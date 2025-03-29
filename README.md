# Saudicate - Saudi-Style Trivia Game

A trivia game inspired by Seen Jeem (سين جيم), built with React and TypeScript. This game is designed for local multiplayer, with teams taking turns to answer questions of various difficulty levels.

## 🎮 Features

- Team-based gameplay with score tracking
- Multiple categories with questions of varying difficulty (200/400/600 points)
- Arabic RTL layout support
- Life lines for each team (Change Question, Pass Turn, Audience Suggestion)
- Responsive design for desktop and mobile

## 📋 Game Rules

1. Each team takes turns selecting a question
2. Questions have point values of 200, 400, or 600 based on difficulty
3. Teams earn points for correct answers
4. Turn always passes to the next team after a question
5. Each team has access to 3 lifelines (usable once per game)
6. Game ends when all questions have been answered

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/saudicate.git
cd saudicate
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 How to Play

1. On the setup screen, add team names or use the default teams
2. Click "Start Game" to begin
3. The current team selects a question tile
4. After reading the question, the team has time to answer
5. Mark whether the answer was correct or incorrect
6. The game automatically passes the turn to the next team
7. Continue until all questions have been answered
8. The team with the highest score wins!

## 🔧 Customization

You can customize the game by editing the `gameData.ts` file:
- Add or modify categories
- Change questions and answers
- Adjust point values

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the popular Saudi TV show "Seen Jeem" (سين جيم)
- Built with React and TypeScript
- Styled with styled-components
