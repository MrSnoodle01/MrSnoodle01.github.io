import './App.css'
import ProjectList from './ProjectList'

function App() {

  return (
    <>
      <h1>👋 Hey there, welcome to my website</h1>
      <p className="random-links">
        <a href="https://github.com/MrSnoodle01">Github</a>
        <a href="https://www.mountainproject.com/user/201304798/josh-richardson">Mountain Project</a>
      </p>
      <p style={{ maxWidth: "650px" }}>
        I’m Josh, a software developer with a passion for creating engaging and interactive web applications.
        This site showcases some of my projects, including an algorithm visualizer and a Unity game.
      </p>
      <ProjectList />
    </>
  )
}

export default App
