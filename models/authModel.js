const database = require("../db/database.js");
const validator = require("email-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();




const authModel = {

    register: async function register(req, res) {
        const email = req.email;
        const password = req.password;


        // Kolla om både email och lösenord finns angivna
        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email and/or password not provided."
                }
            });
        }

        // Kolla att email är i rätt format
        if (!validator.validate(email)) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email is not in correct format"
                }
            });
        }

        // Försök hasha lösenord...
        const saltRounds = 10;

        bcrypt.hash(password, saltRounds,
            async function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            message: "Could not hash password"
                        }
                    });
                }

                //... och försök spara hashat lösenord

                let db;

                try {
                    db = await database.getDb("users");
                    const userDoc = {
                        email: email,
                        password: hash
                    };
                    const result = await db.collection.insertOne(userDoc);
                    // kanske skicka result i res nedan?

                    console.log(result);

                    return res.status(201).json({
                        data: {
                            status: 201,
                            message: "User succesfully created"
                        }
                    });
                } catch (error) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            message: "Could not create new user"
                        }
                    });
                } finally {
                    await db.client.close();
                }
            });
    },
    login: async function register(req, res) {
        let db;

        try {
            db = await database.getDb("users");
            const filter = { email: req.email };
            const user = await db.collection.findOne(filter);
            // kanske skicka med detta i res nedan?


            if (user) {
                this.comparePassword(res, user, req.password);
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        message: "User not found"
                    }
                });
            }
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    message: "Database error"
                }
            });
        } finally {
            await db.client.close();
        }
    },
    comparePassword: async function comparePassword(ress, user, password) {
        // user.password är vårt hashade lösenord
        bcrypt.compare(password, user.password, function (err, res) {
            // res innehåller nu true eller false beroende på om det är rätt lösenord.
            if (err) {
                return ress.status(500).json({
                    errors: {
                        status: 500,
                        message: "Could not decrypt password"
                    }
                });
            }
            if (res) {
                const payload = { email: user.email };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                return ress.status(201).json({
                    data: {
                        id: user["_id"],
                        email: user.email,
                        token: token
                    }
                });
            }
            return ress.status(401).json({
                errors: {
                    status: 401,
                    message: "Incorrect password"
                }
            });
        });
    },
    getAllUsers: async function getAllUsers() {
        // req contains user object set in checkToken middleware
        let db;

        try {
            db = await database.getDb("users");

            const allUsers = await db.collection.find().toArray();

            return allUsers;
        } catch (error) {
            return {
                errors: {
                    message: error.message
                }
            };
        } finally {
            await db.client.close();
        }
    },
    reset: async function () {
        let db;

        try {
            db = await database.getDb("users");
            await db.collection.deleteMany();

            const msg = `Database reset.`;

            return msg;
        } catch (error) {
            return {
                errors: {
                    message: error.message
                }
            };
        } finally {
            await db.client.close();
        }
    },
    checkToken: function checkToken(req, res, next) {
        const token = req.headers['x-access-token'];

        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            console.log("decoded: ");
            console.log(decoded);
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        message: "Invalid token"
                    }
                });
            }
            // Valid token send on the request
            next();
        });
    }
};


module.exports = authModel;
