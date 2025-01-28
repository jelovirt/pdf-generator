<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                exclude-result-prefixes="xs axsl map array">

  <xsl:import href="utils.xsl"/>

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="no"/>

  <xsl:variable name="ot-version" select="number($version)"/>

  <xsl:template match=".[. instance of map(*)]">
    <xsl:variable name="plugin_name">
      <xsl:choose>
        <xsl:when test="exists($root ?plugin-name[normalize-space()])">
          <xsl:value-of select="concat('plugin:', $root ?plugin-name, ':')"/>
        </xsl:when>
        <xsl:when test="exists($root ?id[normalize-space()])">
          <xsl:value-of select="concat('plugin:', $root ?id, ':')"/>
        </xsl:when>
        <xsl:otherwise>../../</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="extendsDefault" as="xs:boolean"
                  select="map:contains($root, 'extends-default') and $root ?extends-default"/>
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:import href="plugin:org.dita.base:xsl/common/dita-utilities.xsl"/>
      <axsl:import href="plugin:org.dita.base:xsl/common/dita-textonly.xsl"/>
      <axsl:import href="plugin:org.dita.base:xsl/common/related-links.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/common/attr-set-reflection.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/common/vars.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/basic-settings.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/basic-settings.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/layout-masters-attr.xsl"/>
      <xsl:if test="$formatter = 'xep'">
        <axsl:import href="plugin:org.dita.pdf2.xep:cfg/fo/attrs/layout-masters-attr_xep.xsl"/>
      </xsl:if>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/layout-masters-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/layout-masters.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/layout-masters.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/links-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/links-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/links.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/links.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/lists-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/lists-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/lists.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/lists.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/tables-attr.xsl"/>
      <xsl:choose>
        <xsl:when test="$formatter = 'ah'">
          <axsl:import href="plugin:org.dita.pdf2.axf:cfg/fo/attrs/tables-attr_axf.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'fop'">
          <axsl:import href="plugin:org.dita.pdf2.fop:cfg/fo/attrs/tables-attr_fop.xsl"/>
        </xsl:when>
      </xsl:choose>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/tables-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/tables.xsl"/>
      <xsl:if test="$formatter = 'fop'">
        <axsl:import href="plugin:org.dita.pdf2.fop:xsl/fo/tables_fop.xsl"/>
      </xsl:if>
      <axsl:import href="{$plugin_name}xsl/fo/tables.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/root-processing.xsl"/>
      <xsl:choose>
        <xsl:when test="$formatter = 'ah'">
          <axsl:import href="plugin:org.dita.pdf2.axf:xsl/fo/root-processing_axf.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'fop'">
          <axsl:import href="plugin:org.dita.pdf2.fop:xsl/fo/root-processing_fop.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'xep'">
          <axsl:import href="plugin:org.dita.pdf2.xep:xsl/fo/root-processing_xep.xsl"/>
        </xsl:when>
      </xsl:choose>

      <xsl:if test="$ot-version ge 3.5">
        <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/topic-attr.xsl"/>
      </xsl:if>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/topic-attr.xsl"/>
      <xsl:if test="$ot-version ge 3.5">
        <xsl:choose>
          <xsl:when test="$formatter = 'ah'">
            <axsl:import href="plugin:org.dita.pdf2.axf:xsl/fo/topic_axf.xsl"/>
          </xsl:when>
          <xsl:when test="$formatter = 'fop'">
            <axsl:import href="plugin:org.dita.pdf2.fop:xsl/fo/topic_fop.xsl"/>
          </xsl:when>
          <xsl:when test="$formatter = 'xep'">
            <axsl:import href="plugin:org.dita.pdf2.xep:xsl/fo/topic_xep.xsl"/>
          </xsl:when>
        </xsl:choose>
        <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/concept-attr.xsl"/>
      </xsl:if>
      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/commons-attr.xsl"/>
      <xsl:choose>
        <xsl:when test="$formatter = 'fop'">
          <axsl:import href="plugin:org.dita.pdf2.fop:cfg/fo/attrs/commons-attr_fop.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'xep'">
          <axsl:import href="plugin:org.dita.pdf2.xep:cfg/fo/attrs/commons-attr_xep.xsl"/>
        </xsl:when>
      </xsl:choose>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/commons-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/commons.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/topic.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/commons.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/toc-attr.xsl"/>
      <xsl:choose>
        <xsl:when test="$formatter = 'ah'">
          <axsl:import href="plugin:org.dita.pdf2.axf:cfg/fo/attrs/toc-attr_axf.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'fop' and $ot-version le 3.4">
          <axsl:import href="plugin:org.dita.pdf2.fop:cfg/fo/attrs/toc-attr_fop.xsl"/>
        </xsl:when>
      </xsl:choose>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/toc-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/toc.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/toc.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/bookmarks.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/index-attr.xsl"/>
      <xsl:choose>
        <xsl:when test="$formatter = 'ah'">
          <axsl:import href="plugin:org.dita.pdf2.axf:cfg/fo/attrs/index-attr_axf.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'xep' and $ot-version ge 3.5">
          <axsl:import href="plugin:org.dita.pdf2.xep:cfg/fo/attrs/index-attr_xep.xsl"/>
        </xsl:when>
      </xsl:choose>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/index.xsl"/>
      <xsl:choose>
        <xsl:when test="$formatter = 'ah'">
          <axsl:import href="plugin:org.dita.pdf2.axf:xsl/fo/index_axf.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'fop'">
          <axsl:import href="plugin:org.dita.pdf2.fop:xsl/fo/index_fop.xsl"/>
        </xsl:when>
        <xsl:when test="$formatter = 'xep'">
          <axsl:import href="plugin:org.dita.pdf2.xep:xsl/fo/index_xep.xsl"/>
        </xsl:when>
      </xsl:choose>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/front-matter-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/front-matter-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/front-matter.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/front-matter.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/preface.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/map-elements-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/map-elements.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/task-elements-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/task-elements-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/task-elements.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/task-elements.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/reference-elements-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/reference-elements.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/sw-domain-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/sw-domain-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/sw-domain.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/pr-domain-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/pr-domain-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/pr-domain.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/pr-domain.xsl"/>
      <xsl:if test="not($extendsDefault)">
        <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/hi-domain-attr.xsl"/>
      </xsl:if>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/hi-domain-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/hi-domain.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/hi-domain.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/ui-domain-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/ui-domain-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/ui-domain.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/ut-domain.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/abbrev-domain.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/markup-domain-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/markup-domain-attr.xsl"/>

      <xsl:if test="not($extendsDefault)">
        <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/xml-domain-attr.xsl"/>
      </xsl:if>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/xml-domain-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/markup-domain.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/xml-domain.xsl"/>
      <xsl:if test="$ot-version ge 3.5">
        <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/svg-domain-attr.xsl"/>
        <axsl:import href="plugin:org.dita.pdf2:xsl/fo/svg-domain.xsl"/>

        <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/hazard-d-attr.xsl"/>
        <axsl:import href="{$plugin_name}cfg/fo/attrs/hazard-d-attr.xsl"/>
        <axsl:import href="plugin:org.dita.pdf2:xsl/fo/hazard-d.xsl"/>
        <axsl:import href="{$plugin_name}xsl/fo/hazard-d.xsl"/>
      </xsl:if>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/static-content-attr.xsl"/>
      <axsl:import href="{$plugin_name}cfg/fo/attrs/static-content-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/static-content.xsl"/>
      <axsl:import href="{$plugin_name}xsl/fo/static-content.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/glossary-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/glossary.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/lot-lof-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/lot-lof.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:cfg/fo/attrs/learning-elements-attr.xsl"/>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/learning-elements.xsl"/>

      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/flagging.xsl"/>
      <xsl:if test="$formatter = 'fop' and $ot-version le 3.4">
        <axsl:import href="plugin:org.dita.pdf2.fop:xsl/fo/flagging_fop.xsl"/>
      </xsl:if>
      <axsl:import href="plugin:org.dita.pdf2:xsl/fo/flagging-from-preprocess.xsl"/>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>