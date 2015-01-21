var urlparse = require('helpers/urlparse');

describe("url parsing", function(){

    it("handles single param", function(){
        var loc = {search: "?endpoint=betelgeuse"};
        var params = urlparse.parseParameters(loc);
        expect(params["endpoint"]).toBe("betelgeuse");
    });

});
