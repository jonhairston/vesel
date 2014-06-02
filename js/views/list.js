define([
  'jquery',
  'mobiscroll',
  'collection-view',
  'hbs!templates/list',
  'hbs!templates/list-item'
], function($, mobiscroll, CollectionView, template, itemTemplate) {

    return CollectionView.extend({
        name: "list",
        template: template,
        itemTemplate: itemTemplate,

        // this view holds ref to our 'Alerts' collection from server
        //collection: Application.Collection["alerts"],

        // view represents the content area of its parent, the Home page-view
        className: 'content',

        initialize: function() {
            console.log('CollectionView initialized!!! and collection =');
            console.log(this.collection);

            return this;
        },

        // declaritive events for the view + nested declaritive events for collection
        events: {
            'ready': function(options) {
                var collection = null,
                    collectionView = null;

                console.log('******************** Nested CollectionView home/list event ready was triggered!');

                // check that options are legit
                if (options.target) {
                    console.debug('**Logging options for ready event on collectionView');
                    console.log(options);
                    collectionView = options.target;

                    if (options.target.collection)
                        collection = options.target.collection;
                }

                return false;
            },

            'rendered:collection': function(collectionView, collection) {
                console.debug('Event "rendered:collection"');

                // refactoring this may work without the delay call...
                _.delay(function() {
                    // initialize the mobiscroll listview plugin
                    collectionView.$('ul').mobiscroll().listview({
                        theme: 'ios7',
                        swipe: 'right',
                        // stages: [ { 
                        //     percent: -20, color: 'red', icon: 'remove', action: function (li, inst) { inst.remove(li); return false; } 
                        // } ]
                        actions: {
                            right: [{
                                icon: 'link',
                                action: function(li, inst) {
                                    alert('Linked', inst.settings.context);
                                }
                            }, {
                                icon: 'star3',
                                action: function(li, inst) {
                                    alert('Rated', inst.settings.context);
                                }
                            }, {
                                icon: 'tag',
                                action: function(li, inst) {
                                    alert('Tagged', inst.settings.context);
                                }
                            }, {
                                icon: 'download',
                                action: function(li, inst) {
                                    alert('Downloaded', inst.settings.context);
                                }
                            }, ]
                        }
                    });
                }, 0);

                return false;
            },

            // nested collection listeners
            collection: {
                'vesel:rendered': function() {
                    console.log('Special vesel:rendered event triggered on the alerts collection');

                    this.ensureRendered();
                },
                'change': function() {
                    console.log('CollectionView.collection received a change event!');

                    // trigger a re-render just for testing -- this is wasteful in production
                    this.render();
                }
            }
        }
    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/list"]()