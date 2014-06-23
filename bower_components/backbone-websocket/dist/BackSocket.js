// Generated by CoffeeScript 1.6.3
var BackSocket, defaults,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    };

defaults = {
    key: '3fb8e3f49e89f2640bc9',
    channel: 'beckley',
    channelSuffix: 'channel',
    messageSuffix: 'message',
    autoListen: true,
    logEvents: true,
    logStats: true,
    filters: {
        status: 'C'
    }
};

BackSocket = (function(window, _, Backbone, Pusher) {
    function BackSocket() {
        this.liveRemove = __bind(this.liveRemove, this);
        this.liveAdd = __bind(this.liveAdd, this);
        this.liveUpdate = __bind(this.liveUpdate, this);
        this.filters = __bind(this.filters, this);
    }

    _.extend(BackSocket.prototype, Backbone.Events);

    BackSocket.prototype.filters = null;

    BackSocket.prototype.settings = null;

    BackSocket.prototype.states = {
        last: null,
        current: null
    };

    BackSocket.prototype.logging = false;

    BackSocket.prototype.live = function(options) {
        var opts;
        opts = options || {};
        this.settings = _.defaults(defaults, opts);
        if (this.settings != null) {
            if ((this.settings.filters != null) && _.isObject(this.settings.filters)) {
                this.filters = this.settings.filters;
            }
            this.logging = this.settings.logEvents;
            if (this.settings.logStats === true) {
                this.socketStatus();
            }
            if (this.settings.autoListen === true) {
                this.connect();
            }
        }
        return this;
    };

    BackSocket.prototype.logEventsStates = function() {
        var _this = this;
        console.log('BackSocket#setup triggered');
        if (this.pusher && this.logging) {
            this.pusher.connection.bind('state_change', function(state) {
                console.log("BackSocket.pusher state: " + state.current);
                _this.states = state;
                return _this;
            });
        }
        return this;
    };

    BackSocket.prototype.getState = function() {
        var _ref;
        console.log("Current Pusher State: " + ((_ref = this.pusher) != null ? _ref.connection.state : void 0));
        return this;
    };

    BackSocket.prototype.socketStatus = function() {
        Pusher.log = function(message) {
            if (console.debug_state === true) {
                return console.log(message);
            } else {
                return console.log(message);
            }
        };
        return this;
    };

    BackSocket.prototype.initPusher = function() {
        if (!this.pusher) {
            if (this.settings.key != null) {
                this.pusher = new Pusher(this.settings.key);
            } else {
                console.log('Settings error or key not present for pusher object');
            }
        }
        return this;
    };

    BackSocket.prototype.initChannel = function() {
        var _this = this;
        if (this.pusher != null) {
            this.dataChannel = this.pusher.subscribe("" + this.settings.channel + "-" + this.settings.channelSuffix);
            this;
        } else {
            setTimeout(function() {
                console.log('BackSocket#initChannel Error on subscribe retrying');
                _this.pusher = new Pusher(_this.settings.key);
                return _this.initChannel();
            }, 2000);
        }
        return this;
    };

    BackSocket.prototype.connect = function() {
        var _this = this;
        console.log('BackSocket#connect triggered');
        this.initPusher();
        this.initChannel();
        if (this.logging) {
            this.logEventsStates();
        }
        console.log('startPusher method triggered', this.pusher, this.dataChannel);
        this.dataChannel.bind("update_" + this.settings.messageSuffix, function(data) {
            console.log('Broadcasting pusher Update event: ', data);
            _this.trigger('push_update', data);
            _this.liveUpdate(data);
            return _this;
        });
        return this.dataChannel.bind("add_" + this.settings.messageSuffix, function(data) {
            console.log('Broadcasting pusher Add event: ', data);
            _this.trigger('push_add', data);
            _this.liveAdd(data);
            return _this;
        });
    };

    BackSocket.prototype.filters = function(filters) {
        if (!filters) {
            return this.filters;
        }
        if ((filters != null) && _.isObject(filters)) {
            filters = filters;
        } else {
            filters = {};
        }
        this.filters = _.defaults(this.settings.filters, filters);
        console.log(this.filters);
        return this;
    };

    BackSocket.prototype.liveUpdate = function(data) {
        var filter, model, value, _ref;
        console.log("" + this.constructor.name + ".liveUpdate triggered");
        model = this.get(data.id);
        if (model != null) {
            if (this.filters != null) {
                _ref = this.filters;
                for (filter in _ref) {
                    value = _ref[filter];
                    if (data[filter] === value) {
                        console.log("Model with attribute " + filter + " and value " + value + " was removed from collection!");
                        this.remove(model);
                    }
                }
            } else {
                this.set(model.set(data), {
                    remove: false
                });
                this.trigger('change', model);
            }
            console.log('model already exists in local collection - updating its properties.');
        } else {
            this.set(data, {
                remove: false
            });
            console.log('model was archived & is not present in local collection - updating local collection');
        }
        return this;
    };

    BackSocket.prototype.liveAdd = function(data) {
        console.log("" + this.constructor.name + ".liveAdd triggered");
        this.add(data);
        this.trigger('add', data);
        return this;
    };

    BackSocket.prototype.liveRemove = function(data) {
        var model;
        console.log("" + this.constructor.name + ".liveRemove Triggered");
        model = this.get(data.id);
        if (model != null) {
            this.remove(model);
            console.log('removed model id: #{ data.id }');
        } else {
            console.log('no model found in this collection that matches pusher data - no removal.');
        }
        return this;
    };

    return BackSocket;

})(window, _, Backbone, Pusher);