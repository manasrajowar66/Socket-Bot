const express = require('express');
const cors = require('cors');


module.exports = async (app)=>{
    app.use(cors());

    app.use(express.json());

    app.use('/api/user',require('../routes/api/userRoute'));
    app.get('/',(req,res)=>{
        res.send('Server Working')
    })

    app.use(function(req,res,next){
        return res.status(404).send({
            message:'Route '+req.url+' Not found',
            data:null
        })
    })
}