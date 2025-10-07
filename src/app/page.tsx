import GameCanvas from '@/components/GameCanvas';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-screen justify-center p-6 bg-gray-900 text-white space-y-8">
      <header className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          🚀 Space Shooter
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
          Take control of your starship, dodge deadly asteroids, and blast your way to victory!
          How long can you survive in the depths of space?
        </p>
      </header>

      <section className="space-y-6 flex flex-col items-center">
        <GameCanvas />

        <div className="text-gray-300 text-center max-w-2xl space-y-2">
          <p>
            Use <span className="font-bold">← →</span> or <span className="font-bold">A D</span> to move
          </p>
          <p>
            Press <span className="font-bold">SPACE</span> or <span className="font-bold">ENTER</span> to shoot
          </p>
          <p>
            Press <span className="font-bold">P</span> to pause | Press <span className="font-bold">R</span> to restart after game over
          </p>
        </div>
      </section>

      <footer className="text-gray-500 text-sm text-center pt-4">
        <p>Created with ❤️ using <span className="text-blue-400">Next.js</span></p>
        <p>© {new Date().getFullYear()} Space Shooter Project by Thoeurn Ratha</p>
      </footer>
    </main>
  );
}
