const Conversation = require('./message');
const User = require('../user/user');
const util = require('../modules/util');
const ConversationService = require('./message.service')(Conversation,User);

exports.GET = {
getAll:        async(req,resp)=> {
                let messages = await ConversationService.getAll();
                resp.setHeader('Content-Type', 'application/json');
                resp.end(JSON.stringify(messages));
               }
}

exports.POST = {
create:        async(req,resp)=> {
               let message = await util.getBody(req).then(formdata => JSON.parse(formdata));
               ConversationService.create(message)
               .then(message => {
                 console.log("message saved succefully",message);
                 resp.end(JSON.stringify(message));
               })
               .catch(e => console.log(e));
               },

delete:        async(req,resp)=> {
               let message = await util.getBody(req).then(body => JSON.parse(body));
               ConversationService.delete(message._id)
               .then(message => {
                 resp.end();
               })
               .catch(e => console.log(e));
               }
}

