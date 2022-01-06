const socket = io()

let $messageForm = document.querySelector( "#message-form" );
let $messageFormInput = $messageForm.querySelector( "input" )
let $messageFormButton = $messageForm.querySelector( "button" );

let $locationButton = document.querySelector( "#send-location" );
let $messages = document.querySelector( "#messages" );

//Template

let messageTemplate = document.querySelector( "#message-template" ).innerHTML;


socket.on( 'message', (message) => {
  console.log( message );

  let html = Mustache.render( messageTemplate ,{message});
  $messages.insertAdjacentHTML('beforeend',html)
} )


$messageForm.addEventListener( "submit", ( e ) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled","disabled")
  let message = e.target.elements.message.value;
  socket.emit( "sendMessage", message, () => {
    $messageFormButton.removeAttribute( "disabled" );
    $messageFormInput.value = '';
    $messageFormInput.focus();
    console.log("message was delivered")
  } );
} )

$locationButton.addEventListener( "click", () => {
  if ( !navigator.geolocation ) {
    return alert("Geolocation is not supported by browser")
  }
  $locationButton.setAttribute( "disabled", 'disabled' );
  navigator.geolocation.getCurrentPosition( ( location ) => {
    let { latitude, longitude } = location.coords;
    socket.emit( "sendLocation", { latitude, longitude }, () => {
      console.log( "Location shared" )
      $locationButton.removeAttribute("disabled")
    })
  })
})