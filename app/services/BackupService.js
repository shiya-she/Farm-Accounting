const fs = require('@nativescript/core/file-system');

const BACKUP_DIR = 'backups';
const DB_NAME = 'farm-accounting.db';
const MAX_BACKUPS = 7;

export const BackupService = {
  async backup() {
    const documents = fs.knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);

    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const backupName = `farm-accounting-${dateStr}.db`;

    const dstPath = fs.path.join(backupFolder.path, backupName);
    if (fs.File.exists(dstPath)) return;

    const srcPath = fs.path.join(documents.path, DB_NAME);
    if (fs.File.exists(srcPath)) {
      const srcFile = fs.File.fromPath(srcPath);
      await srcFile.copy(dstPath);
    }
    await this.cleanOldBackups();
  },

  async listBackups() {
    const documents = fs.knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);
    const files = backupFolder.getEntitiesSync()
      .filter(e => e.name.startsWith('farm-accounting-') && e.name.endsWith('.db'))
      .sort((a, b) => b.name.localeCompare(a.name));

    return files.map(f => ({
      filename: f.name,
      label: f.name.replace('farm-accounting-', '').replace('.db', ''),
      path: f.path
    }));
  },

  async restore(filename) {
    const documents = fs.knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);
    const srcPath = fs.path.join(backupFolder.path, filename);
    const dstPath = fs.path.join(documents.path, DB_NAME);

    if (fs.File.exists(srcPath)) {
      const srcFile = fs.File.fromPath(srcPath);
      await srcFile.copy(dstPath);
    }
  },

  async cleanOldBackups() {
    const backups = await this.listBackups();
    if (backups.length > MAX_BACKUPS) {
      const documents = fs.knownFolders.documents();
      const backupFolder = documents.getFolder(BACKUP_DIR);
      for (let i = MAX_BACKUPS; i < backups.length; i++) {
        const file = fs.File.fromPath(backups[i].path);
        await file.remove();
      }
    }
  }
};
