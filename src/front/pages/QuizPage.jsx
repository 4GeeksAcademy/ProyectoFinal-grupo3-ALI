import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuizByLesson } from "../services/quizService.js";

export const QuizPage = () => {
    const { lessonId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [enviado, setEnviado] = useState(false);

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
                    <p className="text-secondary mb-0">{quiz.description}</p>
                </div>
            </div>
            {quiz.questions_data.map((pregunta, index) => (
                <div className="card border mb-3" key={index}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="badge bg-light text-dark border">
                                Pregunta {index + 1} de {quiz.questions_data.length}
                            </span>
                            <span className="small text-secondary">Selecciona una respuesta</span>
                        </div>
                        <h5 className="fw-bold mb-3">{pregunta.question_text}</h5>

                        {["a", "b", "c"].map((letra) => (
                            <div
                                key={letra}
                                className={`border rounded p-3 mb-2 ${respuestas[index] === letra ? "border-dark bg-light" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setRespuestas({ ...respuestas, [index]: letra })}
                            >
                                <span className="badge bg-light text-dark border me-2">
                                    {letra.toUpperCase()}
                                </span>
                                {pregunta["option_" + letra]}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {!enviado ? (
                <button
                    className="btn btn-dark rounded-pill px-4"
                    onClick={() => setEnviado(true)}
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