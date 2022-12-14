import { homedir } from 'os';
import EventEmitter from 'events';
import { dirname, join } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';

/**
 * Event Reminder Interface
 */
export interface IEventReminder {
    title: string;
    message: string;
    triggerTime: number;
}

/**
 * Event Reminder Service class
 */
export class EventReminderService extends EventEmitter {
    /**
     * Get all event reminders
     */
    public get Events(): IEventReminder[] {
        return this.events;
    }
    private events: IEventReminder[] = [];

    /**
     * Check if service is started
     */
    public get Started() {
        return this.processHandle != null;
    }

    // Current process handle
    private processHandle?: NodeJS.Timeout;

    /**
     * Get the service ID
     */
    public get ServiceId() {
        return this.serviceId;
    }
    private serviceId: string;

    constructor(id: string) {
        super();

        this.serviceId = id;
    }

    /**
     * Load stored events from a file
     * @returns the loaded array or undefined
     */
    public static async Load(serviceId: string) {
        try {
            const data = await readFile(join(homedir(), 'EventReminders', serviceId + '.json'), 'utf-8');
            const events = JSON.parse(data) as IEventReminder[];
            if (Array.isArray(events)) return events;
        } catch (_) {
            console.log('No store found, starting from zero!');
        }
    }

    /**
     * Save loaded events into a file
     */
    public async save() {
        const storePath = join(homedir(), 'EventReminders', this.serviceId + '.json');
        await mkdir(dirname(storePath), { recursive: true });
        await writeFile(storePath, JSON.stringify(this.events, null, 4), {
            encoding: 'utf-8',
        });
        this.emit('onEventReminderSaved');
    }

    /**
     * Add an event
     * @param event the event to add
     */
    public addEvent(event: IEventReminder) {
        const index = this.events.push(event);
        this.save().then(() => this.emit('onEventReminderAdded', event, index));
    }

    /**
     * Remove an event
     * @param index the index of the event to remove
     */
    public removeEvent(index: number) {
        if (this.events[index]) {
            const event = this.events[index];
            this.events.splice(index, 1);
            this.emit('onEventReminderRemoved', event, index);
        }
    }

    /**
     * Trigger an event and remove it
     * @param index the index of the event to trigger and remove
     */
    public triggerEvent(index: number) {
        if (this.events[index]) {
            const event = this.events[index];
            this.removeEvent(index);
            this.emit('onEventReminderTriggered', event, index);
        }
    }

    /**
     * Start service
     */
    public start() {
        if (!this.Started) {
            // Load stored events
            EventReminderService.Load(this.serviceId).then((events?: IEventReminder[]) => {
                this.events = events || [];
                this.process();
                console.log(`Service '${this.serviceId}' has started!`);
                this.emit('onServiceStarted');
            });
        }
    }

    /**
     * Stop service
     */
    public stop() {
        if (this.processHandle) {
            clearTimeout(this.processHandle);
            this.processHandle = undefined;
            console.log(`Service '${this.serviceId}' has stopped!`);
            this.emit('onServiceStopped');
        }
    }

    /**
     * Loop throught active event to compare time.
     * Trigger it if trigger time is smaller than current time.
     * * Made this method public to be able to test it but I wish I knew
     * a proper and official way to test privates.
     */
    public async process() {
        if (this.processHandle) clearTimeout(this.processHandle);

        let triggeredCount = 0;
        const now = Date.now();
        for (const [index, event] of this.events.entries()) {
            if (event.triggerTime < now) {
                this.triggerEvent(index);
                triggeredCount++;
            }
        }

        // If any events triggered, let's save the changes
        if (triggeredCount > 0) await this.save().catch(console.error);

        // Start process again
        this.processHandle = setTimeout(() => this.process(), 1000);
    }
}
