# Various ways to run the app in Docker.

## Install Docker and run in a container.
You can use this option if you quickly want to see what the application looks like.

You will need:
* [Docker](https://docs.docker.com/get-started/)

### Get the source code

    git clone https://github.com/voluntarily/vly2.git
    cd vly2
    npm install

## Using docker-compose
Docker-compose allows you to run up multiple docker containers and links them together. This allows us to start both the web application and a separate mongodb at the same time, starting and stopping them together. 


### Start the Containers

    docker-compose docker-compose.yml up -d --build

Note this may take a few minutes the first time you run it as it will download some images.
Also once the command returns the services are still starting up so it will be a minute before you can visit the webpage.

Note In order to stop the root folder filling up I moved all the docker files to the Docker Subfolder. You can either run from root using the -f path or cd to the Docker folder and run there. 


### You are in.
* Open your web browser at http://localhost:3122/

You will now be able to see the voluntarily.nz application (if not then ask for help on our [![gitter](https://badges.gitter.im/voluntarily/vly2.svg)](https://gitter.im/voluntarily/vly2?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) channel.

### Stopping
To halt the containers run:

    docker-compose down 

More information at [Using Docker and Docker Compose](https://voluntarily.atlassian.net/wiki/spaces/VP/pages/9044043/Using+Docker+and+Docker+Compose)


## Using Docker and separate dockerfiles.

### MongoDB
You can start a clean instance of MongoDB with this line

    docker run --name db -d -v /data/db -p:27017:27017 mongo:latest

This runs mongo:latest from the repository, detached (-d) and links the db port out of the container to the system.

-name: Name of the container.
-d: Will start the container as a background (daemon) process. Don’t specify this argument to run the container as foreground process.
-v: Attach the /tmp/mongodb volume of the host system to /data/db volume of the container.
-p: Map the host port to the container port.
Last argument is the name/id of the image.

to test run mongo command line

    mongo 
    quit()

to stop 

  docker stop mymongo
Guide: https://severalnines.com/blog/deploying-mongodb-using-docker



### Running Voluntar.ly

Create the image

    docker build .
    
This command starts the web container and routes the localhost port 80 into the 3122 port PORT value used in the dockerfile. This makes the app accessable at http://localhost  (no port required)

    docker run --name voluntarily --link db:db -p 80:3122 vly2_web

source https://docs.docker.com/network/links/

