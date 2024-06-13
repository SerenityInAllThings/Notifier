#!/bin/bash
validated=$(sh validate.sh $1 $2)
if [ "$validated" != "OK" ]
then
    echo $validated
    exit
fi
PROFILE=$2
PROFILE_PATH="envs/$PROFILE"
echo "Removing local state"
rm -f .terraform.lock.hcl
rm -rf .terraform/


echo "Initializing new local state"
terraform init -backend-config="$PROFILE_PATH/backend.conf"
