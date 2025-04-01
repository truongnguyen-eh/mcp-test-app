export class SSEClient {
  private eventSource: EventSource | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private errorHandlers: ((error: any) => void)[] = [];
  private connectionPromise: Promise<void> | null = null;

  constructor(private url: string) {}

  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.eventSource = new EventSource(this.url);

      this.eventSource.onopen = () => {
        console.log('SSE connection opened');
        resolve();
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.errorHandlers.forEach(handler => handler(error));
        reject(error);
      };
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.connectionPromise = null;
    }
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
  }

  onError(handler: (error: any) => void) {
    this.errorHandlers.push(handler);
  }

  removeMessageHandler(handler: (data: any) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  removeErrorHandler(handler: (error: any) => void) {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
  }
} 