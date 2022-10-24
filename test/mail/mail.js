/**
 * Test for class Card.
 */
"use strict";

/* global describe it */

// Vi använder testdatabas istället för vår
// databas i drift!
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

// var assert = require("assert");
// const Card = require("../../src/card/card");


chai.should();

chai.use(chaiHttp);


describe('Paths', () => {
    describe('POST /mail/send', () => {
        const email = {
            recipient: "erna21@student.bth.se",
            subject: `Invitation by erik@erik.com`,
            text: `Welcome to Erik's Editor,

You have been invited by erik@erik.com to work on document "testDoc".
Register or log into Erik's Editor to begin.

Happy editing!
https://www.student.bth.se/~erna21/editor/
`
        };

        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/mail/send")
                .send(email)
                .end((err, res) => {
                    res.body.message.should.be.oneOf([
                        "Error, no API key was provided.",
                        "Error, no domain was provided.",
                        "Email succesfully sent."
                    ]);
                    done();
                });
        });
    });
});



