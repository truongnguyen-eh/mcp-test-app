import { NextRequest, NextResponse } from 'next/server'
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"

let webAppTransports: SSEServerTransport[] = [];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  
  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 })
  }

  try {
    // Construct the target URL with session ID if present
    const targetUrl = new URL(url)
    console.log("Proxying SSE request to:", targetUrl.toString())

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

    const webAppTransport = new SSEServerTransport("/message", response);

    // Todo: Save response to use later for a session id

    if (!response.ok) {
      console.error("SSE request failed:", response.status, response.statusText)
      return new NextResponse("Failed to fetch from target server", { status: response.status })
    }

    // For SSE connections, we need to stream the response
    if (response.headers.get('content-type')?.includes('text/event-stream')) {
      const stream = response.body
      if (!stream) {
        return new NextResponse("No response body", { status: 500 })
      }

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // For regular responses, return as JSON
    const data = await response.json()
    console.log("Proxy response sse:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Proxy error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 })
  }

  try {
    const body = await request.json()
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return new NextResponse("Failed to fetch from target server", { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Proxy error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
} 