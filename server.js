const net = require('net');
const {handleConnection} = require('./connection')
const Messenger  = require('./messenger.js')
const {createFrame} = require('./writer.js')

const clients = new Map();

const Server = Object.create(null);

Server.server = net.createServer();

Server.messenger = new Messenger();

Server.start = (Server => port => Server.server.listen(port,() => console.log('Server started MAGESTICALLY on PORT',port)))(Server)

Server.authorize = (auth,id) => Server.server.on('connection',handleConnection.bind({auth,id, messenger: Server.messenger,clients})); 

Server.server.on('error', (err) => {
  console.error('Websocket Server FAILED SHAMEFULLY: ',err);
  throw err;
});

const sendMessage = msg => {
  let client = clients.get(msg.to);
  if(msg && client && !client.isClosed) {
    client.write(createFrame(JSON.stringify(msg)));
  }else {
   console.error('Can not send Message',{msg,client})  
  }
}

Server.messenger.on('sendMessage',sendMessage)

module.exports = Object.freeze(Server);
