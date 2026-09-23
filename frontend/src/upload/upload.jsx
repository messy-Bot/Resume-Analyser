import {
    useContext,
    useRef,
    useState
} from "react";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import Styles from "./upload.module.css";

import { usercontext } from "../appcontext";


function Uploadpage() {

    const {
        serviceURL
    } = useContext(usercontext);


    const navigate =
        useNavigate();


    const formRef =
        useRef(null);


    const [fileName, setFileName] =
        useState("No file uploaded");


    const [isLoading, setIsLoading] =
        useState(false);


    const validateFile = (file) => {

        if (!file) {
            return false;
        }


        const allowedTypes = [

            "application/pdf",

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        ];


        if (!allowedTypes.includes(file.type)) {

            toast.error(
                "Please upload a PDF, DOC, or DOCX file."
            );

            return false;
        }


        if (file.size > 2 * 1024 * 1024) {

            toast.error(
                "Resume must be smaller than 2 MB."
            );

            return false;
        }


        return true;
    };


    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            setFileName(
                "No file uploaded"
            );

            return;
        }


        if (!validateFile(file)) {

            event.target.value = "";

            setFileName(
                "No file uploaded"
            );

            return;
        }


        setFileName(file.name);
    };


    const analyseDocument = async (event) => {

        event.preventDefault();


        const form =
            formRef.current;


        if (!form) {
            return;
        }


        const formData =
            new FormData(form);


        const role =
            String(
                formData.get("roles") || ""
            ).trim();


        const file =
            formData.get("file");


        if (!role) {

            toast.warn(
                "Please enter the target role."
            );

            return;
        }


        if (
            !(file instanceof File) ||
            !file.name
        ) {

            toast.warn(
                "Please upload your resume."
            );

            return;
        }


        if (!validateFile(file)) {
            return;
        }


        setIsLoading(true);


        try {

            const response =
                await fetch(
                    `${serviceURL}/extract`,
                    {
                        method: "POST",

                        body: formData,

                        credentials: "include"
                    }
                );


            if (!response.ok) {

                const message =
                    await response.text();


                throw new Error(
                    message ||
                    "Resume analysis failed."
                );
            }


            form.reset();


            setFileName(
                "No file uploaded"
            );


            toast.success(
                "Resume analysed successfully."
            );


            navigate(
                "/analysereport"
            );


        } catch (error) {

            console.error(
                "Resume analysis error:",
                error
            );


            toast.error(
                error.message ||
                "Unable to analyse the resume."
            );


        } finally {

            setIsLoading(false);
        }
    };


    return (

        <div className={Styles.container}>

            <div className={Styles.nav}>

                <h1>
                    Resume Analyser
                </h1>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Home
                </button>

            </div>


            <div
                className={
                    Styles.uploadcontainer
                }
            >

                <h2>
                    Upload Resume
                </h2>


                <form
                    ref={formRef}
                    encType="multipart/form-data"
                    onSubmit={analyseDocument}
                >

                    <label
                        className={
                            Styles.uploadcontainerlabel
                        }
                        htmlFor="roles"
                    >
                        Target Role
                    </label>


                    <input
                        type="text"
                        name="roles"
                        id="roles"
                        autoComplete="off"
                        placeholder="Example: Software Engineer"
                        maxLength={100}
                    />


                    <label
                        htmlFor="resume"
                        className={Styles.fileinp}
                    >

                        <p>
                            Upload your resume here
                        </p>


                        <h5>
                            Select File
                        </h5>


                        <span
                            className={Styles.spn}
                        >
                            {fileName}
                        </span>

                    </label>


                    <input
                        type="file"
                        name="file"
                        id="resume"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />


                    <button
                        type="submit"
                        disabled={isLoading}
                    >

                        {isLoading
                            ? "Analysing..."
                            : "Analyse Resume"}

                    </button>

                </form>

            </div>


            <div
                className={
                    Styles.guidelinescontainer
                }
            >

                <h2>
                    Guidelines
                </h2>


                <ul>

                    <li>

                        <span>
                            File Format:
                        </span>

                        PDF, DOC, or DOCX only.

                    </li>


                    <li>

                        <span>
                            File Size:
                        </span>

                        Maximum 2 MB.

                    </li>


                    <li>

                        <span>
                            Language:
                        </span>

                        English resumes are recommended.

                    </li>

                </ul>

            </div>


            {isLoading && (

                <div
                    className={Styles.loadani}
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
                        Analysing Resume...
                    </h1>

                </div>

            )}

        </div>
    );
}


export default Uploadpage;
