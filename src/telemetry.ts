const ENDPOINT = (process.env.TELEMETRY_ENDPOINT as string) || "https://telemetry.jinmu.me";
const API_KEY = (process.env.TELEMETRY_API_KEY as string) || "telemetry-dev-key";

interface TelemetryEvent {
    app: string;
    event: string;
    context?: Record<string, unknown>;
    properties?: Record<string, unknown>;
    timestamp: string;
}

const FLUSH_INTERVAL = 2_000;
const BATCH_THRESHOLD = 10;
const MAX_QUEUE = 50;

export class Telemetry {
    private queue: TelemetryEvent[] = [];
    private enabled = false;
    private app: string;
    private version: string;
    private flushTimer: number | null = null;

    constructor(app: string, version: string) {
        this.app = app;
        this.version = version;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (!enabled) this.queue = [];
    }

    track(event: string, properties?: Record<string, unknown>) {
        if (!this.enabled) return;
        this.queue.push({
            app: this.app,
            event,
            context: {
                platform: navigator.platform,
                version: this.version,
                obsidian: (window as unknown as { apiVersion?: string }).apiVersion,
            },
            properties,
            timestamp: new Date().toISOString(),
        });
        if (this.queue.length > MAX_QUEUE) {
            this.queue.splice(0, this.queue.length - MAX_QUEUE);
        }
        if (this.queue.length >= BATCH_THRESHOLD) {
            void this.flush();
        } else {
            this.scheduleFlush();
        }
    }

    shutdown() {
        if (this.flushTimer !== null) {
            window.clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }
        void this.flush();
    }

    private scheduleFlush() {
        if (this.flushTimer !== null) return;
        this.flushTimer = window.setTimeout(() => {
            this.flushTimer = null;
            void this.flush();
        }, FLUSH_INTERVAL);
    }

    private async flush() {
        if (this.queue.length === 0) return;
        const batch = this.queue.splice(0);
        try {
            await fetch(`${ENDPOINT}/v1/events/batch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                },
                body: JSON.stringify({ events: batch }),
                keepalive: true,
            });
        } catch {
            // silently drop
        }
    }
}
