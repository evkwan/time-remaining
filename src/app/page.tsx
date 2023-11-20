import Body from './components/Body';
import Footer from './components/Footer';
import Title from './components/TItle';
import Tagline from './components/Tagline';
import Timer from './components/Timer';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center px-24 pt-24">
        <Timer />
        <Title />
        <Body />
        <Tagline />
        <Footer />
      </main>
    </>
  );
}
