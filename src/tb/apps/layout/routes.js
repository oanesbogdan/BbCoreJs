bb.RouteManager.registerRoute("layout",{
    prefix: "layout",
    "home":{
        url: "#/layout/home",
        action: "LayoutController:show",
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
});