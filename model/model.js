'use strict';

//MODEL: data source/update AND behaviour of the data; stateless
var https = require('https');

var RoomData = function(){

  
    return {

    // some variable initialization
    
    "options" : '',
    
    "heartbeat" : '',
    
    "sk" : null,
    
    "Position" : 0,
    
  
    "req" : function(io){
            var Position = RoomData.Position; // I don't think I ended up using this variable...
            
            // using the BASIC Gitter API streaming format for this exercise
            // (Gitter has another much better)
            var req = https.request(RoomData.options, function(res) {
                
                // event-driven format for data capture
                res.on('data', function(chunk) {
                  var chatBuffer = {};
                  var size = false;
                  var msg = chunk.toString();
                  // the heartbeat is used to find EOL (message)
                  // a recommendation by Gitter Stream documentation
                  // OBS: because I am using a basic implementation this function DON'T CAPTURE ALL MESSAGES (get errors)!
                  if (msg !== RoomData.heartbeat && typeof chunk === 'object'){
                    try{
                      chatBuffer.name = JSON.parse(msg).fromUser.username;
                      var mentions = [];
                      for (var i = 0; i < JSON.parse(msg).mentions.length; i++){mentions.push(JSON.parse(msg).mentions[i].screenName)};
                      Position = Position + 1;
                      chatBuffer.group = Position;
                      chatBuffer.mentions = mentions;
                      chatBuffer.status = 'OK';
                      size = true;
                      console.log(chatBuffer.length);
                      
                    }catch(err){
                      console.log(err);
                      chatBuffer.name = '';
                      chatBuffer.group = 0;
                      chatBuffer.status = "GOTERROR";
                    };
                  
                  if (size === true) {         //<<-- if message, then callback (sk == socket)
                      RoomData.sk(io, chatBuffer);
                  };       
                };        
                });
              });
            
              req.on('error', function(e) {
                console.log('Something went wrong: ' + e.message);
              });
            
              req.end();
              }
    }
};

module.exports.RoomData = RoomData;