import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import styles from "./resetpassword.module.css";

function Resetpassword() {
    const { backendURL } = useContext(usercontext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async (event) => {
        event.preventDefault();

        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${backendURL}/resetOtpSent`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Unable to send OTP."
                );
            }

            toast.success(
                "OTP sent to your registered email."
            );

            setStep(2);
        } catch (error) {
            toast.error(
                error.message ||
                "Unable to send OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (event) => {
        event.preventDefault();

        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${backendURL}/verifyResetOtp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        otp
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Invalid OTP."
                );
            }

            toast.success("OTP verified.");

            setStep(3);
        } catch (error) {
            toast.error(
                error.message ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (event) => {
        event.preventDefault();

        if (password.length < 8) {
            toast.error(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${backendURL}/resetPassword`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        otp,
                        password,
                        confirmPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Unable to reset password."
                );
            }

            toast.success(
                "Password reset successfully."
            );

            navigate("/login");
        } catch (error) {
            toast.error(
                error.message ||
                "Password reset failed."
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
                    <h1>Reset Password</h1>

                    <p>
                        {step === 1 &&
                            "Enter your email to receive an OTP."}

                        {step === 2 &&
                            "Enter the OTP sent to your email."}

                        {step === 3 &&
                            "Create a new password for your account."}
                    </p>
                </div>

                {step === 1 && (
                    <form
                        className={styles.form}
                        onSubmit={sendOtp}
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
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form
                        className={styles.form}
                        onSubmit={verifyOtp}
                    >
                        <div className={styles.field}>
                            <label htmlFor="otp">
                                OTP
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(event) =>
                                    setOtp(
                                        event.target.value
                                            .replace(/\D/g, "")
                                    )
                                }
                                placeholder="Enter 6-digit OTP"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={() => setStep(1)}
                        >
                            Change Email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form
                        className={styles.form}
                        onSubmit={resetPassword}
                    >
                        <div className={styles.field}>
                            <label htmlFor="password">
                                New Password
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
                                placeholder="Minimum 8 characters"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </button>
                    </form>
                )}

                <p className={styles.loginText}>
                    Remember your password?{" "}
                    <Link to="/login">
                        Back to Login
                    </Link>
                </p>

            </div>
        </main>
    );
}

export default Resetpassword;
