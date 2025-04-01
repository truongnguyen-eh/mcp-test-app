"use client"

import { useState } from "react"
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Alert, AlertDescription } from "../components/ui/alert"
import { TestArea } from "../components/test-area"
import { OutputArea } from "../components/output-area"
import { getSimilarity } from "../lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { TestData, TestResult } from "../types/common"

interface MCPConfig {
  transportType: string
  sseUrl: string
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [config, setConfig] = useState<MCPConfig>({
    transportType: "sse",
    sseUrl: "",
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [client, setClient] = useState<Client | null>(null)
  const [tools, setTools] = useState<Tool[]>([])

  const validateConfig = () => {
    if (!config.sseUrl) {
      setError("Server URL is required")
      return false
    }
    return true
  }

  const initClient = async () => {
    try {
      const mcpClient = new Client(
        {
          name: "mcp-test-app",
          version: "1.0.0"
        }, {
          capabilities: {
            prompts: {},
            resources: {},
            tools: {}
          }
        }
      )

      const params = new URLSearchParams(window.location.search);
      const PROXY_PORT = params.get("proxyPort") ?? "3000";
      const PROXY_SERVER_URL = `http://${window.location.hostname}:${PROXY_PORT}`;

      const backendUrl = new URL(`${PROXY_SERVER_URL}/sse`);
      backendUrl.searchParams.append("transportType", "sse");
      backendUrl.searchParams.append("url", config.sseUrl);

      const clientTransport = new SSEClientTransport(backendUrl);
      await mcpClient.connect(clientTransport)

      setClient(mcpClient)
      setIsConnected(true)
      const res = await mcpClient.listTools()
      setTools(res.tools)
    } catch (error) {
      console.error("Failed to initialize client:", error)
      setIsConnected(false)
      setClient(null)
      throw error
    }
  }

  const handleConnect = async () => {
    if (!validateConfig()) return

    setIsLoading(true)
    setError("")

    try {
      await initClient()
    } catch {
      setError("Failed to connect to MCP server")
      setIsConnected(false)
      setClient(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = async (selectedTool: string, testData: TestData[], transformationCode: string) => {
    const results: TestResult[] = []
    console.log("testData", testData)

    for (const item of testData) {
      try {
        if (!client) {
          throw new Error("Client not connected")
        }

        const actualOutput = await client.callTool({
          name: selectedTool,
          arguments: item.params
        });
        const textValue = actualOutput.content[0].text;
        const componentExamples = [...textValue.matchAll(/^\d+\.\s*(.+)(?=\n\nSimilarity Score)/gm)].map(m => m[1]);

        // actualOutput = JSON.parse(actualOutput);
        // actualOutput = actualOutput.map((item: any) => {
        //   return item.text
        // })

        // actualOutput = (function(actualOutput: any) {
        //   eval(transformationCode)
        //   return actualOutput
        // })(actualOutput);

        const similarityScore = item.params.expectedOutput
          ? 1 - getSimilarity(
              item.params.expectedOutput,
              componentExamples
            )
          : undefined

        results.push({
          ...item,
          actualOutput: componentExamples,
          similarityScore: similarityScore ?? 0,
        })
      } catch {
        results.push({
          ...item,
          actualOutput: { error: "Failed to get response from server" },
          similarityScore: 0,
        })
      }
    }

    setTestResults(results)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">MCP Test App</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-1/3 p-4 border-r overflow-y-auto">
          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Server Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transportType">Transport Type</Label>
                <Select
                  value={config.transportType}
                  onValueChange={(value) => setConfig({ ...config, transportType: value })}
                >
                  <SelectTrigger className="bg-white dark:bg-card">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-card">
                    <SelectItem value="sse">SSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Server URL</Label>
                <Input
                  id="url"
                  placeholder="Enter server URL"
                  value={config.sseUrl}
                  onChange={(e) => setConfig({ ...config, sseUrl: e.target.value })}
                  className="bg-white dark:bg-card"
                />
              </div>

              <Button
                className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isConnected ? "Disconnect" : "Connect"}
                  </div>
                )}
              </Button>

              <div className="text-center flex items-center justify-center gap-2">
                Status:{" "}
                <span className={`flex items-center gap-1 ${isConnected ? "text-green-500" : "text-red-500"}`}>
                  <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-8">
            <TestArea isConnected={isConnected} onTest={handleTest} tools={tools} />
            <OutputArea results={testResults} />
          </div>
        </div>
      </div>
    </main>
  )
}
