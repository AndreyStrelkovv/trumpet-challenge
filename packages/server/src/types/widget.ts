export interface Widget {
  id: number
  text: string
}

export interface DbSchema {
  nextId: number
  widgets: Widget[]
}
