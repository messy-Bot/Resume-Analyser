import {
    useContext
} from "react";

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import {
    usercontext
} from "./appcontext";

import Home from "./home/home";
import Login from "./login/login";
import Uploadpage from "./upload/upload";
import Analyse from "./analyse/analyse";
import Resetpassword from "./resetpassword/resetpassword";


function ProtectedRoute({ children }) {

    const {
        islogged,
        isauthenticated
    } = useContext(usercontext);


    if (!isauthenticated) {

        return (
            <div>
                Loading...
            </div>
        );
    }


    if (!islogged) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return children;
}


function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={
                    <Home />
                }
            />


            <Route
                path="/login"
                element={
                    <Login />
                }
            />


            <Route
                path="/forgotpassword"
                element={
                    <Resetpassword />
                }
            />


            <Route
                path="/uploaddoc"
                element={
                    <ProtectedRoute>
                        <Uploadpage />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/analysereport"
                element={
                    <ProtectedRoute>
                        <Analyse />
                    </ProtectedRoute>
                }
            />


            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}


export default App;
