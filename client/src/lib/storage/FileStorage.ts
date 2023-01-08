import { Storage } from "./Storage";
import { existsSync, readFile, writeFile } from "fs";

const URL = "http://localhost:3000/storage";

export class AWSStorage implements Storage {
  getObjectURL(path: string): string {
    return `${URL}/${path}`;
  }

  async getObject(path: string): Promise<string> {
    return new Promise((resolve, reject) =>
      readFile(path, "base64", (err, data) => {
        if (err) {
          reject(err.message);
          return;
        }
        resolve(data);
      })
    );
  }

  async objectExits(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(existsSync(path));
    });
  }

  async writeObject(data: string | Buffer, path: string): Promise<void> {
    return new Promise((resolve, reject) =>
      writeFile(path, data, "base64", () => {
        resolve();
      })
    );
  }
}
