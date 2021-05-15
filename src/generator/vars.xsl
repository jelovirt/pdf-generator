<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns="http://www.idiominc.com/opentopic/vars"
                xpath-default-namespace="http://www.idiominc.com/opentopic/vars"
                exclude-result-prefixes="axsl map array">

  <xsl:import href="utils.xsl"/>

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="yes"/>

  <xsl:variable name="style" select=". => map:get('style')" as="map(*)"/>
  
  <xsl:variable name="vars-all" as="element()*">
    <vars xml:lang="de">
      <variable id="blank_page">Diese Seite wurde absichtlich leer gelassen</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Abbildung: <param ref-name="title"/></variable>
      <variable id="Table">Tabelle: <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Anhang:&#xA0;</variable>
    </vars>
    <vars xml:lang="en">
      <variable id="blank_page">This page intentionally left blank</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure"><param ref-name="title"/></variable>
      <variable id="Table"><param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Appendix:&#xA0;</variable>
    </vars>
    <vars xml:lang="es">
      <variable id="blank_page">Esta página ha sido expresamente dejada en blanco</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Figura: <param ref-name="title"/></variable>
      <variable id="Table">Tabla: <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Ap&#xe9;ndice:&#xA0;</variable>
    </vars>
    <vars xml:lang="fi">
      <variable id="blank_page">Tämä sivu on tarkoituksellisesti jätetty tyhjäksi</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Kuva. <param ref-name="title"/></variable>
      <variable id="Table">Taulu. <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Liite</variable>
    </vars>
    <vars xml:lang="fr">
      <variable id="blank_page">Cette page a été volontairement laissée vide</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Illustration: <param ref-name="title"/></variable>
      <variable id="Table"><param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Annexe&#xA0;:&#xA0;</variable>
    </vars>
    <vars xml:lang="he">
      <variable id="blank_page">This page intentionally left blank</variable>
      <variable id="#table-continued">Table continued…</variable>
      <variable id="Figure">איור.<param ref-name="title"/></variable>
      <variable id="Table">טבלה.<param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">נספח</variable>
    </vars>
    <vars xml:lang="it">
      <variable id="blank_page">Questa pagina è stata lasciata intenzionalmente vuota</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Figura: <param ref-name="title"/></variable>
      <variable id="Table">Tabella: <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Appendice:&#xA0;</variable>
    </vars>
    <vars xml:lang="ja">
      <variable id="blank_page">このページは計画的にブランクを残ている</variable>
      <variable id="#table-continued">Table continued…</variable>
      <variable id="Figure">図 : <param ref-name="title"/></variable>
      <variable id="Table">表 : <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">付録 :</variable>
    </vars>
    <vars xml:lang="nl">
      <variable id="blank_page">Deze bladzijde werd met opzet blanco gelaten</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Figuur: <param ref-name="title"/></variable>
      <variable id="Table">Tabel: <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Bijlage:&#xA0;</variable>
    </vars>
    <vars xml:lang="ro">
      <variable id="blank_page">Aceasta pagina a fost lasata libera in mod intentionat</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Fig. <param ref-name="title"/></variable>
      <variable id="Table">Tabel. <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Anexa</variable>
    </vars>
    <vars xml:lang="ru">
      <variable id="blank_page">Эта страница нарочно оставлена пустой</variable>
      <variable id="#table-continued">Table continued…</variable>
      <variable id="Figure">Рисунок. <param ref-name="title"/></variable>
      <variable id="Table">Таблица. <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Приложение</variable>
    </vars>
    <vars xml:lang="sl">
      <variable id="blank_page">Tale stran je zanalačš pučšena prazna</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Slika: <param ref-name="title"/></variable>
      <variable id="Table">Tabela: <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Kazalo dodatka:&#xA0;</variable>
    </vars>
    <vars xml:lang="sv">
      <variable id="blank_page">Denna sida har avsiktligen lämnats blank</variable>
      <variable id="#table-continued">Table continued&#x2026;</variable>
      <variable id="Figure">Figur. <param ref-name="title"/></variable>
      <variable id="Table">Tabell. <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">Appendix</variable>
    </vars>
    <vars xml:lang="zh-CN">
      <variable id="blank_page">這頁故意地被留下空白</variable>
      <variable id="#table-continued">Table continued…</variable>
      <variable id="Figure">图: <param ref-name="title"/></variable>
      <variable id="Table">表: <param ref-name="title"/></variable>
      <variable id="Chapter with number"></variable>
      <variable id="Table of Contents Chapter"></variable>
      <variable id="Table of Contents Appendix">附录: </variable>
    </vars>
  </xsl:variable>

  <xsl:param name="lang"/>

  <xsl:template match=".[. instance of map(*)]">
    <xsl:variable name="vars" select="$vars-all[@xml:lang = $lang]" as="element()"/>
    <vars>
      <xsl:if test="$style ?link ?link-page-number">
<!--        <xsl:copy-of select="$vars/variable[@id = 'blank_page']"/>-->
        <variable id="On the page"/>
      </xsl:if>
      <xsl:if test=". ?table_continued">
        <xsl:copy-of select="$vars/variable[@id = '#table-continued']"/>
      </xsl:if>
      <xsl:if test="$style ?table ?caption-number = 'none'">
        <xsl:copy-of select="$vars/variable[@id = 'Table']"/>
      </xsl:if>
      <xsl:if test="$style ?fig ?caption-number = 'none'">
        <xsl:copy-of select="$vars/variable[@id = 'Figure']"/>
      </xsl:if>
      <xsl:if test="exists($style ?topic ?title-numbering) and not($style ?topic ?title-numbering)">
        <xsl:copy-of select="$vars/variable[@id = 'Table of Contents Chapter']"/>
        <xsl:copy-of select="$vars/variable[@id = 'Table of Contents Appendix']"/>
      </xsl:if>
      <xsl:if test="exists(. ?cover_image_name)">
        <variable id="cover-image-path">
          <xsl:text expand-text="yes">Customization/OpenTopic/common/artwork/{. ?cover_image_name}</xsl:text>
        </variable>
      </xsl:if>
      <xsl:if test=". ?blank_pages">
        <xsl:copy-of select="$vars/variable[@id = 'blank_page']"/>
      </xsl:if>
      <xsl:variable name="headers" select="(
        'Body first header',
        'Body odd header',
        'Body even header',
        'Preface odd header',
        'Preface even header',
        'Preface first header',
        'Toc odd header',
        'Toc even header',
        'Index odd header',
        'Index even header',
        'Glossary odd header',
        'Glossary even header'
      )"/>
      <xsl:variable name="footers" select="(
      'Body odd footer',
      'Body even footer',
      'Body first footer',
      'Preface odd footer',
      'Preface even footer',
      'Preface first footer',
      'Toc odd footer',
      'Toc even footer',
      'Index odd footer',
      'Index even footer',
      'Glossary odd footer',
      'Glossary even footer'
      )"/>
      <xsl:call-template name="variables">
        <xsl:with-param name="args" select=". ?header"/>
        <xsl:with-param name="var_names" select="$headers"/>
      </xsl:call-template>
      <xsl:call-template name="variables">
        <xsl:with-param name="args" select=". ?footer"/>
        <xsl:with-param name="var_names" select="$footers"/>
      </xsl:call-template>
      <xsl:for-each select="1 to 4">
        <xsl:variable name="level" select="."/>
        <variable id="Ordered List Number {$level}">
          <xsl:variable name="olBeforeField" select="concat('ol-before-', $level)"/>
          <xsl:value-of select="if (exists($style('ol')($olBeforeField)))
                                then $style('ol')($olBeforeField)
                                else ''"/><!--$default_style('ol')($olBeforeField)-->
          <param ref-name="number"/>
          <xsl:variable name="olAfterField" select="concat('ol-after-', $level)"/>
          <xsl:value-of select="if (exists($style('ol')($olAfterField)))
                                then $style('ol')($olAfterField)
                                else '. '"/><!--$default_style('ol')($olAfterField)-->
        </variable>
      </xsl:for-each>
      <xsl:for-each select="1 to 4">
        <xsl:variable name="level" select="."/>
        <xsl:variable name="olField" select="concat('ol-', $level)"/>
        <variable id="Ordered List Format {$level}">
          <xsl:value-of select="if (exists($style('ol')($olField)))
                                then $style('ol')($olField)
                                else '1'"/><!--$default_style('ol')($olField)-->
        </variable>
      </xsl:for-each>
      <xsl:for-each select="1 to 4">
        <xsl:variable name="level" select="."/>
        <xsl:variable name="ulField" select="concat('ul-', $level)"/>
        <variable id="Unordered List bullet {$level}">
          <xsl:value-of select="if (exists($style('ol')($ulField)))
                                then $style('ol')($ulField)
                                else '•'"/><!--$default_style('ol')($ulField)-->
        </variable>
      </xsl:for-each>
    </vars>
  </xsl:template>

  <xsl:template name="variables">
    <xsl:param name="args" as="map(*)"/>
    <xsl:param name="var_names" as="item()*"/>
    <xsl:for-each select="$var_names">
      <xsl:variable name="vars" select="if (contains(., 'even'))
                                        then ($args ?even ?content)
                                        else ($args ?odd ?content)"/>
      <variable id="{.}">
        <xsl:for-each select="$vars">
          <xsl:if test="position() ne 1"> | </xsl:if>
          <param ref-name="{.}"/>
        </xsl:for-each>
      </variable>
    </xsl:for-each>
  </xsl:template>

</xsl:stylesheet>