Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function () {
        //Write app code here
        console.log('My first App - v1.31');
        this.pulldownContainer = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
        });

        this.add(this.pulldownContainer);
        this._loadIterations();
    },

    // AND together the two filters and return them
    _getFilters: function(iterationValue, priorityValue) {

        var iterFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Iteration',
            operator: '=',
            value: iterationValue
        });

        var priorityFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Priority',
            operator: '=',
            value: priorityValue
        });

        return iterFilter.and(priorityFilter);
    },

    // Event handlers
    _onIterationReady: function(combobox, eOpts){
        this._loadPriorities();
    },

    // Load a combo box with all iterations
    _loadIterations: function () {
        this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox',{
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            listeners:{
                ready: this._onIterationReady,
                select: this._loadData,
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
                ready: this._loadData,
                select: this._loadData,
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
        var comboFilter = this._getFilters(selectIterRef,selectPriorityValue);

        // If store exists, load new data
        if(this.defectStore) {
            // Update filters and reload data
            this.defectStore.setFilter(comboFilter);
            this.defectStore.load();
        } else {
            // Create store
            this.defectStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                filters: comboFilter,
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
