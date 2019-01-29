const {parse, URLSearchParams} = require("url");
let {createReadStream,createWriteStream,writeFile,open,write } = require("fs");


// String -> Result null String
  const safeJSONParse = string => {
    try {return JSON.parse(string)} 
    catch(e) {return null}
   } 

// retrieves the body of a request. Asynchronous so has to be 'then'ed with a callback
const getBody = async function(req) {
	let data = "";
	return  new Promise(resolve => {
		req.on("data",chunk => data += chunk);
	 	req.on("end",() => resolve(data));  
	});
} 

//converts post form data to JSON
const formToJson = (formdata) => {
    let result = {}; 
    formdata.split("&").forEach(e => {
        let [k,v] = e.split("=");
        result[k] = v;
    });
return result;
};

const cookiesToJson = (cookies) => {
    let result = {}; 
    cookies.split(";").forEach(e => {
        let [k,v] = e.split("=");
        result[k] = v;
    });
return result;
}

//returns request url parameters
const qparams = (req)=> {
  let path = parse(req.url).path;
  let qparams = /\?(.*)$/.exec(path);
  let params;
  if(qparams !== null) {
    params =  new URLSearchParams(qparams[1]); 
  }
  return params;
};

const basePath = (path)=> {
        return /^\/([^\/]*)/.exec(path)[1];
    };

// Hex -> Object
const readHttpHeader = socketData =>{
      return socketData.toString().split('\r\n')
      .slice(0,-2)
      .map(line => {
       let [k,v] = line.split(': ');
       return {[k]:  v};
      })
      .reduce((acc,cur)=> {
      acc[Object.keys(cur)[0]] = (Object.values(cur)[0]);
      return acc;
      },{});
}

module.exports = {safeJSONParse,getBody,formToJson, readHttpHeader,cookiesToJson,qparams,basePath};

