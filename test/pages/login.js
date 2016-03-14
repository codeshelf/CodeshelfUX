export default {
  elements: {
    username: "input#email",
    password: "input#password"
  },

  commands: [
    {
      login: function(username, password) {
        this
          .clearValue('@username')
          .clearValue('@password')
          .setValue('@username', 'andrejskoki@gmail.com')
          .setValue('@password', 'test')
          .submitForm('@password')
          .waitForElementNotPresent('@password');
      },
    }

  ]


};
