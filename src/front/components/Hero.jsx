import React from "react";
import { Link } from "react-router-dom";

export const Hero = () => {

    const verifyUser = () => {
        const user = localStorage.getItem("user");
        if (user) return JSON.parse(user).role;
        return null;
    }

    return (
        <div className="container">
            <div className="text-center py-5">
                <span className="badge bg-primary mb-3">
                    Nueva ruta próximamente: Smart Contracts en Solidity
                </span>

                <h1 className="mb-3">
                    Domina el futuro con <span className="text-primary">Blockchain</span>
                </h1>

                <p className="lead text-muted mb-4">
                    Rutas de prendizaje guiadas desde cero hasta experto. Sin videos
                    interminables, solo contenido técnico de calidad, lectura profunda
                    y evaluaciones prácticas.
                </p>
                {verifyUser() === null ?
                    <Link to="/register" className="btn btn-primary btn-lg me-2">
                        Empieza a aprender gratis
                    </Link> : ""}
                <Link to="/courses" className="btn btn-outline-secondary btn-lg">
                    Ver plan de estudios
                </Link>
            </div>
        </div>
    );
};