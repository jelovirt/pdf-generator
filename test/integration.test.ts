import fs from 'fs';
import child_process from 'child_process';
import JSZip from 'jszip';
import { getInitStore, OtVersion } from '../javascript/app/Model';
import Generator from '../javascript/generator/index';

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

const exists = async (path: string) =>
  await new Promise((resolve, reject) =>
    fs.access(path, fs.constants.F_OK, (err) => resolve(!err))
  );

describe('DITA-OT', () => {
  describe(`version 3.0`, () => {
    const version: OtVersion = '3.0';
    jest.setTimeout(30000);
    beforeAll(async () => {
      await generatePlugin(version);
      await getProcess(version, '--uninstall', 'x');
      await getProcess(version, '--install', `temp/out-${version}.zip`);
    });
    it('should generate PDF', async () => {
      const exitCode = await getProcess(
        version,
        '-i',
        'test/root.ditamap',
        '-o',
        `temp/dita-ot-${version}/out`,
        '-f',
        'x'
      );
      expect(exitCode).toBe(0);
      expect(await exists('temp/root.pdf')).toBe(true);
    });
  });
  describe(`version 3.6`, () => {
    const version: OtVersion = '3.5';
    jest.setTimeout(30000);
    beforeAll(async () => {
      await generatePlugin(version);
      await getProcess(version, 'uninstall', 'x');
      await getProcess(version, 'install', `temp/out-${version}.zip`);
    });
    it('should generate PDF', async () => {
      const exitCode = await getProcess(
        version,
        '-i',
        'test/root.ditamap',
        '-o',
        `temp/dita-ot-${version}/out`,
        '-f',
        'x'
      );
      expect(exitCode).toBe(0);
      expect(await exists('temp/root.pdf')).toBe(true);
    });
  });
});
