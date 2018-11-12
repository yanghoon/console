# Console (for Kubernetes)

> A Vue.js project

This app will be installed in k8s cluster and supports to use it easy.

Main functionalities
1. Web SSH : Can use commands in the browser with k8s authentication(ServiceAccount). (`kubectl`, `helm`, ...)
2. Intuitive Resource Browsing : ...
3. Configurable UI : Menu, ...

## Build Setup

``` bash
# install yarn in global
npm install yarn -g

# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev-all

# Usage
# 1. Connect configure page. (http://localhost:8080/#/conf)
# 2. Upload kubernetes config file (YAML)
# 3. Connect resources page. (http://localhost:8080/#/)
# 4. Select cluster, namespace and resource type

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
