<template>
  <Page class="page">
    <ActionBar title="备份恢复" />
    <StackLayout class="content">
      <Label text="自动备份" class="section-title" />
      <Label text="每次启动应用时自动备份数据库，保留最近7天" class="desc" />
      <Button text="立即备份" class="btn-main" @tap="backupNow" />
      <Label text="恢复备份" class="section-title" style="margin-top: 24;" />
      <ListView :items="backups">
        <template #default="{ item }">
          <GridLayout columns="*, auto" class="item-row">
            <Label col="0" :text="item.label" class="item-name" />
            <Button col="1" text="恢复" class="btn-restore" @tap="restore(item)" />
          </GridLayout>
        </template>
      </ListView>
      <Label v-if="!backups.length" text="暂无备份" class="empty" />
    </StackLayout>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { BackupService } from '../services/BackupService';
import type { BackupEntry } from '../services/BackupService';

export default Vue.extend({
  data(): { backups: BackupEntry[] } { return { backups: [] }; },
  async mounted(): Promise<void> { await this.loadBackups(); },
  methods: {
    async loadBackups(): Promise<void> { this.backups = await BackupService.listBackups(); },
    async backupNow(): Promise<void> {
      await BackupService.backup();
      alert('备份成功');
      await this.loadBackups();
    },
    async restore(item: BackupEntry): Promise<void> {
      await BackupService.restore(item.filename);
      alert('恢复成功，请重启应用');
    }
  }
});
</script>
<style scoped>
.page { background-color: var(--color-bg); }
.content { padding: var(--spacing-base); }
.section-title { font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--color-text); margin-bottom: var(--spacing-sm); }
.desc { font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--spacing-md); }
.btn-main { background-color: var(--color-primary); color: var(--color-text-inverse); border-radius: var(--radius-md); padding: var(--spacing-md); font-weight: var(--font-semibold); elevation: var(--elevation-sm); }
.btn-restore { background-color: var(--color-accent); color: var(--color-text-inverse); font-size: var(--text-sm); padding: var(--spacing-xs) var(--spacing-base); border-radius: var(--radius-sm); font-weight: var(--font-medium); }
.item-row { padding: var(--spacing-md) var(--spacing-sm); background-color: var(--color-surface); border-bottom-width: 1; border-bottom-color: var(--color-divider); }
.item-name { font-size: var(--text-base); color: var(--color-text); }
.empty { text-align: center; color: var(--color-text-muted); font-size: var(--text-sm); margin: var(--spacing-lg); }
</style>
