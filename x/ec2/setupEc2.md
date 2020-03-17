# Running Perf Scripts on an EC2 server

The performance initPlatform script fills the test database with 1000s of entities. This can take some time for the larger options.

This doc shows how to run the script on an AWS EC2 instance.
It assumes you have already setup the instance and have an SSH connection.

# Initial Installations
## install git
    sudo yum install -y git

## install node
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

then close and reopen the terminal to load the new profile.
    nvm --version
    nvm install node


## install mongo db
    sudo vi /etc/yum.repos.d/mongodb-org-4.2.repo

insert
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/$releasever/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc

    sudo yum install -y mongodb-org

### start MongoDB
    sudo systemctl start mongod


# install person generator service
    cd 
    git clone https://github.com/RandomAPI/Randomuser.me-Node.git user
    cd user
    npm ci

edit app.js:68 to comment out throttling. 

    npm run build

## run in background
    npm start &  


# install vly2 and modules. 
git clone https://github.com/voluntarily/vly2.git
git checkout VP-1439-cli-script-to-create-a-large-number-of-entitites
cd vly2
npm ci

# create a .env file with the mongo connection url 
vi .env


# finally run the setup scripts
time node x/db/perf/initPlatform.js m