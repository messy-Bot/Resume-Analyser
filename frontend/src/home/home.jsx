import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usercontext } from "../appcontext";
import styles from "./home.module.css";

function Home() {
    const {
        islogged,
        username
    } = useContext(usercontext);

    const navigate = useNavigate();

    const handleStart = () => {
        if (islogged) {
            navigate("/uploaddoc");
        } else {
            navigate("/login");
        }
    };

    return (
        <main className={styles.container}>

            <nav className={styles.navbar}>
                <Link
                    to="/"
                    className={styles.logo}
                >
                    Resume Analyser
                </Link>

                <div className={styles.navLinks}>
                    {islogged ? (
                        <>
                            <span className={styles.welcome}>
                                Hi, {username || "User"}
                            </span>

                            <Link
                                to="/uploaddoc"
                                className={styles.navButton}
                            >
                                Analyse Resume
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className={styles.navButton}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            <section className={styles.hero}>

                <div className={styles.heroContent}>

                    <span className={styles.badge}>
                        AI-Powered Resume Analysis
                    </span>

                    <h1>
                        Build a Resume That
                        <span> Gets Noticed</span>
                    </h1>

                    <p>
                        Upload your resume and let AI analyse your
                        skills, ATS compatibility, strengths,
                        weaknesses and suitable job opportunities.
                    </p>

                    <div className={styles.actions}>

                        <button
                            className={styles.primaryButton}
                            onClick={handleStart}
                        >
                            Analyse My Resume
                        </button>

                        {!islogged && (
                            <Link
                                to="/login"
                                className={styles.secondaryButton}
                            >
                                Sign In
                            </Link>
                        )}

                    </div>

                </div>

                <div className={styles.heroCard}>

                    <div className={styles.cardHeader}>
                        <span>Resume Analysis</span>
                        <span className={styles.status}>
                            AI Powered
                        </span>
                    </div>

                    <div className={styles.scoreCircle}>
                        <strong>92</strong>
                        <span>ATS Score</span>
                    </div>

                    <div className={styles.progressItem}>
                        <div>
                            <span>Skills Match</span>
                            <strong>94%</strong>
                        </div>

                        <div className={styles.progress}>
                            <span style={{ width: "94%" }} />
                        </div>
                    </div>

                    <div className={styles.progressItem}>
                        <div>
                            <span>Experience</span>
                            <strong>88%</strong>
                        </div>

                        <div className={styles.progress}>
                            <span style={{ width: "88%" }} />
                        </div>
                    </div>

                    <div className={styles.progressItem}>
                        <div>
                            <span>Keywords</span>
                            <strong>91%</strong>
                        </div>

                        <div className={styles.progress}>
                            <span style={{ width: "91%" }} />
                        </div>
                    </div>

                </div>

            </section>

            <section className={styles.features}>

                <div className={styles.feature}>
                    <div className={styles.icon}>📄</div>
                    <h3>Resume Analysis</h3>
                    <p>
                        Get an AI-powered review of your resume
                        and understand what can be improved.
                    </p>
                </div>

                <div className={styles.feature}>
                    <div className={styles.icon}>🎯</div>
                    <h3>ATS Optimization</h3>
                    <p>
                        Discover how well your resume matches
                        Applicant Tracking System requirements.
                    </p>
                </div>

                <div className={styles.feature}>
                    <div className={styles.icon}>💼</div>
                    <h3>Job Recommendations</h3>
                    <p>
                        Find relevant job opportunities based
                        on your resume and selected role.
                    </p>
                </div>

            </section>

        </main>
    );
}

export default Home;
