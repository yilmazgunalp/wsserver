const jwt = require('./jwt');

const create = ({req,resp,user}) => {
  //create a JWT token 
  let token = jwt.createJWT(user);
  //set Cookie for JWT token
  resp.setHeader('Set-Cookie',`session_id=${token};Path=/`);
};

const retrieve = (session_id)=> {
  return jwt.verifyToken(session_id);
};

module.exports = {create,retrieve};

