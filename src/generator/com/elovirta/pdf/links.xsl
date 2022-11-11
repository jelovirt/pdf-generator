<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                exclude-result-prefixes="axsl map array">

  <xsl:import href="utils.xsl"/>

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="yes"/>

  <xsl:template match=".[. instance of map(*)]">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>

      <xsl:comment>Link</xsl:comment>
      <axsl:template match="*[contains(@class,' topic/xref ')][not(@type = 'fn')]" name="topic.xref">
        <fo:inline>
          <axsl:call-template name="commonattributes"/>
        </fo:inline>
        <axsl:variable name="destination" select="opentopic-func:getDestinationId(@href)"/>
        <axsl:variable name="element" select="key('key_anchor',$destination)[1]"/>
        <axsl:variable name="referenceTitle" as="node()*">
          <axsl:apply-templates select="." mode="insertReferenceTitle">
            <axsl:with-param name="href" select="@href"/>
            <axsl:with-param name="titlePrefix" select="''"/>
            <axsl:with-param name="destination" select="$destination"/>
            <axsl:with-param name="element" select="$element"/>
          </axsl:apply-templates>
        </axsl:variable>
        <fo:basic-link axsl:use-attribute-sets="xref">
          <axsl:call-template name="buildBasicLinkDestination">
            <axsl:with-param name="scope" select="@scope"/>
            <axsl:with-param name="format" select="@format"/>
            <axsl:with-param name="href" select="@href"/>
          </axsl:call-template>
          <axsl:choose>
            <axsl:when test="not(@scope = 'external' or @format = 'html')">
              <axsl:choose>
                <axsl:when test="exists($referenceTitle) and exists(processing-instruction('ditaot')[. = 'usertext'])">
                  <axsl:copy-of select="$referenceTitle"/>
                </axsl:when>
                <axsl:when test="exists($referenceTitle)">
                  <axsl:call-template name="e:insertPageNumberCitation">
                    <axsl:with-param name="referenceTitle" select="$referenceTitle"/>
                    <axsl:with-param name="isTitleEmpty" select="false()"/>
                    <axsl:with-param name="destination" select="$destination"/>
                    <axsl:with-param name="element" select="$element"/>
                  </axsl:call-template>
                </axsl:when>
                <axsl:otherwise>
                  <axsl:call-template name="e:insertPageNumberCitation">
                    <axsl:with-param name="isTitleEmpty" select="true()"/>
                    <axsl:with-param name="destination" select="$destination"/>
                    <axsl:with-param name="element" select="$element"/>
                  </axsl:call-template>
                </axsl:otherwise>
              </axsl:choose>
            </axsl:when>
            <axsl:otherwise>
              <axsl:choose>
                <axsl:when test="exists(*[not(contains(@class,' topic/desc '))] | text()) and
                                 exists(processing-instruction('ditaot')[. = 'usertext'])">
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'link-external'"/>
                    <axsl:with-param name="params">
                      <link-text>
                        <axsl:apply-templates select="*[not(contains(@class,' topic/desc '))] | text()"/>
                      </link-text>
                      <url>
                        <axsl:value-of select="e:format-link-url(@href)"/>
                      </url>
                    </axsl:with-param>
                  </axsl:call-template>
                </axsl:when>
                <axsl:otherwise>
                  <axsl:value-of select="e:format-link-url(@href)"/>
                </axsl:otherwise>
              </axsl:choose>
            </axsl:otherwise>
          </axsl:choose>
        </fo:basic-link>
      </axsl:template>

      <axsl:template match="*[contains(@class,' topic/link ')][not(empty(@href) or @href = '')]" mode="processLink">
        <axsl:variable name="destination" select="opentopic-func:getDestinationId(@href)"/>
        <axsl:variable name="element" select="key('key_anchor',$destination, $root)[1]" as="element()?"/>

        <axsl:variable name="referenceTitle" as="node()*">
          <axsl:apply-templates select="." mode="insertReferenceTitle">
            <axsl:with-param name="href" select="@href"/>
            <axsl:with-param name="titlePrefix" select="''"/>
            <axsl:with-param name="destination" select="$destination"/>
            <axsl:with-param name="element" select="$element"/>
          </axsl:apply-templates>
        </axsl:variable>
        <axsl:variable name="linkScope" as="xs:string">
          <axsl:call-template name="getLinkScope"/>
        </axsl:variable>

        <fo:block axsl:use-attribute-sets="link">
          <fo:inline axsl:use-attribute-sets="link__content">
            <fo:basic-link>
              <axsl:call-template name="buildBasicLinkDestination">
                <axsl:with-param name="scope" select="$linkScope"/>
                <axsl:with-param name="href" select="@href"/>
              </axsl:call-template>
              <axsl:choose>
                <axsl:when test="not($linkScope = 'external') and exists($referenceTitle)">
                  <axsl:call-template name="e:insertPageNumberCitation">
                    <axsl:with-param name="referenceTitle" select="$referenceTitle"/>
                    <axsl:with-param name="isTitleEmpty" select="false()"/>
                    <axsl:with-param name="destination" select="$destination"/>
                    <axsl:with-param name="element" select="$element"/>
                  </axsl:call-template>
                </axsl:when>
                <axsl:when test="not($linkScope = 'external')">
                  <axsl:call-template name="e:insertPageNumberCitation">
                    <axsl:with-param name="isTitleEmpty" select="true()"/>
                    <axsl:with-param name="destination" select="$destination"/>
                    <axsl:with-param name="element" select="$element"/>
                  </axsl:call-template>
                </axsl:when>
                <axsl:when test="*[contains(@class, ' topic/linktext ')]">
                  <axsl:apply-templates select="*[contains(@class, ' topic/linktext ')]"/>
                </axsl:when>
                <axsl:otherwise>
                  <axsl:value-of select="e:format-link-url(@href)"/>
                </axsl:otherwise>
              </axsl:choose>
            </fo:basic-link>
          </fo:inline>
          <axsl:call-template name="insertLinkShortDesc">
            <axsl:with-param name="destination" select="$destination"/>
            <axsl:with-param name="element" select="$element"/>
            <axsl:with-param name="linkScope" select="$linkScope"/>
          </axsl:call-template>
        </fo:block>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' topic/topic ')]" mode="retrieveReferenceTitle">
        <axsl:variable name="topicref" select="key('map-id', @id)[1]"/>
        <axsl:variable name="contents" as="node()*">
          <axsl:apply-templates select="$topicref[1]" mode="e:title-number"/>
        </axsl:variable>
        <axsl:if test="exists($contents)">
          <axsl:copy-of select="$contents"/>
          <axsl:text>
            <xsl:text> </xsl:text>
          </axsl:text>
        </axsl:if>
        <axsl:apply-templates select="*[contains(@class, ' topic/title ')]/node()"/>
      </axsl:template>

      <axsl:function name="e:format-link-url">
        <axsl:param name="href"/>
        <axsl:variable name="h" select="if (starts-with($href, 'http://')) then substring($href, 8) else $href"/>
        <axsl:value-of
            select="if (contains($h, '/') and substring-after($h, '/') = '') then substring($h, 0, string-length($h)) else $h"/>
      </axsl:function>

      <axsl:template name="e:insertPageNumberCitation">
        <axsl:param name="referenceTitle" as="node()*"/>
        <axsl:param name="isTitleEmpty" as="xs:boolean" select="false()"/>
        <axsl:param name="destination" as="xs:string"/>
        <axsl:param name="element" as="element()?"/>
        <axsl:choose>
          <axsl:when test="not($element) or ($destination = '')"/>
          <axsl:when test="$isTitleEmpty">
            <fo:inline>
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="'Page'"/>
                <axsl:with-param name="params">
                  <pagenum>
                    <fo:inline>
                      <fo:page-number-citation ref-id="{{$destination}}"/>
                    </fo:inline>
                  </pagenum>
                </axsl:with-param>
              </axsl:call-template>
            </fo:inline>
          </axsl:when>
          <axsl:otherwise>
            <fo:inline>
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="'link-local'"/>
                <axsl:with-param name="params">
                  <link-text>
                    <axsl:copy-of select="$referenceTitle"/>
                  </link-text>
                  <pagenum>
                    <fo:inline>
                      <fo:page-number-citation ref-id="{{$destination}}"/>
                    </fo:inline>
                  </pagenum>
                </axsl:with-param>
              </axsl:call-template>
            </fo:inline>
          </axsl:otherwise>
        </axsl:choose>
      </axsl:template>

      <axsl:template name="insertLinkShortDesc">
        <axsl:param name="destination"/>
        <axsl:param name="element"/>
        <axsl:param name="linkScope"/>
        <axsl:choose>
          <!-- User specified description (from map or topic): use that. -->
          <axsl:when test="*[contains(@class, ' topic/desc ')] and
                            processing-instruction()[name() = 'ditaot'][. = 'usershortdesc']">
            <fo:block axsl:use-attribute-sets="link__shortdesc">
              <axsl:apply-templates select="*[contains(@class, ' topic/desc ')]"/>
            </fo:block>
          </axsl:when>
          <!-- External: do not attempt to retrieve. -->
          <axsl:when test="$linkScope = 'external'">
          </axsl:when>
          <!-- When the target has a short description and no local override, use the target -->
          <axsl:when test="$element/*[contains(@class, ' topic/shortdesc ')]">
            <axsl:variable name="generatedShortdesc" as="node()*">
              <axsl:apply-templates select="$element/*[contains(@class, ' topic/shortdesc ')]/node()"/>
            </axsl:variable>
            <fo:block axsl:use-attribute-sets="link__shortdesc">
              <axsl:apply-templates select="$generatedShortdesc" mode="dropCopiedIds"/>
            </fo:block>
          </axsl:when>
        </axsl:choose>
      </axsl:template>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:attribute-set name="link__shortdesc">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-body'"/>
          <xsl:with-param name="properties" select="('space-after', 'start-indent')"/>
        </xsl:call-template>
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-link-desc'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>