# Chatapp

## Some Features

- Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI
- Authentication and authorization with JWT
- Real-time messaging with Socket.io
- Online user status (Socket.io and React Context)
- Global state management with Zustand
- Error handling on both server and client
- Deployment guide for free hosting
- And much more

## Setup `.env` file

```env
PORT=...
MONGO_DB_URI=...
JWT_SECRET=...
NODE_ENV=...
```

## Ports

- **Backend** (`npm run server` or `npm start`): listens on `PORT` from `.env`, or **5000** if unset.
- **Frontend** (local dev, `npm run dev` in `frontend/`): Vite is set to **3001** in `frontend/vite.config.js` (avoids clashing with other apps on 3000). Open [http://localhost:3001](http://localhost:3001). API requests to `/api` are proxied to the backend on port 5000.
- **Socket.IO** CORS in `backend/socket/socket.js` allows `http://localhost:3001` for the dev UI.

## Build the app

```shell
npm run build
```

## Start the app

```shell
npm start
```
