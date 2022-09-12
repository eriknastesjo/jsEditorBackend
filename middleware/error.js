/**
 * Error middleware.
 */
"use strict";

var express = require('express');
var router = express.Router();


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
router.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});


module.exports = router;