#!/usr/bin/env bash
# Manually deploy the Prometheus + Grafana monitoring stack to the nginx VM.
# Run from the repo root:
#   bash infrastructure/deploy-monitoring-manual.sh
#
# Set these env vars or the script will prompt for them:
#   SSH_HOST_NGINX      — public IP of the nginx VM
#   BACKEND_PRIVATE_IP  — private IP of the backend VM
#   SSH_KEY_PATH        — path to your SSH private key (auto-detected from ~/.ssh)
#   SSH_USER            — SSH username (default: azureuser)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_USER="${SSH_USER:-azureuser}"
SSH_HOST_NGINX="${SSH_HOST_NGINX:-}"
BACKEND_PRIVATE_IP="${BACKEND_PRIVATE_IP:-}"

log() { printf '\n\033[1;34m[monitoring]\033[0m %s\n' "$*"; }
die() { printf '\n\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

# Auto-detect SSH key
if [[ -z "${SSH_KEY_PATH:-}" ]]; then
  for candidate in id_ed25519 id_rsa id_ecdsa; do
    if [[ -f "$HOME/.ssh/$candidate" ]]; then
      SSH_KEY_PATH="$HOME/.ssh/$candidate"
      break
    fi
  done
fi
[[ -n "${SSH_KEY_PATH:-}" && -f "$SSH_KEY_PATH" ]] \
  || die "No SSH key found. Set SSH_KEY_PATH or generate one with: ssh-keygen -t ed25519"

# Prompt for missing values
[[ -n "$SSH_HOST_NGINX" ]]     || read -rp "Nginx VM public IP:      " SSH_HOST_NGINX
[[ -n "$BACKEND_PRIVATE_IP" ]] || read -rp "Backend VM private IP:   " BACKEND_PRIVATE_IP

[[ -n "$SSH_HOST_NGINX" ]]     || die "SSH_HOST_NGINX is required"
[[ -n "$BACKEND_PRIVATE_IP" ]] || die "BACKEND_PRIVATE_IP is required"

SSH_OPTS=(-i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null)

log "Generating prometheus config (backend: $BACKEND_PRIVATE_IP)..."
BACKEND_PRIVATE_IP="$BACKEND_PRIVATE_IP" \
  envsubst < "$REPO_ROOT/monitoring/prometheus.azure.template.yml" \
  > "$REPO_ROOT/monitoring/prometheus.azure.yml"

log "Uploading monitoring files to $SSH_HOST_NGINX..."
ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST_NGINX" 'mkdir -p ~/monitoring'
tar -czf - \
  -C "$REPO_ROOT" \
  monitoring/prometheus.azure.yml \
  monitoring/docker-compose.azure.yml \
  monitoring/grafana \
  | ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST_NGINX" \
    'tar -xzf - --strip-components=1 -C ~/monitoring'

log "Starting monitoring stack on VM..."
ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST_NGINX" <<'REMOTE'
set -euo pipefail
cd ~/monitoring
docker compose -f docker-compose.azure.yml pull
docker compose -f docker-compose.azure.yml up -d
echo ""
docker compose -f docker-compose.azure.yml ps
REMOTE

log "Done."
printf '\nGrafana:    http://%s:3000  (admin / admin)\n' "$SSH_HOST_NGINX"
printf 'Prometheus: http://%s:9090\n\n' "$SSH_HOST_NGINX"
