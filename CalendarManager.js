class CalendarManager {
    constructor() {
        this.clear = this.clear.bind(this);
        this.delete = this.delete.bind(this);
        this.get = this.get.bind(this);
        this.insert = this.insert.bind(this);
        this.patch = this.patch.bind(this);
        this.update = this.update.bind(this);
    }
    /**
     * Clears a primary calendar. This operation deletes all events associated with
     * the primary calendar of an account.
     */
    clear() {
    }
    /**
     * Deletes a secondary calendar. Use CalendarManager.clear for clearing all
     * events on primary calendars.
     */
    delete() {
    }
    /**
     * Returns metadata for a calendar.
     */
    get() {
    }
    /**
     * Creates a secondary calendar.
     */
    insert() {
    }
    /**
     * Updates metadata for a calendar. This method supports patch semantics.
     */
    patch() {
    }
    /**
     * Updates metada for a calendar.
     */
    update() {
    }
}
