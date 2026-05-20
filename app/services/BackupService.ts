import { File, knownFolders, path } from '@nativescript/core';

const BACKUP_DIR = 'backups';
const DB_NAME = 'farm-accounting.db';
const MAX_BACKUPS = 7;

export interface BackupEntry {
  filename: string;
  label: string;
  path: string;
}

export const BackupService = {
  async backup(): Promise<void> {
    const documents = knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);

    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const backupName = `farm-accounting-${dateStr}.db`;

    const dstPath = path.join(backupFolder.path, backupName);
    if (File.exists(dstPath)) return;

    const srcPath = path.join(documents.path, DB_NAME);
    if (File.exists(srcPath)) {
      const srcFile = File.fromPath(srcPath);
      await srcFile.copy(dstPath);
    }
    await this.cleanOldBackups();
  },

  async listBackups(): Promise<BackupEntry[]> {
    const documents = knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);
    const files = backupFolder.getEntitiesSync()
      .filter((e: { name: string }) => e.name.startsWith('farm-accounting-') && e.name.endsWith('.db'))
      .sort((a: { name: string }, b: { name: string }) => b.name.localeCompare(a.name));

    return files.map((f: { name: string; path: string }) => ({
      filename: f.name,
      label: f.name.replace('farm-accounting-', '').replace('.db', ''),
      path: f.path
    }));
  },

  async restore(filename: string): Promise<void> {
    const documents = knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);
    const srcPath = path.join(backupFolder.path, filename);
    const dstPath = path.join(documents.path, DB_NAME);

    if (File.exists(srcPath)) {
      const srcFile = File.fromPath(srcPath);
      await srcFile.copy(dstPath);
    }
  },

  async cleanOldBackups(): Promise<void> {
    const backups = await this.listBackups();
    if (backups.length > MAX_BACKUPS) {
      const documents = knownFolders.documents();
      const backupFolder = documents.getFolder(BACKUP_DIR);
      for (let i = MAX_BACKUPS; i < backups.length; i++) {
        const file = File.fromPath(backups[i].path);
        await file.remove();
      }
    }
  }
};
