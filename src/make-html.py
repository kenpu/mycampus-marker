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
    <a href="javascript:void (function(){%s})()">Bookmark Me</a>;
    """ % urllib.quote(code)

