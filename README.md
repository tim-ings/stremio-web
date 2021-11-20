# stremio-web-proxy

Watch torrent based streams in your web browser.

Due to the limits of WebRTC, traditional UDP/TCP based torrents are not supported directly in the browser. This project makes use of a backend server to proxy video streamed via traditional torrents to a browser based client.

## Local development

Use the provided `local-*.sh` scripts to deploy the application to a local kubernetes cluster. You can provision a local cluster with minikube, kind, or docker desktop. Descriptions of each script can be found in the following table.

You will need to update `local-set-kube-context.sh` to use your local context.

| Script | Use |
| --- | --- |
| `local-reset.sh` | Rebuild and redeploy the application to the local cluster |
| `local-build.sh` | Build the application's docker images |
| `local-start.sh` | Install the application's helm chart to the local cluster |
| `local-stop.sh` | Uninstall the application's helm chart from the local cluster |

## Self Hosting

Install the provided helm chart to a kubernetes cluster to quickly spin up your own proxy.

Alternatively, the provided docker images can be used to deploy via other means:

| Application | Image Repository |
| --- | --- |
| Server | ghcr.io/tim-ings/stremio-web-proxy-server |
| Client | ghcr.io/tim-ings/stremio-web-proxy-client |
