#!/bin/bash

set -euo pipefail

bash ./local-set-kube-context.sh

bash ./local-stop.sh && bash ./local-build.sh && bash ./local-start.sh
