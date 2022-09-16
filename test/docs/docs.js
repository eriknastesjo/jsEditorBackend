/**
 * Test for class Card.
 */
"use strict";

/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

var assert = require("assert");
// const Card = require("../../src/card/card");


chai.should();

chai.use(chaiHttp);



describe('Paths', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.result.should.be.an("array");
                    done();
                });
        });
    });

    describe('POST /insert', () => {
        it('201 HAPPY PATH', (done) => {
            const testName = "TestName";
            const testContent = "TestContent";

            chai.request(server)
                .post("/insert")
                .send({
                    name: testName,
                    content: testContent
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.result.should.be.an("object");
                    res.body.data.result._id.should.be.an("string");
                    assert.equal(res.body.data.result.name, testName);
                    assert.equal(res.body.data.result.content, testContent);
                    done();
                });
        });
    });

    describe('POST /reset', () => {
        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/reset")
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.result.should.be.an("string");
                    assert.equal(res.body.data.result, "Database reset.");
                    done();
                });
        });
    });

    describe('POST /init', () => {
        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/init")
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.result.should.be.an("string");
                    assert.equal(res.body.data.result, "3 documents were inserted.");
                    done();
                });
        });
    });

    describe('POST /insert and /update', () => {
        const testName = "TestName";
        const testContent = "TestContent";
        const testNameUpdated = "TestNameUpdated";
        const testContentUpdated = "TestContentUpdated";
        let testId;

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/insert")
                .send({
                    name: testName,
                    content: testContent
                })
                .end((err, res) => {
                    testId = res.body.data.result._id;
                    done();
                });
        });

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/update")
                .send({
                    _id: testId,
                    name: testNameUpdated,
                    content: testContentUpdated
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.result.should.be.an("object");
                    assert.equal(res.body.data.result.modifiedCount, 1);
                    done();
                });
        });
    });

    describe('POST /insert and /find', () => {
        const testName = "TestName";
        const testContent = "TestContent";
        let testId;

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/insert")
                .send({
                    name: testName,
                    content: testContent
                })
                .end((err, res) => {
                    testId = res.body.data.result._id;
                    done();
                });
        });

        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/find")
                .send({
                    _id: testId
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.result.should.be.an("object");
                    assert.equal(res.body.data.result._id, testId);
                    assert.equal(res.body.data.result.name, testName);
                    assert.equal(res.body.data.result.content, testContent);
                    done();
                });
        });
    });

    // todo: skriv test för \find också (först insert sen find som när testar update)
});



