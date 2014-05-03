Application.AnimView.extend({
    name: "home/home",
    animateIn: "fadeIn",
    animateOut: "iosFadeLeft",
    collectionView: null,

    events: {
        'click a.overlay.mask': function(event) {

            // get reference to the nested header view using its data-view-cid
            var headerView = this.children[this.$("header").data("view-cid")];

            // call the "home/header" view method to trigger aside reveal
            // forward the event data on to the header view too.
            headerView.toggleSettings(event);

            return false;
        }
    },

    initialize: function() {
        // instantiate the CollectionView to create the nested list
        // & list-item views with the Alerts collection/resource data
        // as the list-item template context. The Emmet equivalent for
        // this structure would be something like:  ul>li*(alerts.length)
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        this.$el.attr("data-effeckt-page", "home");
        this.$el.attr("data-view-persist", "true");

        return this; // allow chaining
    },

    // Perfect for a unit test that the home view should have onRender()
    beforeRender: function() {
        console.log(this.name + "#beforeRender()");

        // add 
        this.$el.addClass("effeckt-page-active");

        return this; // allow chaining
    },

    hideSettings: function(event) {

        // get the header view by accessing the nested element
        // with header tag and getting its data-view-cid
        // then grab that view from this.children array of objects
        var headerView = this.children[this.$('header.bar').data("view-cid")];

        headerView.toggleSettings(event);
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()