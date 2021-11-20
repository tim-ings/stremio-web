#!/bin/bash

set -euo pipefail

bash ./local-set-kube-context.sh

if [[ $(helm list -n stremio-web-proxy | grep stremio-web-proxy) ]]; then
    helm uninstall -n stremio-web-proxy stremio-web-proxy
fi
