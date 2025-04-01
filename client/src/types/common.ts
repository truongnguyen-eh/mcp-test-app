interface TestItem {
  params: Record<string, unknown>
  expectedOutput: Array<string>
}

interface OutputItem {
  result: string
  embeddingSimilarity: number
}

interface TestItemResult extends TestItem {
  actualOutput: Array<OutputItem>
  similarityScore: number
}

export type { TestItem, TestItemResult }
