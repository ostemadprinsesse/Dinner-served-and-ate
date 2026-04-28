#!/bin/bash

################################################################################
# COMPLETE Azure Two-VM Setup Script for Dinner Served & Ate
# 
# This script creates a complete two-VM architecture:
# - nginx-vm: Public-facing reverse proxy on ports 80/443
# - backend-vm: Private app server (10.0.0.10) with Docker apps
# 
# Features:
# - Path validation with --repo-dir parameter
# - Auto-detection of docker-compose.deploy.yml and network/ folder
# - Virtual Network + NSG configuration
# - Secure backend lockdown (NSG rules)
# - Docker deployment automation
################################################################################

set -e  # Exit on any error

# Fix for Azure CLI Python 3.13 JSON encoding issue on Windows
export PYTHONIOENCODING=utf-8
export PYTHONUTF8=1

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

################################################################################
# CONFIGURATION VARIABLES
################################################################################

# Azure Configuration
RESOURCE_GROUP="dinner-served-and-ate-rg"
LOCATION="swedencentral"
VM_SIZE="Standard_B2ats_v2"
ADMIN_USERNAME="azureuser"
SSH_KEY_PATH="$HOME/.ssh/id_rsa.pub"

# Network Configuration
VNET_NAME="dinner-vnet"
VNET_CIDR="10.0.0.0/24"
SUBNET_NAME="app-subnet"
NSG_NGINX="dinner-nginx-nsg"
NSG_BACKEND="dinner-backend-nsg"

# VM Names
NGINX_VM="dinner-nginx-vm"
BACKEND_VM="dinner-backend-vm"

# Backend static IP
BACKEND_PRIVATE_IP="10.0.0.10"

# Docker images
BACKEND_IMAGE="ghcr.io/ostemadprinsesse/dinner-served-backend:latest"
FRONTEND_IMAGE="ghcr.io/ostemadprinsesse/dinner-served-frontend:latest"

# Timeout settings
SSH_TIMEOUT=30
RETRY_COUNT=3
RETRY_WAIT=10

# Global variables
REPO_DIR=""
NO_COLORS=false

################################################################################
# FUNCTIONS
################################################################################

# Print colored output
print_header() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}\n"
}

print_step() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Disable colors if requested
disable_colors() {
    if [ "$NO_COLORS" = true ]; then
        GREEN=''
        YELLOW=''
        RED=''
        NC=''
    fi
}

# Show help message
show_help() {
    cat << EOF
${GREEN}Azure Two-VM Setup Script for Dinner Served & Ate${NC}

${YELLOW}Usage:${NC}
    $0 --repo-dir <path/to/repo> [OPTIONS]

${YELLOW}Required Arguments:${NC}
    --repo-dir PATH           Path to the repository directory containing:
                              - docker-compose.deploy.yml
                              - network/ folder (with nginx.config)

${YELLOW}Optional Arguments:${NC}
    --no-colors              Disable colored output
    --help, -h              Show this help message

${YELLOW}Example:${NC}
    $0 --repo-dir ~/projects/dinner-served-at-ate
    $0 --repo-dir . --no-colors

${YELLOW}Directory Structure Expected:${NC}
    repo/
    ├── docker-compose.deploy.yml
    ├── network/
    │   ├── nginx.config
    │   └── Dockerfile
    └── ...

EOF
    exit 0
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --repo-dir)
                REPO_DIR="$2"
                shift 2
                ;;
            --no-colors)
                NO_COLORS=true
                shift
                ;;
            --help|-h)
                show_help
                ;;
            *)
                print_error "Unknown argument: $1"
                show_help
                ;;
        esac
    done
}

# Validate repository directory structure
validate_repo_structure() {
    print_step "Validating repository structure..."
    
    # Check if repo directory is provided
    if [ -z "$REPO_DIR" ]; then
        print_error "Repository directory not specified"
        echo ""
        show_help
    fi
    
    # Convert to absolute path
    REPO_DIR="$(cd "$REPO_DIR" && pwd)" || {
        print_error "Repository directory does not exist: $REPO_DIR"
        exit 1
    }
    
    # Check for required files
    if [ ! -f "$REPO_DIR/docker-compose.deploy.yml" ]; then
        print_error "Required file not found: $REPO_DIR/docker-compose.deploy.yml"
        exit 1
    fi
    print_success "Found docker-compose.deploy.yml"
    
    # Check for network folder
    if [ ! -d "$REPO_DIR/network" ]; then
        print_error "Required folder not found: $REPO_DIR/network"
        exit 1
    fi
    print_success "Found network/ folder"
    
    # Check for nginx.config
    if [ ! -f "$REPO_DIR/network/nginx.config" ]; then
        print_error "Required file not found: $REPO_DIR/network/nginx.config"
        exit 1
    fi
    print_success "Found network/nginx.config"
    
    # Check for network Dockerfile
    if [ ! -f "$REPO_DIR/network/Dockerfile" ]; then
        print_error "Required file not found: $REPO_DIR/network/Dockerfile"
        exit 1
    fi
    print_success "Found network/Dockerfile"
    
    print_success "Repository structure validation complete\n"
}

# Check Azure CLI installation
check_azure_cli() {
    print_step "Checking Azure CLI..."
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed"
        echo "Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
    print_success "Azure CLI is installed"
}

# Check Azure login status
check_azure_login() {
    print_step "Checking Azure login status..."
    if ! az account show &> /dev/null; then
        print_warning "Not logged in to Azure"
        print_step "Launching Azure login..."
        az login
    fi
    ACCOUNT=$(az account show --query name -o tsv)
    print_success "Logged in to Azure account: $ACCOUNT"
}

# Check SSH key
check_ssh_key() {
    print_step "Checking SSH key..."
    if [ ! -f "$SSH_KEY_PATH" ]; then
        print_warning "SSH key not found at $SSH_KEY_PATH"
        print_step "Generating new SSH key..."
        mkdir -p "${SSH_KEY_PATH%/*}"
        ssh-keygen -t rsa -b 4096 -f "${SSH_KEY_PATH%.pub}" -N "" -C "azure-dinner-setup"
        print_success "SSH key generated"
    else
        print_success "SSH key found"
    fi
}

# Create or verify resource group
create_resource_group() {
    print_header "Creating/Verifying Resource Group"
    
    if az group exists --name "$RESOURCE_GROUP" | grep -q "true"; then
        print_warning "Resource group already exists"
        read -p "Do you want to delete and recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_step "Deleting resource group..."
            az group delete --name "$RESOURCE_GROUP" --yes --no-wait
            sleep 15
        else
            print_step "Using existing resource group"
            return
        fi
    fi
    
    print_step "Creating resource group: $RESOURCE_GROUP in $LOCATION"
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --output table
    print_success "Resource group created"
}

# Create virtual network
create_virtual_network() {
    print_header "Creating Virtual Network and Subnet"
    
    # Check if VNET already exists
    if az network vnet show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$VNET_NAME" &> /dev/null; then
        print_warning "Virtual network already exists"
        return
    fi
    
    print_step "Creating virtual network: $VNET_NAME with CIDR $VNET_CIDR"
    az network vnet create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$VNET_NAME" \
        --address-prefix "$VNET_CIDR" \
        --subnet-name "$SUBNET_NAME" \
        --subnet-prefix "$VNET_CIDR" \
        --output table
    
    print_success "Virtual network and subnet created"
}

# Create NSG for nginx VM
create_nginx_nsg() {
    print_header "Creating Network Security Group for nginx-vm"
    
    # Check if NSG already exists
    if az network nsg show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NSG_NGINX" &> /dev/null; then
        print_warning "nginx NSG already exists"
        return
    fi
    
    print_step "Creating NSG: $NSG_NGINX"
    az network nsg create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NSG_NGINX" \
        --output table
    
    # Allow SSH (port 22)
    print_step "Adding SSH rule..."
    az network nsg rule create \
        --resource-group "$RESOURCE_GROUP" \
        --nsg-name "$NSG_NGINX" \
        --name "AllowSSH" \
        --priority 100 \
        --source-address-prefixes "*" \
        --source-port-ranges "*" \
        --destination-address-prefixes "*" \
        --destination-port-ranges 22 \
        --access Allow \
        --protocol Tcp \
        --output table
    
    # Allow HTTP (port 80)
    print_step "Adding HTTP rule..."
    az network nsg rule create \
        --resource-group "$RESOURCE_GROUP" \
        --nsg-name "$NSG_NGINX" \
        --name "AllowHTTP" \
        --priority 200 \
        --source-address-prefixes "*" \
        --source-port-ranges "*" \
        --destination-address-prefixes "*" \
        --destination-port-ranges 80 \
        --access Allow \
        --protocol Tcp \
        --output table
    
    # Allow HTTPS (port 443)
    print_step "Adding HTTPS rule..."
    az network nsg rule create \
        --resource-group "$RESOURCE_GROUP" \
        --nsg-name "$NSG_NGINX" \
        --name "AllowHTTPS" \
        --priority 300 \
        --source-address-prefixes "*" \
        --source-port-ranges "*" \
        --destination-address-prefixes "*" \
        --destination-port-ranges 443 \
        --access Allow \
        --protocol Tcp \
        --output table
    
    print_success "nginx NSG created with rules"
}

# Create NSG for backend VM
create_backend_nsg() {
    print_header "Creating Network Security Group for backend-vm"
    
    # Check if NSG already exists
    if az network nsg show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NSG_BACKEND" &> /dev/null; then
        print_warning "backend NSG already exists"
        return
    fi
    
    print_step "Creating NSG: $NSG_BACKEND"
    az network nsg create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NSG_BACKEND" \
        --output table
    
    # Allow SSH (port 22)
    print_step "Adding SSH rule..."
    az network nsg rule create \
        --resource-group "$RESOURCE_GROUP" \
        --nsg-name "$NSG_BACKEND" \
        --name "AllowSSH" \
        --priority 100 \
        --source-address-prefixes "*" \
        --source-port-ranges "*" \
        --destination-address-prefixes "*" \
        --destination-port-ranges 22 \
        --access Allow \
        --protocol Tcp \
        --output table
    
    # Allow app ports (3005, 5000) ONLY from nginx-vm
    print_step "Adding app port rules (frontend 3005, backend 5000) from nginx-vm..."
    
    # Allow port 3005 (frontend) from vnet
    az network nsg rule create \
        --resource-group "$RESOURCE_GROUP" \
        --nsg-name "$NSG_BACKEND" \
        --name "AllowFrontendFromVnet" \
        --priority 200 \
        --source-address-prefixes "VirtualNetwork" \
        --source-port-ranges "*" \
        --destination-address-prefixes "*" \
        --destination-port-ranges 3005 \
        --access Allow \
        --protocol Tcp \
        --output table
    
    # Allow port 5000 (backend) from vnet
    az network nsg rule create \
        --resource-group "$RESOURCE_GROUP" \
        --nsg-name "$NSG_BACKEND" \
        --name "AllowBackendFromVnet" \
        --priority 210 \
        --source-address-prefixes "VirtualNetwork" \
        --source-port-ranges "*" \
        --destination-address-prefixes "*" \
        --destination-port-ranges 5000 \
        --access Allow \
        --protocol Tcp \
        --output table
    
    print_success "backend NSG created with rules"
}

# Create nginx VM
create_nginx_vm() {
    print_header "Creating nginx Reverse Proxy VM"
    
    # Check if VM already exists
    if az vm show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NGINX_VM" &> /dev/null; then
        print_warning "nginx VM already exists"
        NGINX_PRIVATE_IP=$(az vm show \
            --resource-group "$RESOURCE_GROUP" \
            --name "$NGINX_VM" \
            --show-details \
            --query privateIps \
            --output tsv)
        print_success "nginx VM found with private IP: $NGINX_PRIVATE_IP"
        return
    fi
    
    print_step "Creating VM: $NGINX_VM (Ubuntu 22.04, $VM_SIZE)"
    print_warning "This may take 3-5 minutes..."
    
    if ! az vm create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NGINX_VM" \
        --image Ubuntu2204 \
        --size "$VM_SIZE" \
        --vnet-name "$VNET_NAME" \
        --subnet "$SUBNET_NAME" \
        --nsg "$NSG_NGINX" \
        --admin-username "$ADMIN_USERNAME" \
        --ssh-key-values "$SSH_KEY_PATH" \
        --public-ip-sku Standard; then
        print_error "Failed to create nginx VM"
        exit 1
    fi
    
    print_success "nginx VM created"
    
    # Wait a moment for Azure to update
    sleep 5
    
    # Get nginx VM IPs
    NGINX_PRIVATE_IP=$(az vm show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NGINX_VM" \
        --show-details \
        --query privateIps \
        --output tsv 2>/dev/null || echo "")
    
    NGINX_PUBLIC_IP=$(az vm show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NGINX_VM" \
        --show-details \
        --query publicIps \
        --output tsv 2>/dev/null || echo "")
    
    if [ -z "$NGINX_PRIVATE_IP" ]; then
        print_warning "Could not retrieve nginx VM IPs immediately - will retry during SSH phase"
    else
        print_success "nginx VM Private IP: $NGINX_PRIVATE_IP"
        print_success "nginx VM Public IP: $NGINX_PUBLIC_IP"
    fi
}

# Create backend VM
create_backend_vm() {
    print_header "Creating Backend Application VM"
    
    # Check if VM already exists
    if az vm show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$BACKEND_VM" &> /dev/null; then
        print_warning "backend VM already exists"
        return
    fi
    
    print_step "Creating VM: $BACKEND_VM (Ubuntu 22.04, $VM_SIZE)"
    print_warning "This may take 3-5 minutes..."
    
    # Create NIC with static private IP
    NIC_NAME="${BACKEND_VM}-nic"
    print_step "Creating network interface with static IP $BACKEND_PRIVATE_IP..."
    
    if ! az network nic create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$NIC_NAME" \
        --vnet-name "$VNET_NAME" \
        --subnet "$SUBNET_NAME" \
        --network-security-group "$NSG_BACKEND" \
        --private-ip-address "$BACKEND_PRIVATE_IP"; then
        print_error "Failed to create network interface"
        exit 1
    fi
    
    # Create VM with the custom NIC
    print_step "Creating backend VM with custom NIC..."
    if ! az vm create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$BACKEND_VM" \
        --image Ubuntu2204 \
        --size "$VM_SIZE" \
        --nics "$NIC_NAME" \
        --admin-username "$ADMIN_USERNAME" \
        --ssh-key-values "$SSH_KEY_PATH" \
        --public-ip-address ""; then
        print_error "Failed to create backend VM"
        exit 1
    fi
    
    print_success "backend VM created with private IP: $BACKEND_PRIVATE_IP"
}

# Wait for SSH connectivity with retry logic
wait_for_ssh() {
    local vm_ip=$1
    local vm_name=$2
    local retry=0
    
    # If IP is empty, try to get it first
    if [ -z "$vm_ip" ]; then
        print_warning "IP address is empty, trying to retrieve..."
        if [ "$vm_name" = "nginx-vm" ]; then
            vm_ip=$(az vm show --resource-group "$RESOURCE_GROUP" --name "$NGINX_VM" --show-details --query publicIps --output tsv 2>/dev/null || echo "")
            NGINX_PUBLIC_IP="$vm_ip"
        fi
    fi
    
    if [ -z "$vm_ip" ]; then
        print_error "Could not determine IP address for $vm_name"
        return 1
    fi
    
    print_step "Waiting for $vm_name ($vm_ip) to be ready..."
    
    # For backend-vm, use nginx-vm as jump host
    local ssh_opts="-o StrictHostKeyChecking=no -o ConnectTimeout=$SSH_TIMEOUT -o BatchMode=yes -o PasswordAuthentication=no"
    local ssh_cmd="ssh"
    
    if [ "$vm_name" = "backend-vm" ]; then
        # Backend VM is private, SSH through nginx-vm
        if [ -z "$NGINX_PUBLIC_IP" ]; then
            print_error "Cannot reach backend-vm: nginx VM public IP not available"
            return 1
        fi
        ssh_cmd="ssh -J $ADMIN_USERNAME@$NGINX_PUBLIC_IP"
        print_step "SSH to backend-vm will be through nginx-vm jump host ($NGINX_PUBLIC_IP)"
    fi
    
    while [ $retry -lt $RETRY_COUNT ]; do
        if timeout $SSH_TIMEOUT $ssh_cmd $ssh_opts \
            "$ADMIN_USERNAME@$vm_ip" "echo 'SSH connection successful'" 2>/dev/null; then
            print_success "SSH connection to $vm_name successful"
            return 0
        fi
        
        retry=$((retry + 1))
        if [ $retry -lt $RETRY_COUNT ]; then
            print_warning "SSH connection attempt $retry failed, retrying in $RETRY_WAIT seconds..."
            sleep $RETRY_WAIT
        fi
    done
    
    print_error "Failed to connect via SSH to $vm_name after $RETRY_COUNT attempts"
    return 1
}

# Install Docker on VM
install_docker() {
    local vm_ip=$1
    local vm_name=$2
    
    print_header "Installing Docker on $vm_name"
    
    print_step "Updating system and installing Docker..."
    
    # For backend-vm, use SSH jump host through nginx-vm
    local ssh_cmd="ssh -o StrictHostKeyChecking=no"
    if [ "$vm_name" = "backend-vm" ]; then
        ssh_cmd="ssh -J $ADMIN_USERNAME@$NGINX_PUBLIC_IP -o StrictHostKeyChecking=no"
    fi
    
    $ssh_cmd "$ADMIN_USERNAME@$vm_ip" << 'ENDDOCKER'
        set -e
        echo "Updating package index..."
        sudo apt update -y
        
        echo "Installing prerequisites..."
        sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
        
        echo "Adding Docker GPG key..."
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        
        echo "Adding Docker repository..."
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        echo "Installing Docker..."
        sudo apt update -y
        sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        echo "Adding user to docker group..."
        sudo usermod -aG docker $USER
        
        echo "Starting Docker service..."
        sudo systemctl enable docker
        sudo systemctl start docker
        
        echo "Docker installation complete!"
        docker --version
        docker compose version
ENDDOCKER
    
    print_success "Docker installed on $vm_name"
}

# Deploy backend application
deploy_backend() {
    print_header "Deploying Backend Application to backend-vm"
    
    # For private backend-vm, use SSH jump host
    local scp_opts="-o StrictHostKeyChecking=no -J $ADMIN_USERNAME@$NGINX_PUBLIC_IP"
    local ssh_cmd="ssh -J $ADMIN_USERNAME@$NGINX_PUBLIC_IP -o StrictHostKeyChecking=no"
    
    print_step "Copying docker-compose.deploy.yml to backend-vm..."
    scp $scp_opts \
        "$REPO_DIR/docker-compose.deploy.yml" \
        "$ADMIN_USERNAME@$BACKEND_PRIVATE_IP:~/docker-compose.deploy.yml"
    print_success "docker-compose.deploy.yml copied"
    
    print_step "Copying network/ folder to backend-vm..."
    scp $scp_opts -r \
        "$REPO_DIR/network" \
        "$ADMIN_USERNAME@$BACKEND_PRIVATE_IP:~/"
    print_success "network/ folder copied"
    
    print_step "Logging in to GitHub Container Registry..."
    read -sp "Enter your GitHub CR PAT token (will not be shown): " GH_TOKEN
    echo
    
    print_step "Deploying Docker containers..."
    $ssh_cmd "$ADMIN_USERNAME@$BACKEND_PRIVATE_IP" << ENDBACKEND
        set -e
        echo "Setting up Docker login..."
        echo "$GH_TOKEN" | docker login ghcr.io -u USERNAME_TOKEN --password-stdin
        
        echo "Pulling Docker images..."
        docker pull $BACKEND_IMAGE
        docker pull $FRONTEND_IMAGE
        
        echo "Starting Docker containers with docker-compose..."
        cd ~/
        docker compose -f docker-compose.deploy.yml pull
        docker compose -f docker-compose.deploy.yml up -d
        
        echo "Waiting for services to start..."
        sleep 10
        
        echo "Container status:"
        docker compose -f docker-compose.deploy.yml ps
        
        echo "Backend deployment complete!"
ENDBACKEND
    
    print_success "Backend application deployed"
}

# Create nginx configuration for inter-VM communication
create_nginx_config() {
    print_header "Creating nginx Configuration for Reverse Proxy"
    
    # Create temporary nginx config pointing to backend-vm's private IP
    TEMP_NGINX_CONFIG="/tmp/nginx-azure.config"
    
    cat > "$TEMP_NGINX_CONFIG" << 'ENDNGINXCONFIG'
events {}

http {
    upstream backend {
        server 10.0.0.10:5000;
    }
    
    upstream frontend {
        server 10.0.0.10:3005;
    }
    
    server {
        listen 80;
        server_name _;
        
        client_max_body_size 100M;
        
        # API proxy
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            
            # Timeouts for long-running requests
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
        
        # Frontend proxy
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            
            # Timeouts for long-running requests
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
    }
}
ENDNGINXCONFIG
    
    print_success "nginx configuration created (pointing to $BACKEND_PRIVATE_IP)"
    echo "$TEMP_NGINX_CONFIG"
}

# Deploy nginx reverse proxy
deploy_nginx() {
    print_header "Deploying nginx Reverse Proxy to nginx-vm"
    
    # Create nginx config
    NGINX_CONFIG=$(create_nginx_config)
    
    print_step "Copying nginx configuration to nginx-vm..."
    scp -o StrictHostKeyChecking=no \
        "$NGINX_CONFIG" \
        "$ADMIN_USERNAME@$NGINX_PUBLIC_IP:~/nginx.config"
    print_success "nginx configuration copied"
    
    print_step "Copying network/Dockerfile to nginx-vm..."
    scp -o StrictHostKeyChecking=no \
        "$REPO_DIR/network/Dockerfile" \
        "$ADMIN_USERNAME@$NGINX_PUBLIC_IP:~/Dockerfile"
    print_success "Dockerfile copied"
    
    print_step "Building and starting nginx container on nginx-vm..."
    ssh -o StrictHostKeyChecking=no "$ADMIN_USERNAME@$NGINX_PUBLIC_IP" << 'ENDNGINX'
        set -e
        
        echo "Building nginx image from Dockerfile..."
        docker build -t dinner-served-nginx:latest -f ~/Dockerfile ~
        
        echo "Starting nginx reverse proxy container..."
        docker run -d \
            --name dinner-served-nginx \
            --restart unless-stopped \
            -p 80:80 \
            -p 443:443 \
            dinner-served-nginx:latest
        
        echo "Waiting for nginx to start..."
        sleep 5
        
        echo "nginx container status:"
        docker ps | grep nginx
        
        echo "Testing nginx..."
        curl -s http://localhost/api/ || echo "Backend not yet ready (this is OK)"
        
        echo "nginx deployment complete!"
ENDNGINX
    
    print_success "nginx reverse proxy deployed"
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment"
    
    print_step "Testing backend connectivity from nginx-vm..."
    ssh -o StrictHostKeyChecking=no "$ADMIN_USERNAME@$NGINX_PUBLIC_IP" << ENDVERIFY
        echo "Testing connection to backend-vm (10.0.0.10)..."
        if curl -s -m 5 http://10.0.0.10:3005 > /dev/null; then
            echo "✅ Frontend (port 3005) is accessible"
        else
            echo "⚠️  Frontend not yet responding (may still be starting)"
        fi
        
        if curl -s -m 5 http://10.0.0.10:5000 > /dev/null; then
            echo "✅ Backend (port 5000) is accessible"
        else
            echo "⚠️  Backend not yet responding (may still be starting)"
        fi
ENDVERIFY
    
    print_step "Testing public access to nginx..."
    if curl -s -m 5 "http://$NGINX_PUBLIC_IP" > /dev/null 2>&1; then
        print_success "Public nginx reverse proxy is responding"
    else
        print_warning "nginx may still be initializing - wait a moment and try: curl http://$NGINX_PUBLIC_IP"
    fi
}

# Print summary
print_summary() {
    print_header "Deployment Complete! 🎉"
    
    echo "RESOURCE GROUP:"
    echo "  Name: ${GREEN}$RESOURCE_GROUP${NC}"
    echo "  Location: ${GREEN}$LOCATION${NC}"
    echo ""
    
    echo "NETWORK INFRASTRUCTURE:"
    echo "  Virtual Network: ${GREEN}$VNET_NAME${NC} ($VNET_CIDR)"
    echo "  Subnet: ${GREEN}$SUBNET_NAME${NC}"
    echo ""
    
    echo "NGINX VM (Reverse Proxy):"
    echo "  Name: ${GREEN}$NGINX_VM${NC}"
    echo "  Public IP: ${GREEN}$NGINX_PUBLIC_IP${NC}"
    echo "  Private IP: ${GREEN}$NGINX_PRIVATE_IP${NC}"
    echo "  SSH: ${YELLOW}ssh $ADMIN_USERNAME@$NGINX_PUBLIC_IP${NC}"
    echo ""
    
    echo "BACKEND VM (Application Server):"
    echo "  Name: ${GREEN}$BACKEND_VM${NC}"
    echo "  Private IP: ${GREEN}$BACKEND_PRIVATE_IP${NC} (no public IP)"
    echo "  SSH via nginx-vm: ${YELLOW}ssh $ADMIN_USERNAME@$NGINX_PUBLIC_IP${NC}"
    echo "  SSH via tunnel: ${YELLOW}ssh -J $ADMIN_USERNAME@$NGINX_PUBLIC_IP $ADMIN_USERNAME@$BACKEND_PRIVATE_IP${NC}"
    echo ""
    
    echo "ACCESS YOUR APPLICATION:"
    echo "  Frontend: ${GREEN}http://$NGINX_PUBLIC_IP${NC}"
    echo "  API (backend): ${GREEN}http://$NGINX_PUBLIC_IP/api${NC}"
    echo ""
    
    echo "USEFUL COMMANDS:"
    echo "  View nginx logs:"
    echo "    ${YELLOW}ssh $ADMIN_USERNAME@$NGINX_PUBLIC_IP 'docker logs -f dinner-served-nginx'${NC}"
    echo ""
    echo "  View backend logs:"
    echo "    ${YELLOW}ssh -J $ADMIN_USERNAME@$NGINX_PUBLIC_IP $ADMIN_USERNAME@$BACKEND_PRIVATE_IP 'docker logs -f dinner-served-backend'${NC}"
    echo ""
    echo "  SSH into nginx-vm:"
    echo "    ${YELLOW}ssh $ADMIN_USERNAME@$NGINX_PUBLIC_IP${NC}"
    echo ""
    echo "  SSH into backend-vm (via nginx):"
    echo "    ${YELLOW}ssh -J $ADMIN_USERNAME@$NGINX_PUBLIC_IP $ADMIN_USERNAME@$BACKEND_PRIVATE_IP${NC}"
    echo ""
    
    echo "TO CLEANUP EVERYTHING:"
    echo "  ${RED}az group delete --name $RESOURCE_GROUP --yes${NC}"
    echo ""
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    # Parse arguments
    parse_arguments "$@"
    disable_colors
    
    # Pre-flight checks
    print_header "Azure Two-VM Setup for Dinner Served & Ate"
    print_step "Starting pre-flight checks..."
    
    validate_repo_structure
    check_azure_cli
    check_azure_login
    check_ssh_key
    
    # Phase 1: Create network infrastructure
    print_header "Phase 1: Network Infrastructure Setup"
    create_resource_group
    create_virtual_network
    create_nginx_nsg
    create_backend_nsg
    
    # Phase 2: Create VMs
    print_header "Phase 2: Virtual Machine Creation"
    create_nginx_vm
    sleep 10  # Extra time for Azure to settle
    create_backend_vm
    sleep 10
    
    # Ensure we have IP addresses before proceeding
    if [ -z "$NGINX_PUBLIC_IP" ]; then
        print_step "Retrieving nginx-vm public IP..."
        NGINX_PUBLIC_IP=$(az vm show --resource-group "$RESOURCE_GROUP" --name "$NGINX_VM" --show-details --query publicIps --output tsv 2>/dev/null || echo "")
        if [ -n "$NGINX_PUBLIC_IP" ]; then
            print_success "Retrieved nginx-vm Public IP: $NGINX_PUBLIC_IP"
        fi
    fi
    
    # Wait for SSH connectivity
    print_header "Phase 3: Waiting for VMs to be Ready"
    wait_for_ssh "$NGINX_PUBLIC_IP" "nginx-vm" || exit 1
    wait_for_ssh "$BACKEND_PRIVATE_IP" "backend-vm" || exit 1
    
    # Phase 3: Install Docker
    print_header "Phase 3: Docker Installation"
    install_docker "$NGINX_PUBLIC_IP" "nginx-vm"
    install_docker "$BACKEND_PRIVATE_IP" "backend-vm"
    
    # Phase 4: Deploy applications
    print_header "Phase 4: Application Deployment"
    deploy_backend
    sleep 15  # Give backend time to start
    deploy_nginx
    
    # Phase 5: Verification and summary
    print_header "Phase 5: Verification and Summary"
    sleep 10  # Give services time to stabilize
    verify_deployment
    print_summary
}

# Run main function with error handling
if ! main "$@"; then
    print_error "Setup failed!"
    exit 1
fi

exit 0
