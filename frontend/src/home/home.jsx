import { useContext } from "react";

import { useNavigate } from "react-router-dom";

import { usercontext } from "../appcontext";

import Styles from "./home.module.css";


function Home() {

    const navigate = useNavigate();

    const {
        islogged,
        username,
        isauthenticated
    } = useContext(usercontext);


    const handleStartAnalysis = () => {

        if (islogged) {

            navigate("/uploaddoc");

        } else {

            navigate("/login");
        }
    };


    const handleLogin = () => {

        navigate("/login");
    };


    return (

        <div className={Styles.container}>

            <nav className={Styles.navbar}>

                <h1 className={Styles.logo}>
                    Resume Analyser
                </h1>


                <div className={Styles.navlinks}>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>


                    {!islogged && isauthenticated && (

                        <button
                            type="button"
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                    )}


                    {islogged && (

                        <span className={Styles.username}>
                            Hello, {username}
                        </span>

                    )}

                </div>

            </nav>


            <main className={Styles.hero}>

                <div className={Styles.heroContent}>

                    <p className={Styles.tagline}>
                        AI-Powered Career Assistant
                    </p>


                    <h2>
                        Improve Your Resume.
                        <br />
                        Discover Better Opportunities.
                    </h2>


                    <p className={Styles.description}>

                        Upload your resume and receive AI-powered
                        feedback, skill-gap analysis, and relevant
                        job recommendations.

                    </p>


                    <button

                        type="button"

                        className={Styles.primaryButton}

                        onClick={handleStartAnalysis}

                    >

                        Analyse My Resume

                    </button>

                </div>


                <div className={Styles.heroCard}>

                    <div className={Styles.cardIcon}>
                        AI
                    </div>


                    <h3>
                        Smart Resume Analysis
                    </h3>


                    <p>
                        Get personalized insights into your skills,
                        strengths, weaknesses, and career opportunities.
                    </p>


                    <div className={Styles.featureList}>

                        <div>
                            ✓ Resume evaluation
                        </div>

                        <div>
                            ✓ Skill-gap identification
                        </div>

                        <div>
                            ✓ Job recommendations
                        </div>

                        <div>
                            ✓ Career improvement tips
                        </div>

                    </div>

                </div>

            </main>


            <footer className={Styles.footer}>

                <p>
                    © {new Date().getFullYear()} Resume Analyser
                </p>

            </footer>

        </div>
    );
}


export default Home;
