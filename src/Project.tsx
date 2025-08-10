
interface Project {
    id: number;
    title: string;
    description: string;
    Technologies: string[];
    link: string;
}

export default function Project(project: Project) {
    return (
        <div key={project.id}>
            <a href={project.link}>{project.link}</a>
            <h2>{project.title}</h2>
            <p style={{ color: "#a5a5a5ff" }}>
                {project.Technologies.map((tech, index) => (
                    <span key={index} className="technology">
                        {tech}{index < project.Technologies.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </p>
            <p style={{ maxWidth: "90%" }}>{project.description}</p>
        </div >
    )
}