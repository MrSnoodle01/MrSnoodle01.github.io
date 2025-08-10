import { projects } from './assets/projects';
import Project from './Project';
import { useState } from 'react';

export default function Projects() {
    const [index, setIndex] = useState(0);

    let firstProject = projects[index];
    let secondProject = projects[index + 1];

    let hasNext = index + 2 < projects.length;
    let hasPrevious = index > 0;

    function handleNextClick() {
        setIndex(index + 1);
    }

    function handlePreviousClick() {
        setIndex(index - 1);
    }

    return (
        <div className="projects-carousel">
            <button
                className="carousel-arrow carousel-arrow--prev"
                onClick={handlePreviousClick}
                disabled={!hasPrevious}
            >
                &#8249;
            </button>
            <Project {...firstProject} />
            <Project {...secondProject} />
            <button
                className="carousel-arrow carousel-arrow--next"
                onClick={(handleNextClick)}
                disabled={!hasNext}
            >
                &#8250;
            </button>
        </div>
    )
}