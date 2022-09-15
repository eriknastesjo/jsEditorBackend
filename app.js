const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');

// Express server
const app = express();
// const port = process.env.DBWEBB_PORT || 1337;   // antingen i drift eller lokalt

const port = process.env.PORT || 1337;  // antingen i drift eller lokalt

// // MongoDB
// const mongo = require("mongodb").MongoClient;
// const dsn = process.env.DBWEBB_DSN || "mongodb://localhost:27017/documents";   // antingen i drift eller lokalt

const middleware = require("./middleware/index.js");
const errorMiddleware = require("./middleware/error.js")

const index = require('./routes/index');
const hello = require('./routes/hello');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Tillåter klienter från andra domäner att använda sig av API:et (vad det nu betyder...?)
app.use(cors());




//GENERAL MIDDLEWARE
// ===================================
app.use(middleware.logIncomingToConsole); // middleware that writes out route path and method in console
// don't show the morgan log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}



// ROUTES
// ===================================
app.use('/', index);
app.use('/hello', hello); // så URL:en behöver börja med /hello och sen fylla på med routenames från hello.js





// ERROR MIDDLEWARE (must come after other routes)
// ===================================
app.use(errorMiddleware);


// // Startup server and liten on port
// app.listen(port, () => {
//     console.log(`Server is listening on ${port}`);
//     console.log(`DSN is: ${dsn}`);
// });


// Start up server (save server as a variable so it can be imported and used for integration tests)
const server = app.listen(port, () => console.log(`API listening on port ${port}!`));

module.exports = server;