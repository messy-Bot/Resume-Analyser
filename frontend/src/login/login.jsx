import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import Styles from "./login.module.css";

import Googlebtn from "../googlebtn";

import { usercontext } from "../appcontext";


function Login() {

    const navigate = useNavigate();

    const {
        backendURL,
        setislogged,
        setusername
    } = useContext(usercontext);


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleLogin =
        async (event) => {

            event.preventDefault();


            if (!email.trim()) {

                toast.warn(
                    "Please enter your email."
                );

                return;
            }


            if (!password) {

                toast.warn(
                    "Please enter your password."
                );

                return;
            }


            setLoading(true);


            try {

                const response =
                    await fetch(
                        `${backendURL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            credentials: "include",

                            body: JSON.stringify({
                                email:
                                    email.trim(),

                                password:
                                    password
                            })
                        }
                    );


                const data =
                    await response.json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        "Invalid email or password."
                    );
                }


                setislogged(true);


                setusername(
                    data?.username ||
                    data?.name ||
                    ""
                );


                toast.success(
                    "Login successful."
                );


                navigate("/");


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to login."
                );


            } finally {

                setLoading(false);
            }
        };


    return (

        <div className={Styles.container}>

            <div className={Styles.loginbox}>

                <button

                    type="button"

                    className={Styles.backButton}

                    onClick={() =>
                        navigate("/")
                    }

                >

                    ← Back

                </button>


                <h1>
                    Welcome Back
                </h1>


                <p className={Styles.subtitle}>
                    Login to continue using
                    Resume Analyser.
                </p>


                <form
                    onSubmit={handleLogin}
                >


                    <label htmlFor="email">
                        Email
                    </label>


                    <input

                        id="email"

                        type="email"

                        value={email}

                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }

                        placeholder="Enter your email"

                        autoComplete="email"

                    />


                    <label htmlFor="password">
                        Password
                    </label>


                    <input

                        id="password"

                        type="password"

                        value={password}

                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }

                        placeholder="Enter your password"

                        autoComplete="current-password"

                    />


                    <button

                        type="button"

                        className={
                            Styles.forgotButton
                        }

                        onClick={() =>
                            navigate(
                                "/forgotpassword"
                            )
                        }

                    >

                        Forgot Password?

                    </button>


                    <button

                        type="submit"

                        className={
                            Styles.loginButton
                        }

                        disabled={loading}

                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>


                </form>


                <div className={Styles.divider}>

                    <span>
                        OR
                    </span>

                </div>


                <Googlebtn />


                <p className={Styles.registerText}>

                    Don't have an account?

                    {" "}

                    <button

                        type="button"

                        onClick={() =>
                            navigate("/")
                        }

                    >

                        Register

                    </button>

                </p>


            </div>

        </div>
    );
}


export default Login;
