define("bb.ApiRequestBuilder", ["jquery", "jsclass"],function($, jsClass){
    
    /**
     * BB Api Request Builder
     **/
    var ApiRequestBuilder = new jsClass.Class({
        
        url: null,
        method: 'GET',
        queryParams: {},
        data: null,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        config: {},
        
        initialize: function(baserUrl){
            this.baserUrl = baserUrl;
        },        
        
        setQueryParam: function (name, value) {
            this.queryParams[name] = value;
            return this;
        }, 
        
        setQueryParams: function (params) {
            this.queryParams = params;
            return this;
        }, 
        setData: function (data) {
            this.data = data;
            return this;
        }, 
        setHeader: function (name, value) {
            this.headers[name] = value;
            return this;
        }, 
        
        setContentType: function(contentType) {
            this.setHeader("Content-Type", contentType);
            return this;
        },
        
        getContentType: function() {
            return this.headers["Content-Type"];
        },
        
        getRequest: function() {
            me = this;
            
            var request = {};
            // headers
            request["beforeSend"] = function (xhr){ 
                for (header in me.headers) {
                    xhr.setRequestHeader(header, me.headers[header]); 
                }
            };
            
            if('application/x-www-form-urlencoded' !== this.getContentType()) {
                request["processData"] = false;
            }
            
            // data
            request["data"] = this.data;
            if('application/json' === this.getContentType()) {
                // encode json data
                if('string' !== typeof request["data"]) {
                    data = JSON.stringify(request["data"]);
                }
            }
            
            // query string
            var url = this.url;
            
            if (false === $.isEmptyObject(this.queryParams)) {
                url += ((url.indexOf('?') == -1) ? '?' : '&') + $.param(this.queryParams);
            }
            
            
            return request;
        }
        

    });
    
    bbCore.register("ApiRequestBuilder", ApiRequestBuilder);
    
    return ApiRequestBuilder;
});