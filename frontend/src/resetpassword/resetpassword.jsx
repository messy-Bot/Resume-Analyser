import {
    useContext,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import Styles from "./resetpassword.module.css";

import {
    usercontext
} from "../appcontext";


function Resetpassword() {

    const navigate =
        useNavigate();

    const {
        backendURL
    } = useContext(usercontext);


    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [step, setStep] =
        useState(1);

    const [loading, setLoading] =
        useState(false);


    const sendOtp = async (event) => {

        event.preventDefault();

        if (!email.trim()) {

            toast.warn(
                "Please enter your email."
            );

            return;
        }

        setLoading(true);

        try {

            const response =
                await fetch(
                    `${backendURL}/resetOtpSent`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email: email.trim()
                        })
                    }
                );

            const message =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    message ||
                    "Unable to send OTP."
                );
            }

            toast.success(
                "OTP sent successfully."
            );

            setStep(2);

        } catch (error) {

            console.error(
                "OTP error:",
                error
            );

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

        if (!otp.trim()) {

            toast.warn(
                "Please enter the OTP."
            );

            return;
        }

        setLoading(true);

        try {

            const response =
                await fetch(
                    `${backendURL}/verifyResetOtp`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email: email.trim(),
                            otp: otp.trim()
                        })
                    }
                );

            const message =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    message ||
                    "Invalid OTP."
                );
            }

            toast.success(
                "OTP verified successfully."
            );

            setStep(3);

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            toast.error(
                error.message ||
                "Invalid OTP."
            );

        } finally {

            setLoading(false);
        }
    };


    const resetPassword = async (event) => {

        event.preventDefault();

        if (!password || !confirmPassword) {

            toast.warn(
                "Please enter both passwords."
            );

            return;
        }

        if (password.length < 8) {

            toast.warn(
                "Password must contain at least 8 characters."
            );

            return;
        }

        if (password !== confirmPassword) {

            toast.error(
                "Passwords do not match."
            );

            return;
        }

        setLoading(true);

        try {

            const response =
                await fetch(
                    `${backendURL}/resetPassword`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email: email.trim(),
                            password: password,
                            confirmPassword:
                                confirmPassword
                        })
                    }
                );

            const message =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    message ||
                    "Password reset failed."
                );
            }

            toast.success(
                "Password reset successfully."
            );

            navigate("/login");

        } catch (error) {

            console.error(
                "Password reset error:",
                error
            );

            toast.error(
                error.message ||
                "Password reset failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className={Styles.container}>

            <div className={Styles.card}>

                <h1>
                    Reset Password
                </h1>


                {step === 1 && (

                    <form onSubmit={sendOtp}>

                        <p>
                            Enter your registered
                            email address to receive
                            an OTP.
                        </p>

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
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send OTP"}
                        </button>

                    </form>

                )}


                {step === 2 && (

                    <form onSubmit={verifyOtp}>

                        <p>
                            Enter the OTP sent to
                            your email address.
                        </p>

                        <label htmlFor="otp">
                            OTP
                        </label>

                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(event) =>
                                setOtp(
                                    event.target.value
                                )
                            }
                            placeholder="Enter OTP"
                            maxLength={6}
                            autoComplete="one-time-code"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            className={Styles.backbtn}
                            onClick={() =>
                                setStep(1)
                            }
                        >
                            Change Email
                        </button>

                    </form>

                )}


                {step === 3 && (

                    <form onSubmit={resetPassword}>

                        <p>
                            Create a new password
                            for your account.
                        </p>

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
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            required
                        />

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
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </button>

                    </form>

                )}


                <button
                    type="button"
                    className={Styles.loginbtn}
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Back to Login
                </button>

            </div>

        </div>
    );
}


export default Resetpassword;
