const express = require('express');
const authModel = require('../models/authModel');
const docModel = require('../models/docModel');
const router = express.Router();


router.get("/", async (req, res) => {
    console.log("GETTING DOCS");
    const docs = await docModel.getAllDocs();

    res.json({
        data: {
            msg: "Got a GET request",
            result: docs
        }
    });
});


router.post("/findUsersDocs",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        const user = req.body;

        const result = await docModel.findUsersDocs(user);

        return res.status(201).json({
            data: {
                msg: "Got a POST request",
                result: result
            }
        });
    });

router.post("/insert", async (req, res) => {
    const newDoc = req.body;

    const result = await docModel.insertDoc(newDoc);

    return res.status(201).json({
        data: {
            msg: "Got a POST request",
            result: result
        }
    });
});


router.post("/find", async (req, res) => {
    const docToFind = req.body;

    console.log(docToFind);

    const result = await docModel.findDoc(docToFind);

    return res.status(201).json({
        data: {
            msg: "Got a POST request",
            result: result
        }
    });
});

router.post("/update", async (req, res) => {
    const docToUpdate = req.body;

    console.log(docToUpdate);

    const result = await docModel.updateDoc(docToUpdate);

    return res.status(201).json({
        data: {
            msg: "Got a POST request",
            result: result
        }
    });
});


router.post("/reset", async (req, res) => {
    const result = await docModel.reset();

    return res.status(201).json({
        data: {
            msg: "Got a POST request",
            result: result
        }
    });
});

router.post("/init", async (req, res) => {
    const result = await docModel.init();

    return res.status(201).json({
        data: {
            msg: "Got a POST request",
            result: result
        }
    });
});




// router.post("/user", (req, res) => {
//     res.status(201).json({
//         data: {
//             msg: "Got a POST request"
//         }
//     });
// });

// router.put("/user", (req, res) => {
//     res.status(204).json({
//         data: {
//             msg: "Got a PUT request"
//         }
//     });
// });

// router.delete("/user", (req, res) => {
//     res.status(204).json({
//         data: {
//             msg: "Got a DELETE request"
//         }
//     });
// });




// /**
//  * Find documents in an collection by matching search criteria.
//  *
//  * @async
//  *
//  * @param {string} dsn        DSN to connect to database.
//  * @param {string} colName    Name of collection.
//  * @param {object} criteria   Search criteria.
//  * @param {object} projection What to project in results.
//  * @param {number} limit      Limit the number of documents to retrieve.
//  *
//  * @throws Error when database operation fails.
//  *
//  * @return {Promise<array>} The resultset as an array.
//  */
// async function findInCollection(dsn, colName, criteria, projection, limit) {
//     const client = await mongo.connect(dsn);
//     const db = await client.db();
//     const col = await db.collection(colName);
//     const res = await col.find(criteria, projection).limit(limit).toArray();

//     await client.close();

//     return res;
// }








module.exports = router;
