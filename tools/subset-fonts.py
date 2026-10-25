"""Download tiny subsets of the page's Google Fonts into fonts/ and print the @font-face rules.

Every bit of text on the home page is fixed, so each font only ships the characters it actually shows.
If you change any visible text (the tagline, a card title, the footer), add the new text to
FAMILIES below, run this script, and paste the printed rules over the @font-face block in index.html.

Run: python3 tools/subset-fonts.py   (from the repository root)
All fonts are from Google Fonts under the SIL Open Font License, which allows self-hosting.
"""
import re, urllib.parse, urllib.request
from pathlib import Path

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
BASIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;!?\'"()-&/'

# css family name, Google Fonts family spec, weight, file name, characters to keep
FAMILIES = [
    ('Syne', 'Syne:wght@800', 800, 'syne-800', 'Midnights NEW'),
    ('Neonderthaw', 'Neonderthaw', 400, 'neonderthaw-400', 'Little games for late nights. Still developing.'),
    # Body font: footer text plus basic Latin so small copy edits never fall back.
    ('Figtree', 'Figtree:wght@400', 400, 'figtree-400', BASIC),
]

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30).read()

root = Path(__file__).resolve().parent.parent
out = root / 'fonts'
out.mkdir(exist_ok=True)
rules = []
for name, spec, weight, file, text in FAMILIES:
    chars = ''.join(sorted(set(text)))
    css = get(f'https://fonts.googleapis.com/css2?family={spec}&display=swap&text={urllib.parse.quote(chars)}').decode()
    urls = re.findall(r'url\((https://[^)]+)\)', css)
    assert len(urls) == 1, (name, urls)
    data = get(urls[0])
    (out / f'{file}.woff2').write_bytes(data)
    rules.append(f"    @font-face {{ font-family: '{name}'; font-style: normal; font-weight: {weight}; font-display: swap; src: url(fonts/{file}.woff2) format('woff2'); }}")
    print(f'/* {file}.woff2 {len(data) / 1024:.1f} KB */')
print('\n'.join(rules))
