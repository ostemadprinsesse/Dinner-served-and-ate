# ==============================
# Variabler
# ==============================

$resourceGroupName = "dinner-served-and-ate-rg"
$location = "norwayeast"
$vmName = "dinner-served-and-ate-vm"
$adminUsername = "azureuser"
$sshPublicKeyPath = "$HOME\.ssh\id_rsa.pub"

# ==============================
# Login til Azure
# ==============================

Write-Host "Logger ind i Azure..."
az login

# ==============================
# Opret Resource Group
# ==============================

Write-Host "Opretter resource group..."
az group create `
    --name $resourceGroupName `
    --location $location

# ==============================
# Opret Virtual Machine
# ==============================

Write-Host "Opretter virtual machine..."
az vm create `
    --resource-group $resourceGroupName `
    --name $vmName `
    --image Ubuntu2204 `
    --size Standard_B1s `
    --admin-username $adminUsername `
    --ssh-key-values $sshPublicKeyPath `
    --public-ip-sku Standard

Write-Host "VM oprettet!"

# ==============================
# List, start VM and show IP
# ==============================

az vm list --resource-group $resourceGroupName
az vm start --resource-group $resourceGroupName --name $vmName

$publicIp = az vm show `
    --resource-group $resourceGroupName `
    --name $vmName `
    --show-details `
    --query publicIps `
    -o tsv

Write-Host "VM Public IP: $publicIp"

# ==============================
# Open ports on VM
# ==============================

az vm open-port --resource-group $resourceGroupName --name $vmName --port 80 --priority 300

#SSH til VM
ssh azureuser@$publicIp