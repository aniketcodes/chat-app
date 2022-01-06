const socket = io()

socket.on( 'message', (message) => {
  console.log( message );
} )


document.querySelector( "#message-form" ).addEventListener( "submit", ( e ) => {
  e.preventDefault();
  let message = e.target.elements.message.value;
  socket.emit( "sendMessage", message );
} )

document.querySelector( "#send-location" ).addEventListener( "click", () => {
  if ( !navigator.geolocation ) {
    return alert("Geolocation is not supported by browser")
  }
  navigator.geolocation.getCurrentPosition( ( location ) => {
    let { latitude, longitude } = location.coords;
    socket.emit("sendLocation",{latitude,longitude})
  })
})