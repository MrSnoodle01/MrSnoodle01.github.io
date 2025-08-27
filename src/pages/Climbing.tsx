import NavBar from '../components/NavBar';

export default function Climbing(props: { title: string }) {
    document.title = props.title;
    return (
        <div>
            <NavBar />
            <h2>🧗‍♂️ Climbing</h2>
            <p style={{ maxWidth: "50vw" }}>
                I love climbing, especially bouldering and trad climbing. I enjoy the challenge of solving problems and pushing my limits.
                You can find some of my climbing achievements on my <a href="https://www.mountainproject.com/user/201304798/josh-richardson">Mountain Project</a> account.
            </p>
        </div >
    )
}