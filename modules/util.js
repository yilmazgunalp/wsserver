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

//reads file and converts to JSON
const fileToJson = () => {
	return new Promise(resolve => {  
	let usersFile = createReadStream("./users.json");
	let users = "";
	usersFile.on("data",chunk =>  users += chunk);
		usersFile.on("end", () => {
        let result = JSON.parse(("["+ users.replace(/\n/g,",").slice(0,-1) + "]")); 
	resolve(result);  
		});
	});  
};

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


module.exports = {safeJSONParse,getBody,formToJson, fileToJson,cookiesToJson,qparams,basePath};

