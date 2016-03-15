import 'source-map-support/register';

var username = "andrejskoki@gmail.com";
var password = "test";

export default {
  'Menu': (browser) => {
    const page = browser.page.login();
    browser.url('http://localhost:8000/');

    page.expect.element('@username').to.be.present.before(1000);
    page.login(username, password);
    page.expect.element('.sidebar-menu').to.be.present.before(5000);

    // elements which should appear after clicking on menu items in order
    const elements = ['.panel', '.panel', '.panel', '.panel', 'svg', '.form-control', '.form-control', '.form-control', '.panel-body', '.panel', '.inner-table',
    '.inner-table', '.listview', '.panel', '.listview', '.listview', '.listview', '.listview'];

    browser.elements('css selector', '.menu-items a', (result)=>{
      for (let e of result.value) {
        browser.elementIdClick(e.ELEMENT).getLog('browser', function(result) {
           for (let error in result) {
                // catch console errors
                if (result[error].level === 'SEVERE') {
                    console.log(result[error]);
                }
           }
        });
        // wait for element to appear
        page.expect.element(elements[e.ELEMENT] || '.panel').to.be.present.before(7000);
      }
    })
    browser.end();
  },
}