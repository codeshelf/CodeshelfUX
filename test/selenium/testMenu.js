import 'source-map-support/register';

export default {
  'Menu': (browser) => {
    const page = browser.page.login();
    browser.setCookie(browser.globals.cookie);
    browser.url('http://localhost:8000/');
    console.info(browser.globals.cookie);    
    page.expect.element('.sidebar-menu').to.be.present.before(5000);
    page.click('.menu-items a');
    page.expect.element('.panel').to.be.present.before(5000);
    browser.back();
  },
}