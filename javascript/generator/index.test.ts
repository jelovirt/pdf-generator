import { getInitStore } from '../app/Model';
import Generator from './index';
import JSZip from 'jszip';

describe('Generator', () => {
  const generator = new Generator({ ...getInitStore(), id: 'x' });
  it('should generate ZIP', async () => {
    const zip = new JSZip();
    generator.generate_plugin(zip);
    const zipData = await zip.generateAsync({
      type: 'uint8array',
    });

    // expect(zipData.length).toBe(144077);
    const act = await JSZip.loadAsync(zipData);

    expect(new Set(Object.keys(act.files))).toStrictEqual(
      new Set([
        'x/',
        'x/integrator.xml',
        'x/plugin.xml',
        'x/cfg/',
        'x/cfg/catalog.xml',
        'x/xsl/',
        'x/xsl/fo/',
        'x/xsl/fo/front-matter.xsl',
        'x/xsl/fo/commons.xsl',
        'x/xsl/fo/tables.xsl',
        'x/xsl/fo/toc.xsl',
        'x/xsl/fo/topic.xsl',
        'x/xsl/fo/links.xsl',
        'x/xsl/fo/lists.xsl',
        'x/xsl/fo/pr-domain.xsl',
        'x/xsl/fo/static-content.xsl',
        'x/cfg/fo/',
        'x/cfg/fo/layout-masters.xsl',
        'x/cfg/fo/attrs/',
        'x/cfg/fo/attrs/front-matter-attr.xsl',
        'x/cfg/fo/attrs/commons-attr.xsl',
        'x/cfg/fo/attrs/layout-masters-attr.xsl',
        'x/cfg/fo/attrs/static-content-attr.xsl',
        'x/cfg/fo/attrs/tables-attr.xsl',
        'x/cfg/fo/attrs/toc-attr.xsl',
        'x/cfg/fo/attrs/topic-attr.xsl',
        'x/cfg/fo/attrs/basic-settings.xsl',
        'x/cfg/fo/attrs/links-attr.xsl',
        'x/cfg/fo/attrs/lists-attr.xsl',
        'x/cfg/fo/attrs/pr-domain-attr.xsl',
        'x/xsl/fo/topic2fo_shell_fop.xsl',
        'x/cfg/common/',
        'x/cfg/common/vars/',
        'x/cfg/common/vars/de.xml',
        'x/cfg/common/vars/en.xml',
        'x/cfg/common/vars/es.xml',
        'x/cfg/common/vars/fi.xml',
        'x/cfg/common/vars/fr.xml',
        'x/cfg/common/vars/he.xml',
        'x/cfg/common/vars/it.xml',
        'x/cfg/common/vars/ja.xml',
        'x/cfg/common/vars/nl.xml',
        'x/cfg/common/vars/ro.xml',
        'x/cfg/common/vars/ru.xml',
        'x/cfg/common/vars/sv.xml',
        'x/cfg/common/vars/zh_CN.xml',
      ])
    );
  });
});
