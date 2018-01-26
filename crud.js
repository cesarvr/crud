const mongoskin = require('mongoskin')
const bodyParser = require('body-parser')
const express = require('express')
const _ = require('underscore')

let MongoURI = process.env.MONGOURL

function initialize() {

    var router = new express.Router();

    console.log('connecting to mongodb: ', MongoURI)

    if (_.isEmpty(MongoURI)) {
        console.log('no connection to MongoDB, persistance capabilities are disable')
        console.log('to enable persistance capabilities deploy this container with the enviorment variable MONGOURL')
        console.log('============================================================ \n\n')
        console.log('example: mongodb://User:Password@ServiceName:27317/Database')

        router.get('/', function(req, res) {
            res.send('Persistance is not available. Please check the logs for more information.')
        })

        return router
    }

    const db = mongoskin.db(process.env.MONGOURL);

    return route(router, db, require('mongodb').ObjectID)
}


const route = function(router, db, ObjectID) {

    // parse application/x-www-form-urlencoded
    router.use(bodyParser.urlencoded({
        extended: false
    }))

    // parse application/json
    router.use(bodyParser.json())

    let collection = {};

    router.param('collectionName', function(req, res, next, collectionName) {
        collection = db.collection(collectionName)
        return next()
    })

    router.get('/', function(req, res) {
        res.send('please select a collection, e.g., /collections/messages')
    })

    router.get('/collections/:collectionName', function(req, res) {
        collection.find({}, {
            limit: 10,
            sort: [
                ['_id', -1]
            ]
        }).toArray(function(e, results) {
            if (e) return next(e)
            res.send(results)
        })
    })

    router.post('/collections/:collectionName', function(req, res) {
        collection.insert(req.body, {}, function(e, results) {
            if (e) return next(e)
            res.send(results)
        })
    })

    router.get('/collections/:collectionName/:id', function(req, res) {
        collection.findOne({
            _id: ObjectID(req.params.id)
        }, function(e, result) {
            if (e) return next(e)
            res.send(result)
        })
    })

    router.put('/collections/:collectionName/:id', function(req, res) {
        collection.update({
            _id: mongoskin.helper.toObjectID(req.params.id)
        }, {
            $set: req.body
        }, function(e, result) {

            res.send(result)
        })
    })

    router.delete('/collections/:collectionName/:id', function(req, res) {
        collection.remove({
            _id: ObjectID(req.params.id)
        }, function(e, result) {
            if (e) return next(e)
            res.send(result)
        })
    })


    return router
}

module.exports = initialize()
