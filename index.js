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
const {generateLocationMessage,generateMessage} = require( "./src/utils/messages" );
app.use("/",express.static(path.join(__dirname,"public")))


io.on( 'connection', (socket) => {
  console.log( "New web socket connection" )
  socket.emit( 'message',generateMessage("Welcome") );
  socket.broadcast.emit( 'message', generateMessage("A new user joined") );
  socket.on( "sendMessage", ( message ,cb) => {
    io.emit( "message", generateMessage( message) );
    cb();
  } );

  socket.on( "sendLocation", ( { latitude, longitude },cb ) => {
    socket.broadcast.emit( "locationMessage", generateLocationMessage( `https://maps.google.com?q=${ latitude },${ longitude }` ))
    cb();
  })

  socket.on( "disconnect", () => {
    io.emit( "message", generateMessage( "A user has left the chat") );
  })
})

//LISTEN Route
server.listen( PORT, ( err ) => {
  if ( err ) {
    return console.log(`Error in serving at port ${PORT}`)
  }
  console.log( `Serving at PORT ${ PORT }` );
})
