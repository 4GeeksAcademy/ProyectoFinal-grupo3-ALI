import React from "react";

export const HowItWorks = () => {
    const pasos = [
        {
            numero: "1",
            titulo: "Elige tu ruta",
            texto: "Empieza por los fundamentos o salta directo a smart contracts si ya tienes base."
        },
        {
            numero: "2",
            titulo: "Lee a tu ritmo",
            texto: "Lecciones escritas, con ejemplos de código reales. Vuelves atrás cuando quieras."
        },
        {
            numero: "3",
            titulo: "Demuestra que lo entendiste",
            texto: "Cada módulo cierra con una evaluación. Necesitas 70% para avanzar."
        }
    ];

    return (
        <section className="py-5 bg-light">
            <div className="container">
                <h2 className="fw-bold text-center mb-5">Cómo funciona</h2>
                <div className="row g-4">
                    {pasos.map((paso) => (
                        <div className="col-12 col-md-4" key={paso.numero}>
                            <div className="text-center px-3">
                                <div
                                    className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                                    style={{ width: "48px", height: "48px" }}
                                >
                                    {paso.numero}
                                </div>
                                <h5 className="fw-bold mb-2">{paso.titulo}</h5>
                                <p className="text-secondary mb-0">{paso.texto}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};