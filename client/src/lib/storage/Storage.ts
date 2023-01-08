export interface Storage {
  getObjectURL: (path: string) => string;
  objectExits: (path: string) => Promise<boolean>;
  writeObject: (data: string | Buffer, path: string) => Promise<void>;
}
