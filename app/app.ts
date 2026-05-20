import Vue from 'nativescript-vue';
import { createPinia } from 'pinia';
import { initDatabase } from './database/database';
import { BackupService } from './services/BackupService';
import App from './components/App.vue';

Vue.use(createPinia());

new Vue({
  render: (h: any) => h('frame', [h(App)]),
  async created(): Promise<void> {
    await initDatabase();
    try { await BackupService.backup(); } catch (_e) { /* best-effort */ }
  }
}).$start();
