import fs from 'fs/promises';
import path from 'path';
import { config } from './config';

class StorageService {
  constructor(private readonly rootDir: string) {}

  async ensureReady(): Promise<void> {
    await fs.mkdir(this.rootDir, { recursive: true });
    const probePath = path.join(this.rootDir, '.healthcheck');
    await fs.writeFile(probePath, 'ok');
    await fs.readFile(probePath);
    await fs.unlink(probePath);
  }

  async writeFile(relativePath: string, data: string | Buffer): Promise<string> {
    const cleanPath = relativePath.replace(/^\/+/, '');
    const fullPath = path.join(this.rootDir, cleanPath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, data);
    return this.getPublicUrl(cleanPath);
  }

  readFile(relativePath: string): Promise<Buffer> {
    const cleanPath = relativePath.replace(/^\/+/, '');
    const fullPath = path.join(this.rootDir, cleanPath);
    return fs.readFile(fullPath);
  }

  getPublicUrl(relativePath: string): string {
    const cleanPath = relativePath.replace(/^\/+/, '');
    return `/assets/${cleanPath}`;
  }
}

export const storage = new StorageService(config.dataDir);
