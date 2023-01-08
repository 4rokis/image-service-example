export interface Storage {
  getObjectURL: (path: string) => string
  getObject: (path: string) => Promise<string | Buffer>
  objectExits: (path: string) => Promise<boolean>
  writeObject: (data: string | Buffer, path: string) => Promise<void>
}
