# Northcoders News API

## Project Summary 

This is a project designed to consolidate the skills and techniques I've acquired through studying back-end development. 

NC-News is an api that creates its own database of users, news articles, comments and topics from the development data provided and actions a range of http requests based on user input. 

Currently available requests include retrieving all available articles, sorted by date in either ascending or descending order, posting comments, updating a specific vote count, and deleting a comment. Please refer to the endpoints.json file to view a full list of available endpoints. 

The project is hosted at: https://nc-news-zcdp.onrender.com 

## Getting Started 

### Cloning the Repo and Installing Dependencies 

First, clone the repo from https://github.com/kimmimonkey/nc-news.git. You'll need to install the relevant dependencies using the command npm install or npm i. 

### Creating the .env files Information about how to create the two .env files.

In order to run the tests using the test database, but use the development data within the api, you will need to set up environment variables. 

Using .env-example, create files called .env.development and .env.test. 

1) Within these files, add the line: PGADATABASE=database_name_here
2) Replace "database_name_here" in each file with the correct database name. The .env.test file should contain the test database name, and the .env.development file should use the other database name. 

Clear instructions of how to clone, install dependencies, seed local database, and run tests.

### Database Setup

Setup the database locally and complete seeding using these commands: 
npm run setup-dbs
npm run seed 

### Running Tests

The command npm test app runs the test suite. "app" is a key word that means only the tests created for the api run. There is a suite of tests created for the utility functions, which can be run using the command npm test utils.

.only can be appended to a describe or test keyword within the app.test file, so that only that block of tests or individual test

There is a developer dependency package called husky installed, which will not allow commits to be made unless all tests pass. 

### Version Information 

The minimum versions of Node.js and Postgres needed to run the project: 


Node    : >6.0.0
Postgres: 14.12


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)