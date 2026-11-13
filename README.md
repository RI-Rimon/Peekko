# 🎮 Peekko — A Smart Hide-and-Seek Game

**Hide smart. Search carefully. Outsmart your opponent.**

Peekko is a fast-paced, browser-based hide-and-seek strategy game where you either hide from an intelligent AI Seeker or hunt it down across four detailed environments.

Choose your role, explore handcrafted maps, use strategic hiding spots, and outsmart your opponent through movement, positioning, and careful decision-making.

Built with HTML5 Canvas, vanilla JavaScript, and CSS, Peekko delivers an interactive gaming experience without relying on external game engines or JavaScript frameworks.

<p align="center">
  <img src="assets/screenshot.png" alt="Peekko Game Preview" width="850" />
</p>


---

## 📖 About Peekko

Peekko is one of my fun projects it is a single-page, single-player browser game built around the classic concept of hide-and-seek, with strategic gameplay and a rule-based AI opponent.

Players can choose between two roles:

- **Hider:** Sneak around the environment, find the perfect hiding place, and survive while the AI Seeker systematically searches the map.
- **Seeker:** Track down the hidden AI opponent by exploring the environment and inspecting potential hiding spots before running out of attempts.

Every round creates a different strategic challenge. Players must consider hiding locations, movement, visibility, sound, and search patterns to win.

Your score, wins, losses, selected map, theme, and difficulty preferences are saved locally in your browser.

---

## ✨ Features

### 🎯 Two Gameplay Roles

- Play as either the Hider or the Seeker.
- Switch roles after every round.
- Each role has its own objectives and gameplay mechanics.
- Different strategies are required to survive or successfully locate the opponent.

### 🗺️ Four Detailed Maps

Explore four unique environments, each featuring its own atmosphere, layout, obstacles, and hiding locations.

| Map | Environment | Hiding Spots |
|---|---|---:|
| Skyglass Penthouse | Terrace, master suite, lounge bar, cinema, and kitchen | 20 |
| Heritage Manor | Atrium, banquet hall, parlor, suites, and library | 20 |
| Underground Basement | Parked cars, elevators, boiler room, lockers, and pillars | 26 |
| Grand Shopping Mall | Storefronts, escalators, fountain, kiosks, and aisles | 26 |

Each environment provides different navigation challenges and hiding opportunities.

### 🤖 Intelligent AI Seeker

The Seeker Bot uses rule-based decision-making to search for the hidden player.

Key AI capabilities include:

- **Systematic Room Searching:** Sweeps rooms methodically instead of moving randomly.
- **Navigation Graph:** Finds routes around walls and obstacles.
- **Limited Vision:** Uses a directional field of view to detect exposed players.
- **Sound Detection:** Can hear player movement and investigate the source of noise.
- **Rechecking Behaviour:** May revisit previously searched locations.

These mechanics make the bot more than a simple random-moving opponent.

### 🔥 Hot / Warm / Cool Search Hints

When playing as the Seeker, unsuccessful searches provide proximity hints:

- **Hot:** The hidden opponent is very close.
- **Warm:** The opponent is nearby.
- **Cool:** The opponent is farther away.

These clues encourage players to use information from previous searches to narrow down possible hiding locations.

### ⚡ Three Difficulty Levels

Choose the challenge that suits your play style.

| Setting | Easy | Normal | Hard |
|---|---:|---:|---:|
| Seeker Attempts | 13 | 10 | 7 |
| Bot Checks as Hider | 7 | 10 | 13 |
| Bot Speed | Slower | Standard | Faster |
| Search Hints | Hot, Warm, Cool | Hot, Warm, Cool | Hot only |

Difficulty settings affect the bot's behaviour, search limits, and available information.

### 🔊 Procedural Audio System

Peekko generates its sound effects using the **Web Audio API** without requiring external audio files.

Audio features include:

- Procedural footsteps.
- Search and interaction sounds.
- Gameplay audio cues.
- Master volume control.
- Mute and unmute functionality.

### 🎨 Themes & Interface

- Dark and Light themes.
- Fullscreen gameplay.
- Interactive pause menu.
- Responsive interface.
- Dedicated gameplay HUD.
- Visual feedback for player actions and game events.

### 📱 Mobile Support

Peekko supports mobile landscape gameplay with:

- On-screen directional D-pad.
- Dedicated action buttons.
- Touch-friendly interactions.
- Landscape-oriented gameplay layout.

### ♿ Accessibility

The interface includes several accessibility considerations:

- Keyboard-operable menus.
- Visible focus indicators.
- Labelled dialogs.
- Live status announcements.
- Support for reduced-motion preferences.

### 💾 Local Progress Saving

Peekko uses browser `localStorage` to preserve player information and preferences, including:

- Total score.
- Wins and losses.
- Selected map.
- Theme preference.
- Difficulty preference.

Progress is stored locally and does not require an account or backend server.

---

## 🕹️ How to Play

### Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | Arrow Keys / W A S D | On-screen D-pad |
| Hide / Leave a Spot / Search | `Space` | SPACE button |
| Confirm "I'm Ready" (Hider) | `Enter` | READY button |
| Pause / Resume | `Esc` | Pause button |

### Playing as the Hider

Your objective is to remain hidden while the Seeker Bot searches the environment.

1. Choose your map and select the Hider role.
2. Move around and explore available hiding locations.
3. Approach an object and press `Space` to hide.
4. Press `Enter` or the Ready button to begin the search.
5. Survive all the bot's checks without getting caught.

**Strategy Tips:**
- Staying in your original hiding spot earns a +25 bonus.
- You can move to another hiding spot while the bot is searching.
- Moving creates noise, which may attract the bot's attention.
- If the bot sees you in the open, you risk getting caught.

### Playing as the Seeker

Your objective is to locate the hidden bot before running out of attempts.

1. Select the Seeker role.
2. The bot chooses a hiding location.
3. Explore the environment and approach potential hiding spots.
4. Press `Space` to search a location.
5. Use Hot, Warm, and Cool hints to narrow down the bot's position.
6. Find the bot before all your attempts are exhausted.

**Strategy Tips:**
- Pay attention to proximity hints.
- Use previous search results to guide your next decision.
- Choose your searches carefully, especially on Hard difficulty.

---

## 🏆 Scoring System

Your performance is rewarded or penalized based on the outcome of each round.

| Outcome | Score |
|---|---:|
| Hider survives all checks | +100 |
| Hider survives without leaving the original spot | +25 bonus |
| Hider gets caught | -50 |
| Seeker finds the hidden bot | +100 |
| Seeker finds the bot with remaining attempts | +15 per unused attempt |
| Seeker runs out of attempts | -50 |

**Score Protection:** Your total score will never drop below zero.

---

## 🛠️ Built With

Peekko is developed using standard web technologies without external game engines or JavaScript frameworks.

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling, themes, and responsive layout |
| Vanilla JavaScript (ES6) | Gameplay logic and AI behaviour |
| HTML5 Canvas | Map, character, and visual-effect rendering |
| Web Audio API | Procedural sound generation |
| localStorage | Local progress and preference persistence |

No package manager, build tools, or framework dependencies are required.

---

## 🚀 Getting Started

Peekko is a static browser application. There is no installation or build process required.

### Prerequisites

- A modern web browser.
- Python 3 (recommended for local hosting).

### Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/RI-Rimon/Peekko.git
```

**2. Navigate to the project directory**

```bash
cd Peekko
```

**3. Start a local HTTP server**

```bash
python -m http.server 8080
```

**4. Open the game**

Visit the following address in your browser:

```text
http://localhost:8080
```

You can also open `index.html` directly in a modern browser. However, running a local HTTP server is recommended.

**Mobile users:** Landscape orientation is recommended for the best gameplay experience.

---

## 📂 Project Structure

```text
Peekko/
├── assets/
│   └── peekko-icon.svg
│
├── css/
│   └── style.css
│
├── js/
│   ├── apartment.js   # Map data, collision, navigation, and pathfinding
│   ├── audio.js       # Procedural sound effects
│   ├── renderer.js    # Canvas rendering and visual effects
│   └── game.js        # Game state, rules, input, and AI behaviour
│
└── index.html         # Main application structure
```

---

## 🔮 Future Roadmap — Peekko v2

The current release focuses on single-player gameplay against an AI opponent.

Peekko v2 is planned to expand the experience with multiplayer functionality, larger environments, improved visuals, and a downloadable edition.

**Note:** The following features are planned for future development and are not included in the current release.

### 🌐 Online Multiplayer

Introduce real-time multiplayer gameplay with two matchmaking options.

**1. Random Matches**
- Join public matches with other players.
- Support for up to five players per match.
- Automatic matchmaking.

**2. Custom Rooms**
- Create private multiplayer rooms.
- Generate shareable room codes.
- Invite friends to join through room codes.
- Support matches ranging from solo play to five players.
- Allow players to choose their own roles.

### 🗺️ Bigger Maps

- Introduce larger and more expansive environments.
- Add significantly more hiding locations.
- Increase map variety and exploration opportunities.

### 🎨 Enhanced Visual Experience

- Redesigned environmental structures.
- More realistic and detailed objects.
- Improved map presentation and visual atmosphere.

### 💻 Downloadable Edition

- Develop a standalone downloadable version of Peekko.
- Provide a public download link for players who prefer a downloadable experience.

---

## ⚠️ Known Limitations

- The current release supports single-player gameplay against an AI bot only.
- Online multiplayer and custom rooms are not implemented yet.
- Player progress is stored in browser `localStorage`; clearing site data resets saved progress.
- Google Fonts requires an internet connection. System fonts are used as fallbacks.
- Automated test suites are not currently included.

---

## 🤝 Feedback & Contributions

Ideas, suggestions, and feedback are welcome.

If you find a bug or have an idea for improving Peekko, feel free to open an issue in the repository.

Your feedback can help shape the future of Peekko.

---

## 👨‍💻 About the Developer

Peekko was conceptualized, designed, and planned by **Redwanul Islam Rimon**.

The implementation was developed with AI coding assistance and refined through iterative review, testing, and improvements.

**Connect with me:**

- LinkedIn: [Redwanul Islam Rimon](https://www.linkedin.com/in/redwanul-rimon/)
- GitHub: [RI-Rimon](https://github.com/RI-Rimon)

---

## 📄 License

Peekko is intended to be released under the **MIT License**.

