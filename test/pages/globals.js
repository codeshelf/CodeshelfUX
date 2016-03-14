var self = module.exports = {
    cookie: {},
    before: function(browser) {
      console.log("Setting up...");
      browser
        .windowSize('current', 1024, 768)
        .url("app:8000/") 
        .waitForElementVisible("body", 1000)
        .login('user', 'password')
    },
};