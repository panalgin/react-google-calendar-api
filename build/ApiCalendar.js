"use strict";

exports.__esModule = true;
var Config = require("../../apiGoogleconfig.json");
var ApiCalendar = /** @class */function () {
    function ApiCalendar() {
        this.sign = false;
        this.gapi = null;
        this.onLoadCallback = null;
        this.calendar = 'primary';
        try {
            this.updateSigninStatus = this.updateSigninStatus.bind(this);
            this.initClient = this.initClient.bind(this);
            this.handleSignoutClick = this.handleSignoutClick.bind(this);
            this.handleAuthClick = this.handleAuthClick.bind(this);
            this.createEvent = this.createEvent.bind(this);
            this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
            this.createEventFromNow = this.createEventFromNow.bind(this);
            this.listenSign = this.listenSign.bind(this);
            this.onLoad = this.onLoad.bind(this);
            this.setCalendar = this.setCalendar.bind(this);
            this.handleClientLoad();
            console.log("Constructor completed");
        } catch (e) {
            console.log(e);
        }
    }
    /**
     * Update connection status.
     * @param {boolean} isSignedIn
     */
    ApiCalendar.prototype.updateSigninStatus = function (isSignedIn) {
        this.sign = isSignedIn;
    };
    /**
     * Auth to the google Api.
     */
    ApiCalendar.prototype.initClient = function () {
        var _this = this;
        this.gapi = window['gapi'];
        this.gapi.client.init(Config).then(function () {
            // Listen for sign-in state changes.
            _this.gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);
            // Handle the initial sign-in state.
            _this.updateSigninStatus(_this.gapi.auth2.getAuthInstance().isSignedIn.get());
            if (_this.onLoadCallback) {
                _this.onLoadCallback();
            }
        })["catch"](function (e) {
            console.log(e);
        });
    };
    /**
     * Init Google Api
     * And create gapi in global
     */
    ApiCalendar.prototype.handleClientLoad = function () {
        var _this = this;
        this.gapi = window['gapi'];
        var script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
        script.onload = function () {
            window['gapi'].load('client:auth2', _this.initClient);
        };
    };
    /**
     * Sign in Google user account
     */
    ApiCalendar.prototype.handleAuthClick = function () {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().signIn();
        } else {
            console.log("Error: this.gapi not loaded");
        }
    };
    /**
     * Set the default attribute calendar
     * @param {string} newCalendar
     */
    ApiCalendar.prototype.setCalendar = function (newCalendar) {
        this.calendar = newCalendar;
    };
    /**
     * Execute the callback function when a user is disconnected or connected with the sign status.
     * @param callback
     */
    ApiCalendar.prototype.listenSign = function (callback) {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
        } else {
            console.log("Error: this.gapi not loaded");
        }
    };
    /**
     * Execute the callback function when gapi is loaded
     * @param callback
     */
    ApiCalendar.prototype.onLoad = function (callback) {
        if (this.gapi) {
            callback();
        } else {
            this.onLoadCallback = callback;
        }
    };
    /**
     * Sign out user google account
     */
    ApiCalendar.prototype.handleSignoutClick = function () {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().signOut();
        } else {
            console.log("Error: this.gapi not loaded");
        }
    };
    /**
     * List all events in the calendar
     * @param {number} maxResults to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any}
     */
    ApiCalendar.prototype.listUpcomingEvents = function (maxResults, calendarId) {
        if (calendarId === void 0) {
            calendarId = this.calendar;
        }
        if (this.gapi) {
            return this.gapi.client.calendar.events.list({
                'calendarId': calendarId,
                'timeMin': new Date().toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': maxResults,
                'orderBy': 'startTime'
            });
        } else {
            console.log("Error: this.gapi not loaded");
            return false;
        }
    };
    /**
     * Create an event from the current time for a certain period
     * @param {number} time in minutes for the event
     * @param {string} summary of the event
     * @param {string} description of the event
     * @param {string} calendarId
     * @returns {any}
     */
    ApiCalendar.prototype.createEventFromNow = function (_a, calendarId) {
        var time = _a.time,
            summary = _a.summary,
            _b = _a.description,
            description = _b === void 0 ? '' : _b;
        if (calendarId === void 0) {
            calendarId = this.calendar;
        }
        var event = {
            summary: summary,
            description: description,
            start: {
                dateTime: new Date().toISOString(),
                timeZone: "Europe/Paris"
            },
            end: {
                dateTime: new Date(new Date().getTime() + time * 60000),
                timeZone: "Europe/Paris"
            }
        };
        return this.gapi.client.calendar.events.insert({
            'calendarId': calendarId,
            'resource': event
        });
    };
    /**
     * Create Calendar event
     * @param {string} calendarId for the event.
     * @param {object} event with start and end dateTime
     * @returns {any}
     */
    ApiCalendar.prototype.createEvent = function (event, calendarId) {
        if (calendarId === void 0) {
            calendarId = this.calendar;
        }
        return this.gapi.client.calendar.events.insert({
            'calendarId': calendarId,
            'resource': event
        });
    };
    return ApiCalendar;
}();
var googleApiService = new ApiCalendar();
exports["default"] = googleApiService;