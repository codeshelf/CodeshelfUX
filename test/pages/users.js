export default {
  elements: {
    admin: 'a#admin',
    addButton: 'a[title="Add"]',
    editButton: 'a[title="Edit"][href="#/admin/users/102"]',
    modal: '.modal-dialog',
    cancel: 'button#cancel',
    checkBoxAdmin: 'label[for="RolesAdmin"]',
    checkBoxView: 'label[for="RolesView"]',
    username: 'input[name="username"]',
    submit: 'button[type="submit"]',
    active: 'label[for="active"]'
  },
  commands: [
    {
      goToAdmin: function() {
        return this
          .click('@admin')
          .waitForElementNotPresent('@admin')
          .waitForElementPresent('@addButton');
      }
    },
    {
      clickAddButton: function() {
        return this
            .click('@addButton')
            .waitForElementPresent('@modal')
            .waitForElementPresent('@cancel')
      },
      clickCancelButton: function() {
        return this
          .click('@cancel')
          .waitForElementNotPresent('@modal')
      },
      fillIncompleteData: function() {
        return this
          .waitForElementPresent('@username')
          .waitForElementPresent('@submit')
          .setValue('@username', 'test')
      },
      fillCompleteData: function() {
        return this
          .waitForElementPresent('@username')
          .waitForElementPresent('@checkBoxAdmin')
          .waitForElementPresent('@checkBoxView')
          .waitForElementPresent('@submit')
          .setValue('@username', 'richardizip+todel2@gmail.com')
          .click('@checkBoxAdmin');
      },
      closeEdit: function() {
        return this
            .waitForElementPresent('@modal')
            .click('@cancel')
            .waitForElementNotPresent('@modal');
      },
      editData: function() {
        return this
          .waitForElementPresent('@active')
          .waitForElementPresent('@checkBoxView')
          .waitForElementPresent('@submit')
          .click('@checkBoxView')
          .click('@active');
      }
    }

  ]

};
