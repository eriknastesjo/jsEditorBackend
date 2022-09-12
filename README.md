# Eriks Documents API

## Get going

Use `npm install` to install dependencies for this app. This API is using [mongoDB](https://www.mongodb.com/) to store documents.

### Use database locally

In file `db/database.js`: Comment out `let dsn = mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.etlx7li.mongodb.net/?retryWrites=true&w=majority`.

Uncomment `let dsn = "mongodb://localhost:27017/documents"`.

### Use MongoDB Atlas
Create user and cluster. Now create a file `.env` in the root of this project with atlas username and password from the cluster like so:

ATLAS_USERNAME="xxxxxx"

ATLAS_PASSWORD="xxxxxx"

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode but doesn't keep watch over changes in script.

### `npm watch`

Runs the app in the development mode and keep it updated when changes is made to script.

## GET Routes

### `/`

Get all documents in database.

## POST Routes

### `/`

Insert new document in database with optional attributes. An _id will automatically be generated.

### `/find`

Find one document in database based on _id value.

### `/update`

Update existing attributes in one of your documents.

### `/reset`

Reset the database, deleting all documents.

### `/init`

Initiating database with three arbitrary ggdocuments described in `data/docs.json`.



