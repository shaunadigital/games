# Project status

Last updated 2026-10-16.

## Live now

All of this is committed to `main` and deployed to https://games.shauna.digital.

- Cards: TropiChop (with a "New" sticker), Saltwhisker, Home Before Dark, 13 Beads, in that order. Straight polaroids, one-line teasers in Momo Signature, no Play buttons (the whole card is the link). The "Still developing." card is hidden in an HTML comment.
- Background: gooey blobs in the Sunset lava colors, with color pull, liquid stretch, tap to split, scroll drift and film grain. See `CLAUDE.md` for how it behaves.
- Footer: "Made by Shauna." (shauna.dev) plus a line to shauna.digital, on a dark band.
- Link previews: `og.png` plus Open Graph and Twitter card tags. Saltwhisker has its own preview image (`og.jpg` in its repo, a moonlit pier shot).
- All three games link back to the games page (checked on the live sites 2026-10-11).
- Fonts: self-hosted subsets in `fonts/`, about 38 KB in total, no requests to Google.
- There is no test suite. Changes are checked by rendering the page with Playwright at phone and desktop widths.

## Decisions

Append new rows. If a row stops being true, mark it superseded rather than deleting it.

| Date | Decision | Why |
|---|---|---|
| 2026-10-11 | Cards are straight, not tilted. | Shauna's call. It also removed a bug where the Coming soon card's own tilt was overridden by a more specific rule. |
| 2026-10-11 | 13 Beads card shows the game's full bead wordmark. | Copied from the game's header so the card matches what players see inside the game. |
| 2026-10-11 | Captions are teasers only; the game name is in each link's aria-label. | The card art already shows the name. The aria-label keeps the links named for screen readers. |
| 2026-10-11 | Teasers: "Feed Walter by eight.", "Pedal fast, don't look back.", "Make and trade bracelets." | Chosen by Shauna. Walter is the Saltwhisker cat. |
| 2026-10-12 | Saltwhisker teaser now "Help Walter catch dinner." | Shauna's pick. The game dropped its eight o'clock dinner deadline. |
| 2026-10-11 | Caption font is Momo Signature at 14px, one line, with cards at least 264px wide. | Shauna picked it from fonts Google added in 2025 and 2026 (Caveat was too common; Edu SA Hand was tried first). The longest teaser is 221px at 14px and must fit the 224px caption on the narrowest card, so the grid minimum went from 250px to 264px. |
| 2026-10-11 | No Play buttons. | A Play label beside the caption forced captions onto two lines; it moved to a pill on the photo, then Shauna removed it as unneeded because the whole card is the link. |
| 2026-10-11 | Newest game first, with a pink "New" sticker. | Marketing review: gives returning visitors a reason to look again. Move the sticker when a game is added. |
| 2026-10-11 | "Still developing." card hidden, kept in an HTML comment. | On desktop it sat alone on the second row. Kept so it can tease the next game. |
| 2026-10-11 | Footer on a dark band, with a line to shauna.digital. | The old light-on-teal footer was about 2.7:1 contrast. The marketing review suggested one quiet line to the business, not a sales pitch. |
| 2026-10-11 | Link preview images for the games page and Saltwhisker. | Shared links to both showed as bare text. |
| 2026-10-11 | Not done from the marketing review: a plain line under the tagline, and a "what kind of game" line per card. | Shauna did not pick them. |
| 2026-10-11 | Background is the gooey blobs (mix A), Sunset lava colors, "just the way it is for now". | Shauna passed on the teal marble, glow-in-the-dark ceiling stars, a corkboard with string lights, arcade carpet, a stars and lights mix, and a 70s bead curtain. Ribbed glass over the blobs was dropped because it hides the split and merge and is the heaviest effect on phones. |
| 2026-10-11 | Phone interactions: tap to split, scroll drift, color pull on scroll. | All work through touch and scroll, so there is no "allow motion" prompt and iPhone and Android behave the same. |
| 2026-10-11 | Blobs are metaballs on a low-resolution canvas, not an SVG blur filter. | A full-screen SVG blur every frame is too heavy for phones. The canvas runs at about 30 frames a second. |
| 2026-10-11 | Fonts self-hosted as per-font subsets of only the characters shown (`tools/subset-fonts.py`). | All page text is fixed, so this cut fonts from about 219 KB in 9 files from two Google servers to about 38 KB in 7 files from this site, with no extra connections before the title can draw. Figtree keeps basic Latin so footer edits do not break; Figtree 500 and 600 were dropped because nothing used them. |
| 2026-10-16 | TropiChop added at `/tropichop`, first with the "New" sticker. Teaser "Chop fruit, dodge slippahs." (219px). Card photo is the game's logo over its beach sunset. Tint `#ff9a1a`. | New game. "Chop fruit, dodge the slippah." was 241px, too wide for the 224px caption. |
| 2026-10-16 | `og.png` now shows the three newest cards, so 13 Beads drops out of the preview. | The recipe hides the 4th card to keep a single row of three. |

## Queue

1. Check the blobs on an older phone. If it stutters, use one canvas pixel per 4 screen pixels on phones, or fewer droplets.
2. Tab icon is still the teal polaroid. Ask Shauna whether it should move to the plum and pink palette.
3. When a game is added: put its card first, move the "New" sticker, measure its teaser (one line at 14px within 224px), add its card title and teaser to `tools/subset-fonts.py` and rebuild the fonts, add its tint color in the background script (`TINT`, keyed by its path), regenerate `og.png`, and update the README tables.
4. Refresh Saltwhisker's `og.jpg` when its art changes.

## How to

**Regenerate `og.png`.** Open `index.html` in Playwright at 1200 by 630, wait for fonts, inject this CSS, then screenshot the viewport:

```css
main{max-width:858px!important;padding:64px 0 0!important;gap:30px!important}
.games{grid-template-columns:repeat(3,270px)!important;gap:24px!important}
.games>li:nth-child(4),footer{display:none!important}
.tagline,.tagline .tube{animation:none!important}
body{min-height:630px!important;overflow:hidden}
```

**Rebuild the fonts.** After changing any visible text, add it to `tools/subset-fonts.py`, run `python3 tools/subset-fonts.py` from the repository root, and paste the printed `@font-face` rules over the block at the top of the `<style>` in `index.html`.

**Check a teaser fits.** Render it in Momo Signature at 14px with `white-space: nowrap` and read its width. It must be 224px or less.
