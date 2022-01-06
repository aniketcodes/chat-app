module.exports = {
   generateMessage:( text ) => {
    return {
      text,
      createdAt: new Date().getTime()
    }
  },
  generateLocationMessage: ( url ) => {
    return {
      url,
      createdAt: new Date().getTime()

    }
  }
}