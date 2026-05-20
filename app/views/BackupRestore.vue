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
<script>
import { BackupService } from '../services/BackupService';
export default {
  data() { return { backups: [] }; },
  async mounted() { await this.loadBackups(); },
  methods: {
    async loadBackups() { this.backups = await BackupService.listBackups(); },
    async backupNow() { await BackupService.backup(); alert('备份成功'); await this.loadBackups(); },
    async restore(item) { await BackupService.restore(item.filename); alert('恢复成功，请重启应用'); }
  }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.content { padding: 16; }
.section-title { font-size: 16; font-weight: bold; color: #333; margin-bottom: 8; }
.desc { font-size: 13; color: #666; margin-bottom: 12; }
.btn-main { background-color: #2e6b3e; color: white; border-radius: 8; padding: 12; font-weight: bold; }
.btn-restore { background-color: #3498db; color: white; font-size: 12; padding: 6 16; border-radius: 4; }
.item-row { padding: 12 8; background-color: white; border-bottom-width: 1; border-bottom-color: #eee; }
.item-name { font-size: 14; color: #333; }
.empty { text-align: center; color: #999; font-size: 13; margin: 20; }
</style>
