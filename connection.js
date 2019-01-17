const net = require('net');
const sessions = require('./modules/session');
const crypto = require('crypto');
const {readFrame} = require('./reader.js')
const {createFrame} = require('./writer.js')
const util = require('./modules/util');
const {safeJSONParse} = require('./modules/util.js')
const Conversation = require('./message/message');
const ConversationService = require('./message/message.service')(Conversation);

const clients = new Map();
let counter = 0;

exports.handleConnection = (socket) => {
  console.log('client connected');
  socket.isNew = true;
  console.log(++counter)

  socket.on('closing',() => {
  console.log('EMITTED CLOSING EVENT')
  socket.isClosed = true;
  })
  socket.on('data',(data, skt = socket) => {   
      console.log('hello from DATAAAAAAA')
      console.log('clients size:', clients.size)
    if(skt.isNew) {
      console.log('lets handshake')
      let head = readHttpHeader(data);
      handShake(socket,head);
      skt.isNew = false;
      console.log('after handshake')
    }
    else  { 
      console.log('Socket already connected') 
      //console.log('frame data',readFrame(data));
      let message = safeJSONParse(readFrame(data,skt));
      console.log('hghjgjgjh',message);
if(socket.isClosed) {
      console.log('Socket has closed.Cant write to it anymore')
      return;

}
      ConversationService.getAll('ruby').then(ms => console.log( 'llllllllll',ms))
        ConversationService.create(message).then(message => console.log( message,'fgfgfgfgfgfg','FROM WEBSOCKET SERVER CREATED MESSAGE'))
      if(message && message.type === 'chat' && clients.has(message.to)) {
        clients.get(message.to).write(createFrame(JSON.stringify(message)));
        console.log('shouldnt see this')
      } else {
      // write the message to DB

      }
      //socket.write(createFrame('You are not the devil.just a practise'));
    };
  })

  socket.on('close', (hadError) => {
   console.log('socket closed',hadError)
  });
  socket.on('end', () => {
  console.log('before',clients.size) 
  clients.delete(socket.user);
   console.log('socket ended')
  console.log('after',clients.size) 
  });
}

// String -> String
const SecWSAcceptHeader = SecWSKey => {
		const hash = crypto.createHash('sha1');
    hash.update(SecWSKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
    return (hash.digest('base64'));
}

// Hex -> Object
const readHttpHeader = socketData =>{
      return socketData.toString().split('\r\n')
      .slice(0,-2)
      .map(line => {
       let [k,v] = line.split(': ');
       return {[k]:  v};
      })
      .reduce((acc,cur)=> {
      acc[Object.keys(cur)[0]] = (Object.values(cur)[0]);
      return acc;
      },{});
}

// TODO this is not pure needs refactoring
const handShake = async(socket,head) => {
  let session_id = util.cookiesToJson(head.Cookie).session_id;
  let user =  await sessions.retrieve(session_id);
    socket.user = user.sub;
    clients.set(user.sub,socket);
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               `Sec-WebSocket-Accept: ${SecWSAcceptHeader(head['Sec-WebSocket-Key'])}\r\n` +
               '\r\n');
}


