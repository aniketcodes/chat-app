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


let count = 0;

io.on( 'connection', (socket) => {
  console.log( "New web socket connection" )
  socket.emit( 'message', "Welcome" );
})

//LISTEN Route
server.listen( PORT, ( err ) => {
  if ( err ) {
    return console.log(`Error in serving at port ${PORT}`)
  }
  console.log( `Serving at PORT ${ PORT }` );
})
