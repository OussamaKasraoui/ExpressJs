const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var moment = require('moment');
const Schema = mongoose.Schema;

// User model Schema
var userSchema = new Schema({
    firstName:  String,
    lastName:   String,
    email:      {type: String, unique: true, lowercase: true, required: true},
    password:   {type: String, min: 6},
    date:       {type: Date, default: moment()},
    point:      [{_id:     { type: Schema.Types.ObjectId, ref: 'Store'},
                  date:    { type: Date, required: true},
                  status : { type: Number, default : 0  }
                }]
});

//@ Saving new user
//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });

// Saving authenticating existed user
//Compare Given password against stored Hashed password
userSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same) {
      if (err) {
        callback(err);
      } else {
        callback(err, same);
      }
    });
};

module.exports = mongoose.model('User', userSchema);
module.exports = userSchema;