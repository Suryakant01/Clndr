import CalendarCard from './components/CalendarCard';

function App() {
    return (
        <main className="min-h-screen flex flex-col p-4 md:p-10 font-sans transition-colors duration-300">

            {/* 
        flex-grow ensures this container takes up all available space, 
        keeping the calendar perfectly centered vertically and horizontally.
      */}
            <div className="flex-grow flex items-center justify-center w-full">
                <CalendarCard />
            </div>

            {/* Subtle Footer */}
            <footer className="mt-8 text-center shrink-0 no-print">
                <p className="text-xs font-medium tracking-widest text-gray-400 dark:text-gray-500 uppercase">
                    Clndr 2.0 © {new Date().getFullYear()}
                    <span className="mx-2 opacity-50">•</span>
                    <a
                        href="https://github.com/Suryakant01"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                    >
                        By Myth
                    </a>
                </p>
            </footer>

        </main>
    );
}

export default App;