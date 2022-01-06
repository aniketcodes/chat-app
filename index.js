const dotenv = require( "dotenv" );
dotenv.config();
const express = require( 'express' )
const app = express();
const path = require( "path" );
const http = require( "http" );
const PORT = process.env.PORT;
const server = http.createServer( app );
app.use("/",express.static(path.join(__dirname,"public")))

//LISTEN Route
server.listen( PORT, ( err ) => {
  if ( err ) {
    return console.log(`Error in serving at port ${PORT}`)
  }
  console.log( `Serving at PORT ${ PORT }` );
})
