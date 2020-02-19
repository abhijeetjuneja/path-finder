// defining a mongoose schema 
// including the module
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// declare schema object.
let Schema = mongoose.Schema;

//Declare test result model
let missionSchema = new Schema({

    path                   : {type:Object,required:true},
    direction               : {type:String,required:true},
    createdAt             : {type:Date,default:Date.now()}

})

//Export model
mongoose.model('Mission',missionSchema)

