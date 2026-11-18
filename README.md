# Qbid

Qbid is a real-time multiplayer quiz-bidding game built with React, Vite, Express, Socket.IO and SQLite.

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173. Create a room in one browser, then join the six-character room code from another browser/device. At least two players are required to start.

## Production build
```bash
npm run build
```
The Vite frontend is generated in `dist/`. The Express/Socket.IO server is started separately with `npx tsx server/index.ts` (or compile the server with your preferred TypeScript build configuration). The SQLite database `qbid.sqlite` is created in the working directory.

## Gameplay
- Hidden bids are accepted by the server until the bidding deadline.
- Highest bid wins; equal bids are ordered by the server's receipt timestamp.
- Only a player receiving an answer attempt pays their wager.
- Correct answers add 10 marks and refund half the wager (rounded down); incorrect answers lose the wager.
- If nobody bids, the server creates a free-answer queue ordered by wallet balance and answering attempts.

## Question imports
CSV, XLSX and JSON are accepted. Required fields: `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option` (A/B/C/D). Optional: `category`, `difficulty`, `explanation`. The Question Bank page includes a downloadable CSV template.

## Notes
This is a local-first development build. Before public deployment, configure HTTPS, trusted origins, persistent hosting/backup for SQLite, room expiration, stronger host/session tokens, and a production-grade upload scanning/validation policy. Do not expose the server directly to the public internet without these hardening steps.
