How to run:
install npm packages
run node app.js
go to localhost:3000 in your browser

How authentication works:
Registering creates a user database entry
The password is hashed through bcrypt
Logging in compares the log in fields to the database
If the log in is successful, a jwt token is created
This token is checked whenever the user tries to manage the games
The token expires is 2 hours
