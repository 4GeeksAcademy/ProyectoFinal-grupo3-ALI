import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
//import Feature from "../components/Feature";


const LessonPage = () => {

    const params = useParams();
    const [lesson, setLesson] = useState();
    const [userProgress, setUserProgress] = useState({});
    const [error, setError] = useState("");

    const getLesson = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lessons/${params.lessonId}`, {
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
        if (JSON.parse(localStorage.getItem("user")).role === "student") {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/${JSON.parse(localStorage.getItem("user")).id}/${params.lessonId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("token")}`
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
    }

    const handleLessonDone = async () => {

        if (!userProgress.is_completed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/3/${params.lessonId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "is_completed": true,
                    })
                });

                if (!response.ok) {
                    throw new Error("No se pudo guardar el progreso");
                }

                const data = await response.json();
                setUserProgress({ ...userProgress, is_completed: true });

            } catch (error) {
                setError(error.message);
            }
        }
    }

    const previousLessonId = () => {
        const currentOrder = lesson.module_lessons.find(lesson => lesson.id === parseInt(params.lessonId)).order;
        const previousLesson = lesson.module_lessons.find(lesson => lesson.order === currentOrder - 1);
        if (!previousLesson) return "";
        return previousLesson.id;
    }


    const nextLessonId = () => {
        const currentOrder = lesson.module_lessons.find(lesson => lesson.id === parseInt(params.lessonId)).order;
        const nextLesson = lesson.module_lessons.find(lesson => lesson.order === currentOrder + 1);
        if (!nextLesson) return "quiz";

        return nextLesson.id;
    }

    useEffect(() => {
        getLesson();
        getUserProgress();
    }, [params.lessonId])

    if (!lesson) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return <div className="container mt-4">
        <div className="d-flex">
            <div>
                <p className="badge bg-info-subtle text-info-emphasis border me-2">Lección {lesson?.order_number}</p>
            </div>
            {JSON.parse(localStorage.getItem("user")).role === "student" ?
                <div className="ms-auto">
                    <button type="button"
                        className={`btn ${userProgress?.is_completed ?
                            "btn-success" : "btn-outline-success"} rounded-pill`}
                        onClick={handleLessonDone}>
                        <i className={`${userProgress?.is_completed ?
                            "fa-solid" : "fa-regular"} fa-circle-check`}></i> {userProgress?.is_completed ?
                                "Completado" : "Marcar como completado"}
                    </button>
                </div> : ""}
        </div>
        <div className="markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>{lesson?.content}</Markdown>
        </div>
        <div className="d-flex justify-content-between pt-4">
            {lesson.order_number === 1 ? <Link to={`/course/${params.pathId}`} className="btn btn-outline-secondary rounded-5">
                <i className="fa-solid fa-arrow-left-long"></i> Volver al Curso
            </Link> : <Link to={`/lesson/${params.pathId}/${previousLessonId()}`} className="btn btn-outline-secondary rounded-5">
                <i className="fa-solid fa-arrow-left-long"></i> Anterior
            </Link>}
            {nextLessonId() !== "quiz" ?
                <Link to={`/lesson/${params.pathId}/${nextLessonId()}`} className="btn btn-dark rounded-5">
                    Siguiente <i className="fa-solid fa-arrow-right"></i>
                </Link>
                : <Link to={`/quizzes/${lesson.module_lessons[0].id}`} className="btn btn-dark rounded-5">
                    Ir al Quiz <i className="fa-solid fa-arrow-right"></i>
                </Link>}
        </div>
        {/* <Feature /> */}
    </div>

}

export default LessonPage;