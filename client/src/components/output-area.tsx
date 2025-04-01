"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface TestResult {
  params: Record<string, unknown>
  expectedOutput?: Array<string>
  actualOutput?: Array<string>
  similarityScore?: number
}

interface OutputAreaProps {
  results: TestResult[]
}

export function OutputArea({ results }: OutputAreaProps) {
  if (!results.length) {
    return null
  }

  return (
    <Card className="bg-white dark:bg-card">
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={index} className="space-y-4">
              <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <h4 className="font-medium mb-2">Test Case {index + 1}</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Params:</span>
                    <pre className="mt-1 p-2 bg-muted rounded-md overflow-auto">
                      {JSON.stringify(result.params, null, 2)}
                    </pre>
                  </div>
                  {result.expectedOutput && (
                    <div>
                      <span className="font-medium">Expected Output:</span>
                      <pre className="mt-1 p-2 bg-muted rounded-md overflow-auto">
                        {JSON.stringify(result.expectedOutput, null, 2)}
                      </pre>
                    </div>
                  )}
                  {result.actualOutput && (
                    <div>
                      <span className="font-medium">Actual Output:</span>
                      <pre className="mt-1 p-2 bg-muted rounded-md overflow-auto">
                        {JSON.stringify(result.actualOutput, null, 2)}
                      </pre>
                    </div>
                  )}
                  {result.similarityScore !== undefined && (
                    <div>
                      <span className="font-medium">Similarity Score:</span>
                      <div className="mt-1">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${result.similarityScore * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {(result.similarityScore * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 