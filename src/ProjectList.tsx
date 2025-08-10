import { projects } from './assets/projects';
import Project from './Project';
import { useState } from 'react';

export default function Projects() {
    const [firstproject, setFirstProject] = useState(projects[0]);
    const [secondproject, setSecondProject] = useState(projects[1]);

    return (
        <div className="projects-box">
            <Project {...firstproject} />
            <Project {...secondproject} />
        </div>
    )
}