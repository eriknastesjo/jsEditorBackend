const express = require('express');
const authModel = require('../models/authModel');
const router = express.Router();


router.post("/register", async (req, res) => {
    // modellen returnerar ett json-svar!
    await authModel.register(req.body, res);
});

router.post("/login", async (req, res) => {
    // modellen returnerar ett json-svar!
    await authModel.login(req.body, res);
});

router.get("/", async (req, res) => {
    const docs = await authModel.getAllUsers();

    res.json({
        data: {
            msg: "Got a GET request",
            result: docs
        }
    });
});

router.post("/reset", async (req, res) => {
    const result = await authModel.reset();

    return res.status(201).json({
        data: {
            msg: "Got a POST request",
            result: result
        }
    });
});


module.exports = router;

