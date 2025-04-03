# MCP Test App

A testing application for the Model Context Protocol (MCP) that allows you to test and validate MCP tools and transformations.

## Features

- Connect to MCP servers
- Test MCP tools with custom input
- Transform output using JavaScript

## Prerequisites

- Node.js 18.x or later

## Project Structure

```
.
├── client/          # Next.js MCP test application
├── server/          # Express.js for proxy server (So we can bypass CORS of targeted MCP server)
└── package.json     # Root package.json for workspace
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/truongnguyen-eh/mcp-test-app.git
cd mcp-test-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the client:

- From root project:
```bash
cd client
npm run start
```

4. Start the proxy server:

- From root project:
```bash
cd server
npm run start
```

## Usage

1. **Connect to MCP Server**
   - Open the application in your browser (default: http://localhost:3000)
   - Enter the MCP server URL and connect

2. **Test MCP Tools**
   - Select a tool from the dropdown
   - Enter test data in JSON format
   - Add transformation code if needed
   - Click "Get Output" to run the test

3. **Test Data Format**
```json
[
  {
    "params": {
      "query": "Your query here"
    },
    "expectedOutput": [
      "Expected output 1",
      "Expected output 2"
    ]
  }
]
```

4. **Transformation Code**
   - Write JavaScript code to transform the output
   - Use the `actualOutput` variable to access the raw output
   - Return the transformed result

## Deployment

### Deploy to Vercel

1. Deploy the server:
```bash
cd server
vercel
```

2. Deploy the client:
```bash
cd client
vercel
```

3. Set up environment variables in Vercel:
   - For server: Set `NEXT_PUBLIC_CLIENT_URL` to your client's Vercel URL
   - For client: Set `NEXT_PUBLIC_SERVER_URL` to your server's Vercel URL

## Development

- Client runs on http://localhost:3000
- Server runs on http://localhost:3010
- Hot reloading is enabled for both client and server
