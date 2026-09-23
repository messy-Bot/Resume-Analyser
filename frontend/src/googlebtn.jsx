import { useEffect } from "react";

function Googlebtn() {
    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "";

    useEffect(() => {
        // Google OAuth is handled by Spring Security.
        // This component is kept for compatibility with the project.
    }, []);

    const handleGoogleLogin = () => {
        window.location.href =
            `${API_BASE_URL}/oauth2/authorization/google`;
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
