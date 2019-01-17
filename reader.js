exports.readFrame = (data,socket) => {
  console.log('Hello from READER')
  let fin = (data[0] & 0x80) === 0x80;
  let rsv1 = (data[0] & 0x40);
  let rsv2 = (data[0] & 0x20);
  let rsv3 = (data[0] & 0x10);
  let opcode = data[0] & 0x0F; // if this equals to  1 then payload is utf encoded text.
  let mask = (data[1] & 0x80);
  let length = (data[1] & 0x7F); // reads the last seven digits of the second byte

  if(opcode === 8) {socket.emit('closing');return}
  let nextByte = 2;
  if (length === 126) {
     length = data.readUInt16BE(2)
    nextByte += 2;
  } else if (length === 127){
    console.error('No Implementation for 64bit Integers')
    nextByte += 8;
  }
  let maskingKey = null;
  if (mask){
    maskingKey = data.slice(nextByte, nextByte + 4);
    nextByte += 4;
  }
  let payload = data.slice(nextByte, nextByte + length);

  if (maskingKey){
    for (let i = 0; i < payload.length; i++){
      payload[i] = payload[i] ^ maskingKey[i % 4];
    }
  }
console.log('MESSAGE FROM CLIENT',payload)
  return payload.toString();
}

