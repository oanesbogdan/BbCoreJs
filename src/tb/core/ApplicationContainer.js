define("tb.core.ApplicationContainer",["jquery","jsclass","tb.core.Api"],function($){
    var instance = null;

    var AppContainer = new JS.Class({

        initialize: function(){
            this.container = [];
        },

        /** {name:"appname",instance:"",state} **/
        register : function(applicationInfos){
            this.container.push(applicationInfos);
        },

        getByAppInfosName : function(name){
            var result = null;
            $.each(this.container,function(i, appInfos){
                if(appInfos.name==name){
                    result = appInfos;
                    return false;
                }
            });
            return result;
        }

    });

    return {
        getInstance : function(){
            if(!instance){
                instance = new AppContainer;
            }
            return instance;
        }

    }

});