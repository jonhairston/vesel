define([
    'backbone',
    'views/root',
    'views/home',
    'views/header',
    'views/footer',
    'views/maplist',
    'views/detail',
    'views/profile',
    'views/slides',
    'collections/alerts',
    'models/alerts'
], function(Backbone, RootView, HomeView, HeaderView, FooterView, MapView, DetailView, ProfileView, SlidesView, AlertsCollection, AlertsModel) {
    return Backbone.Router.extend({
        routes: {
            "": "index",
            "intro": "intro",
            "map": "maplist",
            "about": "about",
            "profile": "profile",
            "detail/:id": "detail"
        },

        // ----------
        // properties

        alerts: null,
        indexView: null,
        mapView: null,

        // ------
        // methods

        initialize: function() {
            // create the header and footer views so we can nest them within templates
            this.headerView = new HeaderView();
            this.footerView = new FooterView();

            return this;
        },

        // default route, triggered on / or /#
        index: function(params) {
            // only instantiate the alerts collection once
            if (!this.alerts) {
                this.alerts = Application["alerts"] = new AlertsCollection();
            }

            // only instantiate on the initial run
            if (!this.indexView) {
                // create an instance of the home page-view (AnimView)
                this.indexView =
                    new HomeView({
                        el: '#home',
                        className: 'home page',
                        collection: this.alerts
                    });
            }

            // Tell the root view to render the view and render it as a page w/ animations
            Application.goto(this.indexView, {
                page: true
            }); // alternative RootView.getInstance().setView(view);

            return this;
        },

        intro: function() {
            var introView = null;

            introView = new SlidesView();

            Application.goto(introView, {
                page: true
            }); 

            return this;
        },

        detail: function(params) {

            // hoisting 
            var model = null,
                pageView = null,
                fetched = false;

            // use params to get model from our collection
            if (Application["alerts"]) {
                model = Application["alerts"].get(params);
                fetched = true;
            } else {
                model = new AlertsModel({ id: params});
                model.fetch({wait: true}, function() {     
                    fetched = true;         
                });
            }

            if (fetched) {
                // create the detail page-view that contains the header view,
                // the footer view, and the actual content view nested within
                // using the handlebars "view" helper
                pageView = new DetailView({
                    className: 'detail right',
                    model: model
                });

                // animate to this view and remove the classname 'right'
                // after the view is appended to the DOM but right before 
                // the transition happens. 
                Application.goto(pageView, {
                    page: true, // this is its own page/pane so tell app to animate it
                    toggleIn: 'right' // remove the class right before animating
                });      
            }


            return this;
        },

        // triggered when route matches /#map
        maplist: function(params) {

            // only create the map view if it hasnt been created yet
            if (!this.mapView) {
                // create map view
                this.mapView = new MapView({
                    el: '#map',
                    className: 'maplist'
                });
            }

            // show the settings view
            Application.goto(this.mapView, {
                page: true
            });

            return this;
        },

        profile: function(params) {
            var profileView = new ProfileView();

            Application.goto(profileView, {
                page: true // this is its own page/pane so tell app to animate it
            });

            return this;
        }
    });
});