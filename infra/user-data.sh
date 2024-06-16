#!/bin/bash

apt update
cd /tmp || exit

curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

# # TODO: Make registry region dynamic
docker pull serenityinallthings/notifier:latest
docker run \
  -e ENVIRONMENT=${environment} \
  -e PORT=${app_port} \
  -e DISCORD_TOKEN=${discord_token} \
  -p ${app_port}:${app_port} \
  -d serenityinallthings/notifier:latest
