// String -> Buffer
const createFrameHeader = (message) => {
   //FIN: 1 , RSV1-2-3: 0 , OPCODE: 1 => 1000 0001 
   let firstByte = 0x81;
   let secondByte;

   if(message.length <= 125) {
      secondByte = message.length & 0x7f;
      return Buffer.from([firstByte,secondByte]);
   } else if(message.length <= 65535) {
     secondByte = 0x7e;
     let firstTwoBytes = Buffer.from([firstByte,secondByte]);
     let payloadLength = Buffer.allocUnsafe(2);
     payloadLength.writeInt16BE(message.length & 65535)
     return Buffer.concat([firstTwoBytes,payloadLength]); 
   }
   throw Error('COULD NOT CREATE FRAME HEADER')
}   

// String -> Buffer
const createPayload = message => Buffer.from(message);

exports.createFrame = message => {
    let header = createFrameHeader(message);
    let payload = createPayload(message);
    return Buffer.concat([header,payload]); 
}
