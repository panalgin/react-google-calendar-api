/**
 * @author Mustafa YILDIZ <mashadow@outlook.com>
 */
export class CalendarManager {
  public Gapi: any = null;

  constructor() {
    this.clear = this.clear.bind(this);
    this.delete = this.delete.bind(this);
    this.get = this.get.bind(this);
    this.insert = this.insert.bind(this);
    this.patch = this.patch.bind(this);
    this.update = this.update.bind(this);
  }

  /**
   * @description Clears a primary calendar. This operation deletes all events associated with the primary calendar of an account.
   * @param {string} calendarId The identifier for the calendar to be cleared.
   * @returns {any}
   */
  public async clear(calendarId: string): Promise<any> {
    return await this.Gapi.client.calendar.calendars.clear({
      "calendarId": calendarId,
    });
  }

  /**
   * @description Deletes a secondary calendar. Use CalendarManager.clear for clearing all
   * events on primary calendars.
   * @param {string} calendarId The identifier for the calendar to be deleted.
   */
  public async delete(calendarId: string): Promise<any> {
    return this.Gapi.client.calendar.calendars.delete({
      "calendarId": calendarId
    });
  }

  /**
   * @description Returns metadata for a calendar.
   * @param {string} calendarId The identifier for the calendar to get its metadata.
   */
  public get(calendarId: string): any {
    return this.Gapi.client.calendar.calendars.get({
      "calendarId": calendarId
    });
  }

  /**
   * @description Creates a secondary calendar.
   * @param {string} summary The name of the calendar
   * @param {string} description Optional description text for this calendar
   */
  public insert(summary: string, description?: string): any {
    return this.Gapi.client.calendar.calendars.insert(summary, description);
  }

  /**
   * @description Updates metadata for a calendar. This method supports patch semantics.
   */
  public patch(): any {

  }

  /**
   * @description Updates metadata for a calendar.
   */
  public update(): void {

  }
}
