# TrackMyTime

# Table of Contents

* [Introduction](#Introduction)
* [Getting Started](#Getting-Started)
  * [Requirements](#Requirements)
  * [Building](#Building)
  * [Configuring](#Configuring)
  * [Running](#Running)

# Introduction

A project about a project about a project about a time tracking project.

# Getting Started

## Requirements

* Node.JS (17.9.0 or higher)
* npm (8.5.0 or higher)

## Building

To build the project one must first open a Shell window in the master directory, and run the command "npm install". Be sure to run "npm install" every time you get a new update for the project so it doesn't get out of sync!

## Configuring
### Dotenv
```
Rename
.env-example --> .env

Insert your database URL
DB_Connection = postgres://username:password@example.com/database

Insert a secret for the session
SessionSecret = "secret"

Insert a secret for jasonwebtoken
JWTSecret = "hi";

```

## Running

To run the project the command "npm start" is used in the master directory. "npm run dev" is used to run it in debug with nodemon.