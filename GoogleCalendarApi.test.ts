import googleApiService from "./GoogleCalendarApi";

test('setCalendar method', () => {
    googleApiService.setCalendar('test-calendar');
    expect(googleApiService.calendar).toBe('test-calendar');
});

test("Actual initialization", () => {
    console.log("Gapi: ", googleApiService.gapi);
    expect(googleApiService.gapi).toBeDefined;
});
