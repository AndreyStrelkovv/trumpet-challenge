export interface RawWidget {
  id: number
  text: string
  createdAt: string
  updatedAt: string
  docType?: string
}

export interface DbSchema {
  nextId: number
  widgets: RawWidget[]
}
