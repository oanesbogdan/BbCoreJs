module.exports = {
    'Test homepage load' : function (client) {
        'use strict';

        client
            .url(client.globals.baseUrl)
            .waitForElementPresent('body', 1000)
            .end();
    }
};