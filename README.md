# Campsite

Explore the Globe with this Fully Functional Website Powered by Bootstrap and Node.js - Your Ultimate Camping Companion
---
## Requirements

For development, you will only need Node.js and a node global package, Express, MongoDB(Database used) installed in your environment.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v20.1.0

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Installing the required packages using a single command

      $ npm install

---

## Install

    $ git clone https://github.com/kartik481/campsite.git
    $ cd campsite

## Adding the Data to the database
Use can you files in the seeds folder to seed the database inoder to get full functionality. Just run the following command:
    $ node seeds/index.js

## Running the project

    $ node index.js

## Opening in browser
Just type the below URL in your browser to run:

    $ http://localhost:8080/


