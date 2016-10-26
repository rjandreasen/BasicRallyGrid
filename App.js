Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        //Write app code here
				console.log("My first App - v1.1");
				
				var myStore = Ext.create('Rally.data.wsapi.Store', {
				    model: 'User Story',
				    autoLoad: true,
				    listeners: {
				        load: function(store, data, success) {
				            //process data				            
					          var myGrid =  Ext.create('Ext.Container', {
									     items: [{
									         xtype: 'rallygrid',
									         columnCfgs: [
									             'FormattedID',
									             'Name',
									             'Owner'
									         ],
									         storeConfig: {
									             model: 'userstory'
									         }
									     }],
									     renderTo: Ext.getBody()
									 });
									 this.add(myGrid);
				        },
				        scope: this
				    },
				    fetch: ['FormattedID', 'Name', 'Owner']
				});
				
        //API Docs: https://help.rallydev.com/apps/2.1/doc/
    }
});
