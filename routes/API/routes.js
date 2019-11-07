const storeSchema           = require('../../models/store').storeSchema;
const userSchema            = require('../../models/user').userSchema;
const mongoose              = require('mongoose');
const express               = require('express');
const bcrypt                = require('bcrypt');
const moment                = require('moment');
const jwt                   = require('jsonwebtoken');
const User                  = mongoose.model('User', userSchema);
const Store                 = mongoose.model('Store', storeSchema);
const router                = express.Router();
const { body,
        validationResult }  = require('express-validator');


/************************** *
 *       GET  routes        *
 ***************************/

// DESC           Get List of ALL stores
// STORES         @localhost/api/
router.get('/api/store',(req, res)=>{
    
    jwt.verify(req.headers.authorization, process.env.SECRETORKEY, function(err, decoded) {
        if (err) {
          return res.status(401).json({'error' : err});
        } else {
          
          Store.find( )
               .then(store => {

                let dbShops = null;
                    if (!store.length){
                        return res.json({
                            'status' : 'Shops',
                            'response': store,
                            'message' : 'there is no saved shops in database'
                        });
                    }else{
                            
                        dbShops = store.map(_store =>{
                                let Like = false;
                                let Dislike = false;

                                _store.Reaction.map(rctn =>{
                                    if(mongoose.Types.ObjectId(decoded.id).equals
                                    (mongoose.Types.ObjectId(rctn._id))){
                                        switch(rctn.status){
                                            case -1 :
                                                Like = false;
                                                Dislike = true;
                                            break;

                                            case 1 :
                                                Like = true;
                                                Dislike = false;
                                            break;

                                            default:
                                                Like = false;
                                                Dislike = false;
                                            break;
                                        }
                                    }
                                });
                                
                                return {'Id' :      _store.id,
                                        'Name':     _store.Name,
                                        'Address' : _store.Address,
                                        'Coords': {
                                                    'latitude':  _store.Location.coordinates[1],
                                                    'longitude': _store.Location.coordinates[0]
                                                  },
                                        'Like':     Like,
                                        'Dislike':  Dislike
                                    };
                        });
                    }
                    
                    return res.json({
                            'status' : 'Shops',
                            'response'  :  dbShops
                            });
                    
                    
                })
                .catch(err=>{
                    console.log('\n\nfile[routes.js] get(/api/store) catch() err =  '+ JSON.stringify(err));
                    res.json({
                        'status' : 'error',
                        'response' : err
                    });
                });
        }
    });
});

// DESC
//STORES : NEARBY
router.get('/api/store/nearby', (req, res)=>{
    
    jwt.verify(req.headers.authorization, process.env.SECRETORKEY, function(err, decoded) {
        if (err) {
            return res.status(401).json({'error' : err});
        } else {

            //fetching Shops from database
            Store.find()
                 .then(store =>{
                     
                    if(!store.length){

                        return res.json({
                            'status' : 'Shops',
                            'response': store,
                            'message' : 'there is no Shops in Database'
                        });

                    }else{
                        let retShops = store.map(_store =>{

                                    let Like    = false;
                                    let Dislike = false;
                                    let time = '';
                                    let Later       = false;

                        _store.Reaction.map(rctn =>{

                            if(mongoose.Types.ObjectId(decoded.id).equals
                              (mongoose.Types.ObjectId(rctn._id))){

                                switch(rctn.status){
                                    case -1 :
                                        Like = false;
                                        Dislike = true;
                                        time = rctn.date;

                                        var minutes = moment.utc().diff(moment.utc(time), 'minutes');
        
                                        if(minutes < 120){
                                            Later = {
                                                status : true,
                                                rest   : 120 - minutes
                                            };
                                        }
                                    break;

                                    case 1 :
                                        Like = true;
                                        Dislike = false;
                                    break;

                                    default:
                                        Like = false;
                                        Dislike = false;
                                    break;
                                }
                            }
                        });
                            
                        return {
                            'Id' :      _store.id,
                            'Name':     _store.Name,
                            'Address' : _store.Address,
                            'Location': _store.Location,
                            'Date':     time,
                            'Like':     Like,
                            'Dislike' : Dislike,
                            'Later' :   Later
                        };
                    });

                    return res.json({
                                'status' : 'Shops',
                                'response' : retShops} );
                }
            })
             .catch(err => {
                     
                return res.json({
                    'status' : 'error',
                    'response': err.message
                });
            });
        }
    });
});

// DESC
//STORES : LIKED
router.get('/api/store/preferred', (req, res)=>{
    
    jwt.verify(req.headers.authorization, process.env.SECRETORKEY, function(err, decoded) {
        if (err) {
            return res.status(401).json({'error' : err});
        } else {

            Store.find()
                 .then(store => {

                    let dbShops = null;
                    if (!store.length){
                        return res.json({
                            'status' : 'Shops',
                            'response': store,
                            'message' : 'there is no saved shops in database'
                        });
                    }else{
                            
                        dbShops = store.map(_store =>{
                                let Like = false;
                                let Dislike = false;
                                let Owner = false;

                                if(mongoose.Types.ObjectId(decoded.id).equals(
                                   mongoose.Types.ObjectId(_store.Owner))){
                                    Owner = true;
                                }

                                _store.Reaction.map(rctn =>{
                                    if(mongoose.Types.ObjectId(decoded.id).equals
                                    (mongoose.Types.ObjectId(rctn._id))){
                                        switch(rctn.status){
                                            case -1 :
                                                Like = false;
                                                Dislike = true;
                                            break;

                                            case 1 :
                                                Like = true;
                                                Dislike = false;
                                            break;

                                            default:
                                                Like = false;
                                                Dislike = false;
                                            break;
                                        }
                                    }
                                });
                                
                                return {'Id' :      _store.id,
                                        'Name':     _store.Name,
                                        'Address' : _store.Address,
                                        'Coords': {
                                                    'latitude':  _store.Location.coordinates[1],
                                                    'longitude': _store.Location.coordinates[0]
                                                  },
                                        'Like':     Like,
                                        'Dislike':  Dislike,
                                        'Owner':    Owner
                                    };
                        });
                    }
                    
                    return res.json({
                            'status' : 'Shops',
                            'response'  :  dbShops
                            });
                    
                    
                })
                .catch(err=>{
                    
                    console.log('\n\n file[reoutes.js] get(store/nearby) catch(User) error = '+err);
                    return res.json({
                                    'status': 'error',
                                    'response': err
                    });
                });

        }
    });
});


/***************************
*       POST  routes       *
***************************/
// DESC
// Add new user
router.post('/api/register',[
    body('firstName', 'your First name is required !').not().isEmpty(),
    body('lastName', 'your Last name is required !').not().isEmpty(),
    body('email', 'please signup using a valid Email address').isEmail().normalizeEmail(),
    body('password', 'Password should be 6 chars minimum').not().isEmpty().isLength({min : 6})
    ],(req, res)=>{

    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        
        return res.json({  
                    'status': 'error',
                    'response': errors 
        });
    }else {
        
        let Nuser = new User();
    
        Nuser.firstName   = req.body.firstName;
        Nuser.lastName    = req.body.lastName;
        Nuser.email       = req.body.email;
        Nuser.password    = req.body.password;
        
        User.findOne({email : Nuser.email})
            .then(user => {

                //The User doesn't exist => Add New User
                if(!user){
                    Nuser.save()
                        .then(usr =>{

                            return res.status(200).json({
                                'status': 'save',
                                response : usr
                            });
                        })
                        .catch(err=>{
                            console.log('create err = '+ JSON.stringify(err));

                            return res.json({
                                'status': 'error',
                                response : err
                            });
                        });
                }else{
                    // email is already taken
                    return res.json({ "status" :  'exist', 
                                      "response" :  {  'key' : 'email',
                                                       'value': 'please singup using another email'
                            } 
                    });  
                }
            })
            .catch(err =>{
                console.log('find by email err = '+JSON.stringify(err));

                return res.status(200).json({
                    'status': 'error',
                    response : err
                });
            });
    }  
});

// DESC
// Log user in  
router.post('/api/login', [
    body('email', 'please LOGIN using a valid Email address').isEmail().normalizeEmail(),
    body('password', 'Password should be 6 chars minimum').not().isEmpty().isLength({min : 6})
    ], (req, res)=>{
    
    const email     = req.body.email;
    const password  = req.body.password;
    
    User.findOne({"email" : email})
        .then(user => {
            
            // Check if user exists
            if (!user) {
              return res.status(404).json({ status: 'email',
                                            response: 'Email not found' });
            }

            // Check password
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                
                if (isMatch) {
                    
                    const payload = {
                      id       : user.id,
                      email    : user.email,
                      firstName: user.firstName,
                      lastName : user.lastName
                    };

                    const token = jwt.sign(payload, process.env.SECRETORKEY, {expiresIn: 31556926});


                    return res.status(200).json({   status: 'success',
                                                    response:  token});

                } else {
                    
                    return res.status(400).json({   status: 'password',
                                                    response: 'Password incorrect' });
                }
            })
            .catch(err =>{
                console.log('error compare password  = '+ JSON.stringify(err));
                return res.status(400).json({   status: 'error',
                                                    response: err });
            });
        })
        .catch(err => {
            console.log('file[routes.js] :: router.post(/api/login) :: User.findOne().catch(err = '+ err +')');
            return res.status(500). json({ "error": err });
        });
});

// DESC
// Like a store
router.post('/api/store/like', (req, res) => {

    const storeId = req.body.storeId;
    const userId  = req.headers.authorization;

    jwt.verify(userId, process.env.SECRETORKEY, function(err, decoded) {
        if (err) {
            res.status(401).json({'error' : err});
        } else {

            Store.findByIdAndUpdate({'_id': storeId})
                 .then(point =>{
                     
                    if(!point.Reaction.length){
                        point.Reaction.push({
                            '_id' : mongoose.Types.ObjectId(decoded.id),
                            'date' : moment(),
                            'status' : 1
                        });
                    }else{
                        let match = false;

                        point.Reaction.map(pnt =>{
                            if(mongoose.Types.ObjectId(pnt._id).equals(mongoose.Types.ObjectId(decoded.id))){
                                pnt.date = moment();
                                pnt.status = 1;
                                match =true;
                            }
                        });

                        if(!match){
                            point.Reaction.push({
                                '_id' : mongoose.Types.ObjectId(decoded.id),
                                'date' : moment(),
                                'status' : 1
                            });
                        }
                    }
                    
                    point.save();
                    res.status(200).json({
                        status : 'Liked',
                        response : point
                    });
            })
            .catch(err =>{
                console.log('error = '+ JSON.stringify(err));
                res.status(401).json({'error' : err});
            });
      }
    });

});

//DESC
//Disklike a store
router.post('/api/store/dislike', (req,res)=>{

    const storeId = req.body.storeId;
    const userId  = req.headers.authorization;

    jwt.verify(userId, process.env.SECRETORKEY, function(err, decoded) {
        if (err) {
            res.status(401).json({'error' : err});
        } else {
        
            Store.findByIdAndUpdate({'_id': storeId})
                .then(point =>{
                    
                    if(!point.Reaction.length){
                        point.Reaction.push({
                            '_id' : mongoose.Types.ObjectId(decoded.id),
                            'date' : moment(),
                            'status' : -1
                        });
                    }else{
                        let match = false;
                        point.Reaction.map(pnt =>{
                            if(mongoose.Types.ObjectId(pnt._id).equals(mongoose.Types.ObjectId(decoded.id))){
                                pnt.date = moment();
                                pnt.status = -1;
                                match = true;
                            }
                        });

                        if(!match){
                            point.Reaction.push({
                                '_id' : mongoose.Types.ObjectId(decoded.id),
                                'date' : moment(),
                                'status' : -1
                            });
                        }
                    }
                    
                    point.save();
                    
                    res.status(200).json({
                        status : 'disliked',
                        response : point
                    });
            })
            .catch(err =>{
                console.log('error = '+ JSON.stringify(err));
                res.status(401).json({'error' : err});
            });
        }
    });
});

// DESC
// Add a Store to Database
router.post('/api/store/add', (req,res)=>{

    jwt.verify(req.headers.authorization, process.env.SECRETORKEY, function(err, decoded) {
      if (err) {
        res.status(401).json({'error' : err});
      }else{
        const store = new Store();
        store.Owner = mongoose.Types.ObjectId(decoded.id);
        store.Name   = req.body.Name.split(',')[0] ;
        store.Address    = req.body.Address ;
        store.Location    = req.body.Location ;
        
        store.save()
             .then( store =>{
                 
                res.json({"Save": "Succeed", "store": store });
             }) 
            .catch(err => {
                
                res.json({"Save": "Failed", "error": err.message });
            });
      }
    });
});

// DESC
// Remove a Store from Database
router.post('/api/store/remove', (req,res)=>{

    const storeId = req.body.storeId;
    const userId  = req.body.userId;

    jwt.verify(req.headers.authorization, process.env.SECRETORKEY, function(err, decoded) {
        if (err) {
            res.status(401).json({'error' : err});
        }else{

            Store.findByIdAndDelete({'_id': storeId , 'Owner' : mongoose.Types.ObjectId(decoded.id) })
                 .then(str =>{

                    User.findByIdAndUpdate({'_id': decoded.id})
                        .then(user => {
                            user.point.pull({'_id' : mongoose.Types.ObjectId(storeId)});
                            user.save();
                        })
                        .catch(err => {
                            return res.status(400).json({'error' : err});
                        });

                        str.save();
                        
                        return res.json({"status": "removed", 
                                         "response": str });
                    
                 })
                 .catch(err =>{
                    res.json({"status": "error", "response": err });
                 });
        }
    });
});

// DESC
// UUpdate user's password
router.post('/api/reset', [
    body('confirmPassword', 'Password should be 6 chars minimum').not().isEmpty().isLength({min : 6})
    ], (req,res)=>{


    const userData = {
        confirmPassword:req.body.confirmPassword,
        newPassword:req.body.newPassword,
        oldPassword:req.body.oldPassword};

    jwt.verify(req.headers.authorization, process.env.SECRETORKEY, function(err, decoded) {
        if (err) {
            res.status(401).json({'error' : err});
        }

            User.findByIdAndUpdate({'_id' : decoded.id})
                .then(user => {
                    let status = null;
                    let response = null;
                    
                    // Check if user exists
                    if (!user) {
                        return res.status(404).json({ 
                            status: 'email',
                            response: 'Account not found' 
                        });
                    }

                    // Check password
                    bcrypt.compare(userData.oldPassword, user.password)
                    .then(isMatch => {
                    
                        if (isMatch) {

                            user.password = userData .confirmPassword;
                            user.save();
                            
                            const payload = {
                            id       : user.id,
                            email    : user.email,
                            firstName: user.firstName,
                            lastName : user.lastName
                            };

                            const token = jwt.sign(payload, process.env.SECRETORKEY, {expiresIn: 31556926});

                            status = 'success';
                            response = token;

                        } else {
                            status = 'incorrect';
                            response = 'Old password is incorrect';
                        }

                        return res.json({
                                'status'    : status,
                                'response'  : response
                        });
                    })
                    .catch(err =>{
                        console.log('error compare password  = '+ JSON.stringify(err));
                        response = err;
                    });
                })
                .catch(err => {
                    console.log('file[routes.js] :: router.post(/api/reset) :: User.findOne().catch(err = '+ err +')');
                    return res.status(500). json({ 
                        'status'    : 'error',
                        'response'  : err
                     });
                });
    });
});

/***************************
*       Other  routes      *
***************************/
module.exports = router;