import EventEmitter from 'events';
import { readFile, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

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
     * Pause the check process
     */
    public set PauseProcess(value: boolean) {
        this.pauseProcess = value;
        if (!value) this.process();
    }
    private pauseProcess: boolean;

    // Store check process handle
    private processHandle?: NodeJS.Timeout;

    constructor() {
        super();

        this.pauseProcess = false;

        // First load then start the process
        EventReminderService.Load().then((events: IEventReminder[]) => {
            this.events = events;
            this.process();
        });
    }

    /**
     * Load stored events from a file
     */
    public static async Load() {
        try {
            const data = await readFile(join(homedir(), 'EventReminders.store'), 'utf-8');
            const events = JSON.parse(data) as IEventReminder[];
            if (Array.isArray(events)) return events;
        } catch (_) {
            console.log('No store found, starting from zero!');
        }
        return [];
    }

    /**
     * Save loaded events into a file
     */
    public async save() {
        await writeFile(join(homedir(), 'EventReminders.store'), JSON.stringify(this.events, null, 4), {
            encoding: 'utf-8',
        });
        this.emit('onEventReminderSaved');
    }

    /**
     * Add an event
     * @param event
     */
    public addEvent(event: IEventReminder) {
        const index = this.events.push(event);
        this.emit('onEventReminderAdded', event, index);
    }

    /**
     * Remove an event
     * @param index
     */
    public removeEvent(index: number) {
        if (this.events[index]) {
            const event = this.events[index];
            this.events.slice(index, 1);
            this.emit('onEventReminderRemoved', event, index);
        }
    }

    /**
     * Trigger an event and remove it
     * @param index
     */
    public triggerEvent(index: number) {
        if (this.events[index]) {
            this.emit('onEventReminderTriggered', this.events[index], index);
            this.removeEvent(index);
        }
    }

    /**
     * Loop throught active event to compare time.
     * Trigger it if trigger time is smaller than current time.
     */
    private async process() {
        if (this.processHandle) clearTimeout(this.processHandle);

        if (this.pauseProcess) return;

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
        this.processHandle = setTimeout(this.process, 1000);
    }
}
