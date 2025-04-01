# MCP Test App

A modern web application for testing Model Context Protocol (MCP) servers. Built with Next.js, Tailwind CSS, and Shadcn UI.

## Features

- Connect to MCP servers with configurable transport types (HTTP, HTTPS, WebSocket)
- Support for authentication
- Real-time connection status monitoring
- Test data input and validation
- Automatic output comparison using Manhattan distance
- Dark mode support
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mcp-test-app.git
cd mcp-test-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. Enter the MCP server configuration:
   - Select the transport type
   - Enter the server URL
   - Add authentication token if required

2. Click "Connect" to establish a connection with the MCP server

3. Once connected, you can:
   - Enter test data as a JSON array of objects
   - Each object should have:
     - `params`: The parameters to send to the server
     - `expectedOutput`: (Optional) The expected response from the server

4. Click "Get Output" to:
   - Send each test case to the server
   - Compare responses with expected outputs
   - View similarity scores and differences

## Test Data Format

```json
[
  {
    "params": {
      "key1": "value1",
      "key2": "value2"
    },
    "expectedOutput": {
      "result": "expected result"
    }
  }
]
```

## Development

### Project Structure

```
src/
  ├── app/              # Next.js app directory
  ├── components/       # React components
  │   ├── ui/          # Shadcn UI components
  │   ├── test-area.tsx
  │   └── output-area.tsx
  └── lib/             # Utility functions
```

### Adding New Features

1. Create new components in the `src/components` directory
2. Add new utility functions in `src/lib/utils.ts`
3. Update the main page in `src/app/page.tsx`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
