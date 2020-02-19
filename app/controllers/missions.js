let mongoose = require('mongoose')
let express = require('express')
let app = express()
mongoose.Promise = require('bluebird')

// express router // used to define routes 
let missionRouter  = express.Router()
let missionModel = mongoose.model('Mission')
let responseGenerator = require('./../../libs/responseGenerator')


module.exports.controllerFunction = function(app) {


    //Get all missions
    missionRouter.get('/all',function(req,res){

        //begin mission find
        missionModel.find({}).select("path direction createdAt").exec(function(err,allmissions){
            if(err){
                let myResponse = responseGenerator.generate(true,"some error",err.code,null,null)          
                res.json(myResponse)
            }
            else
            {
                if(allmissions == null || allmissions == undefined)
                {
                    let myResponse = responseGenerator.generate(false,"No missions found",404,null,null) 
                    console.log(myResponse)        
                    res.json(myResponse)
                }
                else
                {
                    let myResponse = responseGenerator.generate(false,"Fetched missions",200,null,allmissions)
                    console.log(myResponse)     
                    res.json(myResponse)
                }           
            }

        })//end mission model find 

    })//end get all missions


    //Signup
    missionRouter.post('/create',function(req,res){

        //Verify body parameters
        if(req.body.direction !=undefined && req.body.path!=undefined){

            let newmission = new missionModel({
                direction           : req.body.direction,
                path                : req.body.path,

            });// end new mission 

            //Save mission
            newmission.save(function(err,newmission){
                if(err){
                   let myResponse = responseGenerator.generate(true,'Error occurred',500,null,null)
                    console.log(myResponse)
                    res.status(500).json(myResponse)
                }
                //If no errors
                else{        
                    let myResponse = responseGenerator.generate(false,"Mission created Successfully",200,null,newmission)
                    console.log(myResponse)
                    res.status(200).json(myResponse)
                }

            })//end new mission save
        }
        //Form fields not filled up
        else{
            let myResponse = {
                error: true,
                message: "Please fill up all the fields",
                status: 403,
                data: null
            }
            console.log(myResponse)
            res.status(403).json(myResponse)
        }
        

    })//end create

    //name api
    app.use('/missions', missionRouter)

}//end contoller code
