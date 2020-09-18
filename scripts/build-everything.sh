#!/usr/bin/env bash

# Fail if anything in here fails
set -e

# This script runs from the project root
cd "$(dirname "$0")/.."

source scripts/helpers.sh

###################################################################################################
# Setup

run_command "./scripts/check-environment.sh"
run_command "yarn install"

###################################################################################################
# Run all read-write scripts then all read-only scripts

run_command "yarn all"
run_command "yarn validate"
