$resourceGroupName = "dinner-served-and-ate-rg"
$location = "norwayeast"
$vmName = "dinner-served-and-ate-vm"
$adminUsername = "azureuser"
$sshPublicKeyPath = "$HOME\.ssh\DINNERKEY\id_rsa.pub"

# ==============================
# Login til Azure
# ==============================

Write-Host "Logger ind i Azure..."
az login

#Start VM
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