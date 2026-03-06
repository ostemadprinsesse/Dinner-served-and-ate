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
# Tjek om resource group findes
# ==============================

$rgExists = az group exists --name $resourceGroupName

if ($rgExists -eq "true") {
    Write-Host "Resource group findes allerede. Sletter den..."
    
    az group delete `
        --name $resourceGroupName `
        --yes `
        --no-wait

    Write-Host "Venter på at resource group bliver slettet..."
    
    # Vent indtil den faktisk er væk
    do {
        Start-Sleep -Seconds 5
        $rgExists = az group exists --name $resourceGroupName
    } while ($rgExists -eq "true")

    Write-Host "Resource group er slettet."
}
else {
    Write-Host "Resource group findes ikke. Fortsætter..."
}


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
    --size Standard_B2ats_v2 `
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