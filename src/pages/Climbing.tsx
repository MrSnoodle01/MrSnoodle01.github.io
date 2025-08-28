import NavBar from '../components/NavBar';
import ClimbingPics from '../components/ClimbingPics';

export default function Climbing(props: { title: string }) {
    document.title = props.title;
    return (
        <div>
            <NavBar />
            <h2>🧗‍♂️ Climbing</h2>
            <p style={{ maxWidth: "40vw" }}>
                I love climbing, especially bouldering and trad climbing. I enjoy the challenge of solving problems and pushing my limits.
                You can find some of my climbing achievements on my <a href="https://www.mountainproject.com/user/201304798/josh-richardson">Mountain Project</a> account.
            </p>
            <p style={{ maxWidth: "40vw" }}>
                I started climbing in the summer of 2016 and have been hooked ever since. Shorty after I started climbing I joined a
                competitive youth team at my local climbing gym. Here I learned the fundamentals of climbing and how to solve problems.
                Once I aged out of competing at a youth level I started climbing outdoors where I found a new appreciation for the outdoors and climbing.
            </p>
            <ClimbingPics />
        </div >
    )
}