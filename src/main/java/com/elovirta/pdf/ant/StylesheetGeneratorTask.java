package com.elovirta.pdf.ant;

import net.sf.saxon.expr.XPathContext;
import net.sf.saxon.s9api.*;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.dita.dost.log.DITAOTAntLogger;
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

import static org.dita.dost.util.Constants.ANT_REFERENCE_XML_UTILS;
import static org.dita.dost.util.Constants.ANT_TEMP_DIR;

public class StylesheetGeneratorTask extends Task {
    private File template;
    private XMLUtils xmlUtils;
    private URIResolver resolver;

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
    }

    @Override
    public void execute() throws BuildException {
        xmlUtils = getProject().getReference(ANT_REFERENCE_XML_UTILS);
        if (xmlUtils == null) {
            xmlUtils = new XMLUtils();
            xmlUtils.setLogger(new DITAOTAntLogger(getProject()));
        }

        final File tempDir = new File(getProject().getProperty(ANT_TEMP_DIR));
        final File dstDir;
        try {
            dstDir = Files.createTempDirectory(tempDir.toPath(), "org.elovirta.pdf").toFile();
        } catch (IOException e) {
            throw new BuildException("Failed to generate stylesheet directory", e);
        }
        custom_xslt("front-matter");
//        custom_xslt("commons");
        custom_xslt("tables");
        custom_xslt("toc");
        custom_xslt("links");
        custom_xslt("lists");
        custom_xslt("pr-domain");
        custom_xslt("static-content");
        custom_xslt("topic");
//        custom_xslt(LayoutMasters, `${this.plugin_name}/cfg/fo/layout-masters.xsl`);
//        attr_xslt(FrontMatter, 'front-matter-attr');
//        attr_xslt(Commons, 'commons-attr');
//        attr_xslt(LayoutMasters, 'layout-masters-attr');
//        attr_xslt(StaticContent, 'static-content-attr');
//        attr_xslt(Tables, 'tables-attr');
//        attr_xslt(Toc, 'toc-attr');
//        attr_xslt(Tables, 'tables-attr');
//        attr_xslt(BasicSettings, 'basic-settings');
//        attr_xslt(Links, 'links-attr');
//        attr_xslt(Lists, 'lists-attr');
//        attr_xslt(PrDomain, 'pr-domain-attr');
//        attr_xslt(Topic, 'topic-attr');
//        custom_xslt(Shell,`${this.plugin_name}/xsl/fo/topic2fo_shell_${this.formatter}.xsl`);
    }

    private void custom_xslt(final String name) throws BuildException {
        getProject().log("Generating " + name + ".xsl", Project.MSG_INFO);
        try {
            final Processor processor = xmlUtils.getProcessor();
//            final XPathContext conversionContext = processor.getUnderlyingConfiguration().getConversionContext();
            final XsltCompiler compiler = processor.newXsltCompiler();
            compiler.setURIResolver(resolver);
            final String stylesheetUri = String.format("classpath:/%s.xsl", name);
            final XsltExecutable executable = compiler.compile(resolver.resolve(stylesheetUri, null));
            final Xslt30Transformer transformer = executable.load30();
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
//            System.out.println("set global context item: " + xdmNode);
//            System.out.println("size " + xdmItem.size());
//            final Source source = processor.newDocumentBuilder().wrap(xdmItem).asSource();
            transformer.applyTemplates(xdmItem, processor.newSerializer(System.out));
            System.out.println("done");
        } catch (Exception e) {
            e.printStackTrace();
            throw new BuildException(String.format("Failed to generate stylesheet %s.xsl", name), e);
        }
    }

    public void setTemplate(final File template) {
        this.template = template;
    }
}
