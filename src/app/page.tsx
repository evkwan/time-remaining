import Body from './components/Body';
import Title from './components/TItle';
import Tagline from './components/Tagline';
import Timer from './components/Timer';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24">
        <Timer />
        <Title />
        <Body />
        <Tagline />
      </main>
    </>
  );
}
