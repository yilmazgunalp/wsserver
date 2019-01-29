const Socket = require('./socket.js');


exports.handleConnection = function(socket) {
  socket.isNew = true;

  socket.on('closing',Socket.handleClosing.bind({socket}));
  socket.on('data',Socket.handleData.bind({socket,clients: this.clients,authorizer: this.auth,messenger: this.messenger, identifier: this.id}));
  socket.on('close',Socket.handleClose);
  socket.on('end',Socket.handleEnd.bind({socket,clients:this.clients}));
}
