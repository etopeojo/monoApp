# monoApp
This application consists of 2 services namely: 
1. bankServiceApi
2. webSocketServer

## Bank Service API
Please note that this API requires the use of a MongoDB database.
The bank service api contains features like create new customer, view account balance, make transfer, etc.

Below are steps to be taken to get you all setup
1. Clone this repo
2. Inside the bankServiceApi folder, run the code "npm install" to install dependencies
3. Create a ".env" file, and fill it as such:
   HOST=0.0.0.0
   PORT=1337

    # DB
  DATABASE_HOST={}
  DATABASE_SRV={}  
  DATABASE_PORT={}
  DATABASE_NAME="test-strapi"
  DATABASE_USERNAME={}
  DATABASE_PASSWORD={}
  AUTHENTICATION_DATABASE={}
  DATABASE_SSL={}
  Note, the parts showing "{}* is to be filled with your DB details
4. Lastly, you will run the code "npm run develop" to start the service.


## Web Socket Service API
This is a simple web socket application

Below are steps to be taken to get you all setup
1. Inside the webSocketServer folder, run the "npm insall"
2. Then navigate to the path /bin/; and run the command "node www.js" to start the service
