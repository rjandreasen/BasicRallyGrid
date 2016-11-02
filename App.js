Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function () {
        //Write app code here
        console.log('My first App - v1.25');
        this.pulldownContainer = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
        });

        this.add(this.pulldownContainer);
        this._loadIterations();
    },

    // Load a combo box with all iterations
    _loadIterations: function () {
        this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox',{
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            listeners:{
                ready: function(combobox){
                    this._loadPriorities();
                },
                select: function(combobox, records) {
                    this._loadData();
                },
                scope: this
            }
        });
        this.pulldownContainer.add(this.iterComboBox);
    },

    // Load a combo box with all defect priorities
    _loadPriorities: function() {
        this.priorityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox',{
            model: 'Defect',
            field: 'Priority',
            fieldLabel: 'Priority',
            labelAlign: 'right',
            listeners:{
                ready: function(combobox){
                    this._loadData();
                },
                select: function(combobox, records) {
                    this._loadData();
                },
                scope: this
            }
        });

        this.pulldownContainer.add(this.priorityComboBox);
    },

    // Loads the defect data store (applying selected filters) and displays
    // the results in a grid
    _loadData: function () {
        var selectIterRef = this.iterComboBox.getRecord().get('_ref');
        var selectPriorityValue = this.priorityComboBox.getRecord().get('value');

        var myFilters = [
            {
                property: 'Iteration',
                operator: '=',
                value: selectIterRef
            },
            {
                property: 'Priority',
                operator: '=',
                value: selectPriorityValue
            }
        ];

        // If store exists, load new data
        if(this.defectStore) {
            // Update filters and reload data
            this.defectStore.setFilter(myFilters);
            this.defectStore.load();
        } else {
            // Create store
            this.defectStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function (store, data, success) {
                        if(!this.myGrid) {
                            this._createGrid(store);
                        }
                    },
                    scope: this
                },
                fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
            });
        }
    },

    // Loads and displays the grid
    _createGrid: function (myStore) {
        this.myGrid = Ext.create('Rally.ui.grid.Grid',{
            store: myStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration'
            ]
        });

        this.add(this.myGrid);
    }
});
