#!/bin/bash
validated=$(sh validate.sh $1 $2)
if [ "$validated" != "OK" ]
then
    echo $validated
    exit
fi

PROFILE=$2
PROFILE_PATH="envs/$PROFILE"
terraform plan -var-file="$PROFILE_PATH/terraform.tfvars" -out=planfile
