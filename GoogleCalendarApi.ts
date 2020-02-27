import { CalendarManager } from './CalendarManager';
import { EventManager } from './EventManager';

//@ts-ignore
let Config = {
  "clientId": "754982713370-oe0jco1hr4vn7ni8545v010280tij7h7.apps.googleusercontent.com",
  "apiKey": "AIzaSyBCnV4bldtQSqnpbfxQN1YZLQQoGAICsg0",
  "scope": "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.settings.readonly",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
};

declare var window: any;

class GoogleCalendarApi {
  private static instance: GoogleCalendarApi;
  public Calendars: CalendarManager = new CalendarManager();
  public Events: EventManager = new EventManager();
  sign: boolean = false;
  gapi: any = null;
  onLoadCallback: any = null;
  calendar: string = 'primary';

  protected constructor() {
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
      console.log("Ctor called");
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Gets the singleton instance
   * @returns GoogleCalendarApi::instance
   */
  public static getInstance(): GoogleCalendarApi {
    if (!GoogleCalendarApi.instance) {
      GoogleCalendarApi.instance = new GoogleCalendarApi();
    }

    return GoogleCalendarApi.instance;
  }

  /**
   * Update connection status.
   * @param {boolean} isSignedIn
   */
  private updateSigninStatus(isSignedIn: boolean): void {
    this.sign = isSignedIn;

    console.log("IsSignedIn: ", isSignedIn);
  }

  /**
   * Auth to the google Api.
   */
  private initClient(): void {
    this.gapi = window['gapi'];
    console.log("Gapi set");

    this.gapi.client.init(Config)
      .then(() => {
        // Listen for sign-in state changes.
        this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
        // Handle the initial sign-in state.
        this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());
        if (this.onLoadCallback) {
          this.onLoadCallback();
        }

        console.log ("OnLoadCallback called");
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  /**
   * Init Google Api
   * And create gapi in global
   */
  private handleClientLoad(): void {
    this.gapi = window['gapi'];
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);
    console.log("Gapi script being injected");
    script.onload = (): void => {
      console.log("Gapi script being injected222");
      window['gapi'].load('client:auth2', this.initClient);
      console.log("Gapi script injected");
    }
  }

  /**
   * Sign in Google user account
   */
  public handleAuthClick(): void {
    if (this.gapi) {
      this.gapi.auth2.getAuthInstance().signIn();
    } else {
      console.log("Error: this.gapi not loaded")
    }
  }

  /**
   * Set the default attribute calendar
   * @param {string} newCalendar
   */
  public setCalendar(newCalendar: string): void {
    this.calendar = newCalendar;
  }

  /**
   * Execute the callback function when a user is disconnected or connected with the sign status.
   * @param callback
   */
  public listenSign(callback: any): void {
    if (this.gapi) {
      this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
    } else {
      console.log("Error: this.gapi not loaded")
    }
  }

  /**
   * Execute the callback function when gapi is loaded
   * @param callback
   */
  public onLoad(callback: any): void {
    if (this.gapi) {
      callback();

      // Set subclasses gapi instance
      console.log("OnLoaded: Setting subclasses gapi instance");
      this.Calendars.Gapi = this.gapi;
      this.Events.Gapi = this.gapi;
    } else {
      this.onLoadCallback = callback;
    }
  }

  /**
   * Sign out user google account
   */
  public handleSignoutClick(): void {
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
  public async listUpcomingEvents(maxResults: number, calendarId: string = this.calendar): Promise<any> {
    let result = null;

    if (this.gapi) {
      await this.gapi.client.calendar.events.list({
        "calendarId": calendarId,
        "maxResults": maxResults,
        "orderBy": "updated",
        "showDeleted": false
      })
        .then((response: any) => {
          // Handle the results here (response.result has the parsed body).
          result = response.result;
        },
          (err: any) => {
            console.error("Execute error", err);

            result = "Error: " + err.toString();
          });
    } else {
      console.log("Error: this.gapi not loaded");
      result = "Error: Gapi not loaded.";
    }

    return result;
  }

  /**
   * Create an event from the current time for a certain period
   * @param {number} time in minutes for the event
   * @param {string} summary of the event
   * @param {string} description of the event
   * @param {string} calendarId
   * @returns {any}
   */
  public createEventFromNow({ time, summary, description = '' }: any, calendarId: string = this.calendar): any {
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
  public async createEvent(event: object, calendarId: string = this.calendar): Promise<any> {
    let result = "";

    await this.gapi.client.calendar.events.insert({
      'calendarId': calendarId,
      'resource': event,
    }).then((response: any) => {
      result = response.result;
    }, (err: any) => {
      result = err.toString();
    });

    return result;
  }
}

const googleApiService = GoogleCalendarApi.getInstance();
export default googleApiService;
