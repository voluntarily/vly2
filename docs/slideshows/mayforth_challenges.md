---
title: Voluntarily May the Fourth (be with you) Challenges
theme: puzzle.css
revealOptions:
    transition: 'fade'
    
---
# Voluntari.ly
May the Fourth Mission

![V](./img/v-logo.svg)
---
# Voluntari.ly
<br />
![V](./img/v-logo.svg)
## Working Bee @ Datacom
### May the Fourth (be with you)
---
# Voluntari.ly
<br />
![V](./img/v-logo.svg)
## Challenges
### <br />
---
# Challenges
![V](./img/v-logo.svg)
1. Dev to Production
2. Corporate Integration 
3. Volunteer Me

---
# Dev to Production


----
# Dev to Production

## GOAL
Set up automated processes that make life easy for contributors, especially given that they are volunteers. And also to help us maintain a high level of code quality. 
----

## Current state
* http://alpha.voluntarily.nz = docker container on Amazon Elastic Container Service (ECS)
  * Pushed from Andrew's laptop.  He holds the keys.
  * Uses docker-compose in vly1
  
* Tests run locally, not enforced, not run on github after commit
* Some code not covered by tests, no end-to-end tests.
----
## Future state
* CI - Commits are auto built and tested, fails go back to developer
* CD - good PRs to master auto pushed to UAT 
* http ->  https
* Production server(s) deployable
* Rules and processes documents

----
## Ideal for
* You know Docker, AWS/Azure, Travis, Jenkins, Github, AVA, Enzyme etc. 
* You don't need to know much about the codebase or react.
* Ticket [VP-18](https://voluntarily.atlassian.net/browse/VP-18) - Create Production Environment and Deployment chain.

---
# Corporate Integration

----
# Corporate Integration

## GOAL
Allow people from Datacom and other onboarded businesses to sign into Voluntari.ly with their office identity.

### Stretch Goal
Show the opportunity listings embedded in the company intranet. (e.g in SharePoint)
----
## Current State
* Cloud based sign in via Auth0 has support for OAuth, OICD and AD providers. 
* I can sign in with my Google, Github, Facebook and LinkedIn accounts as well as create a username and password.

* An OpsListSection component contains a list of Opportunity cards - see Landing page
----
## Future State
* Kerry can sign in with his Datacom credentials
* We have a documented process of what business need to do to get onboarded
* We can get some information about the person - e.g. job title, skills ?
* We can deliver a page URL in embedded form with no header/footer. 
  * e.g ?embedded=true
* We have https and can be embedded into an internal content page.

----
## Ideal for...
* OAuth, AD, Sharepoint and Firewall experts
* Next/Express/React to setup the undecorated pages
* Someone to write up the experience
  * [VP-101](https://voluntarily.atlassian.net/browse/VP-101) As a corporate user I can sign in using my company 
  * [VP-103](https://voluntarily.atlassian.net/browse/VP-103) As a corporate user I can see a list of volunteering opportunities on my intranet

---
# Volunteer Me
----
# Volunteer Me
## GOAL
Volunteers can put their hand up for an opportunity and teachers can see who is interested.
----
## Current State
* We have a page of opportunities, create and edit.
* A button on the opportunity details page that opens a mailto.

----
## Future State
* Click the I'm Interested button, fill in a message about your level of interest and you are linked to the request
* Creator of the request sees a list of who is interested
* and can send a confirming invitation, (or decline)
* Volunteers can see the items they are committed to, and interested in on their Home page.
* Both sides and message/email the other.
----

* [VP-53](https://voluntarily.atlassian.net/browse/VP-101) - As a volunteer I can express interest in an opportunity 
* [VP-41](https://voluntarily.atlassian.net/browse/VP-101) - As a teacher I can create, edit and manage my list of opportunties.


---
# Extras
Plus any amount of 

* Testing - writing tests, and fixing the bugs they find.
* Styling - making the pages look like the designs
* Training/Learning - react, node, mongo and next etc.
* Researching solutions.
* Thinking about how to make everything better.

---
# Voluntari.ly
![V](./img/v-logo-white.svg)

---
# Voluntari.ly
![V](./img/v-logo.svg)
---

# &nbsp;
![V](./img/v-logo.svg)
---
