//CONTROLLER: data configuration/initialisation and REST; stateful

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var Config = require('../config/config');

var configmodel = {
    "heartbeat": " \n",
    "options" : {
        "hostname" : "stream.gitter.im",
        "port"     : 443,
        "path"     : "/v1/rooms/" + Config.roomId + "/chatMessages",
        "method"   : "GET",
        "headers"  : {
            "Authorization": "Bearer " + Config.token,
            "Content-Type": "application/json",
            "Accept": "application/json"           
        }
    }
}


var RD = require('../model/model').RoomData;

// this is the callback function to be injected in the MODEL
var sk = function(io, chatBuffer){ 
  //broadcast tweets
  io.sockets.emit('add', chatBuffer); //<<<--- check!!!
  chatBuffer = {};
  size = false;
  ////originally only the following:
  //io.sockets.emit('post', chatBuffer);
}


// configuring model with the new values and methods
RD.options = configmodel.options;
RD.heartbeat = configmodel.heartbeat;
RD.sk = sk;

// passing reconfigurated model to App
module.exports.skData = RD;
