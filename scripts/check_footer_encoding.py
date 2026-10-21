#!/usr/bin/env python3
"""Check user-visible footer accents and symbols without external dependencies."""
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = ('Expansão', 'Conexões', 'Políticas', '™', '→', '↗', '↑')
BROKEN = ('Ã£', 'Ã§', 'Ã©', 'Ãƒ', 'â„', 'â†', 'Â©', '\ufffd')


class FooterText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = False
        self.found = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == 'footer' and dict(attrs).get('id') == 'winf-global-footer':
            self.active = self.found = True
        if self.active:
            self.parts.extend(value for _, value in attrs if value)

    def handle_endtag(self, tag):
        if tag == 'footer':
            self.active = False

    def handle_data(self, data):
        if self.active:
            self.parts.append(data)


def main():
    checked = 0
    failures = []
    for page in sorted(ROOT.rglob('*.html')):
        parser = FooterText()
        parser.feed(page.read_text(encoding='utf-8', errors='strict'))
        if not parser.found:
            continue
        text = ' '.join(parser.parts)
        missing = [value for value in EXPECTED if value not in text]
        broken = [value for value in BROKEN if value in text]
        if missing or broken:
            failures.append(f'{page.relative_to(ROOT)}: missing={missing}, malformed={broken}')
        checked += 1
    if failures:
        raise SystemExit('\n'.join(failures))
    if not checked:
        raise SystemExit('No static footers found.')
    print(f'{checked} footers: Portuguese accents, trademark and arrows verified.')


if __name__ == '__main__':
    main()
