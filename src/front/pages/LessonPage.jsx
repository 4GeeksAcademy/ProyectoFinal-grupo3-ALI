import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const LessonPage = () => {

    const params = useParams();
    const [lesson, setLesson] = useState();
    const [userProgress, setUserProgress] = useState({});
    const [error, setError] = useState("");

    const getLesson = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lessons/${params.theId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error("No se pudo obtener información");
            }

            const data = await response.json();
            setLesson(data);

        } catch (error) {
            console.log(error);
        }
    }

    const getUserProgress = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/1/1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener el progreso del usuario");
            }

            const data = await response.json();
            setUserProgress(data);

        } catch (error) {
            console.log(error);
        }
    }

    const handleLessonDone = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/1/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "is_completed": true
                })
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar el progreso");
            }

            const data = await response.json();
            setUserProgress({ ...userProgress, is_completed: true });

        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        getLesson();
        getUserProgress();
    }, [])

    return <div className="container mt-4">
        <div className="d-flex">
            <div>
                <p className="badge bg-info-subtle text-info-emphasis border me-2">Lección {lesson?.index + 1}</p>
                <p className="badge text-info-emphasis border me-2">
                    <i className="fa-regular fa-clock"></i> Tiempo de lectura
                </p>
                <p className="badge text-info-emphasis border">Nivel</p>
            </div>
            <div className="ms-auto">
                <button type="button"
                    className={`btn ${userProgress?.is_completed ?
                        "btn-success" : "btn-outline-success"} rounded-pill`}
                    onClick={handleLessonDone}>
                    <i className={`${userProgress?.is_completed ?
                        "fa-solid" : "fa-regular"} fa-circle-check`}></i> {userProgress?.is_completed ?
                            "Completado" : "Marcar como completado"}
                </button>
            </div>
        </div>
        <div className="markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>{lesson?.content}</Markdown>
        </div>
        <div className="d-flex justify-content-between pt-4">
            <Link to="/courses/1" className="btn btn-outline-secondary rounded-5">
                <i className="fa-solid fa-arrow-left-long"></i> Volver al Curso
            </Link>
            <button className="btn btn-dark rounded-5">
                Siguiente <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    </div>

}

export default LessonPage;