#!/bin/bash

mkdir config

SECRET=$(kubectl get serviceaccount default -o=jsonpath='{.secrets[].name}')
kubectl get secret $SECRET -o yaml | grep "token:" | awk {'print $2'} |  base64 -d > .minikube-token

kubectl config view > minikube-conf.yaml
echo "    token: $(cat .minikube-token)" >> minikube-conf.yaml

mv minikube-conf.yaml config/