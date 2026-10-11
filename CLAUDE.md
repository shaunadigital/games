# Games

The home page for https://games.shauna.digital. Read `README.md`: it explains the hosting, the domain, how games are mounted under a path, and how to add one.

- Plain static site: `index.html` and `vercel.json`. No build step.
- Repository `shaunagits/games`, Vercel project `games`, team `shaunagits-projects`. Every push to `main` deploys to production.
- Current design (updated 2026-10-11): title "Midnights" (Syne), neon tagline "Little games for late nights." that flickers, straight (untilted) polaroid game cards on a marbled teal background drawn in code (original, inspired by a teal marbled vinyl photo; the photo and its label are not used), teal polaroid tab icon. Each card's photo is the game's own title treatment: 13 Beads is its full bead wordmark (1 3, pink bead, B E A D S on a string, copied from the game's header), Home Before Dark is Press Start 2P, Saltwhisker is Shantell Sans in sou'wester yellow over a soft sea.
- Cards (2026-10-11): newest game first with a pink "New" sticker (move it when a new game lands). Under each photo is a two-line handwritten teaser in Edu SA Hand (no game name; the name is in the link's aria-label) and an always-visible "Play" cue. Teasers chosen by Shauna: Saltwhisker "Help Walter / catch dinner." (Walter is the cat), Home Before Dark "Pedal fast. / Don't look back.", 13 Beads "Make one. / Trade one." Keep new captions in that style. The last card is a "Still developing." polaroid with a slow fog, standing in for the next game.
- Footer: "Made by Shauna." (links to https://shauna.dev) plus "By day I build software for growing businesses at shauna.digital" (links to https://shauna.digital).
- The page description is "Little games for late nights. Made by Shauna." Link previews use og:title "Midnights: little games for late nights" and `og.png` (1200 by 630, the three cards on marble). Regenerate `og.png` when the cards change.
- Vercel builds one project at a time for this account; a stuck build on another project (for example faf-app) blocks deploys here. Check the queue before assuming a push failed.
- No em dashes in any text. No AI or assistant credit in code, commits, or docs.
- All artwork is original. No artist names, logos, album artwork, or lyrics.
- Shauna creates new GitHub repositories herself. A session cannot.
