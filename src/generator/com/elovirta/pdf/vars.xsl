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
    <variables>
      <xsl:choose>
        <xsl:when test="map:contains($root, 'style-link-content')">
          <xsl:call-template name="variables">
            <xsl:with-param name="prefix" select="'style-link'"/>
            <xsl:with-param name="var_names" select="'link-local'"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:when test="map:contains($root ,'style-link-link-page-number') and not($root ?style-link-link-page-number)">
          <variable id="link-local">
            <param ref-name="link-text"/>
          </variable>
        </xsl:when>
        <xsl:otherwise>
          <variable id="link-local">
            <param ref-name="link-text"/>
            <variableref refid="On the page"/>
          </variable>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:choose>
        <xsl:when test="map:contains($root, 'style-link-external-content')">
          <xsl:call-template name="variables">
            <xsl:with-param name="prefix" select="'style-link-external'"/>
            <xsl:with-param name="var_names" select="'link-external'"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:when test="map:contains($root ,'style-link-link-url') and $root ?style-link-link-url">
          <variable id="link-external">
            <param ref-name="link-text"/>
            <xsl:text> (</xsl:text>
            <param ref-name="url"/>
            <xsl:text>)</xsl:text>
          </variable>
        </xsl:when>
        <xsl:otherwise>
          <variable id="link-external">
            <param ref-name="link-text"/>
          </variable>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:choose>
        <xsl:when test="map:contains($root, 'style-cover-title-content')">
          <xsl:call-template name="variables">
            <xsl:with-param name="var_names" select="'cover-title'"/>
            <xsl:with-param name="content" select="$root ?style-cover-title-content"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <variable id="cover-title">
            <param ref-name="title"/>
          </variable>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:if test="$root ?table-continued">
        <xsl:copy-of select="$vars/variable[@id = '#table-continued']"/>
      </xsl:if>
      <xsl:if test="$root ?style-table-caption-number = 'none'">
        <xsl:copy-of select="$vars/variable[@id = 'Table']"/>
      </xsl:if>
      <xsl:if test="$root ?style-fig-caption-number = 'none'">
        <xsl:copy-of select="$vars/variable[@id = 'Figure']"/>
      </xsl:if>
      <xsl:if test="map:contains($root, 'style-topic-title-numbering') and not($root ?style-topic-title-numbering)">
        <xsl:copy-of select="$vars/variable[@id = 'Table of Contents Chapter']"/>
        <xsl:copy-of select="$vars/variable[@id = 'Table of Contents Appendix']"/>
      </xsl:if>
      <xsl:if test="map:contains($root, 'cover-image-name')">
        <variable id="cover-image-path">
          <xsl:text expand-text="yes">Customization/OpenTopic/common/artwork/{$root ?cover-image-name}</xsl:text>
        </variable>
      </xsl:if>
      <xsl:if test="$root ?blank-pages">
        <xsl:copy-of select="$vars/variable[@id = 'blank_page']"/>
      </xsl:if>
      <xsl:call-template name="variables">
        <xsl:with-param name="prefix" select="'header-odd'"/>
        <xsl:with-param name="var_names" select="(
          'Body first header',
          'Body odd header',
          'Preface first header',
          'Preface odd header',
          'Toc odd header',
          'Index odd header',
          'Glossary odd header'
          )"/>
      </xsl:call-template>
      <xsl:call-template name="variables">
        <xsl:with-param name="prefix" select="'header-even'"/>
        <xsl:with-param name="var_names" select="(
          'Body even header',
          'Preface even header',
          'Toc even header',
          'Index even header',
          'Glossary even header'
          )"/>
      </xsl:call-template>
      <xsl:call-template name="variables">
        <xsl:with-param name="prefix" select="'footer-odd'"/>
        <xsl:with-param name="var_names" select="(
          'Body odd footer',
          'Body first footer',
          'Preface first footer',
          'Preface odd footer',
          'Toc odd footer',
          'Index odd footer',
          'Glossary odd footer'
          )"/>
      </xsl:call-template>
      <xsl:call-template name="variables">
        <xsl:with-param name="prefix" select="'footer-even'"/>
        <xsl:with-param name="var_names" select="(
          'Body even footer',
          'Preface even footer',
          'Toc even footer',
          'Index even footer',
          'Glossary even footer'
          )"/>
      </xsl:call-template>
      <xsl:for-each select="1 to 4">
        <xsl:variable name="level" select="."/>
        <variable id="Ordered List Number {$level}">
          <xsl:variable name="olBeforeField" select="concat('ol-before-', $level)"/>
          <xsl:value-of select="if (map:contains($root, concat('style-ol-', $olBeforeField)))
                                then $root(concat('style-ol-', $olBeforeField))
                                else ''"/><!--$default_style('ol')($olBeforeField)-->
          <param ref-name="number"/>
          <xsl:variable name="olAfterField" select="concat('ol-after-', $level)"/>
          <xsl:value-of select="if (map:contains($root, concat('style-ol-', $olAfterField)))
                                then $root(concat('style-ol-', $olAfterField))
                                else '. '"/><!--$default_style('ol')($olAfterField)-->
        </variable>
      </xsl:for-each>
      <xsl:for-each select="1 to 4">
        <xsl:variable name="level" select="."/>
        <xsl:variable name="olField" select="concat('ol-', $level)"/>
        <variable id="Ordered List Format {$level}">
          <xsl:value-of select="if (map:contains($root, concat('style-ol-', $olField)))
                                then $root(concat('style-ol-', $olField))
                                else '1'"/><!--$default_style('ol')($olField)-->
        </variable>
      </xsl:for-each>
      <xsl:for-each select="1 to 4">
        <xsl:variable name="level" select="."/>
        <xsl:variable name="ulField" select="concat('ul-', $level)"/>
        <variable id="Unordered List bullet {$level}">
          <xsl:value-of select="if (map:contains($root, concat('style-ul-', $ulField)))
                                then $root(concat('style-ul-', $ulField))
                                else '•'"/><!--$default_style('ol')($ulField)-->
        </variable>
      </xsl:for-each>
      <!-- Table -->
      <xsl:if test="map:contains($root, 'style-table-caption-content')">
        <xsl:call-template name="variables">
          <xsl:with-param name="prefix" select="'style-table-caption'"/>
          <xsl:with-param name="var_names" select="'Table.title'"/>
        </xsl:call-template>
      </xsl:if>

      <!-- Fig -->
      <xsl:if test="map:contains($root, 'style-fig-caption-content')">
        <xsl:call-template name="variables">
          <xsl:with-param name="prefix" select="'style-fig-caption'"/>
          <xsl:with-param name="var_names" select="'Figure.title'"/>
        </xsl:call-template>
      </xsl:if>

      <!-- Note -->
      <!--xsl:if test="map:contains($root, 'style-note-label-content')">
        <xsl:call-template name="variables">
          <xsl:with-param name="prefix" select="'style-note-label'"/>
          <xsl:with-param name="var_names" select="'note-note-label'"/>
        </xsl:call-template>
      </xsl:if-->
      <xsl:for-each select="'note', 'notice', 'tip', 'fastpath', 'restriction', 'important', 'remember', 'attention', 'caution', 'danger', 'warning', 'trouble', 'other'">
        <xsl:choose>
          <xsl:when test="map:contains($root, concat('style-note-', ., '-label-content'))">
            <xsl:call-template name="variables">
              <xsl:with-param name="prefix" select="concat('style-note-', ., '-label')"/>
              <!--xsl:with-param name="var_names" select="concat(upper-case(substring(., 1, 1)), substring(., 2))"/-->
              <xsl:with-param name="var_names" select="concat('note-', ., '-label')"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <variable id="{concat('note-', ., '-label')}">
              <xsl:attribute name="xml:space">preserve</xsl:attribute>
              <variableref refid="{concat(upper-case(substring(., 1, 1)), substring(., 2))}"/>
              <variableref refid="#note-separator"/>
              <xsl:text> </xsl:text>
            </variable>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
    </variables>
  </xsl:template>

  <xsl:template name="variables">
    <xsl:param name="prefix"/>
    <xsl:param name="var_names" as="item()*"/>
    <xsl:param name="content" select="$root(concat($prefix, '-content'))" as="array(*)?"/>
    <xsl:if test="exists($content)">
      <xsl:for-each select="$var_names">
        <variable id="{.}">
          <xsl:attribute name="xml:space">preserve</xsl:attribute>
          <xsl:for-each select="1 to array:size($content)">
            <xsl:variable name="item" select="$content(.)"/>
            <xsl:choose>
              <xsl:when test="$item ?kind = 'field'">
                <param ref-name="{$item ?value}"/>
              </xsl:when>
              <xsl:when test="$item ?kind = 'variable'">
                <variableref refid="{$item ?value}"/>
              </xsl:when>
              <xsl:when test="$item ?kind = 'text'">
                <xsl:value-of select="$item ?value"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:message terminate="yes">Unsupported to item kind: <xsl:value-of select="$item ?kind"/></xsl:message>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>
        </variable>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>