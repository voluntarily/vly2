<p align="center">
  <img src="https://i.imgur.com/aFjiS0u.png">
</p>

# vly2
![VLY2 test and build](https://github.com/voluntarily/vly2/workflows/VLY2%20test%20and%20build/badge.svg)
[![codecov](https://codecov.io/gh/voluntarily/vly2/branch/master/graph/badge.svg)](https://codecov.io/gh/voluntarily/vly2)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

<div style="background-color: rgb(255, 204, 0)">
COVID-19 - The platform is undergoing a major change to be able to support a wider range of volunteering activities.

This means that the code base is undergoing a rapid period of change.  If you are considering using the platform in your own country please contact us about the best time to do that. 

Stay Safe
</div>

# How to join the Voluntarily community
You don't need permission to help - its open.

This is an open source project and you are welcome to contribute at any level you feel comfortable.
Find out more about the project at the [Website](http://voluntarily.nz) and then...

1. Say hello on our Slack channel - [Join here](https://blog.voluntarily.nz/get-involved)
2. [Start Reading documentation](https://voluntarily.atlassian.net/wiki/spaces/VP/overview)
3. Build the code - below
4. Add yourself to the CONTRIBUTORS file, check it in and send us a pull request - see this ticket [VP-82](https://voluntarily.atlassian.net/browse/VP-82)

# How to build it

Voluntarily is based on the [MERN (MongoDB, Express, React+Redux, Node)](http://mern.io/) software stack but also uses next.js to keep things clean and simple. Everything should work out of the box. There are two choices:

1. install NodeJS and MongoDB and run locally - [See here for detailed instructions](
   "Instructions")

2. install Docker and run in a container - [See here for detailed instructions](https://github.com/voluntarily/vly2/blob/master/docs/Docker.md "Instructions")

### Available Commands

1. `npm run dev` - starts the development server with hot reloading enabled

2. `npm run build` - bundles the code

3. `npm run test` - start the test runner

4. `npm run start` - runs production server

5. `npm run check-coverage` - generates test coverage report

6. `npm run lint` - runs standard to check for lint errors ( npm run fix to fix lint errors )

7. `npm run storybook` - starts the Storybook Component Library


Once you see the message: 

    "Voluntarily is running on port: 3122! Be Awesome!" 

then you can open your browser at http://localhost:3122.

If you see the message _"Please make sure Mongodb is installed and running!"_  then go back and start mongod.

Press `ctrl + c` to exit the node application.

#######################Running BDD Tests#########################

    cd systemtest
    npx codeceptjs run --grep "@smoke" --plugins allure   
    allure serve output



############### BDD Set Up ################################ 

//Refer https://codecept.io/bdd

### MacOS
You may need to install selenium and webdriver
`brew install selenium-server-standalone`
`brew install allure`
followed by
`selenium-server -port 4444`


