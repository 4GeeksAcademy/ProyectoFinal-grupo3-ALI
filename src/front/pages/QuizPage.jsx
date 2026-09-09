import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuizByLesson } from "../services/quizService.js";

export const QuizPage = () => {
    const { lessonId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState("");
    const params = useParams();

    // Lee el usuario de forma segura: si no hay sesión, devuelve null
    // en vez de tronar con JSON.parse(null).role
    const getCurrentUser = () => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    };
    const currentUser = getCurrentUser();

    const setScore = async () => {
        if (!currentUser) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/${currentUser.id}/${params.lessonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    "quiz_score": calcularNota() / quiz.questions_data.length * 100,
                })
            });

            if (!response.ok) {
                throw new Error("No se pudo guardar el score");
            }

            const data = await response.json();

            setEnviado(true);

        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        getQuizByLesson(lessonId).then((data) => setQuiz(data));
    }, [lessonId]);

    const calcularNota = () => {
        let correctas = 0;
        quiz.questions_data.forEach((pregunta, index) => {
            if (respuestas[index] === pregunta.correct_option) {
                correctas++;
            }
        });
        return correctas;
    };

    if (!quiz) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="card border mb-4">
                <div className="card-body">
                    <span className="badge bg-dark mb-2">EVALUACIÓN</span>
                    <h3 className="fw-bold">{quiz.title}</h3>
                    {currentUser?.role === "student" ?
                        <p className="text-secondary mb-0">{quiz.description}</p> : ""}
                </div>
            </div>
            {quiz.questions_data.map((pregunta, index) => (
                <div className="card border mb-3" key={index}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="badge bg-light text-dark border">
                                Pregunta {index + 1} de {quiz.questions_data.length}
                            </span>
                            {currentUser?.role === "student" ?
                                <span className="small text-secondary">Selecciona una respuesta</span> : ""}
                        </div>
                        <h5 className="fw-bold mb-3">{pregunta.question_text}</h5>

                        {["a", "b", "c"].map((letra) => (
                            <div
                                key={letra}
                                className={`border rounded p-3 mb-2
                                        ${respuestas[index] === letra ? "border-dark bg-light" : ""}
                                        ${letra === pregunta.correct_option &&
                                        currentUser?.role === "admin" ?
                                        "bg bg-primary" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => { if (!enviado) setRespuestas({ ...respuestas, [index]: letra }) }}
                            >
                                <span className="badge bg-light text-dark border me-2">
                                    {letra.toUpperCase()}
                                </span>
                                {pregunta["option_" + letra]}
                            </div>
                        )
                        )}
                    </div>
                </div>
            ))}
            {currentUser?.role !== "student" ? "" : !enviado ? (
                <button
                    className="btn btn-dark rounded-pill px-4"
                    onClick={() => setScore()}
                    disabled={Object.keys(respuestas).length < quiz.questions_data.length}
                >
                    Enviar respuestas
                </button>
            ) : (
                <div className="card border">
                    <div className="card-body text-center">
                        <h4 className="fw-bold">
                            {calcularNota()} de {quiz.questions_data.length} correctas
                        </h4>
                        <p className="text-secondary mb-0">
                            {calcularNota() / quiz.questions_data.length >= 0.7
                                ? "Aprobaste la evaluación."
                                : "Necesitas 70% para aprobar. Puedes intentarlo de nuevo."}
                        </p>
                        <button
                            className="btn btn-outline-dark rounded-pill px-4 mt-3"
                            onClick={() => {
                                setRespuestas({});
                                setEnviado(false);
                            }}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};