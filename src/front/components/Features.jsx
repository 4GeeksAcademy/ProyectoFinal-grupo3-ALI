import React from "react";

export const Features = () => {
    const features = [
        {
            icon: "bi-file-text",
            title: "Enfoque en Texto",
            text: "Lee a tu propio ritmo. El material escrito permite escaneo rápido, búsqueda de conceptos y una absorción de conocimientos más eficiente que el video.",
            dark: false
        },
        {
            icon: "bi-patch-question",
            title: "Evaluación Continua",
            text: "Quizzes técnicos al final de cada módulo para asegurar la comprensión de conceptos complejos como criptografía y consenso.",
            dark: true
        },
        {
            icon: "bi-diagram-3",
            title: "Rutas Estructuradas",
            text: "No pierdas tiempo decidiendo qué aprender. Sigue un currículo lógico y progresivo diseñado por expertos de la industria.",
            dark: false
        }
    ];

    return (
        <section className="py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">¿Por qué elegir BlockScholar?</h2>
                    <p className="text-secondary mx-auto" style={{ maxWidth: "600px" }}>
                        Un enfoque pedagógico diseñado para desarrolladores y profesionales
                        que valoran su tiempo y buscan profundidad técnica.
                    </p>
                </div>

                <div className="row g-4">
                    {features.map((f, index) => (
                        <div className="col-12 col-md-4" key={index}>
                            <div
                                className={`card border-0 h-100 p-4 ${f.dark ? "text-white" : ""}`}
                                style={f.dark ? { backgroundColor: "#111827" } : { backgroundColor: "#e9ecef" }}
                            >
                                <div
                                    className={`d-flex align-items-center justify-content-center rounded-3 mb-4 ${f.dark ? "bg-white bg-opacity-10" : "bg-primary bg-opacity-25"
                                        }`}
                                    style={{ width: "48px", height: "48px" }}
                                >
                                    <i className={`bi ${f.icon} fs-5`}></i>
                                </div>
                                <h5 className="fw-bold mb-3">{f.title}</h5>
                                <p className={`mb-0 ${f.dark ? "text-white-50" : "text-secondary"}`}>
                                    {f.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};