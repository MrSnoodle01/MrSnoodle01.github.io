import { BrowserView } from 'react-device-detect';

interface ProjectProps {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    link: string;
    image: string;
    className?: string;
    imageSide: number;
}


export default function Project(project: ProjectProps) {
    return (
        <div key={project.id} className={project.className ? project.className + " project-card" : "project-card"}>
            <BrowserView>
                {project.imageSide === 0 ? <img src={project.image} alt={`Project ${project.id}`} key={project.id} className="project-image" /> : null}
            </BrowserView>

            <div className="project-info">
                <h2>{project.title}</h2>
                <a href={project.link}>{project.link}</a>
                <p style={{ color: "#a5a5a5ff" }}>
                    {project.technologies.map((tech, index) => (
                        <span key={index}>
                            {tech}{index < project.technologies.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>
                <p style={{ maxWidth: "90%" }}>{project.description}</p>
            </div>

            <BrowserView>
                {project.imageSide === 1 ? <img src={project.image} alt={`Project ${project.id}`} key={project.id} className="project-image" /> : null}
            </BrowserView>
        </div>
    )
}