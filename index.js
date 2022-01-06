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
const { addUser, removeUser, getUser, getUsersInRoom } = require( './src/utils/users' )

app.use( "/", express.static( path.join( __dirname, "public" ) ) )


io.on( 'connection', (socket) => {
  console.log( "New web socket connection" )
  socket.on( 'join', ( options, callback ) => {
    const { error, user } = addUser( { id: socket.id, ...options } )

    if ( error ) {
      return callback( error )
    }

    socket.join( user.room )

    socket.emit( 'message', generateMessage( 'Admin', 'Welcome!' ) )
    socket.broadcast.to( user.room ).emit( 'message', generateMessage( 'Admin', `${ user.username } has joined!` ) )
    io.to( user.room ).emit( 'roomData', {
      room: user.room,
      users: getUsersInRoom( user.room )
    } )

    callback()
  } )


  socket.on( 'sendMessage', ( message, callback ) => {
    const user = getUser( socket.id )
    const filter = new Filter()

    if ( filter.isProfane( message ) ) {
      return callback( 'Profanity is not allowed!' )
    }

    io.to( user.room ).emit( 'message', generateMessage( user.username, message ) )
    callback()
  } )

  socket.on( 'sendLocation', ( coords, callback ) => {
    const user = getUser( socket.id )
    io.to( user.room ).emit( 'locationMessage', generateLocationMessage( user.username, `https://google.com/maps?q=${ coords.latitude },${ coords.longitude }` ) )
    callback()
  } )

  socket.on( 'disconnect', () => {
    const user = removeUser( socket.id )

    if ( user ) {
      io.to( user.room ).emit( 'message', generateMessage( 'Admin', `${ user.username } has left!` ) )
      io.to( user.room ).emit( 'roomData', {
        room: user.room,
        users: getUsersInRoom( user.room )
      } )
    }
  } )
})

//LISTEN Route
server.listen( PORT, ( err ) => {
  if ( err ) {
    return console.log(`Error in serving at port ${PORT}`)
  }
  console.log( `Serving at PORT ${ PORT }` );
})
