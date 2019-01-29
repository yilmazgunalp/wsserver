const crypto = require('crypto');
const {readFrame} = require('./reader.js')
const {safeJSONParse,readHttpHeader,cookiesToJson} = require('./modules/util.js')

exports.handleData = function(data) {   
    if(this.socket.isNew) {
      console.log('lets handshake')
      let head = readHttpHeader(data);
      handShake(this.socket,head,this.clients,this.authorizer,this.identifier);
      this.socket.isNew = false;
      console.log('after handshake')
    }else  { 
      console.log('Socket already connected') 
      let message = safeJSONParse(readFrame(data,this.socket));
      this.messenger.emit('newMessage',message);
    };
}

exports.handleClosing = function() {
  console.log('EMITTED CLOSING EVENT')
  this.socket.isClosed = true;
}

exports.handleClose =  function(hadError) {
   console.log('socket closed',hadError)
};

exports.handleEnd = function() {
  console.log('before',this.clients.size) 
  this.clients.delete(this.socket.user);
   console.log('socket ended')
  console.log('after',this.clients.size) 
};

// String -> String
const SecWSAcceptHeader = SecWSKey => {
		const hash = crypto.createHash('sha1');
    hash.update(SecWSKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
    return (hash.digest('base64'));
}

// TODO this is not pure needs refactoring
const handShake = (socket,head,clients,auth,id) => {
  if(auth(head)) {
    clients.set(id(head),socket);
    socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               `Sec-WebSocket-Accept: ${SecWSAcceptHeader(head['Sec-WebSocket-Key'])}\r\n` +
               '\r\n');
  } else { console.log('coldnt authorize ', this.auth)}
}
