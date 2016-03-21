export default {
  elements: {
    username: 'input#email',
    password: 'input#password',
    form: 'form#login-form'
  },

  commands: [
    {
      login: function(username, password) {
        return this
          .clearValue('@username')
          .clearValue('@password')
          .setValue('@username', username)
          .setValue('@password', password)
          .submitForm('@form')
          .waitForElementNotPresent('@form', 20000);
      }
    }

  ]

};
