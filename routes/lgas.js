var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('../config');

// var db = mongojs('mongodb://'+config.db.user+':'+config.db.password+'@ds121906.mlab.com:21906/info-ng');
var db = mongojs(config.db.connectionString)

//Get All LGAs
router.get('/', function (req, res, next) {
    if(req.query.capital){
        db.lgas.findOne({
            capital: req.query.capital
        }, function (err, singleLGA) {
            if (err) {
                res.send(err);
            } else {
                if(singleLGA){
                    db.lgas.find({
                        state: String(singleLGA._id)
                    }).sort({id: 1},function (err, lgas) {
                        if (err) {
                            res.send(err);
                        } else {
                            singleLGA["lgas"] = lgas
                            res.json(singleLGA);
                        }
                    })

                    // res.json(singleLGA);
                }else{
                    res.status(404)
                    res.send('LGA not found')
                }
            }
        });
    }else{
        db.lgas.find(function (err, lgas) {
            if (err) {
                res.send(err);
            } else {
                res.json(lgas);
            }
        })
    }
    
    // res.send('STUDENT APIs');
});


//Get LGA by id
router.get('/:id', function (req, res, next) {
    db.lgas.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, state) {
        if (err) {
            res.send(err);
        } else {
            res.json(state);
        }
    });
});


//Save LGA
router.post('/state', function (req, res, next) {
    var state = req.body;
    if (!state.firstName || !(state.lastName) || !(state.class) || !(state.gender)) {
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    } else {
        db.lgas.save(state, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
})

//Update LGA
router.put('/state/:id', function (req, res, next) {
    var state = req.body;
    var updObj = {};

    if (!state.firstName || !(state.lastName) || !(state.class) || !(state.gender)) {
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    } else {
        db.lgas.update({
            _id: mongojs.ObjectId(req.params.id)
        }, state, {}, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
})

//Delete LGA
router.delete('/state/:id', function (req, res, next) {
    db.lgas.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, 1, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});


//Update LGAs
router.put('/lgas/update', function (req, res, next) {
    var state1 = req.body;
    var updObj = {};

    // console.log(state1)

    // var obj = JSON.parse(state1);
    var stateData = state1

    stateData.forEach(function (stateJson) {
        var stateInfo;
        stateInfo = stateJson.info

        db.lgas.findOne({
            capital: stateInfo.Capital
        }, function (err, state) {
            if (err) {
                res.send(err);
            } else {
                console.log(stateInfo.Governor)
                if (state) {
                    // console.log(state)
                    state["deputyGovernor"] = stateInfo.DeputyGovernor
                    state["governor"] = stateInfo.Governor
                    state["slogan"] = stateInfo.Slogan
                    state["landMass"] = stateInfo.Area
                    state["longitude"] = stateInfo.Longitude
                    state["latitude"] = stateInfo.Latitude
                    state["lgas"] = stateInfo.Number_of_LGAS
                    state["dateFounded"] = stateInfo.Date_created
                    state["officialWebsite"] = stateInfo.Website
                    state["population"] = stateInfo.Population


                    db.lgas.update({
                        _id: mongojs.ObjectId(state._id)
                    }, state, {}, function (err, result) {
                        if (err) {
                            res.send(err);
                        } else {
                            updObj[state.name] = state
                        }
                    })
                }
            }


        })
    })

    res.json(updObj)
});
module.exports = router;