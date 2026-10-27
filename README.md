# Foldnote

Prototype of an anonymous secrets app: one secret per screen (swipe up for the next), twelve kind reactions instead of comments, all visible as emoji chips, a full report flow (reasons, optional details, hide for the reporter), secrets that expire after a time the author picks (24 hours, 7 days, 30 days or 1 year), and a private list of your own secrets where you can follow and delete them, categories, a private profile (nickname, avatar, gender including non-binary, age band, country) that only its owner sees, a safety filter, and a zero-tolerance rules flow.

## Run it

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Publish online (GitHub Pages)

Every push to `main` builds the app and publishes it with GitHub Actions (`.github/workflows/pages.yml`).
To switch it on once: repository **Settings → Pages → Source: GitHub Actions**.
With a free GitHub account this needs a public repository; private repositories need GitHub Pro or a team plan.
The site will be at `https://<username>.github.io/foldnote/`.

## Files

| File | What's in it |
|---|---|
| `src/App.jsx` | All screens: welcome, profile setup, reader (swipe deck), write, me (profile, rules, language), ban screen |
| `src/data.js` | Categories, reactions and sample secrets (English and Italian) |
| `src/i18n.js` | Interface texts and device-language detection |
| `src/filter.js` | Safety filter: names (also disguised, like `1uca`, `l u c a`, `l.u.c.a`, look-alike letters), contact details, insults, threats, self-harm |
| `src/styles.css` | Styles, light and dark theme |

## No contact between users

By design, Foldnote has no private messages, comments or followers, so nobody can use a secret to reach its author. The filter also blocks invitations to get in touch ("DM me", "scrivimi", social handles), and trying to contact someone is an immediate ban.

## Languages

The interface follows the phone's language (`navigator.languages`), falling back to English. Secrets are never translated. When someone writes a secret, its language is recognised automatically (`src/language.js`): the author sees the three most likely languages, with the best guess selected, and an "Another language" menu for anything else. This stays short however many languages the app supports. Under Me, readers choose which languages they want to read, or all languages; it starts with the phone's language.

## Before going live

- Secrets and reactions are saved only in the browser (localStorage). A real app needs a backend and a database.
- Run the filter on the server too, add an AI context check, and keep human review before publishing. No word filter catches everything.
- Verify accounts (for example by phone number) so a banned user can't simply sign up again.
- Replace the ad slide (`AdSlide` in `App.jsx`) with your ad network.

Live version: https://vanroomenf.github.io/foldnote/
