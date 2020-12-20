import { promisify } from 'util';
import fs from 'fs';
import child_process from 'child_process';
// import { https } from 'follow-redirects';
import JSZip from 'jszip';
import { unzip } from './utils';
import { getInitStore, OtVersion } from '../javascript/app/Model';
import Generator from '../javascript/generator/index';

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const getProcess = (version: OtVersion, ...args: string[]) =>
  new Promise((resolve, reject) => {
    const command = [`temp/dita-ot-${version}/bin/dita`].concat(args).join(' ');
    const ps = child_process
      .exec(command)
      .on('error', reject)
      .on('exit', resolve);
    if (args.includes('-v')) {
      ps.stdout?.pipe(process.stdout);
    }
    ps.stderr?.pipe(process.stderr);
  });

const generatePlugin = async (version: OtVersion) => {
  const zip = new JSZip();
  const generator = new Generator({
    ...getInitStore(),
    id: 'x',
    transtype: 'x',
    ot_version: version,
  });
  generator.generate_plugin(zip);
  await new Promise((resolve, reject) => {
    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(`temp/out-${version}.zip`))
      .on('error', reject)
      .on('finish', resolve);
  });
};

// const getDitaOt = async (version: OtVersion) => {
//   if (!(await exists(`temp/dita-ot-${version}`))) {
//     const file = fs.createWriteStream(`temp/dita-ot-${version}.zip`);
//     const request = await new Promise((resolve, reject) =>
//       https.get(
//         `https://github.com/dita-ot/dita-ot/releases/download/${version}/dita-ot-${version}.zip`,
//         (response) => {
//           response.pipe(file).on('finish', resolve).on('error', reject);
//         }
//       )
//     );
//     const data = await readFile(`temp/dita-ot-${version}.zip`);
//     await unzip(data, `temp/dita-ot-${version}`);
//   }
// };

describe('DITA-OT', () => {
  describe(`version 2.5`, () => {
    const version: OtVersion = '2.5';
    const out = `temp/dita-ot-${version}/out`;
    const pdf = `${out}/root.pdf`;
    jest.setTimeout(30000);
    beforeAll(async () => {
      // await getDitaOt(version);
      await generatePlugin(version);
      await getProcess(version, '--uninstall', 'x').catch((err) => err);
      await getProcess(version, '--install', `temp/out-${version}.zip`);
      if (await exists(pdf)) {
        await unlink(pdf);
      }
    });
    it('should generate PDF', async () => {
      const exitCode = await getProcess(
        version,
        '-i',
        'test/root.ditamap',
        '-o',
        out,
        '-f',
        'x'
      );
      expect(exitCode).toBe(0);
      expect(await exists(pdf)).toBe(true);
    });
  });
  describe(`version 3.0`, () => {
    const version: OtVersion = '3.0';
    const out = `temp/dita-ot-${version}/out`;
    const pdf = `${out}/root.pdf`;
    jest.setTimeout(30000);
    beforeAll(async () => {
      // await getDitaOt(version);
      await generatePlugin(version);
      await getProcess(version, '--uninstall', 'x').catch((err) => err);
      await getProcess(version, '--install', `temp/out-${version}.zip`);
      if (await exists(pdf)) {
        await unlink(pdf);
      }
    });
    it('should generate PDF', async () => {
      const exitCode = await getProcess(
        version,
        '-i',
        'test/root.ditamap',
        '-o',
        out,
        '-f',
        'x'
      );
      expect(exitCode).toBe(0);
      expect(await exists(pdf)).toBe(true);
    });
  });
  describe(`version 3.5`, () => {
    const version: OtVersion = '3.5';
    const out = `temp/dita-ot-${version}/out`;
    const pdf = `${out}/root.pdf`;
    jest.setTimeout(30000);
    beforeAll(async () => {
      // await getDitaOt(version);
      await generatePlugin(version);
      await getProcess(version, 'uninstall', 'x').catch((err) => err);
      await getProcess(version, 'install', `temp/out-${version}.zip`);
      if (await exists(pdf)) {
        await unlink(pdf);
      }
    });
    it('should generate PDF', async () => {
      const exitCode = await getProcess(
        version,
        '-i',
        'test/root.ditamap',
        '-o',
        out,
        '-f',
        'x'
      );
      expect(exitCode).toBe(0);
      expect(await exists(pdf)).toBe(true);
    });
  });
  describe(`version 3.6`, () => {
    const version: OtVersion = '3.6';
    const out = `temp/dita-ot-${version}/out`;
    const pdf = `${out}/root.pdf`;
    jest.setTimeout(30000);
    beforeAll(async () => {
      // await getDitaOt(version);
      await generatePlugin(version);
      await getProcess(version, 'uninstall', 'x').catch((err) => err);
      await getProcess(version, 'install', `temp/out-${version}.zip`);
      if (await exists(pdf)) {
        await unlink(pdf);
      }
    });
    it('should generate PDF', async () => {
      const exitCode = await getProcess(
        version,
        '-i',
        'test/root.ditamap',
        '-o',
        out,
        '-f',
        'x'
      );
      expect(exitCode).toBe(0);
      expect(await exists(pdf)).toBe(true);
    });
  });
});
