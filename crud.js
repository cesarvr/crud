const mongoskin = require('mongoskin')
const bodyParser = require('body-parser')
const express = require('express')

var ObjectID = require('mongodb').ObjectID;

const db = mongoskin.db(process.env.MONGOURL);

console.log('status->', db.collection('test').find({}).toArray((e,r) => console.log('e-> ', e, ' r->', r)))

console.log('connecting to mongodb: ', process.env.MONGOURL)

const route = function() {
    var app = new express.Router();

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: false
    }))

    // parse application/json
    app.use(bodyParser.json())

    let collection = {};

    app.param('collectionName', function(req, res, next, collectionName) {
        collection = db.collection(collectionName)
        return next()
    })

    app.get('/', function(req, res) {
        res.send('please select a collection, e.g., /collections/messages')
    })

    app.get('/collections/:collectionName', function(req, res) {
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

    app.post('/collections/:collectionName', function(req, res) {
        collection.insert(req.body, {}, function(e, results) {
            if (e) return next(e)
            res.send(results)
        })
    })

    app.get('/collections/:collectionName/:id', function(req, res) {
        collection.findOne({
            _id: ObjectID(req.params.id)
        }, function(e, result) {
            if (e) return next(e)
            res.send(result)
        })
    })

    app.put('/collections/:collectionName/:id', function(req, res) {
        collection.update({
            _id: mongoskin.helper.toObjectID(req.params.id)
        }, {
            $set: req.body
        }, function(e, result) {

            res.send(result)
        })
    })

    app.delete('/collections/:collectionName/:id', function(req, res) {
        collection.remove({
            _id: ObjectID(req.params.id)
        }, function(e, result) {
            if (e) return next(e)
            res.send(result)
        })
    })


    return app
}

module.exports = route
