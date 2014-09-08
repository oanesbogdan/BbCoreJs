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
        
        post: function (data, contentType) {
            return {
                "url": this.baserUrl
            };
        }, 
        put: function (id, data, contentType) {
            return {
                "url": this.baserUrl + id  + "/"
            };
            
        }, 
        delete: function (id) {
            return {
                "url": this.baserUrl + id  + "/"
            };
        }, 
        link: function (id, data) {
            return {
                "url": this.baserUrl + id  + "/"
            };
        }, 
        get: function(queryString) {
            return {
                "url": this.baserUrl + id  + "/"
            };
        }, 
        getCollection: function(queryString) {
            return {
                "url": this.baserUrl
            };
        }

    });
    
    bbCore.register("ApiResource", ApiResource);
    
    return ApiResource;
});