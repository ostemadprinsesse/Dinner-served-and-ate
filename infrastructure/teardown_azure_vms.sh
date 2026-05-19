#!/usr/bin/env bash
set -euo pipefail

RESOURCE_GROUP="${RESOURCE_GROUP:-rg-dinner-served-and-ate}"
GITHUB_REPO="${GITHUB_REPO:-ostemadprinsesse/Dinner-served-and-ate}"

log() { printf '\n\033[1;34m[teardown]\033[0m %s\n' "$*"; }
warn() { printf '\n\033[1;33m[warn]\033[0m %s\n' "$*"; }

die() { printf '\n\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

az_cli() {
  MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' az "$@"
}

command -v az >/dev/null || die "Azure CLI (az) not installed."
command -v gh >/dev/null || die "GitHub CLI (gh) not installed."

log "Verifying Azure login..."
az_cli account show >/dev/null 2>&1 || die "Not logged in to Azure. Run 'az login' first."

log "Verifying GitHub login..."
gh auth status >/dev/null 2>&1 || die "Not logged in to GitHub. Run 'gh auth login' first."

cat <<CONFIRM

About to tear down deployment:

  Resource group : $RESOURCE_GROUP
  GitHub repo    : $GITHUB_REPO

This will delete Azure resources in the resource group and clear deployment lock variables.
CONFIRM

read -rp "Continue? (y/N): " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || die "Aborted by user."

if az_cli group exists --name "$RESOURCE_GROUP" -o tsv | grep -qi true; then
  log "Deleting resource group '$RESOURCE_GROUP'..."
  az_cli group delete --name "$RESOURCE_GROUP" --yes --no-wait
  log "Delete request submitted. Azure continues deletion in background."
else
  warn "Resource group '$RESOURCE_GROUP' does not exist."
fi

log "Clearing deployment lock variables..."
gh variable delete DEPLOY_MODE -R "$GITHUB_REPO" 2>/dev/null || true
gh variable delete DEPLOY_OWNER -R "$GITHUB_REPO" 2>/dev/null || true

cat <<SUMMARY

Teardown completed:
  - Resource group deletion requested for: $RESOURCE_GROUP
  - GitHub variables removed: DEPLOY_MODE, DEPLOY_OWNER

Optional manual cleanup in GitHub secrets (if needed):
  SSH_HOST_NGINX, BACKEND_PRIVATE_IP, SSH_USER, SSH_PRIVATE_KEY

SUMMARY
