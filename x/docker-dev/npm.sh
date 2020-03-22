#!/bin/sh

set -e

USER=$(id -u):$(id -g)

docker run \
 --workdir=/app \
 -v "$(pwd):/app" \
 --user=${USER} \
 -e 'NEXT_TELEMETRY_DISABLED=1' \
 --rm \
 node:12.13.0-stretch \
 npm "$@"
