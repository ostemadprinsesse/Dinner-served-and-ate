#!/usr/bin/env bash
set -euo pipefail

# Azure VM provisioning for a dedicated PostgreSQL VM
# Creates (or reuses) resource group + VNet/subnet and provisions a private DB VM
# Installs PostgreSQL, creates database/user, and locks inbound traffic to backend subnet
#
# Run interactively the first time:
#   bash infrastructure/setup_azure_db_vm.sh

RESOURCE_GROUP="${RESOURCE_GROUP:-rg-dinner-served-and-ate}"
LOCATION="${LOCATION:-swedencentral}"
VNET_NAME="${VNET_NAME:-dinner-served-vnet}"
SUBNET_NAME="${SUBNET_NAME:-dinner-served-subnet}"
VNET_CIDR="10.0.0.0/16"
SUBNET_CIDR="10.0.1.0/24"

DB_VM="${DB_VM:-dinner-served-db}"
NGINX_VM="${NGINX_VM:-dinner-served-nginx}"
VM_SIZE="${VM_SIZE:-Standard_B1s}"
VM_IMAGE="Canonical:0001-com-ubuntu-server-jammy:22_04-lts:latest"
ADMIN_USER="${ADMIN_USER:-azureuser}"
DB_PRIVATE_IP="${DB_PRIVATE_IP:-}"

GITHUB_REPO="${GITHUB_REPO:-ostemadprinsesse/Dinner-served-and-ate}"

DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-dinner_db}"
DB_USER="${DB_USER:-dinner_user}"
POSTGRES_VERSION="${POSTGRES_VERSION:-16}"
ALLOW_SOURCE_SUBNET="${ALLOW_SOURCE_SUBNET:-$SUBNET_CIDR}"
SET_DB_SECRETS="${SET_DB_SECRETS:-0}"

log() { printf '\n\033[1;34m[setup]\033[0m %s\n' "$*"; }
die() { printf '\n\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

az_cli() {
  MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' az "$@"
}

command -v az >/dev/null || die "Azure CLI (az) not installed."
command -v ssh >/dev/null || die "ssh not installed."

# Auto-detect an SSH key pair if the user didn't set env vars.
if [[ -z "${SSH_KEY_PATH:-}" ]]; then
  for candidate in id_rsa id_ed25519 id_ecdsa; do
    if [[ -f "$HOME/.ssh/$candidate" && -f "$HOME/.ssh/$candidate.pub" ]]; then
      SSH_KEY_PATH="$HOME/.ssh/$candidate"
      SSH_PUB_KEY_PATH="$HOME/.ssh/$candidate.pub"
      log "Using SSH key pair: $SSH_KEY_PATH"
      break
    fi
  done
fi
SSH_KEY_PATH="${SSH_KEY_PATH:-}"
SSH_PUB_KEY_PATH="${SSH_PUB_KEY_PATH:-${SSH_KEY_PATH}.pub}"

[[ -n "$SSH_KEY_PATH" && -f "$SSH_KEY_PATH" ]] || die "No SSH private key found. Tried ~/.ssh/{id_rsa,id_ed25519,id_ecdsa}. Generate one (ssh-keygen -t ed25519) or set SSH_KEY_PATH."
[[ -f "$SSH_PUB_KEY_PATH" ]] || die "SSH public key not found at $SSH_PUB_KEY_PATH"
SSH_PUB_KEY_CONTENT=$(tr -d '\r' < "$SSH_PUB_KEY_PATH")

log "Verifying Azure login..."
az_cli account show >/dev/null 2>&1 || die "Not logged in to Azure. Run 'az login' first."
ACCOUNT_NAME=$(az_cli account show --query name -o tsv)
SUBSCRIPTION_ID=$(az_cli account show --query id -o tsv)
SIGNED_IN_USER=$(az_cli account show --query user.name -o tsv)

if [[ -z "${DB_PASSWORD:-}" ]]; then
  read -rsp "Enter password for DB user '$DB_USER': " DB_PASSWORD
  echo
fi
[[ -n "$DB_PASSWORD" ]] || die "DB password cannot be empty."

cat <<CONFIRM

About to provision a dedicated PostgreSQL VM:

  Azure subscription : $ACCOUNT_NAME
  Subscription ID    : $SUBSCRIPTION_ID
  Signed-in user     : $SIGNED_IN_USER
  Resource group     : $RESOURCE_GROUP   (location: $LOCATION)
  VNet / subnet      : $VNET_NAME ($VNET_CIDR) / $SUBNET_NAME ($SUBNET_CIDR)
  DB VM              : $DB_VM (private, no public IP)
  VM size            : $VM_SIZE, Ubuntu 22.04

  PostgreSQL version : $POSTGRES_VERSION
  Database name      : $DB_NAME
  Database user      : $DB_USER
  DB port            : $DB_PORT
  Allowed source     : $ALLOW_SOURCE_SUBNET
  SSH jump host      : $NGINX_VM (public IP)
  Static private IP  : ${DB_PRIVATE_IP:-auto}
  Set GH secrets      : $SET_DB_SECRETS

This will consume Azure credits.
CONFIRM

read -rp "Continue? (y/N): " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || die "Aborted by user."

# ---------- Resource group ----------
log "Creating resource group '$RESOURCE_GROUP' in $LOCATION..."
az_cli group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

# ---------- Network ----------
log "Creating VNet '$VNET_NAME' ($VNET_CIDR) and subnet '$SUBNET_NAME' ($SUBNET_CIDR)..."
az_cli network vnet create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VNET_NAME" \
  --address-prefixes "$VNET_CIDR" \
  --subnet-name "$SUBNET_NAME" \
  --subnet-prefixes "$SUBNET_CIDR" \
  --output none

create_vm() {
  local name="$1"
  local public_ip_mode="${2:-with-public-ip}"
  log "Creating VM '$name'..."
  if az_cli vm show -g "$RESOURCE_GROUP" -n "$name" >/dev/null 2>&1; then
    log "VM '$name' already exists, skipping create."
    return
  fi
  local pip_args=(--public-ip-sku Standard)
  if [[ "$public_ip_mode" == "no-public-ip" ]]; then
    pip_args=(--public-ip-address "")
  fi
  local private_ip_args=()
  if [[ -n "$DB_PRIVATE_IP" && "$name" == "$DB_VM" ]]; then
    private_ip_args=(--private-ip-address "$DB_PRIVATE_IP")
  fi
  az_cli vm create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$name" \
    --image "$VM_IMAGE" \
    --size "$VM_SIZE" \
    --admin-username "$ADMIN_USER" \
    --ssh-key-values "$SSH_PUB_KEY_CONTENT" \
    --vnet-name "$VNET_NAME" \
    --subnet "$SUBNET_NAME" \
    "${pip_args[@]}" \
    "${private_ip_args[@]}" \
    --output none
}

create_vm "$DB_VM" "no-public-ip"

# ---------- IP lookup ----------
log "Resolving VM IP addresses..."
NGINX_IP=$(az_cli vm show -d -g "$RESOURCE_GROUP" -n "$NGINX_VM" --query publicIps -o tsv)
[[ -n "$NGINX_IP" ]] || die "Could not resolve public IP for nginx VM '$NGINX_VM'."

NGINX_PRIVATE_IP=$(az_cli vm show -d -g "$RESOURCE_GROUP" -n "$NGINX_VM" --query privateIps -o tsv)
[[ -n "$NGINX_PRIVATE_IP" ]] || die "Could not resolve private IP for nginx VM '$NGINX_VM'."

DB_PRIVATE_IP=$(az_cli vm show -d -g "$RESOURCE_GROUP" -n "$DB_VM" --query privateIps -o tsv)
[[ -n "$DB_PRIVATE_IP" ]] || die "Could not resolve private IP for DB VM '$DB_VM'."

log "  nginx public IP:  $NGINX_IP"
log "  nginx private IP: $NGINX_PRIVATE_IP"
log "  db private IP:    $DB_PRIVATE_IP (no public IP)"

# ---------- NSG rules ----------
log "Locking down DB VM network access..."
DB_NIC_ID=$(az_cli vm show -g "$RESOURCE_GROUP" -n "$DB_VM" \
  --query "networkProfile.networkInterfaces[0].id" -o tsv)
DB_NSG=$(az_cli network nic show --ids "$DB_NIC_ID" \
  --query "networkSecurityGroup.id" -o tsv)

if [[ -z "$DB_NSG" ]]; then
  DB_NSG=$(az_cli network nsg show -g "$RESOURCE_GROUP" -n "${DB_VM}NSG" --query id -o tsv 2>/dev/null || true)
fi
[[ -n "$DB_NSG" ]] || die "Could not locate NSG for $DB_VM"

DB_NSG_NAME="$(basename "$DB_NSG")"

az_cli network nsg rule create \
  --resource-group "$RESOURCE_GROUP" \
  --nsg-name "$DB_NSG_NAME" \
  --name "allow-ssh-from-nginx" \
  --priority 1100 \
  --source-address-prefixes "$NGINX_PRIVATE_IP" \
  --destination-port-ranges 22 \
  --access Allow --protocol Tcp --direction Inbound \
  --output none 2>/dev/null || \
az_cli network nsg rule update \
  --resource-group "$RESOURCE_GROUP" \
  --nsg-name "$DB_NSG_NAME" \
  --name "allow-ssh-from-nginx" \
  --source-address-prefixes "$NGINX_PRIVATE_IP" \
  --destination-port-ranges 22 \
  --output none

az_cli network nsg rule create \
  --resource-group "$RESOURCE_GROUP" \
  --nsg-name "$DB_NSG_NAME" \
  --name "allow-postgres-from-backend-subnet" \
  --priority 1200 \
  --source-address-prefixes "$ALLOW_SOURCE_SUBNET" \
  --destination-port-ranges "$DB_PORT" \
  --access Allow --protocol Tcp --direction Inbound \
  --output none 2>/dev/null || \
az_cli network nsg rule update \
  --resource-group "$RESOURCE_GROUP" \
  --nsg-name "$DB_NSG_NAME" \
  --name "allow-postgres-from-backend-subnet" \
  --source-address-prefixes "$ALLOW_SOURCE_SUBNET" \
  --destination-port-ranges "$DB_PORT" \
  --output none

# ---------- Provision DB VM over SSH ----------
SSH_OPTS=(-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=30 -i "$SSH_KEY_PATH")

wait_for_ssh() {
  local host="$1"
  local jump_host="$2"
  log "Waiting for SSH on $host (via $jump_host)..."
  for _ in $(seq 1 30); do
    if ssh "${SSH_OPTS[@]}" -o "ProxyJump=$ADMIN_USER@$jump_host" "$ADMIN_USER@$host" 'true' 2>/dev/null; then
      return 0
    fi
    sleep 5
  done
  die "SSH never came up on $host"
}

wait_for_ssh "$DB_PRIVATE_IP" "$NGINX_IP"

DB_NAME_ESCAPED=$(printf '%q' "$DB_NAME")
DB_USER_ESCAPED=$(printf '%q' "$DB_USER")
DB_PASSWORD_ESCAPED=$(printf '%q' "$DB_PASSWORD")
POSTGRES_VERSION_ESCAPED=$(printf '%q' "$POSTGRES_VERSION")
ALLOW_SOURCE_SUBNET_ESCAPED=$(printf '%q' "$ALLOW_SOURCE_SUBNET")

log "Provisioning DB VM ($DB_PRIVATE_IP) via nginx jump host..."
ssh "${SSH_OPTS[@]}" -o "ProxyJump=$ADMIN_USER@$NGINX_IP" \
  "$ADMIN_USER@$DB_PRIVATE_IP" \
  "DB_NAME=$DB_NAME_ESCAPED DB_USER=$DB_USER_ESCAPED DB_PASSWORD=$DB_PASSWORD_ESCAPED POSTGRES_VERSION=$POSTGRES_VERSION_ESCAPED ALLOW_SOURCE_SUBNET=$ALLOW_SOURCE_SUBNET_ESCAPED bash -s" <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

sudo -E apt-get update -y
sudo -E apt-get upgrade -y
sudo -E apt-get install -y curl ca-certificates gnupg lsb-release

if [[ ! -f /etc/apt/sources.list.d/pgdg.list ]]; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/keyrings/postgresql.gpg
  echo "deb [signed-by=/etc/apt/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    | sudo tee /etc/apt/sources.list.d/pgdg.list > /dev/null
fi

sudo -E apt-get update -y
sudo -E apt-get install -y "postgresql-${POSTGRES_VERSION}" "postgresql-client-${POSTGRES_VERSION}"

PG_CONF="/etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf"
PG_HBA="/etc/postgresql/${POSTGRES_VERSION}/main/pg_hba.conf"

sudo sed -i "s/^#\?listen_addresses.*/listen_addresses = '*'/'" "$PG_CONF"

if ! sudo grep -q "${ALLOW_SOURCE_SUBNET}" "$PG_HBA"; then
  echo "host all all ${ALLOW_SOURCE_SUBNET} scram-sha-256" | sudo tee -a "$PG_HBA" > /dev/null
fi

sudo systemctl restart postgresql

ROLE_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | tr -d ' ')
if [[ "$ROLE_EXISTS" != "1" ]]; then
  sudo -u postgres psql -v user="$DB_USER" -v pass="$DB_PASSWORD" \
    -c "CREATE ROLE :\"user\" LOGIN PASSWORD :'pass';"
else
  sudo -u postgres psql -v user="$DB_USER" -v pass="$DB_PASSWORD" \
    -c "ALTER ROLE :\"user\" WITH LOGIN PASSWORD :'pass';"
fi

DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | tr -d ' ')
if [[ "$DB_EXISTS" != "1" ]]; then
  sudo -u postgres createdb --owner="$DB_USER" "$DB_NAME"
fi
REMOTE

log "Done."

if [[ "$SET_DB_SECRETS" == "1" ]]; then
  command -v gh >/dev/null || die "GitHub CLI (gh) not installed."
  gh auth status >/dev/null 2>&1 || die "Not logged in to GitHub. Run 'gh auth login' first."
  log "Setting DB secrets on $GITHUB_REPO..."
  set_secret() {
    printf '%s' "$2" | gh secret set "$1" -R "$GITHUB_REPO"
  }
  set_secret DB_HOST "$DB_PRIVATE_IP"
  set_secret DB_PORT "$DB_PORT"
  set_secret DB_NAME "$DB_NAME"
  set_secret DB_USER "$DB_USER"
  set_secret DB_PASSWORD "$DB_PASSWORD"
fi

cat <<SUMMARY

PostgreSQL VM provisioned:
  Resource group:     $RESOURCE_GROUP
  DB VM:              $DB_VM ($DB_PRIVATE_IP)
  VNet / subnet:      $VNET_NAME / $SUBNET_NAME
  Allowed source:     $ALLOW_SOURCE_SUBNET

Database:
  Host:               $DB_PRIVATE_IP
  Port:               $DB_PORT
  Name:               $DB_NAME
  User:               $DB_USER

Example connection (from backend VM):
  psql "host=$DB_PRIVATE_IP port=$DB_PORT dbname=$DB_NAME user=$DB_USER"

SUMMARY
