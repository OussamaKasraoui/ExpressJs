var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var storeSchema = new Schema({
    Owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    Date:     {type: Date, default: moment()},
    Name:     { type: String, unique: true, required: true},
    Address:  String,
    Location: {
                  type:       {
                                type:         String,
                                enum:       ['Point'],
                                required:   true
                              },
                  coordinates:{
                                type:       [Number],
                                required:   true
                              }
              },
    Reaction: [{
                  '_id':      {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
                  date:       { type: Date, required: true},
                  status:     { type: Number, default : 0  }
              }]
});



module.exports = mongoose.model('Store', storeSchema);
module.exports = storeSchema;