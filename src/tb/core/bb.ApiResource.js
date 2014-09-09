define("bb.ApiResource", ["bb.apiClient", "jsclass"],function(bbApiClient,jsClass){
    
    /**
     * BB Api Client
     **/
    var ApiResource = new jsClass.Class({
        client: null,
        headers: {},
        baserUrl: null,
        initialize: function(baserUrl, client){
            this.baserUrl = baserUrl;
            this.client = client;
        },        
        
        post: function (data) {
            var rb = this.client.createRequestBuilder();
            rb
                .setMethod('POST')
                .setData(data)
                .setUrl(this.baserUrl)
            ;
            
            return rb.getRequest();
        }, 
        put: function (id, data) {
            var rb = this.client.createRequestBuilder();
            rb
                .setMethod('PUT')
                .setData(data)
                .setUrl(this.baserUrl + '/' + id)
            ;
            
            return rb.getRequest();
        }, 
        delete: function (id) {
            var rb = this.client.createRequestBuilder();
            rb
                .setMethod('DELETE')
                .setUrl(this.baserUrl + '/' + id)
            ;
            
            return rb.getRequest();
        }, 
        link: function (id, data) {
            var rb = this.client.createRequestBuilder();
            rb
                .setMethod('LINK')
                .setUrl(this.baserUrl + '/' + id)
                .setData(data)
            ;
            
            return rb.getRequest();
        }, 
        get: function(id) {
            var rb = this.client.createRequestBuilder();
            rb
                .setMethod('GET')
                .setUrl(this.baserUrl + '/' + id)
            ;
            
            return rb.getRequest();
        }, 
        getCollection: function(queryParams) {
            var rb = this.client.createRequestBuilder();
            rb
                .setMethod('GET')
                .setUrl(this.baserUrl)
                .setQueryParams(queryParams)
            ;
            
            return rb.getRequest();
        }

    });
    
    bbCore.register("ApiResource", ApiResource);
    
    return ApiResource;
});