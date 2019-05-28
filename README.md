<p align="center">
  <img src="https://i.imgur.com/aFjiS0u.png">
</p>

# vly2
[![Gitter](https://badges.gitter.im/voluntarily/community.svg)](https://gitter.im/voluntarily/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://api.cirrus-ci.com/github/voluntarily/vly2.svg)](https://cirrus-ci.com/github/voluntarily/vly2)
[![codecov](https://codecov.io/gh/voluntarily/vly2/branch/master/graph/badge.svg)](https://codecov.io/gh/voluntarily/vly2)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

Support education and innovation in New Zealand Schools with industry experts and volunteers in the classrooms

# I want to join the Voluntari.ly community
You don't need permission to help - its open.

This is an open source project and you are welcome to contribute at any level you feel comfortable.
Find out more about the project at the [Website](http://voluntari.ly) and then...

1. Say hi or ask questions in the gitter chat room above
2. email team@voluntari.ly to tell us about yourself
3. [Start Reading documentation](https://voluntarily.atlassian.net/wiki/spaces/VP/overview)
4. Build the code - below
5. Add yourself to the CONTRIBUTORS file, check it in and send us a pull request - see this ticket [VP-82](https://voluntarily.atlassian.net/browse/VP-82)
6. Come along to a Drop in Wednesday Afternoon or after work social at our [Auckland office](https://goo.gl/maps/fEtq6mdpz446iXVQA)
7. Come along to one of our developer events - see http://voluntari.ly for the latest details.

# Just let me build it

Voluntari.ly is based on the [MERN (MongoDB, Express, React+Redux, Node)](http://mern.io/) software stack but also uses next.js to keep things clean and simple.

and everything should work out of the box. There are two choices:

1. install NodeJS and MongoDB and run locally.
2. install Docker and run in a container.

## Install NodeJS and MongoDB and run locally.

### Prerequisites
You will need:
* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
You may already have it. Verify with `git --version`

* [nodejs](https://nodejs.org/en/download/).
Verify this with `node -v` which should return a current version. e.g. v11.12.0

You will also need to be connected to the Internet and be prepared for some downloads. (sometimes corporate firewalls make this difficult - go get a coffee and use theirs.)

* [MongoDB](https://docs.mongodb.com/manual/installation/)
or setup a [free account in the cloud](https://cloud.mongodb.com) - but if you do this you will need to change the `MONGO_URL=mongodb://localhost:27017/vly-test` connection string in your environment or in package.json to point at your cloud URL.

For mac users `brew install mongodb` should be all you need to do.

* start the mongodb service

For mac users: `mongod`

For windows users: Run command prompt as adminstrator, then run `net start mongodb`

### Get the Voluntari.ly source code

    git clone https://github.com/voluntarily/vly2.git
    cd vly2
    npm install

npm install may take several minutes as it pulls in all the dependent packages.

### Available Commands

1. `npm run dev` - starts the development server with hot reloading enabled

2. `npm run build` - bundles the code

3. `npm run test` - start the test runner

4. `npm run start` - runs production server

5. `npm run check-coverage` - generates test coverage report

6. `npm run lint` - runs standard to check for lint errors ( npm run fix to fix lint errors )


Once you see the message "Voluntari.ly is running on port: 3122! Be Awesome!" then you can open your browser at http://localhost:3122.

If you see the message "Please make sure Mongodb is installed and running!"  then go back and start mongod.

Press control+C to exit the node application.

## Install Docker and run in a container.
You can use this option if you quickly want to see what the application looks like.

You will need:
* [Docker](https://docs.docker.com/get-started/)

### Get the source code

    git clone https://github.com/voluntarily/vly2.git
    cd vly2
    npm install

### Start the Containers

    docker-compose docker-compose.yml up -d --build

Note this may take a few minutes the first time you run it as it will download some images.
Also once the command returns the services are still starting up so it will be a minute before you can visit the webpage.

Note In order to stop the root folder filling up I moved all the docker files to the Docker Subfolder. You can either run from root using the -f path or cd to the Docker folder and run there.


### You are in.
* Open your web browser at http://localhost:3122/

You will now be able to see the voluntari.ly application (if not then ask for help on our [Gitter](https://gitter.im/voluntarily/community) channel.

### Stopping
To halt the containers run:

    docker-compose down

More information at [Using Docker and Docker Compose](https://voluntarily.atlassian.net/wiki/spaces/VP/pages/9044043/Using+Docker+and+Docker+Compose)

