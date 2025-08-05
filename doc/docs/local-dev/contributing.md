---
sidebar_position: 1
---

# Contributing to AFR

## Testing

> Reference: https://appwrite.io/blog/post/functions-local-development-guide

Prerequisites:

- [Docker](https://www.docker.com/) is installed and running
- `npm install -g appwrite-cli@latest`
- `appwrite login` (_no need to "appwrite init project" etc. it’s all setup already_)

The [./functions/Test/](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test/) folder contains an Appwrite function you may run to test against the library code developped in [./src/](https://github.com/kaibun/appwrite-fn-router/tree/main/src/).

The strategy is kinda brut-force: copy the library code (./src) over to ./function/Test/src/lib, then run the function with `npm install && npm run build` as its setup command within the container, which will ensure the library code is globally available, thus callable by the function handler.

```sh
npm run test # copy the library code over and run the function locally with Docker
```

## Test & debug functions locally

> The testing function sits inside [./functions/Test](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test/). It’s meant to run locally in a (Appwrite) Docker container for rapid debugging, altough it can be deployed and run remotely, eg. on Appwrite Cloud or any hosted Appwrite instance.

1. Install [Docker](https://www.docker.com/).
2. Clone the [repository](https://github.com/kaibun/appwrite-fn-router), checkout any relevant branch.
3. Create an [Appwrite free account](https://appwrite.io/) & download [their cli](https://appwrite.io/docs/tooling/command-line/installation), so you can `appwrite login` (which sadly is required to work locally with Docker).
4. Run `npm run test`, hit [localhost:3000](http://localhost:3000) => check for errors in the container’s output.

With the Docker Desktop GUI, it’s quite easy browsing the server files:

![](../../static/img/docker-gui-server.js.png)

Without a GUI, one must `docker exec -it <containerid> sh`.

From there:

1. the server code is at /usr/local/server/src/server.js ([copy 2025/08/05](../../static/docker-faas-server.js))
2. the Appwrite’s testing function code is at /usr/local/server/src/function/[dist|src]

One may live-edit the former, but not the latter (it gets replaced upon restarting the container). When editing eg. server.js to add debugging logs, simply save the file and hit _Restart_ in the GUI, or `docker container restart <containerid>`.
