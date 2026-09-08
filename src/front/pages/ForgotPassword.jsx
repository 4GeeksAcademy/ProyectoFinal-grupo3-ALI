import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo procesar la solicitud.");
            }

            setSuccess(data.message || "Hemos enviado las instrucciones a tu correo electrónico.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 shadow-sm w-100" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h3 className="text-center mb-2">Recuperar Contraseña</h3>
            <p className="text-muted text-center mb-4">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Enviando..." : "Recuperación de Contraseña"}
                </button>
            </form>

            <p className="text-center mt-3 mb-0">
                <Link to="/login">← Volver al Inicio de Sesión</Link>
            </p>
        </div>
    );
};