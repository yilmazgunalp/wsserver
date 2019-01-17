const crypto = require('crypto');
const assert = require('assert');
const config = require('../config/config');


//not being used at the moment
const chiper = (data) => {
  let x =  crypto.createCipher('aes192');
  x.update(data,'utf8','base64');
return  x.final("base64");
};
//not being used at the moment
const dechiper = (chiper) => {
  let y = crypto.createDecipher('aes192');
  y.update(chiper,'base64','utf8');  
  return y.final('utf8');
};

const base64UrlEncode = (base64) => {
  return base64.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const base64Encode = (base64Url) => {
  return base64Url.replace(/-/g, '+').replace(/_/g, '/');
};

const base64UrlDecode = (base64Url) => {
  let base64 = base64Encode(base64Url);
  return Buffer.from(base64Url, 'base64').toString();
};

const jsonTobase64 = (json) => {
  return Buffer.from(JSON.stringify(json)).toString("base64");
};

const signature = (header,payload) => {
  let first = jsonTobase64(header);
  let second = jsonTobase64(payload);
  let token = base64UrlEncode(first) + "." + base64UrlEncode(second);
  const hash = crypto.createHmac('sha256',config.SECRET);
  hash.update(token);
  return base64UrlEncode(hash.digest('base64'));
};

const createJWT = (userdata) => {
  if (!userdata.username) throw error;
  const header = {
    "alg": "HS256",
    "typ": "JWT"
    };
  let payload = {
  "iss": "cohab",
  "sub": userdata.username
  };
  return  base64UrlEncode(jsonTobase64(header)) + "." + base64UrlEncode(jsonTobase64(payload)) + 
"." + signature(header,payload);
};  

const verifyToken = (token) => {
  //as per specification https://tools.ietf.org/html/rfc7519#section-7.2
  if (!/\./.test(token)) throw "Not Valid JWT";
  let header = /^[^\.]+/.exec(token)[0];
  header = base64UrlDecode(header);
  if(/[\n\s]/.test(header)) throw "Not Valid JWT Header";
  let headerobj = JSON.parse(header);
  if(headerobj.alg != "HS256" || headerobj.typ != "JWT") throw "HEADERS NOT PERMITTED";
  if(headerobj.enc) throw "JWE TOKEN NOT IMPLEMENTED";
  //validate signature
   const hash = crypto.createHmac('sha256',config.SECRET);
   let signing_input = /(.*\.){2}/.exec(token)[0].slice(0,-1);
   let signature = /[^\.]+$/.exec(token)[0];
   hash.update(signing_input);
   let r = base64UrlEncode(hash.digest('base64'));
  if(r != signature) throw "SIGNATURE DOES NOT MATCH";
  if(headerobj.cty) throw "NESTED JWT NOT SUPPORTED";
  let message = base64UrlDecode(/(.*\.){2}/.exec(token)[1].slice(0,-1));
  if(/[\n\s]/.test(header)) throw "Not Valid JWT Payload";
  let messageobj = JSON.parse(message);
  assert.ok(messageobj instanceof Object);
  // check if algortim matches
  assert.strictEqual(headerobj.alg,"HS256");
  //validate claims
  
  // check permissons
  

  return(messageobj);
};


module.exports = {createJWT,verifyToken,base64UrlEncode};
