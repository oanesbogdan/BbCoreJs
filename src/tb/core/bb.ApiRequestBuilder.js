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
        
        setUrl: function (url) {
            this.url = url;
            return this;
        },
        
        setMethod: function (method) {
            this.method = method;
            return this;
        },
        
        setQueryParam: function (name, value) {
            this.queryParams[name] = value;
            return this;
        },
        
        setQueryParams: function (queryParams) {
            this.queryParams = queryParams;
            return this;
        },
        
        setPagination: function(start, limit) {
            this.setHeader('Range', start + "," + limit);
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
        },
        
        post: function(url, data, contentType) {
            this
                .setUrl(url)
                .setData(data)
                .setContentType(contentType)
                .setMethod('POST')
            ;
            
            return this;
        },
        
        get: function(url, queryParams) {
            this
                .setUrl(url)
                .setQueryParams(queryParams)
                .setMethod('GET')
            ;
            
            return this;
        },
        put: function(url, data, contentType) {
            this
                .setUrl(url)
                .setData(data)
                .setContentType(contentType)
                .setMethod('PUT')
            ;
            
            return this;
        },
        patch: function(url, data, contentType) {
            this
                .setUrl(url)
                .setData(data)
                .setContentType(contentType)
                .setMethod('PATCH')
            ;
            
            return this;
        },
        delete: function(url) {
            this
                .setUrl(url)
                .setMethod('DELETE')
            ;
            
            return this;
        },
        link: function(url, data, contentType) {
            this
                .setUrl(url)
                .setMethod('DELETE')
                .setData(data)
                .setContentType(contentType)
            ;
            
            return this;
        }
        

    });
    
    bbCore.register("ApiRequestBuilder", ApiRequestBuilder);
    
    return ApiRequestBuilder;
});