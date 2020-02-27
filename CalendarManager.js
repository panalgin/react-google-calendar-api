var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @author Mustafa YILDIZ <mashadow@outlook.com>
 */
export class CalendarManager {
    constructor() {
        this.Gapi = null;
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
    clear(calendarId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Gapi.client.calendar.calendars.clear({
                "calendarId": calendarId,
            });
        });
    }
    /**
     * @description Deletes a secondary calendar. Use CalendarManager.clear for clearing all
     * events on primary calendars.
     * @param {string} calendarId The identifier for the calendar to be deleted.
     */
    delete(calendarId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Gapi.client.calendar.calendars.delete({
                "calendarId": calendarId
            });
        });
    }
    /**
     * @description Returns metadata for a calendar.
     * @param {string} calendarId The identifier for the calendar to get its metadata.
     */
    get(calendarId) {
        return this.Gapi.client.calendar.calendars.get({
            "calendarId": calendarId
        });
    }
    /**
     * @description Creates a secondary calendar.
     * @param {string} summary The name of the calendar
     * @param {string} description Optional description text for this calendar
     */
    insert(summary, description) {
        return this.Gapi.client.calendar.calendars.insert(summary, description);
    }
    /**
     * @description Updates metadata for a calendar. This method supports patch semantics.
     */
    patch() {
    }
    /**
     * @description Updates metadata for a calendar.
     */
    update() {
    }
}
