# 🤖 The AI Accord

**"Sign with the AI that shares your values."**

The AI Accord is a Farcaster Frames-based interactive quiz that matches users with one of five fictional AI personas based on their responses to a dystopian, ethically-loaded questionnaire.

Built on top of the [Celo Farcaster Frame Template](https://github.com/celo-org/celo-farcaster-frames), this app uses the Frames.js SDK and Next.js App Router to deliver a fast, visually engaging multi-step frame experience inside Warpcast.

---

## 🧩 How It Works

1. Users open the app via a Farcaster frame or Mini App
2. Each question is phrased like a clause in a fictional AI contract
3. Users accept/reject each clause (via buttons)
4. Answers are scored against AI personas
5. At the end, users are matched with their aligned AI archetype

---

## 💡 Quiz Concept

The quiz presents moral, strategic, and humorous prompts about AI governance and control. Each response contributes to one of the five AI characters:

- 🧠 **Obelisk** – The Strategist  
- 🔮 **Muse** – The Visionary  
- 🛡 **Kairo** – The Commander  
- 🦊 **Libby** – The Libertarian Bot  
- 👁 **Null** – The Observer  

---

## 🛠️ Built With

- [Next.js 13+](https://nextjs.org/)
- [Frames.js](https://framesjs.org/)
- [@farcaster/frame-sdk](https://www.npmjs.com/package/@farcaster/frame-sdk)
- [Vercel](https://vercel.com/)
- Open Graph meta tags for frame compatibility

---

## 🔧 Local Development

### 1. Clone the repo:

```bash
git clone https://github.com/your-username/the-ai-accord.git
cd the-ai-accord
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Add .env.local

```env
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Run dev server

```bash
npm run dev
```

## 🚀 Deployment

Deployed to Vercel with:

```bash
npx vercel deploy --prod
```

Make sure to add:

```env
NEXT_PUBLIC_URL=https://your-vercel-app-url.vercel.app
```

## 🧪 Testing on Warpcast

1. Open Warpcast Frame Developer Tool
2. Enter: https://your-vercel-app.vercel.app/frames
3. Test each frame's load, button transitions, and image rendering

## 📱 Farcaster Mini App Support

This app includes:

- ✅ manifest.json at .well-known/manifest.json
- ✅ sdk.actions.ready() integration
- ✅ Branded splash screen support

## 🙏 Credits

- Inspired by Celo's Farcaster Frames Template
- AI illustrations generated with NightCafe
- Frame logic powered by Frames.js

## 📜 License

MIT


