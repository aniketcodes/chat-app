const dotenv = require( "dotenv" );
dotenv.config();
const express = require( 'express' )
const app = express();
const path = require( "path" );
const http = require( "http" );
const socketio = require( "socket.io" );
const PORT = process.env.PORT;
const server = http.createServer( app );
const io = socketio( server );

app.use("/",express.static(path.join(__dirname,"public")))


io.on( 'connection', (socket) => {
  console.log( "New web socket connection" )
  socket.emit( 'message', "Welcome" );
  socket.broadcast.emit( 'message', "A new user has joined" );
  socket.on( "sendMessage", ( message ) => {
    io.emit( "message", message );
  } );

  socket.on( "sendLocation", ( { latitude, longitude } ) => {
    socket.broadcast.emit("message",`A user's location lat ${latitude} long ${longitude}`)
  })

  socket.on( "disconnect", () => {
    io.emit( "message", "A user has left the chat" );
  })
})

//LISTEN Route
server.listen( PORT, ( err ) => {
  if ( err ) {
    return console.log(`Error in serving at port ${PORT}`)
  }
  console.log( `Serving at PORT ${ PORT }` );
})
