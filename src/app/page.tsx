import Timer from './components/Timer';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1>Time Remaining In The Year</h1>
        <Timer />
      </main>
    </>
  );
}
