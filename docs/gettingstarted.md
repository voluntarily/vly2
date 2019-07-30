# Getting Started
===
This guide covers some recommended ways to get yourself set up for development on the Voluntarily Platform
Refer to OS-specific guides for your machine to get started. 


## Windows
========================================

### Setup
1. Install Node.js on your machine if you don't have it https://nodejs.org/en/
2. Install MongoDB community server on your machine if you don't have it https://www.mongodb.com/download-center/community
3. Install Visual Studio Code on your machine if you don't have it https://code.visualstudio.com/
4. Clone the voluntarily repo https://github.com/voluntarily/vly2
..1. If you're a new user and you downloaded visual studio code, follow the instructions below:
..2. Open up a terminal in visual studio
..3. Make sure the terminal is set to bash
..4. Find your way to a folder you want to put the files in
..5. Run the following command from the terminal (git clone https://github.com/voluntarily/vly2.git)
..6. Create a new terminal window, and run the npm install command

### Running a dev server
1. Create a new terminal window, and run the ```mongod``` command
2. Create a new terminal window, and run the ```npm run dev``` command
3. That's it! You can check your server is running by opening a browser and trying to visit http://localhost:3122
4. Try making some changes to the components or pages - thanks to hot reloading any chances you make and save instantly appear on the site 
5. If you run into any errors, write down what the error says, and try googling parts of the error to solve it

			


## Mac
========================================

### Setup

1. Install Homebrew https://brew.sh/
2. Make sure it's running correctly by running the `brew doctor` command
3. If you're running into permission issues with homebrew - run sudo chown -R $(whoami) /usr/local
4. Install Node.js on your machine if you don't have it by opening a terminal and running brew install node
5. Install MongoDB on your machine if you don't have it by opening a terminal and running brew install mongodb
6. Create a db directory for mongodb sudo mkdir -p /data/db
7. Make sure permissions are set correctly for the directory 
..1. sudo chmod 0755 /data/db
..2. sudo chown $USER /data/db
..3. Install Visual Studio Code on your machine if you don't have it https://code.visualstudio.com/
..4. Clone the voluntarily repo https://github.com/voluntarily/vly2
..5. If you're a new user and you downloaded visual studio code, follow the instructions below:
...1. Open up a terminal in visual studio
...2. Make sure the terminal is set to bash
...3. Find your way to a folder you want to put the files in
...4. Run the following command from the terminal (git clone https://github.com/voluntarily/vly2.git)
...5. Create a new terminal window, and run the npm install command

### Running a dev server
1. Create a new terminal window, and run the mongod command
2. Create a new terminal window, and run the npm run dev command
3. That's it! You can check your server is running by opening a browser and trying to visit http://localhost:3122
4. Try making some changes to the components or pages - thanks to hot reloading any chances you make and save instantly appear on the site 



## Linux
========================================

### Setup

1. Install Node.js on your machine if you don't have it by opening a terminal and running apt-get install node
2. Install MongoDB on your machine if you don't have it by opening a terminal and running brew install mongodb
3. Create a db directory for mongodb sudo mkdir -p /data/db
4. Make sure permissions are set correctly for the directory 
..1. sudo chmod 0755 /data/db
..2. sudo chown $USER /data/db
5. Install Visual Studio Code on your machine if you don't have it https://code.visualstudio.com/
6. Clone the voluntarily repo https://github.com/voluntarily/vly2
7. If you're a new user and you downloaded visual studio code, follow the instructions below:
..1. Open up a terminal in visual studio
..2. Make sure the terminal is set to bash
..3. Find your way to a folder you want to put the files in
..4. Run the following command from the terminal (git clone https://github.com/voluntarily/vly2.git)

### Running a dev server
1. Create a new terminal window, and run the npm install command
2. Create a new terminal window, and run the mongod command
3. Create a new terminal window, and run the npm run dev command
4. That's it! You can check your server is running by opening a browser and trying to visit http://localhost:3122
5. Try making some changes to the components or pages - thanks to hot reloading any chances you make and save instantly appear on the site 
