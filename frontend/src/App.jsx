import { BrowserRouter, Routes, Route } from "react-router-dom";

import Appcontext from "./appcontext";

import Home from "./home/home";
import Login from "./login/login";
import Uploadpage from "./upload/upload";
import Analyse from "./analyse/analyse";
import Resetpassword from "./resetpassword/resetpassword";


function App() {

    return (

        <Appcontext>

            <BrowserRouter>

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/uploaddoc"
                        element={<Uploadpage />}
                    />

                    <Route
                        path="/analysereport"
                        element={<Analyse />}
                    />

                    <Route
                        path="/forgotpassword"
                        element={<Resetpassword />}
                    />

                </Routes>

            </BrowserRouter>

        </Appcontext>
    );
}


export default App;
