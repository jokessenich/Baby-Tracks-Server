# Baby Tracks App!

This is a Baby Tracks App which can be used to track the nursing, eating, and sleeping of a newborn baby. A link to the app can be found here.

https://baby-tracks-app.johnnykessenich.now.sh/user/login

## Documentation for the API

The API can be found at 
https://baby-tracks-server.herokuapp.com/api

### ENDPOINTS

ALL ENDPOINTS REQUIRE VALID TOKEN
Operations avaliable are GET
User can add '/:id'  after token to use a particularly entry by ID
Operations are GET, DELETE, PATCH

/sleep/[TOKEN]- returns the sleep entries for the user

/nursing/[TOKEN]- returns the nursing entries for the user

/diapers[TOKEN]- returns the diaper entries for the user




## Summary

Users can login and proceed to 3 different options of baby tracking.

Diapers- users can input the date and time of the diaper and see past diaper events.

Sleep- users can input the date and times of the sleep beginning and end times

Nursing- users can use a timer to time the nursings of their baby. The timer times on either side and the user can switch in between. 

## Technology Used

The server was built with node, express, postgreSQL, knex.

The client was built with react.