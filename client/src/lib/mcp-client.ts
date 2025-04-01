import { SSEClient } from './sse-client'

export interface MCPMessage {
  method: string
  params?: Record<string, unknown>
  id?: string | number
  result?: unknown
  error?: {
    code: number
    message: string
  }
}

export class MCPClient {
  private sseClient: SSEClient | null = null
  private messageHandlers: ((message: MCPMessage) => void)[] = []
  private errorHandlers: ((error: Error) => void)[] = []
  private messageId = 0

  constructor(
    private url: string,
    private options: {
      name: string
      version: string
    }
  ) {}

  async connect() {
    // Use our proxy to handle CORS
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(`${this.url}/sse`)}`
    this.sseClient = new SSEClient(proxyUrl)
    
    this.sseClient.onMessage((data) => {
      const message = data as MCPMessage
      this.messageHandlers.forEach(handler => handler(message))
    })

    this.sseClient.onError((error) => {
      this.errorHandlers.forEach(handler => handler(error))
    })

    // Wait for SSE connection to be established
    await this.sseClient.connect()

    console.log('Call sendMessage')
    // Send initialization message
    // await this.sendMessage({
    //   method: 'initialize',
    //   params: {
    //     name: this.options.name,
    //     version: this.options.version
    //   }
    // })
  }

  disconnect() {
    if (this.sseClient) {
      this.sseClient.disconnect()
      this.sseClient = null
    }
  }

  private async sendMessage(message: Omit<MCPMessage, 'id'>): Promise<MCPMessage> {
    if (!this.sseClient) {
      throw new Error('Client not connected')
    }

    const id = ++this.messageId
    const fullMessage: MCPMessage = { ...message, id }

    // Send message through proxy
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(`${this.url}/messages`)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fullMessage)
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return response.json()
  }

  onMessage(handler: (message: MCPMessage) => void) {
    this.messageHandlers.push(handler)
  }

  onError(handler: (error: Error) => void) {
    this.errorHandlers.push(handler)
  }

  removeMessageHandler(handler: (message: MCPMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
  }

  removeErrorHandler(handler: (error: Error) => void) {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler)
  }

  async invoke(params?: Record<string, unknown>): Promise<unknown> {
    const response = await this.sendMessage(params)
    
    if (response.error) {
      throw new Error(response.error.message)
    }

    return response.result
  }
} 