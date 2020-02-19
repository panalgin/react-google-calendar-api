"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _apiGoogleconfig = require("../../apiGoogleconfig.json");

var _apiGoogleconfig2 = _interopRequireDefault(_apiGoogleconfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore 

var GoogleCalendarApi = function () {
    function GoogleCalendarApi() {
        _classCallCheck(this, GoogleCalendarApi);

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
     * Gets the singleton instance
     */


    _createClass(GoogleCalendarApi, [{
        key: "updateSigninStatus",

        /**
         * Update connection status.
         * @param {boolean} isSignedIn
         */
        value: function updateSigninStatus(isSignedIn) {
            this.sign = isSignedIn;
            console.log("IsSignedIn: ", isSignedIn);
        }
        /**
         * Auth to the google Api.
         */

    }, {
        key: "initClient",
        value: function initClient() {
            var _this = this;

            this.gapi = window['gapi'];
            this.gapi.client.init(_apiGoogleconfig2.default).then(function () {
                // Listen for sign-in state changes.
                _this.gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);
                // Handle the initial sign-in state.
                _this.updateSigninStatus(_this.gapi.auth2.getAuthInstance().isSignedIn.get());
                if (_this.onLoadCallback) {
                    _this.onLoadCallback();
                }
            }).catch(function (e) {
                console.log(e);
            });
        }
        /**
         * Init Google Api
         * And create gapi in global
         */

    }, {
        key: "handleClientLoad",
        value: function handleClientLoad() {
            var _this2 = this;

            this.gapi = window['gapi'];
            var script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            document.body.appendChild(script);
            script.onload = function () {
                window['gapi'].load('client:auth2', _this2.initClient);
            };
        }
        /**
         * Sign in Google user account
         */

    }, {
        key: "handleAuthClick",
        value: function handleAuthClick() {
            if (this.gapi) {
                this.gapi.auth2.getAuthInstance().signIn();
            } else {
                console.log("Error: this.gapi not loaded");
            }
        }
        /**
         * Set the default attribute calendar
         * @param {string} newCalendar
         */

    }, {
        key: "setCalendar",
        value: function setCalendar(newCalendar) {
            this.calendar = newCalendar;
        }
        /**
         * Execute the callback function when a user is disconnected or connected with the sign status.
         * @param callback
         */

    }, {
        key: "listenSign",
        value: function listenSign(callback) {
            if (this.gapi) {
                this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
            } else {
                console.log("Error: this.gapi not loaded");
            }
        }
        /**
         * Execute the callback function when gapi is loaded
         * @param callback
         */

    }, {
        key: "onLoad",
        value: function onLoad(callback) {
            if (this.gapi) {
                callback();
            } else {
                this.onLoadCallback = callback;
            }
        }
        /**
         * Sign out user google account
         */

    }, {
        key: "handleSignoutClick",
        value: function handleSignoutClick() {
            if (this.gapi) {
                this.gapi.auth2.getAuthInstance().signOut();
            } else {
                console.log("Error: this.gapi not loaded");
            }
        }
        /**
         * List all events in the calendar
         * @param {number} maxResults to see
         * @param {string} calendarId to see by default use the calendar attribute
         * @returns {any}
         */

    }, {
        key: "listUpcomingEvents",
        value: function listUpcomingEvents(maxResults) {
            var calendarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.calendar;

            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                result = null;

                                if (!this.gapi) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 4;
                                return this.gapi.client.calendar.events.list({
                                    "calendarId": calendarId,
                                    "maxResults": maxResults,
                                    "orderBy": "updated",
                                    "showDeleted": false
                                }).then(function (response) {
                                    // Handle the results here (response.result has the parsed body).
                                    result = response.result;
                                }, function (err) {
                                    console.error("Execute error", err);
                                    result = "Error: " + err.toString();
                                });

                            case 4:
                                _context.next = 8;
                                break;

                            case 6:
                                console.log("Error: this.gapi not loaded");
                                result = "Error: Gapi not loaded.";

                            case 8:
                                return _context.abrupt("return", result);

                            case 9:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
        /**
         * Create an event from the current time for a certain period
         * @param {number} time in minutes for the event
         * @param {string} summary of the event
         * @param {string} description of the event
         * @param {string} calendarId
         * @returns {any}
         */

    }, {
        key: "createEventFromNow",
        value: function createEventFromNow(_ref) {
            var time = _ref.time,
                summary = _ref.summary,
                _ref$description = _ref.description,
                description = _ref$description === undefined ? '' : _ref$description;
            var calendarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.calendar;

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
        }
        /**
         * Create Calendar event
         * @param {string} calendarId for the event.
         * @param {object} event with start and end dateTime
         * @returns {any}
         */

    }, {
        key: "createEvent",
        value: function createEvent(event) {
            var calendarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.calendar;

            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                result = "";
                                _context2.next = 3;
                                return this.gapi.client.calendar.events.insert({
                                    'calendarId': calendarId,
                                    'resource': event
                                }).then(function (response) {
                                    result = response.result;
                                }, function (err) {
                                    result = err.toString();
                                });

                            case 3:
                                return _context2.abrupt("return", result);

                            case 4:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            if (!GoogleCalendarApi.instance) {
                GoogleCalendarApi.instance = new GoogleCalendarApi();
            }
            return GoogleCalendarApi.instance;
        }
    }]);

    return GoogleCalendarApi;
}();

var googleApiService = GoogleCalendarApi.getInstance();
exports.default = googleApiService;