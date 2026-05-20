import { defineStore } from 'pinia';
import { WorkerService } from '../services/WorkerService';
import type { Worker } from '../types';

export const useWorkersStore = defineStore('workers', {
  state: (): { workers: Worker[] } => ({ workers: [] }),
  actions: {
    async loadWorkers(): Promise<void> { this.workers = await WorkerService.getAll(); },
    async addWorker(name: string, phone?: string, note?: string): Promise<void> {
      await WorkerService.addWorker(name, phone, note);
      await this.loadWorkers();
    },
    async updateWorker(id: number, name: string, phone?: string, note?: string): Promise<void> {
      await WorkerService.updateWorker(id, name, phone, note);
      await this.loadWorkers();
    },
    async deleteWorker(id: number): Promise<void> {
      await WorkerService.deleteWorker(id);
      await this.loadWorkers();
    }
  }
});
