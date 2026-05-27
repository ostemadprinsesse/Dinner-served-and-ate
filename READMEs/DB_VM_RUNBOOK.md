# DB VM Runbook (PostgreSQL)

This runbook provisions a dedicated PostgreSQL VM and configures network access so only the backend subnet can reach the database.

## Prereqs
- Azure CLI logged in: `az login`
- SSH key exists locally (e.g., `~/.ssh/id_ed25519`)
- The nginx VM is already provisioned (used as SSH jump host)

## Step-by-step
1. Provision nginx + backend VMs if not already done:
   - `bash infrastructure/setup_azure_vms.sh`

2. Provision the DB VM (private IP, same VNet/subnet):
   - `bash infrastructure/setup_azure_db_vm.sh`

3. Optional: write DB secrets to GitHub Actions secrets:
   - `SET_DB_SECRETS=1 bash infrastructure/setup_azure_db_vm.sh`

4. Verify connectivity from the backend VM (run on backend host):
   - `psql "host=<DB_PRIVATE_IP> port=5432 dbname=dinner_db user=dinner_user"`

5. Run migrations + seeds (from a machine that can reach the DB):
   - `cd src/backend`
   - `DB_HOST=<DB_PRIVATE_IP> DB_PORT=5432 DB_NAME=dinner_db DB_USER=dinner_user DB_PASSWORD=<password> npm run migrate:latest`
   - `DB_HOST=<DB_PRIVATE_IP> DB_PORT=5432 DB_NAME=dinner_db DB_USER=dinner_user DB_PASSWORD=<password> npm run seed:run`

## Useful env vars
- `RESOURCE_GROUP` (default: rg-dinner-served-and-ate)
- `LOCATION` (default: swedencentral)
- `VNET_NAME` / `SUBNET_NAME`
- `DB_VM` (default: dinner-served-db)
- `DB_NAME` (default: dinner_db)
- `DB_USER` (default: dinner_user)
- `DB_PORT` (default: 5432)
- `POSTGRES_VERSION` (default: 16)
- `ALLOW_SOURCE_SUBNET` (default: 10.0.1.0/24)
- `SET_DB_SECRETS` (default: 0)

## Notes
- The DB VM is created without a public IP.
- Inbound DB traffic is restricted to the backend subnet.
- SSH access to the DB VM uses the nginx VM as a jump host.
