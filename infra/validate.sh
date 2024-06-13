#!/bin/bash
key="$1"
case $key in
  -p|--profile)
    PROFILE="$2"
    ;;
  *)
    echo "Please inform the profile option. Like: ./init.sh -p ntt"
    exit
esac

case $PROFILE in
  ntt)
    shift
    shift
    ;;
  *)
    echo "Invalid Option! The options are: ntt"
    exit
    ;;
esac

echo "OK"
