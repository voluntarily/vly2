#!/bin/sh

set -e

USER=$(id -u):$(id -g)

docker-compose -f docker-compose-dev.yml up -d
docker-compose -f docker-compose-dev.yml exec db mongo vly-dev --eval "printjson(db.dropDatabase())"
docker-compose -f docker-compose-dev.yml exec web node --http-parser=legacy x/db/import-schools.js
docker-compose -f docker-compose-dev.yml exec web node --http-parser=legacy x/db/load-goals.js
