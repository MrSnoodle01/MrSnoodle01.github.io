import './App.css';
import ProjectList from './components/ProjectList';
import NavBar from './components/NavBar';

export default function App(props: { title: string }) {
  document.title = props.title;

  return (
    <>
      <NavBar />
      <h1>👋 Hey there, welcome to my website</h1>
      <p className="random-links">
        <a href="https://github.com/MrSnoodle01">Github</a>
        <a href="https://www.linkedin.com/in/joshua-richardson-084860284/">Linkedin</a>
        <a href="https://www.mountainproject.com/user/201304798/josh-richardson">Mountain Project</a>
      </p>
      <h2>👀 About me</h2>
      <p style={{ maxWidth: "50vw" }}>
        I’m Josh, a software developer with a passion for learning about computer science.
        This site showcases some of my projects, including an algorithm visualizer and a Unity game. Check them out below!
      </p>
      <h2>🧗‍♂️ Climbing</h2>
      <p style={{ maxWidth: "50vw" }}>
        I love climbing, especially bouldering and trad climbing. I enjoy the challenge of solving problems and pushing my limits.
        You can find some of my climbing achievements on my <a href="https://www.mountainproject.com/user/201304798/josh-richardson">Mountain Project</a> account.
      </p>
      <ProjectList />
    </>
  )
}