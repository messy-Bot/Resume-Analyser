import { useContext } from "react";

import { usercontext } from "./appcontext";


function Googlebtn() {

    const { backendURL } =
        useContext(usercontext);


    const handleGoogleLogin = () => {

        window.location.href =
            `${backendURL.replace(
                "/resumeAnalyser/entry/v1",
                ""
            )}/oauth2/authorization/google`;
    };


    return (

        <button
            type="button"
            onClick={handleGoogleLogin}
        >

            Continue with Google

        </button>
    );
}


export default Googlebtn;
