import urllib
import re

lines = []
with open("main.js") as f:
    for line in f.readlines():
        if not re.match(r'^\s*//', line):
            lines.append(line)

code = "".join(lines)

with open("main.html", "w") as out:
    print >>out, """
    <html>
    <head>
    <style>
    body {
        position: fixed;
        display: table;
        width: 100%%;
        height: 100%%;
    }
    .inner {
        display: table-cell;
        vertical-align: middle;
        width: 100%%;
        height: 100%%;
        text-align: center;
    }
    a {
        font-family: "Helvetica";
        font-size: 32pt;
    }

    </style>
    </head>
    <body>
        <div class="inner">
        <a title="Bookmark This."
           href="javascript:void (function(){%s})()">
        Mycampus Marker
        </a>
        </div>
    </body>
    </html>
    """ % urllib.quote(code)

