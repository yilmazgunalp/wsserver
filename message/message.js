const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: {type: String,required: true},
    to: {type: String,required: true},
    sentAt: {type: Date, default: Date.now},
    read: {type: Boolean,default: false},
    body: {type: String,required: true},
})

const ConversationSchema = new mongoose.Schema({
    between: String,
    messages: [MessageSchema]
    });

const Conversation = mongoose.model('conversation',ConversationSchema);

module.exports = Conversation;

