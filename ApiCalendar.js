var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore 
import Config from "../../apiGoogleconfig.json";
class GoogleCalendarApi {
    constructor() {
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
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Gets the singleton instance
     */
    static getInstance() {
        if (!GoogleCalendarApi.instance) {
            GoogleCalendarApi.instance = new GoogleCalendarApi();
        }
        return GoogleCalendarApi.instance;
    }
    /**
     * Update connection status.
     * @param {boolean} isSignedIn
     */
    updateSigninStatus(isSignedIn) {
        this.sign = isSignedIn;
        console.log("IsSignedIn: ", isSignedIn);
    }
    /**
     * Auth to the google Api.
     */
    initClient() {
        this.gapi = window['gapi'];
        this.gapi.client.init(Config)
            .then(() => {
            // Listen for sign-in state changes.
            this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            // Handle the initial sign-in state.
            this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());
            if (this.onLoadCallback) {
                this.onLoadCallback();
            }
        })
            .catch((e) => {
            console.log(e);
        });
    }
    /**
     * Init Google Api
     * And create gapi in global
     */
    handleClientLoad() {
        this.gapi = window['gapi'];
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
        script.onload = () => {
            window['gapi'].load('client:auth2', this.initClient);
        };
    }
    /**
     * Sign in Google user account
     */
    handleAuthClick() {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().signIn();
        }
        else {
            console.log("Error: this.gapi not loaded");
        }
    }
    /**
     * Set the default attribute calendar
     * @param {string} newCalendar
     */
    setCalendar(newCalendar) {
        this.calendar = newCalendar;
    }
    /**
     * Execute the callback function when a user is disconnected or connected with the sign status.
     * @param callback
     */
    listenSign(callback) {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
        }
        else {
            console.log("Error: this.gapi not loaded");
        }
    }
    /**
     * Execute the callback function when gapi is loaded
     * @param callback
     */
    onLoad(callback) {
        if (this.gapi) {
            callback();
        }
        else {
            this.onLoadCallback = callback;
        }
    }
    /**
     * Sign out user google account
     */
    handleSignoutClick() {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().signOut();
        }
        else {
            console.log("Error: this.gapi not loaded");
        }
    }
    /**
     * List all events in the calendar
     * @param {number} maxResults to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any}
     */
    listUpcomingEvents(maxResults, calendarId = this.calendar) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            if (this.gapi) {
                yield this.gapi.client.calendar.events.list({
                    "calendarId": calendarId,
                    "maxResults": maxResults,
                    "orderBy": "updated",
                    "showDeleted": false
                })
                    .then((response) => {
                    // Handle the results here (response.result has the parsed body).
                    result = response.result;
                }, (err) => {
                    console.error("Execute error", err);
                    result = "Error: " + err.toString();
                });
            }
            else {
                console.log("Error: this.gapi not loaded");
                result = "Error: Gapi not loaded.";
            }
            return result;
        });
    }
    /**
     * Create an event from the current time for a certain period
     * @param {number} time in minutes for the event
     * @param {string} summary of the event
     * @param {string} description of the event
     * @param {string} calendarId
     * @returns {any}
     */
    createEventFromNow({ time, summary, description = '' }, calendarId = this.calendar) {
        const event = {
            summary,
            description,
            start: {
                dateTime: (new Date()).toISOString(),
                timeZone: "Europe/Paris",
            },
            end: {
                dateTime: (new Date(new Date().getTime() + time * 60000)),
                timeZone: "Europe/Paris",
            }
        };
        return this.gapi.client.calendar.events.insert({
            'calendarId': calendarId,
            'resource': event,
        });
    }
    /**
     * Create Calendar event
     * @param {string} calendarId for the event.
     * @param {object} event with start and end dateTime
     * @returns {any}
     */
    createEvent(event, calendarId = this.calendar) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = "";
            yield this.gapi.client.calendar.events.insert({
                'calendarId': calendarId,
                'resource': event,
            }).then((response) => {
                result = response.result;
            }, (err) => {
                result = err.toString();
            });
            return result;
        });
    }
}
const googleApiService = GoogleCalendarApi.getInstance();
export default googleApiService;
