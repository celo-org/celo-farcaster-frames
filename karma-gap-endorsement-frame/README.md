# KarmaGAP Endorsement Frame

This project is a simple frontend built with **Next.js** that dynamically fetches and displays project data from the **KarmaGAP API** using the URL slug. It includes interactive UI components like buttons for "Tip", "Learn More", "Endorse", and "Next Project", and conditionally renders an endorsement form.

> This is a work-in-progress toward supporting a Farcaster V2 Frame.

---

## 🔧 Features

- Fetches real KarmaGAP project data from `https://gapapi.karmahq.xyz/projects/[slug]`
- Displays title, description, and placeholder image
- Conditionally shows an endorsement form
- Beautiful and responsive UI with vanilla CSS
- Built with **Next.js 13+ App Router**

---

## 📁 Project Structure

```

/app
├── project
│   └── \[slug]
│       └── page.tsx       # Project details page

/globals.css                # Global CSS styles
/public/default-image.png   # Placeholder image

````

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone [https://github.com/RuthChisom/celo-farcaster-frames.git](https://github.com/RuthChisom/celo-farcaster-frames.git)
cd celo-farcaster-frames/karma-gap-endorsement-frame
````

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Run Development Server

```bash
npm run dev
```

---

## 🧠 How It Works

* Uses `usePathname()` to get the slug from the URL
* Fetches project data from KarmaGAP API on mount
* Renders project details or a loading state
* Hides the endorsement form until the user clicks the "Endorse" button

---
## Testing the Frame

Here’s the link to this template: [KarmaGap Endorsement Frame](https://celo-farcaster-frames-phi.vercel.app/)

---
## 🧪 To Do (Future Enhancements)

* Add OG meta route for Farcaster V2 frame support (`/project-frame/[slug]/route.ts`)
* Implement a `/api/frame-handler` POST route for frame interactions
* Generate dynamic OG images for Farcaster preview
* Add backend storage or DB for endorsements

---

## 🙋‍♀️ Author

Built by **Ruth Chisom**, a web developer, mom in tech, and Web3 enthusiast.

* Twitter: [@Techy Chisom](https://twitter.com/thischisom)
* Medium: [medium.com/@techychisom](https://medium.com/@techychisom)
