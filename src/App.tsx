import { Wishlist } from './components/Wishlist';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Steam Wishlist Viewer</h1>
            <a
              href="https://github.com/Nair00/steam-wishlist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fab fa-github text-2xl"></i>
            </a>
          </div>
        </div>
      </header>

      <main>
        <Wishlist />
      </main>

      <footer className="bg-gray-800 mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400">
            This site is not affiliated with Valve Corporation. All game images and data are property of their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
