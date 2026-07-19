# Fair Split — Frontend

Next.js + Tailwind CSS frontend for Fair Split, a group expense settlement app.
Talks to the [Spring Boot backend](../fair-split-springboot) over REST.

## Setup

```bash
npm install
cp .env.example .env.local   # adjust the URL if your backend runs elsewhere
npm run dev
```

Runs on `http://localhost:3000`. Requires the backend running on
`http://localhost:5000` (see backend README for setup).

```bash
npm run build   # production build
```

## Pages

| Route | Purpose |
|---|---|
| `/` | Create a group (trip name + members) |
| `/group/[id]` | Add/edit/delete expenses for a group |
| `/group/[id]/settle` | View the minimum-payment settlement result |

## Structure

```
app/
  page.js                  -> Home / create group
  group/[id]/page.js       -> Add expenses (create, edit, delete)
  group/[id]/settle/page.js -> Settlement result
  layout.js, globals.css   -> Shared layout, fonts, styling
components/
  BigButton.js, Card.js    -> Reusable cartoon-style UI primitives
lib/
  api.js                   -> All backend API calls in one place
```

## Notes

- Styling uses Tailwind with a custom cartoon-friendly palette/shadow style
  (see `tailwind.config.js`) — chunky borders, bold shadows, playful fonts
  (Baloo 2 / Nunito, loaded via Google Fonts link tags in `layout.js`).
- `canvas-confetti` fires on the settle page when there are real transactions
  to display (not when everyone's already even).
- All API calls are centralized in `lib/api.js` — if the backend URL or an
  endpoint path changes, that's the only file that needs updating.