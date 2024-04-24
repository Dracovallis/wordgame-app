type MessageHandler = (data: any) => void;
type ErrorHandler = (event: Event) => void;
type CloseHandler = (event: CloseEvent) => void;

export class WebSocketService {
    private socket: WebSocket | null = null;
    private messageHandler: MessageHandler | null = null;
    private errorHandler: ErrorHandler | null = null;
    private closeHandler: CloseHandler | null = null;

    public connect(url: string): void {
        this.socket = new WebSocket(url);

        this.socket.onmessage = (event: MessageEvent) => {
            if (this.messageHandler) {
                this.messageHandler(JSON.parse(event.data));
            }
        };

        this.socket.onerror = (event: Event) => {
            if (this.errorHandler) {
                this.errorHandler(event);
            }
        };

        this.socket.onclose = (event: CloseEvent) => {
            if (this.closeHandler) {
                this.closeHandler(event);
            }
            console.log('WebSocket is closed. Attempting to reconnect...');
            setTimeout(() => this.connect(url), 1000);
        };

        console.log('WebSocket connection established');
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }

    public sendMessage(message: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket connection is not open.');
        }
    }

    public onMessage(handler: MessageHandler): void {
        this.messageHandler = handler;
    }

    public onError(handler: ErrorHandler): void {
        this.errorHandler = handler;
    }

    public onClose(handler: CloseHandler): void {
        this.closeHandler = handler;
    }
}

