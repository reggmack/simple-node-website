var Profile = require("./router.js");
var renderer = require("./renderer.js");

var commonHeaders = {'Content-Type': 'text/html'}

// Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
	//if url == "/" && GET
	if(request.url === "/")
	// show search
	response.writeHead(200, commonHeaders);
	renderer.view("header", {}, response);
	renderer.view("search", {}, response);
	renderer.view("footer", {}, response);
	response.end();
	
  //if url == "/" && POST
    //redirect to /:username
}
  

// Handle HTTP route GET /:username i.e. /chalkers
function user(request, response) {
	//if url == "/...."
	var username = request.url.replace("/", "");
	if(username.length > 0) {
		response.writeHead(200,  commonHeaders);
		renderer.view("header", {}, response);
		
		//get json from Treehouse
		var studentProfile = new Profile(username);
		//on "end"
		
		/**
		* When the JSON body is fully recieved the 
		* the "end" event is triggered and the full body
		* is given to the handler or callback
		**/
		studentProfile.on("end", function(profileJSON) {
			//show profile
			
			// store the values we need
			var values = {
				avatarUrl: profileJSON.gravatar_url,
				username: profileJSON.profile_name,
				badges: profileJSON.badges.length,
				javascriptPoints: profileJSON.points.JavaScript
			}
			// Simple response
			renderer.view("profile", values, response);
			renderer.view("footer", {}, response);
			response.end();
			
		});
		
		//on "error"
		
		/**
		* If a parsing, network or HTTP error occurs an
		* error object is passed in to the handler or callback
		**/
		studentProfile.on("error", function(error){
			//show error
			renderer.view("error", {errorMessage: error.message}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		});	
	}
}

module.exports.home = home;
module.exports.user = user;