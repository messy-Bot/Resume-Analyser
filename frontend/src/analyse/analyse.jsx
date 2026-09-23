import {
    useContext,
    useEffect,
    useState
} from "react";

import Styles from "./analyse.module.css";

import {
    Heat
} from "@alptugidin/react-circular-progress-bar";

import {
    usercontext
} from "../appcontext";

import {
    useNavigate
} from "react-router-dom";


function Analyse() {

    const navigate =
        useNavigate();

    const {
        serviceURL
    } = useContext(usercontext);

    const [score, setscore] =
        useState(0);

    const [atsscore, setatsscore] =
        useState(0);

    const [pros, setpros] =
        useState([]);

    const [cons, setcons] =
        useState([]);

    const [sug, setsug] =
        useState([]);

    const [jobs, setjobs] =
        useState([]);

    const [isfetched, setisfetched] =
        useState(false);


    useEffect(() => {

        let active = true;

        const fetchReport = async () => {

            const loader =
                document.getElementById("animate");

            if (loader) {
                loader.style.display = "flex";
            }

            try {

                const response =
                    await fetch(
                        `${serviceURL}/lastReport`,
                        {
                            credentials: "include"
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch report"
                    );
                }

                const data =
                    await response.json();

                if (!active) {
                    return;
                }

                if (data) {

                    setscore(
                        Number(data.score) || 0
                    );

                    setatsscore(
                        Number(
                            data.atsoptimizationscore
                        ) || 0
                    );

                    setpros(
                        Array.isArray(data.pros)
                            ? data.pros
                            : []
                    );

                    setcons(
                        Array.isArray(data.cons)
                            ? data.cons
                            : []
                    );

                    setsug(
                        Array.isArray(
                            data.suggestions
                        )
                            ? data.suggestions
                            : []
                    );

                    setjobs(
                        Array.isArray(data.jobs)
                            ? data.jobs
                            : []
                    );

                    setisfetched(true);
                }

            } catch (error) {

                console.error(
                    "Report fetching error:",
                    error
                );

            } finally {

                if (loader) {
                    loader.style.display = "none";
                }
            }
        };

        fetchReport();

        return () => {
            active = false;
        };

    }, [serviceURL]);


    return (

        <div className={Styles.container}>

            <div className={Styles.nav}>

                <h1>
                    Resume Analyser
                </h1>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/uploaddoc")
                    }
                >
                    Analyse
                </button>

            </div>


            <div
                className={Styles.loadani}
                id="animate"
            >

                <div
                    className={
                        Styles.loadanimation
                    }
                >

                    <div
                        className={
                            Styles.capstart
                        }
                    />

                    <div
                        className={
                            Styles.loadblock
                        }
                    />

                </div>

                <h1>
                    Preparing Report
                </h1>

            </div>


            {isfetched ? (

                <div className={Styles.doc}>

                    <div className={Styles.report}>

                        <div className={Styles.sc1}>

                            <Heat
                                progress={score}
                                range={{
                                    from: 0,
                                    to: 100
                                }}
                                sign={{
                                    value: "",
                                    position: "end"
                                }}
                                showValue={true}
                                revertBackground={true}
                                text="Overall Score"
                                sx={{
                                    barWidth: 7,
                                    bgColor: "#2c2c2cb1",
                                    bgStrokeColor: "#ffffff",
                                    valueSize: 13,
                                    textSize: 10,
                                    valueFamily: "Poppins",
                                    textFamily: "Poppins",
                                    valueWeight: "normal",
                                    textWeight: "normal",
                                    textColor: "#ffffffff",
                                    valueColor: "#ffffffff",
                                    loadingTime: 1000,
                                    strokeLinecap: "round",
                                    valueAnimation: true
                                }}
                            />

                        </div>


                        <div className={Styles.sc2}>

                            <Heat
                                progress={atsscore}
                                range={{
                                    from: 0,
                                    to: 100
                                }}
                                sign={{
                                    value: "",
                                    position: "end"
                                }}
                                showValue={true}
                                revertBackground={true}
                                text="ATS optimization score"
                                sx={{
                                    barWidth: 7,
                                    bgColor: "#2c2c2cb1",
                                    bgStrokeColor: "#ffffff",
                                    valueSize: 13,
                                    textSize: 7,
                                    valueFamily: "Poppins",
                                    textFamily: "Poppins",
                                    valueWeight: "normal",
                                    textWeight: "normal",
                                    textColor: "#ffffffff",
                                    valueColor: "#ffffffff",
                                    loadingTime: 1000,
                                    strokeLinecap: "round",
                                    valueAnimation: true
                                }}
                            />

                        </div>

                    </div>


                    <div className={Styles.rev}>

                        <div className={Styles.pros}>

                            <h2>
                                Strengths
                            </h2>

                            <ul>

                                {pros.map(
                                    (item, index) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>


                        <div className={Styles.cons}>

                            <h2>
                                Improvements
                            </h2>

                            <ul>

                                {cons.map(
                                    (item, index) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>


                        <div className={Styles.sug}>

                            <h2>
                                Tips to enhance
                            </h2>

                            <ul>

                                {sug.map(
                                    (item, index) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>


                        {jobs.length > 0 ? (

                            <div className={Styles.jobs}>

                                <h2>
                                    Suggested Jobs
                                </h2>


                                {jobs.map(
                                    (item, index) => (

                                        <div
                                            className={
                                                Styles.jobidiv
                                            }
                                            key={index}
                                        >

                                            <h3
                                                className={
                                                    Styles.jobtitle
                                                }
                                            >
                                                Role :{" "}
                                                {item.title}
                                            </h3>


                                            <h4
                                                className={
                                                    Styles.com
                                                }
                                            >
                                                Company :{" "}
                                                {item.company
                                                    ?.display_name
                                                    ?.trim()
                                                    ||
                                                    "Not specified"}
                                            </h4>


                                            <h4
                                                className={
                                                    Styles.loc
                                                }
                                            >
                                                Location :{" "}
                                                {item.location
                                                    ?.display_name
                                                    ?.trim()
                                                    ||
                                                    "Not specified"}
                                            </h4>


                                            <h4
                                                className={
                                                    Styles.cat
                                                }
                                            >
                                                Category :{" "}
                                                {item.category
                                                    ?.label
                                                    ?.trim()
                                                    ||
                                                    "Not specified"}
                                            </h4>


                                            <p
                                                className={
                                                    Styles.jobdes
                                                }
                                            >
                                                {item.description}
                                            </p>


                                            {item.redirect_url && (

                                                <a
                                                    className={
                                                        Styles.joblink
                                                    }
                                                    href={
                                                        item.redirect_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Apply now
                                                </a>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        ) : null}

                    </div>

                </div>

            ) : (

                <h1
                    className={
                        Styles.errinfo
                    }
                >
                    Something went wrong,
                    Please try again after
                    some time !!!
                </h1>

            )}

        </div>
    );
}


export default Analyse;
