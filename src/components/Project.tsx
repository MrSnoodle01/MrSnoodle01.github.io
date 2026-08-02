import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface ProjectProps {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    image: string;
    className?: string;
    liveLink?: string;
    githubLink?: string;
}


export default function Project(project: ProjectProps) {
    return (
        <div key={project.id} className={project.className ? project.className + " project-card" : "project-card"}>
            <img src={project.image} alt={`Project ${project.id}`} key={project.id} className="project-image" />
            <div className="project-info">
                <h2>{project.title}</h2>
                <div className="project-links">
                    {project.liveLink && (
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-button"
                        >
                            <FaExternalLinkAlt /> Live Demo
                        </a>
                    )}

                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-button secondary"
                        >
                            <FaGithub /> GitHub
                        </a>
                    )}
                </div>
                <div className="tech-list">
                    {project.technologies.map((tech) => (
                        <span className="tech-badge" key={tech}>
                            {tech}
                        </span>
                    ))}
                </div>
                <p style={{ maxWidth: "90%" }}>{project.description}</p>
            </div>
        </div>
    )
}