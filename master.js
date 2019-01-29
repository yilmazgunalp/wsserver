const Server = require('./server.js');

const Master = Object.create(null);

Master.start = (port) => Server.start(port);

Master.authorize = (auth,id) => Server.authorize(auth,id);

Master.onMessage = (cb) => Server.messenger.on('newMessage',cb);

Master.send = msg => Server.messenger.emit('sendMessage',msg)

module.exports = Object.freeze(Master);
