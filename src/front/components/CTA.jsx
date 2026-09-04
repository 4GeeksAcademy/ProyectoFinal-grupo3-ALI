import React from "react";
import { Link } from "react-router-dom";

export const CTA = () => {
    return (
        <section className="py-5" style={{ backgroundColor: "#111827" }}>
            <div className="container text-center text-white py-4">
                <h2 className="fw-bold mb-3">Empieza hoy, gratis</h2>
                <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: "520px" }}>
                    Crea tu cuenta y arranca con la primera ruta. Sin tarjeta, sin suscripción.
                </p>
                <Link to="/register" className="btn btn-light rounded-pill px-4 fw-bold">
                    Crear cuenta
                </Link>
            </div>
        </section>
    );
};