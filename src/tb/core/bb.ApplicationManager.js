/**
 * bb.ApplicationManager
 * Responsability
 *  - provide an application skeleton
 *  - What is an application
 *  Application handle views
 *  [-View 1]
 *  [-View 2]
 *  [-View 3]
 *  [-View 4]
 *  application recieves requests via route
 *  
 *  /#layout/create ---> route is handled by Application Route
 *                      ---> Then controller is called
 *                          ---> Then the right method is invoked
 *                              --> The right template
 *  
 *  Application can déclare many controller BackBone Controllers
 *  Application Manager
 **/
define(["BackBone"], function(BackBone,jsCore){
        
    var Api = {registerApplication : ""};
    /*in global*/
    bb.ApplicationManager = Api; 
    
});