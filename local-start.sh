#!/bin/bash

set -euo pipefail

bash ./local-set-kube-context.sh

helm upgrade -i stremio-web-proxy ./helm/stremio-web-proxy \
  --namespace stremio-web-proxy --create-namespace \
  -f ./helm/stremio-web-proxy/values.local.yaml
