interface TestItem {
  params: Record<string, unknown>
  expectedOutput: Array<string>
}

interface TestItemResult extends TestItem {
  actualOutput: Array<string>
  similarityScore: number
}

export type { TestItem, TestItemResult }
