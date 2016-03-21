import 'source-map-support/register';

var username = 'richardizip@gmail.com';
var password = 'test';

export default {
  'Login User' : (browser) => {
    const page = browser.page.login();
    browser.url('http://localhost:8000/');

    page.expect.element('@username').to.be.present.before(1000);
    page.login(username, password);
  },
  'Go to Admin' : (browser) => {
    const page = browser.page.users();
    page.expect.element('@admin').to.be.present.before(20000);
    page.goToAdmin();
  },
  'Open and close Add section': (browser) => {
    const page = browser.page.users();
    page.clickAddButton();
    page.clickCancelButton();
  },
  'Add item (incomplete data)': (browser) => {
    const page = browser.page.users();
    page.clickAddButton();
    page.fillIncompleteData();
    page.submitForm('form');
    page.expect.element('@modal').to.be.present.after(2000);
    page.clickCancelButton();
  },
  'Add item': (browser) => {
    const page = browser.page.users();
    page.clickAddButton();
    page.fillCompleteData();
    browser.pause(1000);
    page.submitForm('form');
    page.expect.element('@modal').to.not.be.present.after(2000);
  },
  'Open and close Edit section': (browser) => {
    const page = browser.page.users();
    browser.execute(function() {
     document.querySelector('a[title="Edit"][href="#/admin/users/102"]').click();
    });
    page.closeEdit();
  },
  'Edit data': (browser) => {
    const page = browser.page.users();
    browser.execute(function() {
     document.querySelector('a[title="Edit"][href="#/admin/users/102"]').click();
    });
    page.editData();
    page.submitForm('form');
    page.waitForElementNotPresent('@modal');
  },
  'after': (browser) => {
    console.log('Closing down...');
    browser.end();
  }
};
