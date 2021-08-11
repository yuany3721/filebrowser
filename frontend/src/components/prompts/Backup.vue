<template>
<!-- 未加入i18n -->
  <div class="card floating">
    <div class="card-title">
      <h2>备份</h2>
    </div>

    <div class="card-content">
      <p>请选择备份内容</p>
    </div>

    <div class="card-action full">
      <div @click="uploadFile" class="action">
        <i class="material-icons">insert_drive_file</i>
        <div class="title">File</div>
      </div>
      <div @click="uploadFolder" class="action">
        <i class="material-icons">folder</i>
        <div class="title">Folder</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "backup",
  methods: {
    uploadFile: function () {
      document.getElementById("upload-input").value = "";
      document.getElementById("upload-input").click();
    },
    uploadFolder: function () {
      document.getElementById("upload-folder-input").value = "";
      document.getElementById("upload-folder-input").click();
    },
  },
};
</script>
