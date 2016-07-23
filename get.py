#!/usr/bin/python

import httplib
import json
import os.path
import sys
import urllib
import zipfile
from StringIO import StringIO


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'


def main():
    servers = {
        "production": ("dita-generator-hrd.appspot.com", 80),
        "heroku": ("dita-generator.elovirta.com", 80),
        "localhost": ("localhost", 10082),
        "node": ("localhost", 3000)
    }
    json_targets = {
        "pdf": {
            "id": "com.example.print-pdf",
            "ot_version": "2.0",
            "plugin_version": "1.0.0",
            "transtype": "print-pdf",
            "configuration": {
                "style": {
                    "body": {
                        "font-size": "12pt",
                        "start-indent": "25pt",
                        "color": "black",
                        "font-family": "Sans",
                        "line-height": "1.8em",
                        "text-align": "justify"
                    },
                    "pre": {
                        "line-height": "1em"
                    },
                    "dl": {
                        "dl-type": "list",
                        "background-color": "pink"
                    },
                    "ol": {
                        "ol-1": "A",
                        "ol-2": "I",
                        "ol-3": "i",
                        "ol-4": "1",
                        "ol-before-1": "(",
                        "ol-after-1": ") "
                    },
                    "ul": {
                        "ul-2": u"\u2022",
                        "ul-1": "*"
                    },
                    "topic.topic.topic": {
                        "font-style": "italic",
                        "start-indent": "5pt"
                    },
                    "section": {
                        "font-style": "italic",
                        "start-indent": "5pt"
                    },
                    "note": {
                        "color": "gray",
                        "font-size": "10pt",
                        "start-indent": "50pt",
                        "icon": "icon"
                    },
                    "topic.topic": {
                        "title-numbering": "true"
                    },
                    "topic": {
                        "color": "blue",
                        "title-numbering": "true",
                        "font-size": "18pt",
                        "font-weight": "bold",
                        "font-family": "Serif"
                    },
                    "link": {
                        "color": "black",
                        "link-url": "true",
                        "font-style": "italic",
                        "link-page-number": "true"
                    },
                    "fig": {
                        "background-color": "yellow",
                        "caption-number": "none",
                        "caption-position": "before"
                    },
                    "table": {
                        "background-color": "cyan",
                        "caption-number": "document",
                        "caption-position": "after"
                    },
                    "codeblock": {
                        "background-color": "silver"
                    }
                },
                "bookmark_style": "EXPANDED",
                "page_size": [
                    "210mm",
                    "297mm"
                ],
                "include_related_links": "nofamily",
                "page_number": "chapter-page",
                "formatter": "ah",
                "override_shell": True,
                "column_gap": "10mm",
                "table_continued": True,
                "title_numbering": "all",
                "cover_image_metadata": "cover-image",
                "page_margins": {
                    "top": "20mm",
                    "inside": "30mm",
                    "outside": "20mm",
                    "bottom": "20mm"
                },
                "force_page_count": "auto",
                "header": {
                    "even": ["heading"],
                    "odd": ["heading"]
                },
                "chapter_layout": "BASIC",
                "footer": {
                    "even": ["pagenum"],
                    "odd": ["pagenum"]
                },
                "mirror_page_margins": True,
                "task_label": True,
                "toc_maximum_level": 3
            }
        }
    }
    form_targets = {
        "pdf2": {
            "ot_version": "2.2",
            "formatter": "fop",
            "override_shell": "true",
            "page-size": "210mm 297mm",
            "orientation": "portrait",
            "page-margin-top": "20mm",
            "page-margin-outside": "20mm",
            "page-margin-bottom": "20mm",
            "page-margin-inside": "30mm",
            "mirror-page-margins": "true",
            "body-column-count": "1",
            "index-column-count": "2",
            "column-gap": "12pt",
            "header.even": "heading",
            "header.odd": "heading",
            "force-page-count": "even",
            "chapter-layout": "BASIC",
            "font-family.body": "Times New Roman",
            "font-size.body": "10pt",
            "color.body": "black",
            "background-color.body": "transparent",
            "font-weight.body": "normal",
            "font-style.body": "normal",
            "text-decoration.body": "none",
            "space-before.body": "6pt",
            "space-after.body": "6pt",
            "text-align.body": "start",
            "start-indent.body": "0pt",
            "line-height.body": "1.2",
            "font-family.topic": "Helvetica",
            "font-size.topic": "18pt",
            "color.topic": "black",
            "background-color.topic": "transparent",
            "font-weight.topic": "bold",
            "font-style.topic": "normal",
            "text-decoration.topic": "none",
            "space-before.topic": "0pt",
            "space-after.topic": "16.8pt",
            "text-align.topic": "start",
            "start-indent.topic": "0pt",
            "line-height.topic": "1.2",
            "title-numbering.topic": "true",
            "font-family.topic_topic": "Helvetica",
            "font-size.topic_topic": "14pt",
            "color.topic_topic": "black",
            "background-color.topic_topic": "transparent",
            "font-weight.topic_topic": "bold",
            "font-style.topic_topic": "normal",
            "text-decoration.topic_topic": "none",
            "space-before.topic_topic": "12pt",
            "space-after.topic_topic": "5pt",
            "text-align.topic_topic": "start",
            "start-indent.topic_topic": "0pt",
            "line-height.topic_topic": "1.2",
            "title-numbering.topic_topic": "true",
            "font-family.topic_topic_topic": "Helvetica",
            "font-size.topic_topic_topic": "12pt",
            "color.topic_topic_topic": "black",
            "background-color.topic_topic_topic": "transparent",
            "font-weight.topic_topic_topic": "bold",
            "font-style.topic_topic_topic": "normal",
            "text-decoration.topic_topic_topic": "none",
            "space-before.topic_topic_topic": "12pt",
            "space-after.topic_topic_topic": "2pt",
            "text-align.topic_topic_topic": "start",
            "start-indent.topic_topic_topic": "0pt",
            "line-height.topic_topic_topic": "1.2",
            "title-numbering.topic_topic_topic": "true",
            "font-family.topic_topic_topic_topic": "Times New Roman",
            "font-size.topic_topic_topic_topic": "10pt",
            "color.topic_topic_topic_topic": "black",
            "background-color.topic_topic_topic_topic": "transparent",
            "font-weight.topic_topic_topic_topic": "bold",
            "font-style.topic_topic_topic_topic": "normal",
            "text-decoration.topic_topic_topic_topic": "none",
            "space-before.topic_topic_topic_topic": "12pt",
            "space-after.topic_topic_topic_topic": "0pt",
            "text-align.topic_topic_topic_topic": "start",
            "start-indent.topic_topic_topic_topic": "0pt",
            "line-height.topic_topic_topic_topic": "1.2",
            "title-numbering.topic_topic_topic_topic": "true",
            "font-family.section": "Helvetica",
            "font-size.section": "10pt",
            "color.section": "black",
            "background-color.section": "transparent",
            "font-weight.section": "normal",
            "font-style.section": "normal",
            "text-decoration.section": "none",
            "space-before.section": "15pt",
            "space-after.section": "6pt",
            "text-align.section": "start",
            "start-indent.section": "0pt",
            "line-height.section": "1.2",
            "font-family.note": "Times New Roman",
            "font-size.note": "10pt",
            "color.note": "black",
            "background-color.note": "transparent",
            "font-weight.note": "normal",
            "font-style.note": "normal",
            "text-decoration.note": "none",
            "space-before.note": "6pt",
            "space-after.note": "6pt",
            "text-align.note": "start",
            "start-indent.note": "0pt",
            "line-height.note": "1.2",
            "icon.note": "icon",
            "font-family.pre": "Monaco",
            "font-size.pre": "10pt",
            "color.pre": "black",
            "background-color.pre": "transparent",
            "font-weight.pre": "normal",
            "font-style.pre": "normal",
            "text-decoration.pre": "none",
            "space-before.pre": "15pt",
            "space-after.pre": "6pt",
            "text-align.pre": "start",
            "start-indent.pre": "0pt",
            "line-height.pre": "1.2",
            "font-family.codeblock": "Monaco",
            "font-size.codeblock": "9pt",
            "color.codeblock": "white",
            "background-color.codeblock": "teal",
            #font-weight.codeblock
            #font-style.codeblock
            #text-decoration.codeblock
            "space-before.codeblock": "15pt",
            #space-after.codeblock
            #text-align.codeblock
            "start-indent.codeblock": "6pt",
            #line-height.codeblock
            "padding-top.codeblock": "15pt",
            "padding-right.codeblock": "15pt",
            "padding-bottom.codeblock": "15pt",
            "padding-left.codeblock": "15pt",
            "font-family.dl": "Times New Roman",
            "font-size.dl": "10pt",
            "color.dl": "black",
            "background-color.dl": "transparent",
            "font-weight.dl": "normal",
            "font-style.dl": "normal",
            "text-decoration.dl": "none",
            "space-before.dl": "6pt",
            "space-after.dl": "6pt",
            "text-align.dl": "start",
            "start-indent.dl": "0pt",
            "line-height.dl": "1.2",
            "dl-type.dl": "html",
            "font-family.ol": "Times New Roman",
            "font-size.ol": "10pt",
            "color.ol": "black",
            "background-color.ol": "transparent",
            "font-weight.ol": "normal",
            "font-style.ol": "normal",
            "text-decoration.ol": "none",
            "space-before.ol": "6pt",
            "space-after.ol": "6pt",
            "text-align.ol": "start",
            "start-indent.ol": "0pt",
            "line-height.ol": "1.2",
            "ol-1.ol": "1",
            "ol-2.ol": "1",
            "ol-3.ol": "1",
            "ol-4.ol": "1",
            #ol-before-1.ol
            #ol-before-2.ol
            #ol-before-3.ol
            #ol-before-4.ol
            "ol-after-1.ol": ".+",
            "ol-after-2.ol": ".+",
            "ol-after-3.ol": ".+",
            "ol-after-4.ol": ".+",
            #ol-sublevel.ol
            "font-family.ul": "Times New Roman",
            "font-size.ul": "10pt",
            "color.ul": "black",
            "background-color.ul": "transparent",
            "font-weight.ul": "normal",
            "font-style.ul": "normal",
            "text-decoration.ul": "none",
            "space-before.ul": "6pt",
            "space-after.ul": "6pt",
            "text-align.ul": "start",
            "start-indent.ul": "0pt",
            "line-height.ul": "1.2",
            "ul-1.ul": u"\u2022",
            "ul-2.ul": u"\u2022",
            "ul-3.ul": u"\u2022",
            "ul-4.ul": u"\u2022",
            "font-family.table": "Times New Roman",
            "font-size.table": "10pt",
            "color.table": "black",
            "background-color.table": "transparent",
            "font-weight.table": "normal",
            "font-style.table": "normal",
            "text-decoration.table": "none",
            "space-before.table": "6pt",
            "space-after.table": "6pt",
            "text-align.table": "start",
            "start-indent.table": "0pt",
            "line-height.table": "1.2",
            "caption-number.table": "chapter",
            "caption-position.table": "before",
            #font-family.fig
            #font-size.fig
            #color.fig
            #background-color.fig
            #font-weight.fig
            #font-style.fig
            #text-decoration.fig
            #space-before.fig
            #space-after.fig
            #text-align.fig
            #start-indent.fig
            #line-height.fig
            "caption-number.fig": "document",
            "caption-position.fig": "after",
            'color.toc_1': 'red',
            'start-indent.toc_1': '25pt',
            'color.toc_2': 'pink',
            'font-size.toc_2': '32pt',
            'font-family.toc_2': 'Comic Sans MS',
            'start-indent.toc_2': '35pt',
            'start-indent.toc_3': '45pt',
            'start-indent.toc_4': '55pt',
            #font-family.link
            #font-size.link
            "color.link": "blue",
            "background-color.link": "transparent",
            #font-weight.link
            "font-style.link": "italic",
            #text-decoration.link
            #line-height.link
            "link-page-number.link": "true",
            "link-url.link": "true",
            #cover_image
            "cover_image_metadata": "cover-image",
            "toc-maximum-level": "4",
            "bookmark-style": "COLLAPSED",
            "task-label": "true",
            "include-related-links": "nofamily",
            "id": "x",
            "transtype": "x",
            #plugin-version
        },
        "pdf": {
            "output": "pdf-plugin",
            "ot_version": "2.0",
            "page-size": "210mm 297mm",
            # "orientation": "landscape",
            "page-margin-top": "20mm",
            "page-margin-outside": "20mm",
            "page-margin-bottom": "20mm",
            "page-margin-inside": "30mm",
            "mirror-page-margins": "true",
            # body-column-count": "2",
            # "index-column-count": "4",
            "column-gap": "10mm",
            "force-page-count": "auto",
            "chapter-layout": "BASIC",
            "bookmark-style": "EXPANDED",
            "toc-maximum-level": "3",
            "task-label": "YES",
            "include-related-links": "nofamily",

            "font-family.body": "Helvetica",
            "font-size.body": "12pt",
            "color.body": "black",
            "start-indent.body": "25pt",
            "text-align.body": "justify",
            "line-height.body": "1.8em",

            "font-family.topic": "Times New Roman",
            "font-size.topic": "18pt",
            "color.topic": "blue",
            "font-weight.topic": "bold",
            "title-numbering.topic": "true",

            "title-numbering.topic.topic": "true",
            "title-numbering.topic_topic": "true",

            "font-style.topic.topic.topic": "italic",
            "font-style.topic_topic_topic": "italic",
            "start-indent.topic.topic.topic": "5pt",
            "start-indent.topic_topic_topic": "5pt",

            "font-style.topic.topic.topic.topic": "italic",
            "font-style.topic_topic_topic_topic": "italic",

            "ol-1.ol": "A",
            "ol-2.ol": "I",
            "ol-3.ol": "i",
            "ol-4.ol": "1",
            "ol-before-1.ol": "(",
            "ol-after-1.ol": ") ",

            "ul-2.ul": u"\u2022",
            "ul-1.ul": "*",

            "font-style.section": "italic",
            "start-indent.section": "5pt",

            "color.link": "black",
            "font-style.link": "italic",
            "link-page-number.link": "true",
            "link-url.link": "true",

            "font-size.note": "10pt",
            "color.note": "gray",
            "start-indent.note": "50pt",
            "icon.note": "icon",

            "line-height.pre": "1em",

            "dl-type.dl": "list",
            "background-color.dl": "pink",

            "background-color.codeblock": "silver",

            "caption-number.table": "document",
            "background-color.table": "cyan",
            "caption-position.table": "after",

            "caption-number.fig": "none",
            "background-color.fig": "yellow",
            "caption-position.fig": "before",

            "cover_image_metadata": "cover-image",
            # "cover_image_topic": "front-cover",

            "text-align": "justify",
            "dl": "list",
            "title-numbering": "all",
            "spacing.before": "10pt",
            "spacing.after": "10pt",
            "link-page-number": "true",
            "table-continued": "true",
            "formatter": "ah",
            "override_shell": "true",
            "header.even": "heading",
            "header.odd": "heading",
            "page-number": "chapter-page",
            "drop-folio": "pagenum",
            "id": "com.example.print-pdf",
            "transtype": "print-pdf",
            "plugin-version": "1.0.0"
        }
    }
    i = 1
    server = None
    params = None
    url = None
    targets = form_targets
    function = get
    handler = list
    version = None

    try:
        if i == len(sys.argv):
            raise None
        while i < len(sys.argv):
            if sys.argv[i] == "-o":
                i = i + 1
                dir = os.path.abspath(sys.argv[i])
                handler = lambda zip: store(zip, dir)
            elif sys.argv[i] == "-h" or sys.argv[i] == "--help":
                raise None
            elif sys.argv[i] == "-f" or sys.argv[i] == "--form":
                targets = form_targets
                function = get
            elif sys.argv[i] == "-j" or sys.argv[i] == "--json":
                targets = json_targets
                function = post
            elif server is None:
                if not sys.argv[i] in servers:
                    raise None
                server = servers[sys.argv[i]]
            elif params is None:
                if not sys.argv[i] in targets:
                    raise None
                params = targets[sys.argv[i]]
                if sys.argv[i][:3] == "pdf":
                    #url = "/generate-plugin"
                    url = "/"
                else:
                    url = "/generate"
            elif version is None:
                version = sys.argv[i]
                params["ot_version"] = version
            else:
                break
            i = i + 1
    except Exception, e:
        print e
        help()
        exit()
    function(server, handler, params, url)


def help():
    sys.stderr.write("""Usage: get.py [options] environment target [version]

Options:
  -o DIR      output files to plug-ins directory
  -h, --help  print help
  -f, --form  use form API
  -j, --json  use JSON API
Environments:
  localhost   localhost
  production  dita-generator.appspot.com
  node
Targets:
  pdf
Version:
  2.1
  2.2
  2.3
""")


def get(server, handler, params, url):
    for k, v in params.iteritems():
        params[k] = v.encode("UTF-8")
    conn = httplib.HTTPConnection(server[0], server[1])
    #conn.set_debuglevel(1)
    #conn.request("POST", url, urllib.urlencode(params))
    conn.request("POST", url, urllib.urlencode(params), {"Content-Type": "application/x-www-form-urlencoded"})
    response = conn.getresponse()
    data = response.read()
    try:
        with zipfile.ZipFile(StringIO(data), "r") as zip:
            handler(zip)
    except:
        print(data)
    finally:
        conn.close()


def post(server, handler, params, url):
    conn = httplib.HTTPConnection(server[0], server[1])
    # conn.set_debuglevel(1)
    conn.request("POST", url, json.dumps(params), {"Content-Type": "application/json"})
    response = conn.getresponse()
    with zipfile.ZipFile(StringIO(response.read()), "r") as zip:
        handler(zip)
    conn.close()


def list(zip):
    for n in zip.namelist():
        print bcolors.HEADER + n + ":" + bcolors.ENDC
        print zip.open(n).read()


def store(zip, dir):
    for n in zip.namelist():
        # print bcolors.HEADER + os.path.join(dir, n) + ":" + bcolors.ENDC
        src = zip.open(n)
        f = os.path.join(dir, n)
        if not os.path.exists(os.path.dirname(f)):
            os.makedirs(os.path.dirname(f))
        dst = open(f, "w")
        try:
            dst.write(src.read())
        finally:
            src.close()
            dst.close()


if __name__ == "__main__":
    main()
