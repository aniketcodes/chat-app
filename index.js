const dotenv = require( "dotenv" );
dotemv.config();
const express = require( 'express' )
const app = express();
const PORT = process.env.PORT;


//LISTEN Route
app.listen( PORT, ( err ) => {
  if ( err ) {
    return console.log(`Error in serving at port ${PORT}`)
  }
  console.log( `Serving at PORT ${ PORT }` );
})
