const database = require("../db/database.js");
const initDocs = require("../data/docs.json");
const ObjectId = require('mongodb').ObjectId;

const docModel = {
    // varför namnge funktionen?
    // Här gör vi det för att om det blir fel i koden så skrivs funktionsnamnet ut.
    // Om vi har anonym funktion så skrivs det bara ut som "anonymous".
    getAllDocs: async function getAllDocs() {
        // req contains user object set in checkToken middleware
        let db;

        try {
            db = await database.getDb();

            const allDocs = await db.collection.find().toArray();

            return allDocs;
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

    findUsersDocs: async function findUsersDocs(req) {
        let db;

        try {
            db = await database.getDb();

            const filter = { allowed_users: { $in: [req.user] } };
            const result = await db.collection.find(filter).toArray();

            return result;
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

    insertDoc: async function (newDoc) {
        let db;

        try {
            db = await database.getDb();
            const result = await db.collection.insertOne(newDoc);

            // Vi slår ihop data om dokumentet (typ name och content)
            // med id:et som kommer tillbaka när vi får in dokumentet i databasen med insertOne()
            return {
                ...newDoc,
                _id: result.insertedId
            };
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

    findDoc: async function (req) {
        let db;

        try {
            db = await database.getDb();
            const filter = { _id: ObjectId(req._id) };
            const result = await db.collection.findOne(filter);

            console.log(result);

            // Vi slår ihop data om dokumentet (typ name och content)
            // med id:et som kommer tillbaka när vi får in dokumentet i databasen med insertOne()
            return {
                ...result
            };
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

    updateDoc: async function (req) {
        let db;

        try {
            db = await database.getDb();

            const filter = { _id: ObjectId(req._id) };

            const updateDocument = {
                $set: {
                    name: req.name,
                    content: req.content,
                    comments: req.comments
                },
            };

            const result = await db.collection.updateOne(
                filter,
                updateDocument
            );

            console.log("RESULTTAAAAAAAAAAAAT");
            console.log(result);


            return result;
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

    deleteDoc: async function () {

    },

    reset: async function () {
        let db;

        try {
            db = await database.getDb();
            await db.collection.deleteMany();

            const msg = `Database reset.`;

            console.log(msg);
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

    init: async function () {
        let db;

        try {
            db = await database.getDb();
            await db.collection.deleteMany();
            const result = await db.collection.insertMany(initDocs);

            const msg = `${result.insertedCount} documents were inserted.`;

            console.log(msg);

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
};

module.exports = docModel;
