#!/bin/sh

set -e

if [ ! -d node_modules ]; then
  npm ci
else
  echo "node_modules already installed"
fi

npm run dev
