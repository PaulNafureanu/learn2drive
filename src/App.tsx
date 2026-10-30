function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <div className="space-y-6">
        <span className="text-5xl">🚗</span>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Learn<span className="text-lime-400">2</span>Drive - Preview
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-medium text-zinc-200">Site în construcție</h2>

          <p className="max-w-md text-zinc-400">Pregătim ceva special pentru viitorii șoferi. Revino în curând!</p>
        </div>
      </div>

      <footer className="absolute bottom-8 text-sm text-zinc-600">© {new Date().getFullYear()} Learn2Drive</footer>
    </main>
  );
}

export default App;
