Codeshelf Companion
===============

# Install NodeJS (4.1.0 stable is fine)

# General Development Instructions

## All dependencies for companion  are updated with the following command.

  `npm install`

## Run Dev Server

   `npm run dev`

## (Optional) When not running a local data server

Using test.codeshelf.com server instead of local server

1. For the time being edit endpoint in
```
  src/companion/data/initialstate.js

  //endpoint = `http://${window.location.hostname}:8181`;
  endpoint = "https://test.codeshelf.com";
```
2. run dev server with env variable USE_TEST
```
  USE_TEST=true npm run dev`
```



## Navigate to http://localhost:8000 to run the companion application against your localhost Codeshelf server

Sign in with your credentials for the data server

# Source Code for the Companion application

All source code and configuration for building the Companion web application are at:

   ./src/companion
