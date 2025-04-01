interface TestData {
  params: Record<string, unknown>
  expectedOutput: Record<string, unknown>
}

interface TestResult extends TestData {
  actualOutput: Record<string, unknown>
  similarityScore: number
}

export type { TestData, TestResult }
