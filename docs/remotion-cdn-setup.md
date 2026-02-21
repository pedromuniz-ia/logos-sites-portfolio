# Remotion + CDN setup (chatbot demo)

## 1) Install dependencies

```bash
cd remotion
npm install
```

## 2) Render assets

```bash
npm run render:all
```

This generates:

- `media/chatbot-demo.webm`
- `media/chatbot-demo.mp4`
- `images/chatbot-demo-poster.jpg`

## 3) Upload to CDN

Upload these files to your CDN bucket/path, for example:

- `https://cdn.seudominio.com/media/chatbot-demo.webm`
- `https://cdn.seudominio.com/media/chatbot-demo.mp4`
- `https://cdn.seudominio.com/images/chatbot-demo-poster.jpg`

## 4) Caching headers

Set for immutable media:

- `Cache-Control: public, max-age=31536000, immutable`

## 5) Wire in page

In `chatbots-automacoes-ia/index.html`, update the `<video>` and `poster` URLs to the CDN paths.
