var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://<username>:<password>@ds121906.mlab.com:21906/info-ng',['states']); 
 
//Get All States
router.get('/states',function(req,res,next){
    db.states.find(function(err, states){
        if(err){
            res.send(err);
        }else{
            res.json(states);
        }
    })
    // res.send('STUDENT APIs');
});

router.get('/',function(req,res,next){
    res.send('STATES APIs');
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





//Get State by id
router.get('/state/:id',function(req,res,next){
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

//Save State
router.post('/state', function(req,res,next){
    var state = req.body;
    if(!state.firstName || !(state.lastName)|| !(state.class)|| !(state.gender)){
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    }else{
        db.states.save(state, function(err, result){
            if(err){
                res.send(err);
            }else{
                res.json(result);
            }
        })
    }
})

//Update State
router.put('/state/:id', function(req,res,next){
    var state = req.body;
    var updObj = {};

    if(!state.firstName || !(state.lastName)|| !(state.class)|| !(state.gender)){
        res.status(400)
        res.json({
            "error": "Invalid Data"
        })
    }else{
        db.states.update({
            _id: mongojs.ObjectId(req.params.id)
        }, state,{},function(err, result){
            if(err){
                res.send(err);
            }else{
                res.json(result);
            }
        })
    }
})

//Delete State
router.delete('/state/:id', function(req,res,next){
    db.states.remove({
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