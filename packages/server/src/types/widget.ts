export interface RawWidget {
  id: number
  text: string
}

export interface DbSchema {
  nextId: number
  widgets: RawWidget[]
}
