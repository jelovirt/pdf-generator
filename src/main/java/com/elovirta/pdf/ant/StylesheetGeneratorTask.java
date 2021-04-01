package com.elovirta.pdf.ant;

import net.sf.saxon.expr.XPathContext;
import net.sf.saxon.s9api.*;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.dita.dost.log.DITAOTAntLogger;
import org.dita.dost.util.Configuration;
import org.dita.dost.util.XMLUtils;

import javax.xml.transform.Source;
import javax.xml.transform.TransformerException;
import javax.xml.transform.URIResolver;
import javax.xml.transform.stream.StreamSource;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static java.util.Collections.singletonMap;
import static org.dita.dost.util.Configuration.configuration;
import static org.dita.dost.util.Constants.ANT_REFERENCE_XML_UTILS;
import static org.dita.dost.util.Constants.ANT_TEMP_DIR;

public class StylesheetGeneratorTask extends Task {
    private File template;
    private XMLUtils xmlUtils;
    private URIResolver resolver;
    private File dstDir;
    private String property;

    @Override
    public void init() {
        resolver = new URIResolver() {
            @Override
            public Source resolve(String href, String base) throws TransformerException {
                URI abs = URI.create(href);
                if (!abs.isAbsolute()) {
                    abs = URI.create(base).resolve(href);
                }
                if (!abs.getScheme().equals("classpath")) {
                    throw new IllegalArgumentException(String.format("Only classpath URI scheme supported: %s", abs));
                }
                final String path = abs.getPath().startsWith("/") ? abs.getPath().substring(1) : abs.getPath();
                final InputStream resourceAsStream = getClass().getClassLoader().getResourceAsStream(path);
                return new StreamSource(resourceAsStream, abs.toString());
            }
        };
        final File tempDir = new File(getProject().getProperty(ANT_TEMP_DIR));
        try {
            dstDir = Files.createTempDirectory(tempDir.toPath(), "org.elovirta.pdf").toFile();
        } catch (IOException e) {
            throw new BuildException("Failed to generate stylesheet directory", e);
        }
        xmlUtils = getProject().getReference(ANT_REFERENCE_XML_UTILS);
        if (xmlUtils == null) {
            xmlUtils = new XMLUtils();
            xmlUtils.setLogger(new DITAOTAntLogger(getProject()));
        }
    }

    @Override
    public void execute() throws BuildException {
        custom_xslt("front-matter.xsl", "xsl/fo/front-matter.xsl", null);
        custom_xslt("commons.xsl", "xsl/fo/commons.xsl", null);
        custom_xslt("tables.xsl", "xsl/fo/tables.xsl", null);
        custom_xslt("toc.xsl", "xsl/fo/toc.xsl", null);
        custom_xslt("links.xsl", "xsl/fo/links.xsl", null);
        custom_xslt("lists.xsl", "xsl/fo/lists.xsl", null);
        custom_xslt("pr-domain.xsl", "xsl/fo/pr-domain.xsl", null);
        custom_xslt("static-content.xsl", "xsl/fo/static-content.xsl", null);
        custom_xslt("topic.xsl", "xsl/fo/topic.xsl", null);
        custom_xslt("layout-masters.xsl", "cfg/fo/layout-masters.xsl", null);
        final QName attrMode = QName.fromClarkName("{}attr");
        custom_xslt("front-matter.xsl", "cfg/fo/attrs/front-matter-attr.xsl", attrMode);
        custom_xslt("commons.xsl", "cfg/fo/attrs/commons-attr.xsl", attrMode);
        custom_xslt("layout-masters.xsl", "cfg/fo/attrs/layout-masters-attr.xsl", attrMode);
        custom_xslt("static-content.xsl", "cfg/fo/attrs/static-content-attr.xsl", attrMode);
        custom_xslt("tables.xsl", "cfg/fo/attrs/tables-attr.xsl", attrMode);
        custom_xslt("toc.xsl", "cfg/fo/attrs/toc-attr.xsl", attrMode);
        custom_xslt("tables.xsl", "cfg/fo/attrs/tables-attr.xsl", attrMode);
        custom_xslt("basic-settings.xsl", "cfg/fo/attrs/basic-settings.xsl", attrMode);
        custom_xslt("links.xsl", "cfg/fo/attrs/links-attr.xsl", attrMode);
        custom_xslt("lists.xsl", "cfg/fo/attrs/lists-attr.xsl", attrMode);
        custom_xslt("pr-domain.xsl", "cfg/fo/attrs/pr-domain-attr.xsl", attrMode);
        custom_xslt("topic.xsl", "cfg/fo/attrs/topic-attr.xsl", attrMode);
        final File shell = custom_xslt("shell.xsl", "xsl/fo/topic2fo_shell.xsl", null);
        getProject().setProperty(property, shell.getAbsolutePath());
    }

    private File custom_xslt(final String name, final String dst, final QName mode) throws BuildException {
        getProject().log("Generating " + name, Project.MSG_INFO);
        try {
            final Processor processor = xmlUtils.getProcessor();
//            final XPathContext conversionContext = processor.getUnderlyingConfiguration().getConversionContext();
            final XsltCompiler compiler = processor.newXsltCompiler();
            compiler.setURIResolver(resolver);
            final String stylesheetUri = String.format("classpath:/%s", name);
            final XsltExecutable executable = compiler.compile(resolver.resolve(stylesheetUri, null));
            final Xslt30Transformer transformer = executable.load30();
            transformer.setStylesheetParameters(getParameters());
//            System.out.println("done loading stylesheet");
//            transformer.setInitialMode(new QName(""));

//            final XPathSelector selector = processor.newXPathCompiler().compile("json-parse(.)").load();
//            selector.setContextItem(processor.newDocumentBuilder().);
            //language=JSON
//            final String jsonString = "{\n" +
//                    "  \"style\": {\n" +
//                    "    \"body\": {\n" +
//                    "      \"space-after\": \"10pt\"\n" +
//                    "    },\n" +
//                    "    \"codeblock\": {\n" +
//                    "      \"line-numbering\": true\n" +
//                    "    },\n" +
//                    "    \"link\": {\n" +
//                    "      \"link-url\": true\n" +
//                    "    }\n" +
//                    "  }\n" +
//                    "}\n";
            final XdmItem xdmItem = processor.newXPathCompiler().evaluateSingle("json-doc(.)",
                    new XdmAtomicValue(template.toURI()));
//            final QName jsonDocName = QName.fromClarkName("{http://www.w3.org/2005/xpath-functions}json-doc");
//            final XdmFunctionItem jsonDocFunc = XdmFunctionItem.getSystemFunction(processor, jsonDocName, 1);
//            final XdmValue inputJson = jsonDocFunc.call(processor, xdmItems);

//            transformer.applyTemplates(inputJson);

//            final JsonParser jsonParser = new JsonParser();
//            System.out.println("parser:\n  " + jsonParser
//                    + "\n  " + conversionContext
//                    + "\n  " + conversionContext.getController()
//            );
//            final JsonHandlerXML handler = new JsonHandlerXML(conversionContext, "file:///foo.json", JsonParser.DEBUG);
//            System.out.println("parse");
//            jsonParser.parse("{\"id\":\"x\"}", 0, handler, conversionContext);
//            System.out.println("parse done");
//            final NodeInfo result = (NodeInfo) handler.getResult();
//            final XdmNode xdmNode = processor.newDocumentBuilder().build(result);
            transformer.setGlobalContextItem(xdmItem);
            if (mode != null) {
                transformer.setInitialMode(mode);
            }
//            System.out.println("set global context item: " + xdmNode);
//            System.out.println("size " + xdmItem.size());
//            final Source source = processor.newDocumentBuilder().wrap(xdmItem).asSource();
            final File dstFile = new File(dstDir.toURI().resolve(dst));
            final Serializer destination = processor.newSerializer(dstFile);
            transformer.applyTemplates(xdmItem, destination);
//            System.out.println("done");
            return dstFile;
        } catch (Exception e) {
            e.printStackTrace();
            throw new BuildException(String.format("Failed to generate stylesheet %s.xsl", name), e);
        }
    }

    private Map<QName, XdmAtomicValue> getParameters() {
        final Map<QName, XdmAtomicValue> parameters = new HashMap<>();
        parameters.put(QName.fromClarkName("{}version"), new XdmAtomicValue(configuration.get("otrelease")));
        String formatter = getProject().getProperty("pdf.formatter");
        if (formatter == null) {
            formatter = "fop";
        }
        parameters.put(QName.fromClarkName("{}formatter"), new XdmAtomicValue(formatter));
        return parameters;
    }

    public void setTemplate(final File template) {
        this.template = template;
    }

    public void setProperty(final String property) {
        this.property = property;
    }
}
