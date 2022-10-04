const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');


// Express server
const app = express();

// Spara http server som används "inom" app. Det används sedan för att skapa sockets.
const httpServer = require("http").createServer(app);

const port = process.env.PORT || 1337;  // antingen i drift eller lokalt


const middleware = require("./middleware/index.js");
const errorMiddleware = require("./middleware/error.js");

const index = require('./routes/index');
const auth = require('./routes/auth');
const hello = require('./routes/hello');


// APP
// ===================================

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Tillåter klienter från andra domäner att använda sig av API:et (vad det nu betyder...?)
app.use(cors());



// SOCKETS
// ===================================
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// const io = require("socket.io")(httpServer, {
//     cors: {
//         origin: "https://www.student.bth.se/~erna21/editor/",
//         methods: ["GET", "POST"]
//     }
// });
// const io = require("socket.io")(httpServer, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });

io.sockets.on('connection', function (socket) {
    console.log("socket-id: " + socket.id); // Nått lång och slumpat
    socket.on('join', function (room) {
        console.log("joining room: " + room);
        socket.join(room);
    });
    socket.on('leave', function (room) {
        console.log("leaving room: " + room);
        socket.leave(room);
    });
    socket.on("name", function (data) {
        console.log("update name");
        console.log(data);
        // socket.broadcast.emit("name", data);
        socket.to(data["_id"]).emit("name", data);
    });
    socket.on("content", function (data) {
        console.log("update content");
        console.log(data);
        // socket.broadcast.emit("content", data);
        socket.to(data["_id"]).emit("content", data);
    });
});


// GENERAL MIDDLEWARE
// ===================================
// middleware that writes out route path and method in console
app.use(middleware.logIncomingToConsole);
// don't show the morgan log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}



// ROUTES
// ===================================
app.use('/', index);
app.use('/auth', auth);
app.use('/hello', hello); // så URL:en behöver börja med /hello
// och sen fylla på med routenames från hello.js





// ERROR MIDDLEWARE (must come after other routes)
// ===================================
app.use(errorMiddleware);


// // Startup server and liten on port
// app.listen(port, () => {
//     console.log(`Server is listening on ${port}`);
//     console.log(`DSN is: ${dsn}`);
// });


// Start up server (save server as a variable so it can be imported and used for integration tests)
const server = httpServer.listen(port, () => console.log(`API listening on port ${port}!`));
// const server = app.listen(port, () => console.log(`API listening on port ${port}!`));

module.exports = server;
