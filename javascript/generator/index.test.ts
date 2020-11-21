import { getInitStore } from '../app/Model';
import Generator from './index';

describe('Generator', () => {
  const generator = new Generator({ ...getInitStore(), id: 'x' });
  it('should ', async () => {
    // await generator
    //     .generate_plugin()
    //     .then((zipData) =>
    //         expect(1).toBe(1)
    //         // FileSaver.saveAs(zipData, `${store.getState().id}.zip`)
    //     );
    expect(1).toBe(1);
  });
  // it('should ', async () => {
  //   const zipData = await generator.generate_plugin();
  //   expect(1).toBe(1);
  // });
});
