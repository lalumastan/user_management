@ECHO OFF
mongoimport --uri="%USER_MGMT_MONGO_URI%" --db=%USER_MGMT_MONGO_DB% --collection=users --file=users.json 
