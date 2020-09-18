#!/usr/bin/env bash

# Fail if anything in here fails
set -e

# This script runs from the project root
cd "$(dirname "$0")/.."

source scripts/helpers.sh

###################################################################################################
# Some files in the example-template-app *project* don't belong in apps which are based off it --
# like the MIT license, and this script.

run_command "rm -rf
  build/
  coverage/
  scripts/prepare-new-app.sh
  storybook-static/
  LICENSE
  "
