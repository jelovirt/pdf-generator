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

      <axsl:attribute-set name="apiname">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-apiname'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="codeph">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-codeph'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="option">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-option'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="parmname">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-parmname'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="parml">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-parml'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="plentry">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-plentry'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="pt">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-pt'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="pd">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-pd'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="synph">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-synph'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="syntaxdiagram">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-syntaxdiagram'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="groupseq">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-groupseq'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="groupchoice">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-groupchoice'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="groupcomp">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-groupcomp'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="fragment">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-fragment'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="fragref">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-fragref'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="synblk">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-synblk'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="synnote">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-synnote'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="synnoteref">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-synnoteref'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="kwd">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-kwd'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="var">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-var'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="oper">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-oper'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="delim">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-delim'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="sep">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-sep'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="repsep">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-repsep'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>