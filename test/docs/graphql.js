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

var assert = require("assert");
// const Card = require("../../src/card/card");


chai.should();

chai.use(chaiHttp);



describe('Paths', () => {
    describe('POST /graphql', () => {
        const testName = "TestName";
        const testContent = "TestContent";
        const testAllowedUsers = ["test@test.com", "erik@erik.com"];
        const testComments = [
            {
                "user": "test@test.com",
                "commentNum": "1",
                "comment": "Sentence sounds weird..."
            },
            {
                "user": "erik@erik.com",
                "commentNum": "2",
                "comment": "YOUR sentence sounds weird."
            }
        ];
        let _idSave;

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/insert")
                .send({
                    name: testName,
                    content: testContent,
                    allowed_users: testAllowedUsers,
                    comments: testComments
                })
                .end((err, res) => {
                    _idSave = res.body.data.result._id;
                    done();
                });
        });

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/graphql")
                .send({
                    query: `{
                    doc (_id: "${_idSave}")
                    {
                        _id
                        name
                        content
                        comments {
                            user
                            commentNum
                            comment
                        }
                        allowed_users
                    }
                }`
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("object");
                    assert.equal(res.body.data.doc._id, _idSave);


                    res.body.data.doc._id.should.be.an("string");
                    res.body.data.doc.name.should.be.an("string");
                    res.body.data.doc.content.should.be.an("string");
                    res.body.data.doc.allowed_users.should.be.an("array");

                    res.body.data.doc.comments.should.be.an("array");
                    res.body.data.doc.comments[0].user.should.be.an("string");
                    res.body.data.doc.comments[0].commentNum.should.be.an("string");
                    res.body.data.doc.comments[0].comment.should.be.an("string");

                    done();
                });
        });
    });
    describe('POST /graphql with no comments', () => {
        const testName = "TestName";
        const testContent = "TestContent";
        const testAllowedUsers = ["test@test.com", "erik@erik.com"];
        let _idSave;

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/insert")
                .send({
                    name: testName,
                    content: testContent,
                    allowed_users: testAllowedUsers
                })
                .end((err, res) => {
                    _idSave = res.body.data.result._id;
                    done();
                });
        });

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/graphql")
                .send({
                    query: `{
                    doc (_id: "${_idSave}")
                    {
                        _id
                        name
                        content
                        allowed_users
                    }
                }`
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("object");
                    assert.equal(res.body.data.doc._id, _idSave);


                    res.body.data.doc._id.should.be.an("string");
                    res.body.data.doc.name.should.be.an("string");
                    res.body.data.doc.content.should.be.an("string");
                    res.body.data.doc.allowed_users.should.be.an("array");

                    assert.equal(res.body.data.doc.comments, null);
                    done();
                });
        });
    });
});



