# Artist Portfolio (MERN)

React + Vite + Tailwind + Framer Motion frontend, Node + Express + MongoDB backend.
Every artwork gets its own frame at its own proportions (masonry gallery), so portrait, landscape and square pieces sit together without cropping.

## 1. Run it

```bash
# Backend
cd backend
cp .env.example .env        # paste your MongoDB connection string into MONGODB_URI
npm install
npm run seed                # loads the artwork from backend/data/artworks.js
npm run dev                 # http://localhost:5000

# Frontend (second terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173  (proxies /api to the backend)
```
Needs Node 18 or newer.

## 2. Add a new photo (a new frame)

1. Copy the image file(s) into `frontend/public/artworks/`.
2. Open `backend/data/artworks.js` and copy an artwork block. Change the title, `slug` (unique, lowercase, no spaces), text, and the `images` paths (1 to 10, the first is the cover).
3. In `backend/`, run `npm run seed`. Refresh the site.

Running `npm run seed` again is safe: it updates existing artworks (matched by `slug`) and never resets likes or views. Frame proportions are read from the cover image automatically.

## 3. Make it yours

| What | Where |
| --- | --- |
| Artist name, email, social links, About text, services, prices | `frontend/src/config/site.js` |
| Colours | `frontend/tailwind.config.js` |
| Artwork text, images, process steps | `backend/data/artworks.js` (then `npm run seed`), or edit in MongoDB |

### Reading commissions and messages
`GET /api/commissions` and `GET /api/contact` return everything people have sent. Update a status with `PUT /api/commissions/:id` or `PUT /api/contact/:id` and body `{ "status": "in-progress" }`.
These lists contain visitors' emails, so before going public set `ADMIN_KEY` in `backend/.env`; the endpoints then require the header `x-admin-key: <your key>`. (A shared secret, not a login system.)

## 4. Deploying
- Backend: set `MONGODB_URI`, `PORT`, `CLIENT_ORIGIN` (your frontend URL), `ADMIN_KEY`, and `TRUST_PROXY=1` as environment variables on the host. Never commit `.env`.
- Frontend: set `VITE_API_URL` to your API, e.g. `https://api.example.com/api`, then `npm run build`. Serve `dist/` with a rewrite of all routes to `index.html`.

## Notes
- Likes are counted in MongoDB; each browser remembers what it liked in `localStorage` (`liked_artworks`). This stops casual repeats but is not tamper-proof, because there are no accounts.
- Views are counted once per browser session per artwork (`sessionStorage`).
- Favorites live in `localStorage` (`favorite_artworks`) and are per browser.
