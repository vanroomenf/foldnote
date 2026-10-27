# Hush

Prototype of an anonymous secrets app: one secret per screen (swipe up for the next), six kind reactions instead of comments, categories, a profile (nickname, avatar, gender including non-binary, age band, country), messages where the sender's profile is visible and the author stays anonymous, a safety filter, and a zero-tolerance rules flow.

## Run it

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Files

| File | What's in it |
|---|---|
| `src/App.jsx` | All screens: welcome, profile setup, reader (swipe deck), write, messages, me (profile, rules, language), ban screen |
| `src/data.js` | Categories, reactions and sample secrets (English and Italian) |
| `src/i18n.js` | Interface texts and device-language detection |
| `src/filter.js` | Safety filter: names (also disguised, like `1uca`, `l u c a`, `l.u.c.a`, look-alike letters), contact details, insults, threats, self-harm |
| `src/styles.css` | Styles, light and dark theme |

## Language

The app reads the device language (`navigator.languages`) and uses the first one it supports, falling back to English. Users can override it under Rules → Language. To add a language, add a block in `src/i18n.js` and the matching texts in `src/data.js`.

## Before going live

- Secrets and reactions are saved only in the browser (localStorage). A real app needs a backend and a database.
- Run the filter on the server too, add an AI context check, and keep human review before publishing. No word filter catches everything.
- Verify accounts (for example by phone number) so a banned user can't simply sign up again.
- Messages: deliver them through the backend, apply the same filter server-side, rate-limit first messages, and keep block/report history.
- Replace the ad slide (`AdSlide` in `App.jsx`) with your ad network.
