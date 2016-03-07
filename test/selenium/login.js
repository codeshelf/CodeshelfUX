import 'source-map-support/register';

var username = "paul.monteiro+pfsweb@codeshelf.com";
var password = "testpassword";

export default {
  'Login User' : (browser) => {
    const page = browser.page.login();
    browser.url('http://localhost:8000/');

    page.expect.element('@username').to.be.present.before(1000);
    page.login(username, password);
    browser.end();
  }
};
