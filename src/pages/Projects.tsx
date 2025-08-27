import { projects } from '../assets/projects';
import Project from '../components/Project';
import NavBar from '../components/NavBar';

export default function Projects(props: { title: string }) {
    document.title = props.title;
    return (
        <div>
            <NavBar />
            {projects.map((project) => (
                <Project key={project.id} {...project} />
            ))}
        </div>
    )
}