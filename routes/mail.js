const express = require('express');
const mailgunModel = require('../models/mailgunModel');
const router = express.Router();


router.post("/send", async (req, res) => {
    const body = req.body;
    const result = mailgunModel.send(res, body);

    return result;
});



module.exports = router;
