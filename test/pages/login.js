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
          .setValue('@username', username)
          .setValue('@password', password)
          .submitForm('@password')
          .waitForElementNotPresent('@password');
      },
    }

  ]


};
