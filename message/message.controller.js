const Conversation = require('./message');
const ConversationService = require('./message.service')(Conversation);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userdb');
const {safeJSONParse,readHttpHeader,cookiesToJson} = require('../modules/util.js')
const sessions = require('../modules/session');

const Master = require('../master.js');

const setSocketID = (header) => {
  let session_id = cookiesToJson(header.Cookie).session_id;
  let user =  sessions.retrieve(session_id);
  return user.sub
}

const handleMessage = (msg) => {
      ConversationService.create(msg).then(msg => console.log( msg,'FROM MESSAGE'))
      .catch(e => console.log(e ))
  if(msg && msg.type === 'chat') { Master.send(msg)};
}

Master.authorize(header => true, setSocketID);

Master.onMessage(handleMessage)

Master.start(4040);

