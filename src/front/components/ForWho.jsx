import React from "react";

export const ForWho = () => {
    const perfiles = [
        {
            icon: "bi-wallet2",
            titulo: "Ya usas crypto, pero no sabes qué hay debajo",
            texto: "Compras, vendes, quizá hasta usas DeFi. Pero no tienes claro qué es un consenso ni por qué una clave privada importa tanto."
        },
        {
            icon: "bi-code-slash",
            titulo: "Programas y quieres entrar a Web3",
            texto: "Sabes JavaScript o Python y ves que Solidity aparece en todas partes. Necesitas los fundamentos antes de escribir tu primer contrato."
        },
        {
            icon: "bi-mortarboard",
            titulo: "Empiezas desde cero",
            texto: "Escuchaste de blockchain y quieres entenderlo de verdad, sin hype ni promesas de rendimientos."
        }
    ];

    return (
        <section className="py-5">
            <div className="container">
                <h2 className="fw-bold text-center mb-2">¿Para quién es esto?</h2>
                <p className="text-secondary text-center mb-5">
                    No hace falta saber programar para empezar.
                </p>
                <div className="row g-4">
                    {perfiles.map((perfil, i) => (
                        <div className="col-12 col-md-4" key={i}>
                            <div className="card border h-100 p-4">
                                <i className={`bi ${perfil.icon} fs-3 mb-3`}></i>
                                <h6 className="fw-bold mb-2">{perfil.titulo}</h6>
                                <p className="text-secondary small mb-0">{perfil.texto}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};