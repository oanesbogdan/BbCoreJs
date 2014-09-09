bb.RouteManager.registerRoute("layout",{
    prefix: "layout",
    routes:{
        "home":{
            url: "#/layout/home",
            action: "MainController:show",
            params: {}
        },
        "edit":{
            url: "#/layout/edit/{:id}",
            action: "LayoutController:edit",
            params: {}
        },
        "delete":{
            url: "#/layouy/delete/{:id}",
            action: "LayoutController:delete"
        }
    }
   
});