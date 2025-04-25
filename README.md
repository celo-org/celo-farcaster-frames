# Celo Farcaster Frames

This repository serves as a mono-repo for all Farcaster V2 frames for Celo.

## How to contribute

1. **Fork this repository**  
   - Click the "Fork" button at the top right of this repository page to create a copy of the repository under your own GitHub account.

2. **Clone your forked repository**  
   - Open your terminal or command prompt.
   - Run the following command to clone the repository to your local machine:
     ```bash
     git clone https://github.com/your-username/celo-farcaster-frames.git
     ```
   - Replace `your-username` with your GitHub username.

3. **Add your code**  
   - Navigate into the cloned repository:
     ```bash
     cd celo-farcaster-frames
     ```
   - Add your Farcaster frame code to the appropriate directory or create a new one if necessary.

4. **Commit your changes**  
   - Stage your changes:
     ```bash
     git add .
     ```
   - Commit your changes with a descriptive message:
     ```bash
     git commit -m "Add new Farcaster V2 frame for Celo"
     ```

5. **Push your changes to GitHub**  
   - Push your changes to your forked repository:
     ```bash
     git push origin main
     ```

6. **Create a Pull Request**  
   - Go to the original repository on GitHub.
   - Click on the "Pull Requests" tab, then click "New Pull Request".
   - Select "compare across forks" if necessary.
   - Choose your forked repository and branch as the compare branch.
   - Provide a clear and descriptive title and description for your pull request, explaining what changes you made and why.

7. **Wait for review**  
   - The repository maintainers will review your pull request. They may request changes or approve it.

By following these steps, you can easily share your Farcaster frames with the Celo community. Thank you for your contributions!

# 🗂 DeepGov Compass – Project Task Checklist

Welcome to the collaborative build of **DeepGov Compass**, a Farcaster Frame quiz experience developed by **@rainwaters11** and **@ruthchisom**. This roadmap helps us organize the tasks needed to design, develop, and launch our interactive quiz.

---

## 🔍 0. Determine the Type of Quiz (First Step!)

Before anything else, let’s decide the exact style and tone of our quiz.

- [ ] Finalize the quiz concept:  
  Example options:
  - **BotMatch** – Which AI shares your values?
  - **MachineVote** – Which AI candidate gets your vote?
  - **SyntherType** – Your AI personality type
  - **Bot’s Best Friend** – Which AI would you trust with your dog?

- [ ] Identify the **values or traits** we want to measure  
  (e.g. political views, AI risk tolerance, openness, fairness, autonomy)

- [ ] Finalize a project name and tone (serious, fun, aesthetic, etc.)

- [ ] Save these decisions in `planning/concept.md`

---

## ✅ Task List

### ✍️ 1. Writing the List of Quiz Questions

- [ ] Decide on 5–7 questions that assess political or ethical beliefs about AI.
- [ ] Ensure each question has 4 distinct answer options.
- [ ] Save draft in `planning/questions.md`.

### 🧠 2. Creating the AI Candidate List

- [ ] Define 3–5 fictional AI "personas" (e.g., SafeMind, LibertAI).
- [ ] Assign core values/traits to each candidate.
- [ ] Save draft in `planning/candidates.md`.

### 🧮 3. Designing Scoring Rules

- [ ] Map answers to candidate scores.
- [ ] Decide how answers accumulate toward a match.
- [ ] Save logic in `planning/scoring-rules.md`.

### 🎨 4. Drawing Images for Each Question

- [ ] Design static images for each quiz question (`images/q1.png`, etc.).
- [ ] Create result images for each candidate (`images/result-libertai.png`, etc.).
- [ ] Store in the `public/images/` folder or similar.

### 🌐 5. Building the HTML Frames

- [ ] Create OG-tag based HTML pages for each frame (`frames/question1.html`, etc.).
- [ ] Include `fc:frame`, `fc:frame:image`, and `fc:frame:button:N` tags.
- [ ] Host them on a CDN-friendly location (Vercel, Netlify, etc.).

### 🧑‍💻 6. Coding the Frame Server

- [ ] Set up a lightweight Node/Express server (or similar).
- [ ] Handle POST requests from button clicks.
- [ ] Verify FrameSignaturePacket using a Farcaster Hub.
- [ ] Return new frames dynamically.

---

