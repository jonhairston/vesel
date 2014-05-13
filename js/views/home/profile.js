Application.AnimView.extend({
    name: "home/profile",

    className: "profile",

    // default animations
    animateIn: 'bounceInDown',
    animateOut: 'slideOutUp',

    // declaritve events hash
    events: {
        'click button[data-button-type="submit"]': function(event) {
            event.preventDefault();
            var attrs = this.serialize();

            console.log('submit form triggered!');
            console.log(attrs);

            //this.collection.add(attrs);

            // this.model.set(attrs, {
            //     silent: true
            // });
            this.model.save();
        },
        'change input[type="checkbox"]': function(event) {
            var metadataPosition = this.$(event.target).data("meta-position"),
                property = null;
            //var model = this.$(event.target).model(),
            // var attrs = this.serialize(event, {
            //     silent: true,
            //     set: true,
            //     validate: false
            // });

            event.preventDefault();

            console.log("toggle was changed. Target:");
            console.log(event.target);

            property = "metadata." + metadataPosition + ".is_enabled";

            // try to get the model
            this.model.set(
                property, event.target.checked, {
                    silent: true
                });

            // since we have reactive/2-way data binding to template
            // we should be able to take any changes and simply set them on 
            // on this view's view-model 
            // this.model.set(attrs, {
            //     silent: true
            // });

            // console.log(this.model);

            this.model.save();

            // this.model.save({}, {
            //     wait: true,
            //     silent: true
            // });

            return false;
        }
    },

    initialize: function() {
        console.log(this.getViewName() + "#initialize()");

        this.model.fetch();

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/profile"]()

// to render, append, and animate the view call:
// Application.goto(view, { page: true });

// You can place the above code in the proper router
// inside of its definition.. something like this:
//
// myRouteHandler: function(params) {
//    // create instance of our view
//	  var view = new Application.Views["home/profile"]({
//	      // pass options to view constructor
//        className: 'class-for-this-view',
//    });
//    
//    Application.goto(view, {
//        // set page to true for animations
//        page: true
//    }); 
// }