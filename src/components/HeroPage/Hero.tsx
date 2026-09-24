import { Link } from "react-router";
import "./hero.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <p className="hero-greeting">Hi, I'm</p>

                <h1 className="hero-name">
                    Josh Richardson
                </h1>

                <h2 className="hero-title">
                    Software Engineer
                </h2>

                <p className="hero-description">
                    Building mobile applications, web applications, and Unity games.
                </p>

                <p className="hero-description">
                    Currently developing games at Konami Gaming Inc.
                </p>

                <div className="hero-buttons">
                    <Link to="/Projects">
                        <a className="primary-button">
                            View Projects
                        </a>
                    </Link>

                    <a
                        href="/Josh-Richardson-Resume.pdf"
                        target="_blank"
                        className="secondary-button"
                    >
                        Resume
                    </a>
                </div>

                <div className="hero-links">
                    <a href="https://github.com/MrSnoodle01">
                        <FaGithub /> GitHub
                    </a>

                    <a href="https://www.linkedin.com/in/josh-richardson02">
                        <FaLinkedin /> LinkedIn
                    </a>
                </div>
            </div>
        </section>
    );
}