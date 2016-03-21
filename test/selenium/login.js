import 'source-map-support/register';

//var username = "paul.monteiro+pfsweb@codeshelf.com";
//var password = "testpassword";

var username = 'richardizip@gmail.com';
var password = 'test';

export default {
  'Login User' : (browser) => {
    const page = browser.page.login();
    browser.url('http://localhost:8000/');

    page.expect.element('@username').to.be.present.before(1000);
    page.login(username, password);
  },
  'after': (browser) => {
    console.log('Closing down...');
    browser.end();
  }
};
