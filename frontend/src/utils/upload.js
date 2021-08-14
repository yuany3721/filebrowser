import store from "@/store";
import url from "@/utils/url";

export function checkConflict(files, items) {
  if (typeof items === "undefined" || items === null) {
    items = [];
  }

  let folder_upload = files[0].fullPath !== undefined;

  let conflict = false;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let name = file.name;

    if (folder_upload) {
      let dirs = file.fullPath.split("/");
      if (dirs.length > 1) {
        name = dirs[0];
      }
    }

    let res = items.findIndex(function hasConflict(element) {
      return element.name === this;
    }, name);

    if (res >= 0) {
      conflict = true;
      break;
    }
  }

  return conflict;
}

export function scanFiles(dt) {
  return new Promise((resolve) => {
    let reading = 0;
    const contents = [];

    if (dt.items !== undefined) {
      for (let item of dt.items) {
        if (
          item.kind === "file" &&
          typeof item.webkitGetAsEntry === "function"
        ) {
          const entry = item.webkitGetAsEntry();
          readEntry(entry);
        }
      }
    } else {
      resolve(dt.files);
    }

    function readEntry(entry, directory = "") {
      if (entry.isFile) {
        reading++;
        entry.file((file) => {
          reading--;

          file.fullPath = `${directory}${file.name}`;
          contents.push(file);

          if (reading === 0) {
            resolve(contents);
          }
        });
      } else if (entry.isDirectory) {
        const dir = {
          isDir: true,
          size: 0,
          fullPath: `${directory}${entry.name}`,
        };

        contents.push(dir);

        readReaderContent(entry.createReader(), `${directory}${entry.name}`);
      }
    }

    function readReaderContent(reader, directory) {
      reading++;

      reader.readEntries(function (entries) {
        reading--;
        if (entries.length > 0) {
          for (const entry of entries) {
            readEntry(entry, `${directory}/`);
          }

          readReaderContent(reader, `${directory}/`);
        }

        if (reading === 0) {
          resolve(contents);
        }
      });
    }
  });
}

export function handleFiles(files, base, overwrite = false) {
  for (let i = 0; i < files.length; i++) {
    let id = store.state.upload.id;
    let path = base;
    let file = files[i];

    if (file.fullPath !== undefined) {
      path += url.encodePath(file.fullPath);
    } else {
      path += url.encodeRFC5987ValueChars(file.name);
    }

    if (file.isDir) {
      path += "/";
    }

    const item = {
      id,
      path,
      file,
      overwrite,
    };

    store.dispatch("upload/upload", item);
  }
}

export function backupFiles(files) {
  for (let i = 0; i < files.length; i++) {
    let id = store.state.upload.id;
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let dateStr =
      year + (month < 10 ? "0" + month : month) + (day < 10 ? "0" + day : day);
    let path = "/files/" + dateStr + "bak/";
    let file = files[i];

    // TODO not included in i18n
    if (file.type.indexOf("video") != -1) {
      path += "video/";
    } else if (file.type.indexOf("image") != -1) {
      path += "img/";
    } else if (file.type.indexOf("text/plain") != -1) {
      path += "txt/";
    } else if (file.type.indexOf("application/pdf") != -1) {
      path += "pdf/";
    } else if (file.type.indexOf("application/vnd.ms-powerpoint") != -1) {
      path += "ppt/";
    } else if (file.type.indexOf("application/msword") != -1) {
      path += "word/";
    } else if (
      file.type.indexOf("application/vnd.ms-excel") != -1 ||
      file.type.indexOf(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) != -1
    ) {
      path += "excel/";
    }

    path += url.encodeRFC5987ValueChars(file.name);
    const item = {
      id,
      path,
      file,
      overwrite: true,
    };

    store.dispatch("upload/upload", item);
  }
}
