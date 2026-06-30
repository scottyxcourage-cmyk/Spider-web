# Spider Hub

Premium entertainment hub — movies, music, downloads. Now with a real backend:
account signups send real verification emails, passwords are hashed (bcrypt),
and user data is stored in SQLite (better-sqlite3) instead of localStorage.

## Project Structure

```
spiderhub/
├── server/
│   ├── server.js        # Express app: serves the frontend + API
│   ├── db.js             # Built-in node:sqlite setup (no native build step - Node 22.5+)
│   ├── email.js          # Nodemailer/SMTP verification + reset emails
│   └── routes/auth.js    # signup / login / verify / forgot / reset / me / logout
├── data/                  # sqlite db lives here at runtime (gitignored)
├── index.html             # Entry point / SPA
├── verify.html             # Email verification landing page
├── reset.html               # Password reset landing page
├── css/  ...                # Styling (now with stronger mobile rules)
└── js/   ...                # Frontend logic; auth.js now calls the API

```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```
   - `JWT_SECRET` — any long random string
   - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` — your free SMTP provider creds
     - **Gmail**: host `smtp.gmail.com`, port `587`, and you MUST use an
       [App Password](https://myaccount.google.com/apppasswords) (not your normal password —
       Gmail blocks plain logins from apps). Gmail's free tier caps around ~500 emails/day.
     - **Brevo** (formerly Sendinblue): free tier gives 300 emails/day, no card required.
       Sign up, grab SMTP creds from Settings → SMTP & API.
   - `EMAIL_FROM` — the "From" address shown on the email (often must match SMTP_USER)
   - `PUBLIC_URL` — the URL this app will be live at (used to build the links inside emails)
3. Start it:
   ```
   npm start
   ```
   Visit `http://localhost:3000` (or your `PORT`).

   Note: the database uses Node's built-in `node:sqlite` module (requires Node 22.5+,
   pxxl.run's runtime is Node 26) instead of `better-sqlite3`, since `better-sqlite3`
   needs to compile native code at install time and fails on build servers without
   Python/a matching prebuilt binary (this is what caused the earlier pxxl deploy
   failure). `node:sqlite` ships with Node itself, so there's nothing to compile.

## Deploying (pxxl.run via Termux, same flow as Spider Web)

1. Push this folder to your GitHub repo (`github.com/scottyxcourage-cmyk/...`).
2. On pxxl.run, connect the repo for auto-deploy, same as Spider Web.
3. In the pxxl.run dashboard, set environment variables matching `.env.example`
   (`JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `PUBLIC_URL`).
   Set `PUBLIC_URL` to the actual `https://yourapp.pxxl.run` URL pxxl.run gives you —
   verification/reset email links are built from this.
4. pxxl.run should run `npm install` then `npm start` automatically. The SQLite file
   is created automatically under `data/` on first run — make sure that directory
   persists between deploys (check pxxl.run's persistent storage / volume settings,
   otherwise registered users disappear on redeploy).

## How auth works now

- Signup hashes the password with bcrypt and stores the user in SQLite, **unverified**.
- A real email is sent (via your SMTP provider) with a verification link.
- Login is blocked until the email is verified ("Resend verification email" link appears
  on a failed login if that's why it failed).
- Sessions are an httpOnly cookie holding a signed JWT — nothing sensitive is kept in
  the browser, and sessions survive refreshes/app restarts.
- "Forgot password" sends a real reset email with a time-limited link to `reset.html`.
- All sensitive auth endpoints are rate-limited (30 requests / 15 min) to slow down
  brute-force attempts.

## Movie/Music API

Still uses the Movie, TV, Music Search and Download API via RapidAPI.
Key is in `js/config.js` — update it there if it changes.

## Mobile

Touch targets were enlarged (40-44px), inputs use 16px font to stop iOS auto-zoom,
the nav bar scrolls horizontally instead of clipping on narrow phones, modal/profile/hero
layouts collapse to single-column under 480px, and hover-only animations are disabled
on touch devices.

Developed by Ben Maps • Zimbabwe 🇿🇼
