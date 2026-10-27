# Foldnote

Prototype of an anonymous secrets app: one secret per screen (swipe up for the next), twelve kind reactions instead of comments (each secret shows its four most used, the rest under "More"), categories, a private profile (nickname, avatar, gender including non-binary, age band, country) that only its owner sees, a safety filter, and a zero-tolerance rules flow.

## Run it

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

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

## Language

The app reads the device language (`navigator.languages`) and uses the first one it supports, falling back to English. Users can override it under Rules → Language. To add a language, add a block in `src/i18n.js` and the matching texts in `src/data.js`.

## Before going live

- Secrets and reactions are saved only in the browser (localStorage). A real app needs a backend and a database.
- Run the filter on the server too, add an AI context check, and keep human review before publishing. No word filter catches everything.
- Verify accounts (for example by phone number) so a banned user can't simply sign up again.
- Replace the ad slide (`AdSlide` in `App.jsx`) with your ad network.
