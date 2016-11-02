Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function () {
        //Write app code here
        console.log('My first App - v1.5');
        this._loadGrid();
    },

    // Loads the User Story data store (not currently used)
    _loadData: function () {
        var myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function (store, data, success) {
                    //process data
                    this._loadGrid();
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'ScheduledState', 'Owner']
        });
    },

    // Loads and displays the grid
    _loadGrid: function () {
        var myGrid = Ext.create('Ext.Container', {
            items: [{
                xtype: 'rallygrid',
                columnCfgs: [
                    'FormattedID',
                    'Name',
                    'ScheduleState',
                    'Owner',
                ],
                storeConfig: {
                    model: 'userstory'
                }
            }],
            renderTo: Ext.getBody()
        });
        this.add(myGrid);
    }
});
