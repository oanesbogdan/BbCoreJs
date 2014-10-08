define('tb.core.AuthenticationHandler', ['tb.core.RequestHandler', 'tb.core.Request', 'jsclass'], function (tbRequestHandler, TbRequest) {
    'use strict';

    /**
     * AuthenticationHandler object
     */
    var AuthenticationHandler = new JS.Class({
        /**
         * This constant define a Key of API KEY
         * @type {String}
         */
        HEADER_API_KEY: 'X-API-KEY',

        /**
         * This constant define a Key of API SIGNATURE
         * @type {String}
         */
        HEADER_API_SIGNATURE: 'X-API-SIGNATURE',

        /**
         * Do the request to rest api with username and password to try authentication.
         * The return will be catch by onRequestDone event.
         * @param {String} username
         * @param {String} password
         */
        authenticate: function (username, password) {
            var request = new TbRequest();

            request.setMethod('POST');
            /*
             * @todo url à définir
             */
            request.setUrl('/rest/1/authentication/' + username + '/' + password);

            tbRequestHandler.send(request);
        },

        /**
         * Remove connexion to the Session storage and reload the page.
         */
        logOut: function () {
            if (null !== sessionStorage.getItem('bb5-session-auth')) {
                sessionStorage.removeItem('bb5-session-auth');
            }

            document.location.reload();
        },

        /**
         * Event
         * He check in Session storage if an item with key 'bb5-session-auth' exist and
         * add the headers to the request if he found it.
         * @param {Object} Request
         */
        onBeforeSend: function (Request) {
            var authentication,
                identifierPos,
                apiKey,
                apiSignature;

            authentication = sessionStorage.getItem('bb5-session-auth');
            if (null !== authentication) {
                identifierPos = authentication.indexOf(';');
                apiKey = authentication.substring(0, identifierPos).trim();
                apiSignature = authentication.substring(identifierPos + 1).trim();

                Request.addHeader(this.HEADER_API_KEY, apiKey);
                Request.addHeader(this.HEADER_API_SIGNATURE, apiSignature);
            }
        },

        /**
         * Event
         * Update api's key and api's signature with the headers provided by response
         * into the Session storage
         * @param {Object} response
         */
        onRequestDone: function (response) {
            var apiKey = response.getHeader(this.HEADER_API_KEY),
                apiSignature = response.getHeader(this.HEADER_API_SIGNATURE);

            if (null !== apiKey && null !== apiSignature) {
                sessionStorage.setItem('bb5-session-auth', apiKey + ';' + apiSignature);
            }
        },

        /**
         * Event
         * Check the status of response.
         * If the user is forbidden to acces,
         * an popin will be showed with an forbidden message.
         * If the user require an authentication, an popin will be showed with
         * a authentication form
         * @param {Object} response
         */
        onRequestFail: function (response) {
            /*
            if (response.getStatus === 403) {
                //@todo
                //Create popin with forbidden message
            } else if (response.getStatus() === 401) {
                //@todo
                //Show popin to authenticate and use authenticate function
                // or logout if click in cancel
            }*/
            return response;
        },

        /**
         * Event
         * Logout the user with logOut
         * @returns {undefined}
         */
        onLogOut: function () {
            this.logOut();
        }
    });

    return new JS.Singleton(AuthenticationHandler);
});
