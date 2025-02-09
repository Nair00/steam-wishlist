# Steam Wishlist Viewer

A modern web application to view and sort your Steam wishlist with a clean interface. Built with React, TypeScript, and Tailwind CSS.

## Features

- View your Steam wishlist with a modern, responsive interface
- Sort games by:
  - Name
  - Price
  - Discount percentage
  - Date added
  - Release date
- Display game information including:
  - Price and discounts
  - Platform availability (Windows/Mac/Linux)
  - Developer and publisher information
  - Release date
  - Links to Steam store pages
- Support for Steam IDs, profile URLs, and custom URLs
- Progress indicator for loading large wishlists
- Dark theme optimized for gaming aesthetics

## Prerequisites

- Node.js (v18 or higher)
- A Steam API key from [Steam Web API](https://steamcommunity.com/dev/apikey)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Nair00/steam-wishlist.git
   cd steam-wishlist
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Steam API key:

   ```env
   VITE_STEAM_API_KEY=your_steam_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Enter your Steam ID, profile URL, or custom URL in the input field
2. Click "View Wishlist" to load your wishlist
3. Use the sort options to organize your games
4. Click on any game card to view it on the Steam store

## Technologies Used

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is not affiliated with Valve Corporation. All game images and data are property of their respective owners.
