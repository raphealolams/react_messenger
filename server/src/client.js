// import webSocket from 'uws';
const webSocket = require('uws')
const ws = new webSocket("ws://localhost:9107")


ws.on('open', () => {
  console.log("Socket Cliented to server")

  ws.send("Hello bitch")
  ws.on('message', (message) => {
    console.log("Server sent this ", message)
  })
})