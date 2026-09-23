import {
    createContext,
    useEffect,
    useState
} from "react";


export const usercontext =
    createContext(null);


function Appcontext({ children }) {


    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "";


    const backendURL =
        `${API_BASE_URL}/resumeAnalyser/entry/v1`;


    const serviceURL =
        `${API_BASE_URL}/resumeAnalyserCore/service/v1`;


    const [islogged, setislogged] =
        useState(false);


    const [isprevious, setisprevious] =
        useState(false);


    const [username, setusername] =
        useState("");


    const [isauthenticated, setisauthenticated] =
        useState(false);


    useEffect(() => {

        let active = true;


        const validateUser = async () => {

            try {

                const response =
                    await fetch(
                        `${serviceURL}/isValid`,
                        {
                            method: "POST",
                            credentials: "include"
                        }
                    );


                if (!active) {
                    return;
                }


                if (response.ok) {

                    const data =
                        await response.json();


                    setusername(
                        data?.username || ""
                    );


                    setisprevious(
                        Boolean(
                            data?.isPrevious
                        )
                    );


                    setislogged(true);
                }


            } catch (error) {

                console.error(
                    "Authentication validation failed:",
                    error
                );


            } finally {

                if (active) {
                    setisauthenticated(true);
                }
            }
        };


        validateUser();


        return () => {

            active = false;

        };

    }, [serviceURL]);


    return (

        <usercontext.Provider
            value={{
                islogged,
                setislogged,

                isprevious,
                setisprevious,

                username,
                setusername,

                backendURL,
                serviceURL,

                isauthenticated
            }}
        >

            {children}

        </usercontext.Provider>
    );
}


export default Appcontext;
