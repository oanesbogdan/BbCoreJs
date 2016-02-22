module.exports = {
  'Test homepage load' : function (client) {
    client
      .url(client.globals.baseUrl)
      .waitForElementPresent('body', 1000)
      .end();;
  }
};