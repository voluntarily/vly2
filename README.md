<p align="center">
  <img src="https://i.imgur.com/aFjiS0u.png">
</p>
 
# vly2
[![Gitter](https://badges.gitter.im/voluntarily/community.svg)](https://gitter.im/voluntarily/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://api.cirrus-ci.com/github/voluntarily/vly2.svg)](https://cirrus-ci.com/github/voluntarily/vly2)
[![codecov](https://codecov.io/gh/voluntarily/vly2/branch/master/graph/badge.svg)](https://codecov.io/gh/voluntarily/vly2)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

Support education and innovation in New Zealand Schools with industry experts and volunteers in the classrooms

# How to join the Voluntarily community
You don't need permission to help - its open.

This is an open source project and you are welcome to contribute at any level you feel comfortable.
Find out more about the project at the [Website](http://voluntarily.nz) and then...

1. Say hello, or ask questions in the [Gitter Chatroom](https://gitter.im/voluntarily/community "Chatroom")
2. email team@voluntarily.nz and tell us about yourself
3. [Start Reading documentation](https://voluntarily.atlassian.net/wiki/spaces/VP/overview)
4. Build the code - below
5. Add yourself to the CONTRIBUTORS file, check it in and send us a pull request - see this ticket [VP-82](https://voluntarily.atlassian.net/browse/VP-82)
6. Come along to a Drop in Wednesday Afternoon or after work social at our [Auckland office](https://goo.gl/maps/fEtq6mdpz446iXVQA)
7. Come along to one of our developer events - see http://voluntarily.nz for the latest details.

# How to build it

Voluntarily is based on the [MERN (MongoDB, Express, React+Redux, Node)](http://mern.io/) software stack but also uses next.js to keep things clean and simple. Everything should work out of the box. There are two choices:

1. install NodeJS and MongoDB and run locally - [See here for detailed instructions](https://github.com/voluntarily/vly2/blob/master/docs/gettingstarted.md "Instructions")

2. install Docker and run in a container - [See here for detailed instructions](https://github.com/voluntarily/vly2/blob/master/docs/Docker.md "Instructions")

### Available Commands

1. `npm run dev` - starts the development server with hot reloading enabled

2. `npm run build` - bundles the code

3. `npm run test` - start the test runner

4. `npm run start` - runs production server

5. `npm run check-coverage` - generates test coverage report

6. `npm run lint` - runs standard to check for lint errors ( npm run fix to fix lint errors )


Once you see the message "Voluntarily is running on port: 3122! Be Awesome!" then you can open your browser at http://localhost:3122.

If you see the message "Please make sure Mongodb is installed and running!"  then go back and start mongod.

Press control+C to exit the node application.

