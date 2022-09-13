import EventEmitter from 'events';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { basename, dirname, join } from 'path';

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
        if (this.pauseProcess != value) {
            this.pauseProcess = value;
            this.process();
        }
    }
    private pauseProcess: boolean;

    // Store check process handle
    private processHandle?: NodeJS.Timeout;

    public get ServiceId() {
        return this.serviceId;
    }
    private serviceId: string;

    constructor(id: string) {
        super();

        this.serviceId = id;

        this.pauseProcess = false;

        // First load then start the process
        EventReminderService.Load(this.serviceId).then((events: IEventReminder[]) => {
            this.events = events;
            this.process();
        });
    }

    /**
     * Load stored events from a file
     */
    public static async Load(serviceId: string) {
        try {
            const data = await readFile(join(homedir(), 'EventReminders', basename(serviceId, '.store')), 'utf-8');
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
        const storePath = join(homedir(), 'EventReminders', basename(this.serviceId, '.store'));
        await mkdir(dirname(storePath), { recursive: true });
        await writeFile(storePath, JSON.stringify(this.events, null, 4), {
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
