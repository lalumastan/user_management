@ECHO OFF
mongoexport --uri="%USER_MGMT_MONGO_URI%" --db=%USER_MGMT_MONGO_DB% --collection=users --out=users.json
