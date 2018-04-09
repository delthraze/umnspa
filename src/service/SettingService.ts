export class SettingsService {
    private notification = true;
    setNotification (status: boolean) {
        this.notification = status;
    }
    isNotification () {
        return this.notification;
    }
}
    