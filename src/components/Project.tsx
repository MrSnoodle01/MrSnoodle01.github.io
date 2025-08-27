
interface ProjectProps {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    link: string;
    className?: string;
}


export default function Project(project: ProjectProps) {
    return (
        <div key={project.id} className={project.className ? project.className + " project-card" : "project-card"}>
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
        </div >
    )
}