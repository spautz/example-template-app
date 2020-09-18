#!/usr/bin/env bash

# Fail if anything in here fails
set -e

# This script runs from the project root
cd "$(dirname "$0")/.."

source scripts/helpers.sh

###################################################################################################
# Validate everything

NODE_ACTUAL=$(echo $(node --version) | tr -d '[v:space:]')
NODE_DESIRED=$(cat .nvmrc)


echo "Node version: $NODE_ACTUAL"
if [ $NODE_DESIRED ] && [ $NODE_ACTUAL != $NODE_DESIRED ]; then
  echo "Node version desired: $NODE_DESIRED"
  exit 1
fi


YARN_ACTUAL=$(yarn --version)
YARN_DESIRED=$(get_json_value package.json "yarn")

echo "Yarn version: $YARN_ACTUAL"
if [ $YARN_DESIRED ] && [ $YARN_ACTUAL != $YARN_DESIRED ]; then
  echo "Yarn version desired: $YARN_DESIRED"
  exit 1
fi


###################################################################################################

echo "All environment checks passed!"
