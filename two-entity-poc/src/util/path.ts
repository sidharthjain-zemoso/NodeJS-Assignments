import path from "path";

let rootDir: string = "";

if (require != undefined && require.main != undefined) {
  rootDir = path.dirname(require.main.filename);
}

export default rootDir;
