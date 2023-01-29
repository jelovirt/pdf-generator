<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                exclude-result-prefixes="axsl map array">

  <xsl:import href="utils.xsl"/>

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="no"/>

  <xsl:template match=".[. instance of map(*)]">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <xsl:if test="$root ?style-codeblock-line-numbering">
        <axsl:template match="node()" mode="codeblock.generate-line-number" as="xs:boolean">
          <axsl:sequence select="true()"/>
        </axsl:template>
      </xsl:if>
      <xsl:if test="$root ?style-codeblock-show-whitespace">
        <axsl:template match="node()" mode="codeblock.show-whitespace" as="xs:boolean">
          <axsl:sequence select="true()"/>
        </axsl:template>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:attribute-set name="codeblock">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-codeblock'"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <xsl:for-each select="('apiname', 'codeph', 'option', 'parmname', 'parml', 'plentry', 'pt', 'pd', 'synph',
                             'syntaxdiagram', 'groupseq', 'groupchoice', 'groupcomp', 'fragment', 'fragref', 'synblk',
                             'synnote', 'synnoteref', 'kwd', 'var', 'oper', 'delim', 'sep', 'repsep')">
        <axsl:attribute-set name="{.}">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="concat('style-', .)"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:for-each>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>