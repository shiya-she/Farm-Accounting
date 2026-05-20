import { WorkerDAO } from '../database/dao/WorkerDAO';
import { now } from '../utils/date';

export const WorkerService = {
  async getAll() { return WorkerDAO.getAll(); },
  async addWorker(name, phone, note) {
    await WorkerDAO.insert({ name, phone, note, created_at: now() });
  },
  async updateWorker(id, name, phone, note) {
    await WorkerDAO.update({ id, name, phone, note });
  },
  async deleteWorker(id) { await WorkerDAO.deleteById(id); }
};
