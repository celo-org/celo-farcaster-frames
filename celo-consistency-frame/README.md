# Celo Consistency Frame

A Farcaster Frame that showcases your consistency in building on Celo through GitHub contributions.

## Features

- 📊 **GitHub Contribution Visualization**: Display your GitHub contribution activity in a clean, visual format.
- 📈 **Weekly Summary**: Track your weekly contribution progress and compare it with previous weeks.
- 🏆 **Leaderboard**: Compete with other Celo developers on a leaderboard.
- 🔥 **Streak Tracking**: Keep track of your contribution streaks to stay motivated.
- 🔔 **Notifications**: Get weekly updates on your position on the leaderboard.

## How It Works

1. **Add your GitHub profile**: Connect your GitHub account to start tracking your consistency.
2. **Show your weekly activity**: View your GitHub contributions in a visually appealing frame.
3. **Weekly notifications**: Get updates on your position on the leaderboard.
4. **Track your streaks**: Monitor your daily contribution streaks, similar to Duolingo's streak system.
5. **Optional rewards**: Top 10 builders may receive weekly rewards (implementation up to the community).

## Technical Implementation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A GitHub personal access token for API access

### Environment Setup

Create a `.env` file in the root directory with the following content:

```
GITHUB_TOKEN=your_github_personal_access_token
NEXT_PUBLIC_HOST=http://localhost:3000
```

In production, set `NEXT_PUBLIC_HOST` to your deployed application URL.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Technology Stack

- **Next.js**: React framework for the web application
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Canvas**: For generating frame images
- **GitHub API**: For fetching contribution data
- **Farcaster Frames Protocol**: For creating interactive frames

## Deployment

This application can be deployed to platforms like Vercel or Netlify. Make sure to set the environment variables in your deployment platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/my-feature`
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Built for the Celo community
- Inspired by GitHub's contribution graph
- Thanks to the Farcaster team for the frames protocol