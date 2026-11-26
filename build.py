# Inlines js/*.js into src.html and writes the single-file TaskSequencer.html
import re, pathlib
root = pathlib.Path(__file__).parent
html = (root / 'src.html').read_text(encoding='utf-8')
def inline(m):
    return '<script>\n' + (root / m.group(1)).read_text(encoding='utf-8') + '\n</script>'
html = re.sub(r'<script src="([^"]+)"></script>', inline, html)
import datetime
html = html.replace('{{BUILD}}', datetime.datetime.now().strftime('%Y-%m-%d %H:%M'))
(root / 'TaskSequencer.html').write_text(html, encoding='utf-8')
print('wrote', len(html), 'bytes')
