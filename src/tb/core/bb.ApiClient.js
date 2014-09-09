define("bb.apiClient", ["jquery","bb.Api", "jsclass", "bb.apiRequestBuilder"], function($, bbCore,jsClass, requestBuilder){
    
    /**
     * BB Api Client
     **/
    var ApiClient = new jsClass.Class({
        publicKey: null,
        privateKey: null,
        version: null,
        resourceManager: {},
        // global jquery ajax config
        config: {
            timeout: 30000,
            cache: false
        },
        
        initialize: function(publicKey, privateKey, version, config) {
            this.publicKey = publicKey;
            this.privateKey = privateKey;
            this.version = version;
            
            if(typeof config !== "undefined") {
                $.extend(this.config, config);
            }
            
            $.ajaxSetup(this.config);
        },        
        
        send: function (request) {
            return $.ajax(request);
        },
        
        createRequestBuilder: function() {
            var rb = new requestBuilder(name, this);
            
            return rb;
        },
        
        /**
         * Construct request object
         * 
         * @param String url
         * @param String method
         * @param PlainObject queryParams
         * @param PlainObject data
         * @param PlainObject headers
         * @returns PlainObject
         */
        createRequest: function(url, method, queryParams, data, headers) {
            var request = {"type" : method};
            
            if (typeof queryParams !== "undefined"  && "" !== queryParams.trim()) {
                url += ((url.indexOf('?') == -1) ? '?' : '&') + $.param(queryParams);
            }
            
            request["url"] = url;
            
            if (typeof data !== "undefined") {
                request["data"] = data;
            }
            
            if (typeof headers !== "undefined") {
                request["headers"] = headers;
            }
            
            return request;
        },
        
        /**
         * Get resource by its name
         * 
         * @param string name
         * @returns bb.ApiResource
         */
        getResource: function(name) {
            if(this.resourceManager[name]) {
                var resource = new ApiResource(name, this);
                
                this.resourceManager[name] = resource;
            }
            
            return this.resourceManager[name];
        }

    });
    
    bbCore.register("apiClient", ApiClient);
    
    return ApiClient;
});