import DreeBrowser from "./dree-browser";
import { Dree } from "dree";

declare const DREE: Dree;

const db = new DreeBrowser(document.getElementById("App")!, DREE, {
  on: {
    file: console.log,
    folder: console.log
  },
  fileContent(d) {
    return `<pre>${JSON.stringify(d, null, 2)}</pre>`;
  }
});
