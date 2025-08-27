import { projects } from '../assets/projects';
import Project from '../components/Project';
import NavBar from '../components/NavBar';

export default function Projects(props: { title: string }) {
    document.title = props.title;
    return (
        <div>
            <NavBar />
            <h1>💻 Projects</h1>
            {projects.map((project) => (
                <Project key={project.id} {...project} className="projects-page" />
            ))}
        </div>
    )
}