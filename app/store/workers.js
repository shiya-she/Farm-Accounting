import { defineStore } from 'pinia';
import { WorkerService } from '../services/WorkerService';

export const useWorkersStore = defineStore('workers', {
  state: () => ({ workers: [] }),
  actions: {
    async loadWorkers() { this.workers = await WorkerService.getAll(); },
    async addWorker(name, phone, note) {
      await WorkerService.addWorker(name, phone, note);
      await this.loadWorkers();
    },
    async updateWorker(id, name, phone, note) {
      await WorkerService.updateWorker(id, name, phone, note);
      await this.loadWorkers();
    },
    async deleteWorker(id) {
      await WorkerService.deleteWorker(id);
      await this.loadWorkers();
    }
  }
});
