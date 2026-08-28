# AI Website Builder

A beginner-friendly web app that turns a plain-English description into a complete HTML website using OpenAI.

## Deploy from GitHub to Render

No local installation is needed.

1. Create a GitHub repository.
2. Upload all files from this project to the repository.
3. Go to [Render](https://render.com) and create a **Web Service**.
4. Connect your GitHub repository.
5. Use `npm install` as the build command, if Render asks for one.
6. Set the start command to `npm start`.
7. Add an environment variable named `OPENAI_API_KEY` and paste in your OpenAI API key.
8. Click **Deploy**.
9. Open the Render URL when the deployment finishes.

The server uses `process.env.PORT || 3000` and listens on `0.0.0.0`, as required by Render.

## Run locally (optional)

If you later choose to run it locally, install Node.js, copy `.env.example` to `.env`, add your OpenAI key, then run `npm install` and `npm start`. Open `http://localhost:3000`.

## How it works

- The browser sends the description to `POST /api/generate`.
- The Express server sends it to OpenAI. The API key never reaches the browser.
- The returned standalone HTML is displayed through an iframe `srcdoc` with `sandbox="allow-scripts"`.
- Downloading creates `website.html` entirely in the browser.