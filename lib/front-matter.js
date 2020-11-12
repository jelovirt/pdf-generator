'use strict';

import ET from './elementtree';
import { fo, xsl } from './utils';

function generate_custom(root, conf) {
  const cover_metadata_raw = `
  <xsl:template name="e:cover-image">
    <xsl:for-each select="($map//*[contains(@class, ' topic/data ')][@name = '${conf.cover_image_metadata}']/*[contains(@class, ' topic/image ')])[1]">
      <xsl:apply-templates select="." mode="placeImage">
        <xsl:with-param name="imageAlign" select="@align"/>
        <xsl:with-param name="href" select="if (@scope = 'external' or opentopic-func:isAbsolute(@href)) then @href else concat($input.dir.url, @href)"/>
        <xsl:with-param name="height" select="@height"/>
        <xsl:with-param name="width" select="@width"/>
      </xsl:apply-templates>
    </xsl:for-each>
  </xsl:template>
`;
  const cover_topic_raw = `
  <xsl:template name="e:cover-image">
    <xsl:for-each select="($map//*[contains(@class, ' map/topicref ')][@outputclass = '${conf.cover_image_topic}'])[1]">
      <xsl:apply-templates select="key('id', @id)/*[contains(@class, ' topic/body ')]/node()"/>
    </xsl:for-each>
  </xsl:template>
`;
  const cover_file_raw = `
  <xsl:template name="e:cover-image">
    <xsl:variable name="path">
      <xsl:call-template name="getVariable">
        <xsl:with-param name="id" select="'cover-image-path'"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:apply-templates select="." mode="placeImage">
      <xsl:with-param name="imageAlign" select="'center'"/>
      <xsl:with-param name="href" select="concat($artworkPrefix, $path)"/>
      <xsl:with-param name="height" select="()"/>
      <xsl:with-param name="width" select="()"/>
    </xsl:apply-templates>
  </xsl:template>
`;
  const cover_raw_2 = `
  <xsl:template name="createFrontCoverContents">
    <!-- set the title -->
    <fo:block xsl:use-attribute-sets="__frontmatter__title">
      <xsl:choose>
        <xsl:when test="$map/*[contains(@class,' topic/title ')][1]">
          <xsl:apply-templates select="$map/*[contains(@class,' topic/title ')][1]"/>
        </xsl:when>
        <xsl:when test="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]">
          <xsl:apply-templates select="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]"/>
        </xsl:when>
        <xsl:when test="//*[contains(@class, ' map/map ')]/@title">
          <xsl:value-of select="//*[contains(@class, ' map/map ')]/@title"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="/descendant::*[contains(@class, ' topic/topic ')][1]/*[contains(@class, ' topic/title ')]"/>
        </xsl:otherwise>
      </xsl:choose>
    </fo:block>
    <!-- set the subtitle -->
    <xsl:apply-templates select="$map//*[contains(@class,' bookmap/booktitlealt ')]"/>
    <fo:block xsl:use-attribute-sets="__frontmatter__owner">
      <xsl:apply-templates select="$map//*[contains(@class,' bookmap/bookmeta ')]"/>
    </fo:block>
    <!-- cover image -->
    <fo:block xsl:use-attribute-sets="image__block">
      <xsl:call-template name="e:cover-image"/>
    </fo:block>
  </xsl:template>
`;

  if (
    conf.cover_image_name ||
    conf.cover_image_metadata ||
    conf.cover_image_topic
  ) {
    root.append(ET.Comment('cover'));
    utils.copy_xml(root, cover_raw_2);
    //copy_xml(root, cover_contents_raw)
    if (conf.cover_image_name) {
      utils.copy_xml(root, cover_file_raw);
    } else if (conf.cover_image_metadata) {
      utils.copy_xml(root, cover_metadata_raw);
    } else if (conf.cover_image_topic) {
      utils.copy_xml(root, cover_topic_raw);
    }
  }
}

function generate_custom_attr(root, conf) {
  // if (stylesheet === "front-matter-attr" or not stylesheet) {
  // if (this.cover_image_name) {
  //     ET.SubElement(root, xsl('variable'), name="e:cover-image-path", select="concat($artworkPrefix, 'Customization/OpenTopic/common/artwork/%s'" % cover_image_name)
  // el
  // if (this.cover_image_metadata) {
  //    cover_image_path = ET.SubElement(root, xsl('variable'), name="e:cover-image-path", select="($map//*[contains(@class, ' topic/data ')][@name = '%s'])[1]/@href" % cover_image_metadata)
  //     cover_image_path = ET.SubElement(root, xsl('variable'), name="e:cover-image")
  //     ET.SubElement(cover_image_path, xsl('apply-templates'), select="($map//*[contains(@class, ' topic/data ')][@name = '%s']/*[contains(@class, ' topic/image ')])[1]" % cover_image_metadata, mode="e:cover-image")
}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr,
};
