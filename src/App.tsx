import './App.css';
import NavBar from './components/NavBar';
import Hero from './components/HeroPage/Hero';

export default function App(props: { title: string }) {
  document.title = props.title;

  return (
    <div className="page-center">
      <NavBar />
      <Hero />
    </div>
  )
}