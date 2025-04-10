# Shanet - Frontend

## Project Info

2110471 Computer Networks I Term Project - Shanet

## How to run the project

1. Run `npm install`

2. Make sure port 3000 is available and not used by any process

3. Make sure you are in the right branch

4. Run `npm run dev`

## Core Dependencies

- React & React-Dom 19: for building components

- Next.js 15.3: for making a web server (in our case, it will only serve the client side)

- Tailwind CSS 4: for being able to utilize CSS more easily

- Material UI (MUI): for some pre-made components

- Socket.IO Client 4.8: for handling chat logics

- Axios 1.8: for handling HTTP/HTTPS requests/responses (`import axios from "@/axios"`)

    - `.env` is needed with `NEXT_PUBLIC_SERVER_URL` with the value of your choice (e.g. `http://localhost:5000/`)