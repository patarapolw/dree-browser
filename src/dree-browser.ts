import "./dree-browser.scss";
import { Dree } from "dree";
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js';

export interface IDreeBrowserOptions {
  colWidth?: number;
  fileContentWidth?: number;
  on?: {
    file?: (d: Dree) => void;
    folder?: (d: Dree) => void;
  }
  fileContent?: (d: Dree) => string;
  iconPath?: string;
}

export default class DreeBrowser {
  private el: HTMLElement;
  private dree: Dree;
  private options: IDreeBrowserOptions;

  constructor(el: HTMLElement, dree: Dree, options: IDreeBrowserOptions = {}) {
    this.el = el;
    this.el.classList.add("dree-browser");
    this.options = options;
    this.options.iconPath = this.options.iconPath || "https://dderevjanik.github.io/vscode-icons-js-example/icons";

    this.dree = dree;
    if (this.dree.children) {
      this.buildColumn(this.dree.children, 0);
    }
  }

  private buildColumn(ds: Dree[], depth: number) {
    const ulDiv = document.createElement("div");

    for (const n of Array.from(this.el.childNodes)) {
      if (n instanceof HTMLDivElement) {
        if (n.classList.contains("file-content")) {
          this.el.removeChild(n);
        }
      }
    };
    
    this.addOrReplaceColumn(ulDiv, depth, "column");

    const ul = document.createElement("ul");
    ulDiv.append(ul);

    for (const d of ds.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      } else {
        return a.type === "directory" ? -1 : 1;
      }
    })) {
      const item = document.createElement("li");
      item.classList.add("item");

      if (d.type === "directory") {
        const icon1 = document.createElement("img");
        icon1.classList.add("icon");
        icon1.classList.add("folder-closed");
        icon1.src = this.options.iconPath + "/" + getIconForFolder(d.name);
        item.append(icon1);

        const icon2 = document.createElement("img");
        icon2.classList.add("icon");
        icon2.classList.add("folder-open");
        icon2.style.display = "none";
        icon2.src = this.options.iconPath + "/" + getIconForOpenFolder(d.name);
        item.append(icon2);
      } else {
        const icon1 = document.createElement("img");
        icon1.classList.add("icon");
        const icon = getIconForFile(d.name);
        if (icon) {
          icon1.src = this.options.iconPath + "/" + icon;
        }
        item.append(icon1);
      }

      const span = document.createElement("span");
      span.innerText = d.name;
      item.append(span);

      item.addEventListener("click", () => {
        if (d.children) {
          if (this.options.on && this.options.on.folder) {
            this.options.on.folder(d);
          }

          this.el.childNodes.forEach((n) => {
            if (n instanceof HTMLImageElement) {
              if (n.classList.contains("folder-open")) {
                n.style.display === "none";
              }
              if (n.classList.contains("folder-closed")) {
                n.style.display === "inline-block";
              }
            }
          })

          item.childNodes.forEach((n) => {
            if (n instanceof HTMLImageElement) {
              if (n.classList.contains("folder-closed")) {
                n.style.display === "none";
              }
            }
          })

          this.buildColumn(d.children, depth + 1);
        } else {
          if (this.options.on && this.options.on.file) {
            this.options.on.file(d);
          }
          if (this.options.fileContent) {
            const col = document.createElement("div");
            col.innerHTML = this.options.fileContent(d);

            this.addOrReplaceColumn(col, 0, "file-content");
          }
        }
      });

      ul.append(item);
    }
  }

  private addOrReplaceColumn(item: HTMLElement, depth: number, filterClass: string) {
    let i = 0;
    let isInserted = false;

    for (const n of Array.from(this.el.childNodes)) {
      if (n instanceof HTMLDivElement) {
        if (n.classList.contains(filterClass)) {
          if (depth === i) {
            n.replaceChild(item, n.childNodes[0]);
            isInserted = true;
          } else if (i > depth) {
            this.el.removeChild(n);
          }
          i++;
        }
      }
    };

    if (!isInserted) {
      const col = document.createElement("div");
      col.classList.add(filterClass);
      if (filterClass === "file-content") {
        if (this.options.fileContentWidth) {
          col.style.flexBasis = `${this.options.fileContentWidth}px`;
        }
      } else {
        if (this.options.colWidth) {
          col.style.flexBasis = `${this.options.colWidth}px`;
        }
      }

      col.append(item);
      this.el.append(col);
    }
  }
}
