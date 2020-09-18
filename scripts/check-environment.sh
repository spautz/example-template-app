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
if [ $NODE_ACTUAL != $NODE_DESIRED ]; then
  echo "Node version desired: $NODE_DESIRED"
  exit 1
fi


YARN_ACTUAL=$(yarn --version)

if [ $YARN_ACTUAL ]; then
  echo "Yarn version: $YARN_ACTUAL"
else
  echo "Yarn is not available"
  exit 1
fi


###################################################################################################

echo "All environment checks passed!"
