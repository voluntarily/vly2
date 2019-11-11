# Docker dev environment

The scripts in this folder help with working within a Docker dev environment.

They use the docker-compose file `docker-compose-dev.yml` found in the root of this repository.

## console.sh

Open a console within the `web` or `db` containers.

The `web` container will open a bash shell. The `db` container will open a mongo client shell.

Usage:

Run the console script: `x/docker-dev/console.sh`

You will be prompted to select the container to open console in, i.e.

    1) web
    2) db
    3) Cancel
    #?

Enter the number next to the relevant container and hit enter and the console will open.

## down.sh

Turn off the docker environment. Brings down all services defined in `docker-compose-dev.yml`.

## logs.sh

View the logs of the docker environment.
A wrapper script for `docker-compose -f docker-compose-dev.yml logs`.

Works the same way as `docker-compose logs` command, so these are all valid:

    x/docker-dev/logs.sh        # view all current logs for all services
    x/docker-dev/logs.sh -f     # watch logs for all services
    x/docker-dev/logs.sh web    # view all current logs for "web" service
    x/docker-dev/logs.sh -f db  # watch logs for the "db" service

## npm.sh

Run an `npm` command within the `web` container.

## up.sh

Turn on the docker environment. Brings up all services defined in `docker-compose-dev.yml`.

## web-container-start-command.sh

You shouldn't ever need to run this script manually.

The `web-container-start-command.sh` script is used as the docker `CMD` when bringing up the `web` service.
You can see it defined as the `command` for the `web` service in `docker-compose-dev.yml`.
It will install (`npm ci`) node packages if they are not
already installed and then run `npm run dev` to start the server.
