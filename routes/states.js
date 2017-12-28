var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('../config');

// var db = mongojs('mongodb://'+config.db.user+':'+config.db.password+'@ds121906.mlab.com:21906/info-ng');
var db = mongojs(config.db.connectionString)

//Get All States
router.get('/', function (req, res, next) {
    if(req.query.capital){
        db.states.findOne({
            capital: req.query.capital
        }, function (err, singleState) {
            if (err) {
                res.send(err);
            } else {
                if(singleState){
                    db.lgas.find({
                        state: String(singleState._id)
                    }).sort({id: 1},function (err, states) {
                        if (err) {
                            res.send(err);
                        } else {
                            singleState["lgas"] = states
                            res.json(singleState);
                        }
                    })

                    // res.json(singleState);
                }else{
                    res.status(404)
                    res.send('State not found')
                }
            }
        });
    }else{
        db.states.find({},{ name: 1, capital: 1, _id: 0 }).sort({name: 1},function (err, states) {
            if (err) {
                res.send(err);
            } else {
                res.json(states);
            }
        })
    }
    
    // res.send('STUDENT APIs');
});

//Get State by name or alias
router.get('/:name', function (req, res, next) {
    // db.states.createIndex( {name:-1}, { collation: { locale: 'en', strength: 2 }} );
    db.states.findOne({
        $or: [ { name: req.params.name }, { capital: req.params.name } ]
    }, function (err, singleState) {
        if (err) {
            res.send(err);
        } else {
            if(singleState){
                // res.json(singleState);

                db.lgas.find({
                    state: String(singleState._id)
                }).sort({id: 1},function (err, states) {
                    if (err) {
                        res.send(err);
                    } else {
                        singleState["lgas"] = states
                        res.json(singleState);
                    }
                })

            }else{
                res.status(404)
                res.send('State not found')
            }
        }
    });
});


//Save State
router.post('/', function (req, res, next) {
    var state = req.body;
    if (!state.firstName || !(state.lastName) || !(state.class) || !(state.gender)) {
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    } else {
        db.states.save(state, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
})

//Update State
router.put('/:id', function (req, res, next) {
    var state = req.body;
    var updObj = {};

    if (!state.firstName || !(state.lastName) || !(state.class) || !(state.gender)) {
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    } else {
        db.states.update({
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

//Delete State
router.delete('/:id', function (req, res, next) {
    db.states.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, 1, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});


//Update States
router.put('/update', function (req, res, next) {
    var state1 = req.body;
    var updObj = {};

    // console.log(state1)

    // var obj = JSON.parse(state1);
    var stateData = state1

    stateData.forEach(function (stateJson) {
        var stateInfo;
        stateInfo = stateJson.info

        db.states.findOne({
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


                    db.states.update({
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