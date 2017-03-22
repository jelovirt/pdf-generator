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
		"production": ("dita-generator.elovirta.com", 80),
		"localhost": ("localhost", 3000)
	}
	json_targets = {
		"pdf": {
			"id": "com.example.print-pdf",
			"ot_version": "2.4",
			"transtype": "print-pdf",
			"blank_pages": True,
			"configuration": {
				"mirror-page-margins": True,
				"page": {
					"width": "210mm",
					"height": "297mm",
					"top": "20mm",
					"outside": "20mm",
					"bottom": "20mm",
					"inside": "20mm"
				},
				"style": {
					"body": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "6pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"border-before-style": "none",
						"border-end-style": "none",
						"border-after-style": "none",
						"border-start-style": "none"
					 },
					"topic": {
						"font-family": "Helvetica",
						"font-size": "18pt",
						"color": "black",
						"font-weight": "bold",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "0pt",
						"space-after": "16.8pt",
						"text-align": "start",
						"start-indent": "0pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"title-numbering": True
					 },
					"topic_topic": {
						"font-family": "Helvetica",
						"font-size": "14pt",
						"color": "black",
						"font-weight": "bold",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "12pt",
						"space-after": "5pt",
						"text-align": "start",
						"start-indent": "0pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"title-numbering": True
					 },
					"topic_topic_topic": {
						"font-family": "Helvetica",
						"font-size": "12pt",
						"color": "black",
						"font-weight": "bold",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "12pt",
						"space-after": "2pt",
						"text-align": "start",
						"start-indent": "0pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"topic_topic_topic_topic": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "bold",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "12pt",
						"space-after": "0pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"section": {
						"font-family": "Helvetica",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "bold",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "15pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"example": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "0.6em",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "36pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "5pt",
						"padding-right": "5pt",
						"padding-bottom": "5pt",
						"padding-left": "5pt",
						"end-indent": "0pt",
						"border-before-style": "solid",
						"border-before-width": "1pt",
						"border-before-color": "black",
						"border-end-style": "solid",
						"border-end-width": "1pt",
						"border-end-color": "black",
						"border-after-style": "solid",
						"border-after-width": "1pt",
						"border-after-color": "black",
						"border-start-style": "solid",
						"border-start-width": "1pt",
						"border-start-color": "black"
					 },
					"example_title": {
						"font-family": "Helvetica",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "bold",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "15pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"note": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "6pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"icon": "icon"
					 },
					"pre": {
						"font-family": "Monaco",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "15pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"codeblock": {
						"line-numbering": True,
						"font-family": "Monaco",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "15pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "31pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"dl": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "6pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"dl-type": "table"
					 },
					"ol": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "6pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"ol-1": "1",
						"ol-2": "1",
						"ol-3": "1",
						"ol-4": "1",
						"ol-after-1": ".+",
						"ol-after-2": ".+",
						"ol-after-3": ".+",
						"ol-after-4": ".+"
					 },
					"ul": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "6pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"ul-1": u"\u2022",
						"ul-2": u"\u2022",
						"ul-3": u"\u2022",
						"ul-4": u"\u2022"
					 },
					"table": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "6pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"caption-number": "document",
						"caption-position": "before"
					 },
					"fig": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "6pt",
						"space-after": "6pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"caption-number": "chapter",
						"caption-position": "after"
					 },
					"toc_1": {
						"font-family": "Times+New+Roman",
						"font-size": "14pt",
						"color": "black",
						"font-weight": "bold",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "0pt",
						"space-after": "0pt",
						"text-align": "start",
						"start-indent": "25pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "20pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt",
						"prefix": True
					 },
					"toc_2": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "0pt",
						"space-after": "0pt",
						"text-align": "start",
						"start-indent": "55pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"toc_3": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "0pt",
						"space-after": "0pt",
						"text-align": "start",
						"start-indent": "85pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"toc_4": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"space-before": "0pt",
						"space-after": "0pt",
						"text-align": "start",
						"start-indent": "115pt",
						"line-height": "1.2",
						"background-color": "transparent",
						"padding-top": "0pt",
						"padding-right": "0pt",
						"padding-bottom": "0pt",
						"padding-left": "0pt",
						"end-indent": "0pt"
					 },
					"link": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "blue",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"background-color": "transparent",
						"link-page-number": True
					 },
					"tm": {
						"font-family": "Times+New+Roman",
						"font-size": "10pt",
						"color": "black",
						"font-weight": "normal",
						"font-style": "normal",
						"text-decoration": "none",
						"background-color": "transparent",
						"symbol-scope": "always"
					 }
				},
				"force_page_count": "even",
				"chapter_layout": "MINITOC",
				"bookmark_style": "COLLAPSED",
				"task_label": False,
				"include_related_links": "none",
				"body_column_count": 1,
				"index_column_count": 2,
				"column_gap": "12pt",
				"mirror_page_margins": True,
				"table_continued": False,
				"formatter": "fop",
				"override_shell": True,
				"cover_image_metadata": "cover-image",
				"blank_pages": True,
				"header": {
					"odd": [
						"copyright",
						"title"
					],
					"even": [
						"chapter",
						"heading"
					]
				},
				"footer": {
					"odd": ["folio"],
					"even": ["folio-with-total"]
				},
				"toc_maximum_level": 3
			}
		}
	}

	i = 1
	server = None
	params = None
	url = None
	targets = json_targets
	function = post
	handler = list
	version = None

	try:
		if i == len(sys.argv):
			raise Exception("A")
		while i < len(sys.argv):
			if sys.argv[i] == "-o":
				i = i + 1
				dir = os.path.abspath(sys.argv[i])
				handler = lambda zip: store(zip, dir)
			elif sys.argv[i] == "-h" or sys.argv[i] == "--help":
				raise Exception("B")
			elif server is None:
				if not sys.argv[i] in servers:
					raise Exception("C")
				server = servers[sys.argv[i]]
			elif params is None:
				if not sys.argv[i] in targets:
					raise Exception("Target " + sys.argv[i] + " not supported")
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
		params = {
			"json": json.dumps(json_targets["pdf"])
		}
	except Exception, e:
		print e
		help()
		exit()
	#function(server, handler, params, url)


def help():
	sys.stderr.write("""Usage: get.py [options] environment target [version]

Options:
  -o DIR	    output files to plug-ins directory
  -h, --help  print help
Environments:
  node    localhost
  heroku  pdf-generator.elovirta.com
Targets:
  pdf
Version:
  2.3
  2.4
  2.5
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
