var request = require("request");
var bind = require('bind');

var base_url = "https://vast-shelf-49781.herokuapp.com";
var allUrls = [];
allUrls.push('/');
allUrls.push('/login');
allUrls.push('/logcheck');
allUrls.push('/order');
allUrls.push('/logout');


describe("Servizio pasti Trento", function() {
  	describe("Status code test suite", function() {
		for(u in allUrls){
    		it("returns status code 200", function(done) {
      			request.get(base_url+allUrls[u], function(error, response, body) {
        			expect(response.statusCode).toBe(200);
					done();
      			});
    		});
		}
  	});
});
