# Trivvio 🎮

**Trivvio** is a modern, real-time trivia application built with **Nuxt 4** and **Supabase**. Host live games, join with friends, and compete on the leaderboard with a slick, engaging UI.

![Trivvio App](/public/screenshot.png)
*(Note: Add a screenshot of the lobby or game screen here)*

## ✨ Features

-   **Real-time Gameplay**: Leveraging Supabase Realtime for instant state sync across all clients.
-   **Live Host Dashboard**: Hosts can control the game flow, view live answer stats, and manage the lobby.
-   **Interactive Player Experience**: Players join via Game PIN, answer questions in real-time, and see immediate feedback.
-   **Dynamic Leaderboard**: Automatically calculated scores based on correctness and speed (`100 + TimeBonus`).
-   **Slick UI**: Built with TailwindCSS, utilizing glassmorphism, animations, and a premium dark mode aesthetic.
-   **Guest Mode**: Players can join without creating an account using a simple nickname.

## 🛠️ Tech Stack

-   **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
-   **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
-   **Styling**: [TailwindCSS](https://tailwindcss.com/)
-   **Icons**: [Nuxt Icon](https://nuxt.com/modules/icon) (Material Symbols)
-   **Notifications**: [Vue Sonner](https://vue-sonner.vercel.app/)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   Supabase Project

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/devadedeji/trivvio.git
    cd trivvio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_KEY=your_supabase_anon_key
    ```
    *Note: The app expects specific database tables (`games`, `questions`, `players`, `answers`). See `supabase/migrations` for schema details.*

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:8080` in your browser.

## 📂 Project Structure

-   `app/components`: Reusable UI components (Game, Lobby, Create flows).
-   `app/composables`: Shared state logic (`useGamePlay`, `useLobby`, `usePlayer`).
-   `app/pages`: Application routes/views.
-   `app/types`: TypeScript definitions for Supabase schema.
-   `supabase/migrations`: SQL migrations for database schema.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
