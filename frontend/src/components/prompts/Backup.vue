<template>
<!-- TODO not included in i18n -->
  <div class="card floating">
    <div class="card-title">
      <h2>点击上传需要备份的内容</h2>
    </div>

    <div class="card-content">
      <p>注意：<br>备份中如果存在同名文件，新文件将直接覆盖旧文件</p>
    </div>

    <div class="card-action full">
      <div @click="backupFile" class="action">
        <i class="material-icons">insert_drive_file</i>
        <div class="title">文件</div>
      </div>
      <div @click="backupFolder" class="action">
        <i class="material-icons">folder</i>
        <div class="title">文件夹</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "backup",
  methods: {
    backupFile: function () {
      document.getElementById("backup-input").value = "";
      document.getElementById("backup-input").click();
    },
    backupFolder: function () {
      document.getElementById("backup-folder-input").value = "";
      document.getElementById("backup-folder-input").click();
    },
  },
};
</script>
