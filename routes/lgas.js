var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://josh:josh@ds121906.mlab.com:21906/info-ng',['lgas']); 
 
//Get All LGAs
router.get('/states',function(req,res,next){
    db.lgas.find(function(err, lgas){
        if(err){
            res.send(err);
        }else{
            res.json(lgas);
        }
    })
    // res.send('STUDENT APIs');
});

router.get('/',function(req,res,next){
    res.send('LGA APIs');
    // res.render('api.html')
});

// router.post('/savestates',function(req,res,next){
//     var fs = require('fs');
//     var obj;
//     fs.readFile('states.json', 'utf8', function (err, data) {
//       if (err) {
//           res.send('Error Occured')
//           throw err
//     };
//       obj = JSON.parse(data);
//       obj.forEach(function(table) {
//         var tableName = table.name;
//         console.log(tableName);
//         db.states.save(table, function(err, result){
//             if(err){
//                 res.send(err);
//             }
//         })
//     });
//     res.send('Done');
//     });
// });





//Get LGA by id
router.get('/lga/:id',function(req,res,next){
    db.states.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, state){
        if(err){
            res.send(err);
        }else{
            res.json(state);
        }
    });
    // res.send('STUDENT APIs');
});

//Get LGA by state
router.get('/lga',function(req,res,next){
    db.states.findOne({
        state: req.query.state
    }, function(err, lga){
        if(err){
            res.send(err);
        }else{
            // state["governor"] = "Udom Gabriel Emmanuel"
            // db.states.update({
            //     _id: mongojs.ObjectId(state._id)
            // }, state,{},function(err, result){
            //     if(err){
            //         res.send(err);
            //     }else{
            //         res.json(result);
            //     }
            // })
            res.json(lga);
        }
    });
});

//Save LGA
router.post('/lga', function(req,res,next){
    var lga = req.body;
    if(!lga){
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    }else{
        db.lgas.save(state, function(err, result){
            if(err){
                res.send(err);
            }else{
                res.json(result);
            }
        })
    }
})

//Update LGA
router.put('/lga/:id', function(req,res,next){
    var lga = req.body;
    var updObj = {};

    if(!lga){
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    }else{
        db.lgas.update({
            _id: mongojs.ObjectId(req.params.id)
        }, lga,{},function(err, result){
            if(err){
                res.send(err);
            }else{
                res.json(result);
            }
        })
    }
})

//Delete LGA
router.delete('/lga/:id', function(req,res,next){
    db.lgas.remove({
        _id: mongojs.ObjectId(req.params.id)
    },1,function(err, result){
                if(err){
                    res.send(err);
                }else{
                    res.json(result);
                }
            });
});

module.exports = router;