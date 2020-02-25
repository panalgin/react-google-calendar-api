import GoogleCalendarApi from './build/GoogleCalendarApi';
test('setCalendar method', () => {
    GoogleCalendarApi.setCalendar('test-calendar');
    expect(GoogleCalendarApi.calendar).toBe('test-calendar');
});
