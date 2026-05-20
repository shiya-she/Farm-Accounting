import { WorkerDAO } from '../database/dao/WorkerDAO';
import { now } from '../utils/date';
import type { Worker } from '../types';

export const WorkerService = {
  async getAll(): Promise<Worker[]> { return WorkerDAO.getAll(); },
  async addWorker(name: string, phone?: string, note?: string): Promise<void> {
    await WorkerDAO.insert({ name, phone: phone || null, note: note || null, created_at: now() });
  },
  async updateWorker(id: number, name: string, phone?: string, note?: string): Promise<void> {
    await WorkerDAO.update({ id, name, phone: phone || null, note: note || null });
  },
  async deleteWorker(id: number): Promise<void> { await WorkerDAO.deleteById(id); }
};
