"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { TestData } from "../types/common"
import { Tool } from "@modelcontextprotocol/sdk/types.js"
import { Editor } from "@monaco-editor/react"

interface TestAreaProps {
  isConnected: boolean
  tools: Tool[]
  onTest: (selectedTool: string, testData: TestData[], transformationCode: string) => Promise<void>
}

export function TestArea({ isConnected, onTest, tools }: TestAreaProps) {
  const [testInput, setTestInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedTool, setSelectedTool] = useState<string>("")
  const [transformationCode, setTransformationCode] = useState(`// Transform the actual output here
// The actual output will be available as 'actualOutput' variable
actualOutput = actualOutput.map(item => {
   return item
});
`)

  const handleGetOutput = async () => {
    if (!testInput.trim()) {
      setError("Test input cannot be empty")
      return
    }

    try {
      const parsedInput = JSON.parse(testInput)
      if (!Array.isArray(parsedInput)) {
        setError("Test input must be an array of objects")
        return
      }

      setIsLoading(true)
      setError("")
      await onTest(selectedTool, parsedInput, transformationCode)
    } catch {
      setError("Invalid JSON format")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Alert>
        <AlertDescription>
          Connect to an MCP server to start testing
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Test Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Tool</label>
              <Select
                value={selectedTool}
                onValueChange={setSelectedTool}
              >
                <SelectTrigger className="bg-white dark:bg-card">
                  <SelectValue placeholder="Select a tool to test" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card">
                  {tools.map(tool => (
                    <SelectItem key={tool.name} value={tool.name}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Data</label>
                <Textarea
                  placeholder="Enter test data as JSON array of objects with params and expectedOutput properties"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="min-h-[200px] font-mono bg-white dark:bg-card"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Transformation</label>
                <Editor
                  height="200px"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={transformationCode}
                  onChange={(value: string | undefined) => setTransformationCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on"
                  }}
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
           
            <Button
              onClick={handleGetOutput}
              disabled={isLoading || !selectedTool}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Get Output
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output area will be added here */}
    </div>
  )
} 