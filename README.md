#Real Time GitterRooms Net Viz
###Simple Network Chart of users posting at gitter room

The project:
* is Full JS stack
* uses gitter stream api
* captures data in an express.js server and passes data to a basic front-end (jQuery + d3.js) using socket.io
* manipulates data and create a simple viz on real time at front-end

The project is a simple . It is intended to provide FreeCodeCamp (FCC) with useful metrics about how users are performing in the Gitter chatrooms.

The demo only runs in local. It was made to run in localhost port 3000

IMPORTANT: no persistent memory was used in this project

IMPORTANT: you are also required to create a `config/config.js` folder/file and add:
* Your Gitter Token (Check https://developer.gitter.im/docs/welcome)
* Find the id of the target room (please ask if you are interested)

They should be passed to `routes/index.js` file as `Config.token` and `Config.roomId` respectively.

To install the project you should have node.js installed. Clone/Pull the project into a desired location and run:
```
>> npm install
```
Then after installation, you can start the project by using:
```
>> npm start
```

OBS: This demo makes sense for very populated, very active rooms at Gitter.

You can reach me at varikvi@yahoo.com

---

Thanks to Gitter Developers Room and the FreeCodeCamp's DataScience Room.