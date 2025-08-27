import { projects } from '../assets/projects';
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
        <div>
            <img src="/climbingImages/climb1.jpg" width="375vw" height="500"></img>
            <img src="/climbingImages/climb2.jpg" width="375vw" height="500"></img>
        </div>
    )
}