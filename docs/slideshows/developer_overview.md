---
title: Voluntarily Developer Overview
theme: puzzle.css
revealOptions:
    transition: 'fade'
    
---
# Join the Voluntari.ly community

Support education and innovation in New Zealand Schools with industry experts and volunteers in the classrooms

[![Gitter](https://badges.gitter.im/voluntarily/community.svg)](https://gitter.im/voluntarily/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

![Voluntarily Logo](./img/v-logo.svg "Voluntarily Logo")

Note: Speaker Notes here

---

# Purpose
We are building a platform that connects corporate volunteer time with classrooms to teach science & technology, engineering, entrepreneurship, arts and design 

with the help of engaging content supplied by New Zealand’s leading innovators in educational content.

---

# How to Help

* Sponsorship - give money, guidance and networking help
* Volunteering on the platform - find and commit to activites put up by requestors.
* Contribute to building the platform - help develop a world class open source project. 

---

# How to Help

* Sponsorship - give money, guidance and networking help
* Volunteering on the platform - find and commit to activites put up by requestors.
* <span style="background-color: orange;" >Contribute to building the platform - help develop a world class open source project. </span>

---

# Contribute to Development

### You don't need permission! 

This is an open source project and you are welcome to contribute at any level you feel comfortable. 
Find out more about the project at the [Voluntari.ly website](http://voluntari.ly) and then...

---

* Say hi introduce yourself in the gitter chat room https://gitter.im/voluntarily/community
* Docs & Issue tracking at https://voluntarily.atlassian.net
* Get the code from https://github.com/voluntarily
* Come along to a Drop in Wednesday Afternoon or after work social at Centrality (48 Emily Place)
* Come along to one of our developer events - see http://voluntari.ly for the latest details.


---

# First Challenge

## Add your name to the CONTRIBUTORS

* clone the code
* edit the file
* check it in and send us a pull request

Use this ticket [VP-82](https://voluntarily.atlassian.net/browse/VP-82)

----

# What you need to get started

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
You probably already have it. Verify with `git --version` 
* [Nodejs](https://nodejs.org/en/download/). 
Verify this with `node -v` which should return a current version. e.g. v12.1.0

----

# Mongo DB

* [MongoDB](https://docs.mongodb.com/manual/installation/) https://docs.mongodb.com/manual/installation/
  
For mac users `brew install mongodb` should be all you need to do.

Start the mongodb service `mongod`

----

# Get the Voluntari.ly source code

    git clone https://github.com/voluntarily/vly2.git
    cd vly2
    npm install



----

# you served my father

`npm run dev` - starts the development server with hot reloading enabled 
 
Open browser at http://localhost:3122/test
ctrl+c to exit

----

# Jedi(t)

Edit ./components/test/Hello.js and make it salute your name.

    export default (props) => 
      <p className='greeting' >
        Hello, *Your name here*!
      </p>

Save - and the test webpage should update to show your change.

----

# You're all clear, kid

`npm run lint` - runs _standard_ to check for lint errors 

There should be no warnings. If there are `npm run fix` to fix most errors.

----

# Run the Tests

`npm test` - runs any AVA tests found in *.spec.js files. 

----

# 1 test failed

      components › test › Hello › renders properly

      /Users/watkinsav/workspace/voluntarily/vly2/components/test/__tests__/Hello.spec.js:8

      7:   t.truthy(wrapper.find('p').first().hasClass('greeting'))          
      8:   t.is(wrapper.find('p').first().text(), 'Hello, *Your name here*!')
      9: })                                                                  

      Difference:

      - 'Hello, *Andrew*!'
      + 'Hello, *Your name here*!'

----


# Undo Undo
Undo the change you made to hello.js
    
    git checkout --  ./components/test/Hello.js

To get the original file and discard the changes you made.

Then `npm run test` again and you should get all tests passed.

----

# Ch ch ch changes
Create a git branch to hold your changes:

    git branch 'doc/VP-82/andrew'

format branch name as: type/jira/label.   
[VP-82](https://voluntarily.atlassian.net/browse/VP-82) is the jira ticket used to add contributors.

`type = doc|feat|bug|merge`

----

# Do the work 
#### magic happens here

Edit the ./CONTRIBUTORS file and add your name and email to the bottom.

Save - and run `lint`  and `test` to check you didn't break anything.

----

# Git in sync

'git pull' - Fetches the latest changes others have made and merges them into your branch. 
'git push' - pushes your changes back to the origin

----
![Git Cheat Sheet](./img/Git-Cheat-Sheet.png "Git Cheat Sheet")


----
# Pull up! 

Now ask for your changes to be merged back from the branch into the master
On the github page

Then put it in your 'local' repository.

    git add .
    git commit -m"Added my name to CONTRIBUTORS"


---
# Looking at the pieces

Voluntari.ly is based on the MERN (MongoDB, Express, React+Redux, Node) software stack and uses next.js to keep things clean and simple.


