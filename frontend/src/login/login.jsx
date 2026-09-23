import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import styles from "./login.module.css";

function Login() {
    const {
        backendURL,
        setislogged,
        setusername,
        setisprevious
    } = useContext(usercontext);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            toast.error("Please enter email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${backendURL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Invalid email or password."
                );
            }

            setislogged(true);
            setusername(data?.username || "");
            setisprevious(Boolean(data?.isPrevious));

            toast.success("Login successful!");

            navigate("/uploaddoc");

        } catch (error) {
            toast.error(
                error.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.page}>

            <div className={styles.card}>

                <Link
                    to="/"
                    className={styles.logo}
                >
                    Resume Analyser
                </Link>

                <div className={styles.header}>
                    <h1>Welcome Back</h1>

                    <p>
                        Sign in to analyse and improve your resume.
                    </p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={handleLogin}
                >

                    <div className={styles.field}>
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <div className={styles.passwordLabel}>
                            <label htmlFor="password">
                                Password
                            </label>

                            <Link to="/forgotpassword">
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <a
                    href={`${backendURL.replace(
                        "/resumeAnalyser/entry/v1",
                        ""
                    )}/oauth2/authorization/google`}
                    className={styles.googleButton}
                >
                    Continue with Google
                </a>

                <p className={styles.registerText}>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create an account
                    </Link>
                </p>

            </div>

        </main>
    );
}

export default Login;
