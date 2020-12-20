import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { promisify } from 'util';
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export const unzip = async (data: Buffer, dst: string) => {
  const contents = await JSZip.loadAsync(data);
  const promises = Object.keys(contents.files).map(
    (filename) =>
      new Promise((resolve, reject) => {
        const file = contents.file(filename);
        if (file) {
          file
            .async('nodebuffer')
            .then((content) => {
              const file = `${dst}/${filename}`;
              const parent = path.dirname(filename);
              return mkdir(parent, { recursive: true }).then(() =>
                writeFile(file, content)
              );
            })
            .then(resolve)
            .catch(reject);
        } else {
          resolve();
        }
      })
  );
  await Promise.all(promises);
};
