#!/bin/bash

set -euo pipefail

bash ./local-set-kube-context.sh
bash ./local-setup-hosts.sh

VERSION=$(cat ./helm/stremio-web-proxy/Chart.yaml | grep version | awk '{ print $2 }')

docker build -t stremio-web-proxy-client:${VERSION} ./client/ --build-arg SOURCEMAPS
docker build -t stremio-web-proxy-server:${VERSION} ./server/

kind load docker-image stremio-web-proxy-client:${VERSION} --name tim-local
kind load docker-image stremio-web-proxy-server:${VERSION} --name tim-local
