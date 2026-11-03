#!/usr/bin/env python3
"""Apply the shared footer to static pages; no browser-time rendering or build step."""
from pathlib import Path
from html.parser import HTMLParser
import re
ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = (ROOT / 'partials/winf-footer.html').read_text().strip()
STYLE = '/css/winf-footer-reference.css?v=20261103-reference-2'
SCRIPT = '/js/winf-footer.js?v=20261103-reference-2'
FONT = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&amp;display=swap'
class IDs(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids = set()
    def handle_starttag(self, tag, attrs):
        value = dict(attrs).get('id')
        if value: self.ids.add(value)
def synchronize():
    updated = []
    for page in sorted(ROOT.rglob('*.html')):
        if 'partials' in page.relative_to(ROOT).parts: continue
        source = page.read_text()
        match = re.search(r'<footer\b[\s\S]*?</footer>', source, re.I)
        if not match: continue
        outside = source[:match.start()] + source[match.end():]
        old_ids, outside_ids = IDs(), IDs()
        old_ids.feed(match.group()); outside_ids.feed(outside)
        aliases = ''.join('<span id="' + name + '" aria-hidden="true"></span>' for name in ['contato', 'privacy', 'politica-de-privacidade'] if name in old_ids.ids and name not in outside_ids.ids)
        footer = TEMPLATE.replace('<!-- footer-anchors -->', aliases)
        result = source[:match.start()] + footer + source[match.end():]
        if STYLE not in result:
            result = result.replace('</head>', '<link rel="stylesheet" href="' + STYLE + '">\n</head>', 1)
        if 'family=Inter' not in result:
            result = result.replace('</head>', '<link rel="stylesheet" href="' + FONT + '">\n</head>', 1)
        result = re.sub(r'/js/winf-footer\.js(?:\?[^"\s<>]*)?', SCRIPT, result)
        if result != source:
            page.write_text(result); updated.append(str(page.relative_to(ROOT)))
    return updated
if __name__ == '__main__':
    updated = synchronize()
    print('Updated ' + str(len(updated)) + ' static footers.')
