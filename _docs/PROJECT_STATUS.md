# Project status

Last updated 2026-10-17.

## Live now

All of this is committed to `main` and deployed to https://games.shauna.digital.

- Cards: TropiChop (with a "New" sticker), Saltwhisker, Home Before Dark, 13 Beads, in that order. Straight polaroids with no captions, no Play buttons (the whole card is the link). Each card photo is the game's logo over its background (`img/<path>-card.webp`). The "Still developing." card is hidden in an HTML comment.
- Background: Shauna's cork wall at night (`img/wall.webp`), with the cards clipped to strings of lights. Four across on wide screens, two rows of two on medium screens, a swipeable clothesline with dots on phones. See `CLAUDE.md` for how it behaves.
- Footer: "Made by Shauna." (shauna.dev) plus a line to shauna.digital, on a dark band.
- Link previews: `og.png` plus Open Graph and Twitter card tags. Saltwhisker has its own preview image (`og.jpg` in its repo, a moonlit pier shot).
- All four games link back to the games page (the first three checked 2026-10-11; TropiChop's "More games" link on its menu checked 2026-10-16).
- Fonts: self-hosted subsets in `fonts/`, about 13 KB in total (Syne, Neonderthaw, Figtree), no requests to Google.
- There is no test suite. Changes are checked by rendering the page with Playwright at phone and desktop widths.

## Decisions

Append new rows. If a row stops being true, mark it superseded rather than deleting it.

| Date | Decision | Why |
|---|---|---|
| 2026-10-11 | Cards are straight, not tilted. | Shauna's call. It also removed a bug where the Coming soon card's own tilt was overridden by a more specific rule. |
| 2026-10-11 (superseded 2026-10-17) | 13 Beads card shows the game's full bead wordmark. | Copied from the game's header so the card matches what players see inside the game. |
| 2026-10-11 (superseded 2026-10-16) | Captions are teasers only; the game name is in each link's aria-label. | The card art already shows the name. The aria-label keeps the links named for screen readers. |
| 2026-10-11 (superseded 2026-10-16) | Teasers: "Feed Walter by eight.", "Pedal fast, don't look back.", "Make and trade bracelets." | Chosen by Shauna. Walter is the Saltwhisker cat. |
| 2026-10-12 (superseded 2026-10-16) | Saltwhisker teaser now "Help Walter catch dinner." | Shauna's pick. The game dropped its eight o'clock dinner deadline. |
| 2026-10-11 (superseded 2026-10-16) | Caption font is Momo Signature at 14px, one line, with cards at least 264px wide. | Shauna picked it from fonts Google added in 2025 and 2026 (Caveat was too common; Edu SA Hand was tried first). The longest teaser is 221px at 14px and must fit the 224px caption on the narrowest card, so the grid minimum went from 250px to 264px. |
| 2026-10-11 | No Play buttons. | A Play label beside the caption forced captions onto two lines; it moved to a pill on the photo, then Shauna removed it as unneeded because the whole card is the link. |
| 2026-10-11 | Newest game first, with a pink "New" sticker. | Marketing review: gives returning visitors a reason to look again. Move the sticker when a game is added. |
| 2026-10-11 | "Still developing." card hidden, kept in an HTML comment. | On desktop it sat alone on the second row. Kept so it can tease the next game. |
| 2026-10-11 | Footer on a dark band, with a line to shauna.digital. | The old light-on-teal footer was about 2.7:1 contrast. The marketing review suggested one quiet line to the business, not a sales pitch. |
| 2026-10-11 | Link preview images for the games page and Saltwhisker. | Shared links to both showed as bare text. |
| 2026-10-11 | Not done from the marketing review: a plain line under the tagline, and a "what kind of game" line per card. | Shauna did not pick them. |
| 2026-10-11 (superseded 2026-10-17) | Background is the gooey blobs (mix A), Sunset lava colors, "just the way it is for now". | Shauna passed on the teal marble, glow-in-the-dark ceiling stars, a corkboard with string lights, arcade carpet, a stars and lights mix, and a 70s bead curtain. Ribbed glass over the blobs was dropped because it hides the split and merge and is the heaviest effect on phones. |
| 2026-10-11 | Phone interactions: tap to split, scroll drift, color pull on scroll. | All work through touch and scroll, so there is no "allow motion" prompt and iPhone and Android behave the same. |
| 2026-10-11 | Blobs are metaballs on a low-resolution canvas, not an SVG blur filter. | A full-screen SVG blur every frame is too heavy for phones. The canvas runs at about 30 frames a second. |
| 2026-10-11 | Fonts self-hosted as per-font subsets of only the characters shown (`tools/subset-fonts.py`). | All page text is fixed, so this cut fonts from about 219 KB in 9 files from two Google servers to about 38 KB in 7 files from this site, with no extra connections before the title can draw. Figtree keeps basic Latin so footer edits do not break; Figtree 500 and 600 were dropped because nothing used them. |
| 2026-10-16 | TropiChop added at `/tropichop`, first with the "New" sticker. Teaser "Chop fruit, dodge slippahs." (219px). Card photo is the game's logo over its beach sunset. Tint `#ff9a1a`. | New game. "Chop fruit, dodge the slippah." was 241px, too wide for the 224px caption. |
| 2026-10-16 | `og.png` now shows the three newest cards, so 13 Beads drops out of the preview. | The recipe hides the 4th card to keep a single row of three. |
| 2026-10-16 | All card captions removed; Momo Signature font dropped; cards keep a blank 52px polaroid bottom. | Shauna: the cards look better without captions. |
| 2026-10-17 | Saltwhisker, Home Before Dark and 13 Beads cards now show Shauna's new logo over her new background for each game, like TropiChop. Fonts used only by the old card titles (Fredoka, Press Start 2P, Shantell Sans) removed. | Shauna made the art to match the TropiChop card. Logos were cut from their white backgrounds and composed at 600 by 600. |
| 2026-10-17 | Background is now polaroids clipped to strings of lights on Shauna's cork wall at night. Blobs, film grain and their script removed. | Shauna: the blobs were distracting next to the new card art. She picked the wall from four options (art glow, night sky, calmer blobs, wall). |
| 2026-10-17 | Layout: 4 across from 1060px, 2 by 2 below that, and on phones (under 700px) one clothesline you swipe sideways with dots. The bulbs near a hovered, focused or centered card glow in that game's color. A tap swings the card before the game opens; on phones a tap on a side card centers it first. | Shauna picked the swipeable clothesline for phones. 4 or 2 columns means no card ever sits alone on a row. |
| 2026-10-17 | `og.png` shows all four cards on the wall. | The 4-across layout fits 1200 by 630. |

## Queue

1. Restoring the hidden "Still developing." card would make 5 cards, which leaves one alone on a row in the 4-across and 2 by 2 layouts. Adjust the column counts if it comes back.
2. Tab icon is still the teal polaroid. Ask Shauna whether it should move to the plum and pink palette.
3. When a game is added: put its card first, move the "New" sticker, add its card image to `img/<path>-card.webp` (its logo over its background, 600 by 600), add its bulb color in the script (`TINT`, keyed by its path), check the column counts still leave no card alone on a row, regenerate `og.png`, and update the README tables.
4. Refresh Saltwhisker's `og.jpg` when its art changes.

## How to

**Regenerate `og.png`.** Open `index.html` in Playwright at 1200 by 630, wait for fonts, inject this CSS, then screenshot the viewport:

```css
main{padding:56px 0 0!important;gap:34px!important}
footer{display:none!important}
.tagline,.tagline .tube,.bulb{animation:none!important}
body{overflow:hidden}
```

**Rebuild the fonts.** After changing any visible text, add it to `tools/subset-fonts.py`, run `python3 tools/subset-fonts.py` from the repository root, and paste the printed `@font-face` rules over the block at the top of the `<style>` in `index.html`.

