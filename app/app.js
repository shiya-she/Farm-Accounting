import Vue from 'nativescript-vue';
import { createPinia } from 'pinia';
import { initDatabase } from './database/database';
import { BackupService } from './services/BackupService';
import App from './components/App';

Vue.use(createPinia());

new Vue({
  render: h => h('frame', [h(App)]),
  async created() {
    await initDatabase();
    try { await BackupService.backup(); } catch (e) { /* best-effort */ }
  }
}).$start();
