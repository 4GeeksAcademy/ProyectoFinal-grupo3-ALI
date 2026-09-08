import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("No se proporcionó ningún token de recuperación.");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo restablecer la contraseña.");
            }

            setSuccess(data.message || "Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card p-5 shadow-sm w-100" style={{ maxWidth: "400px" }}>
                <h3 className="text-center mb-2">Restablecer Contraseña</h3>
                <p className="text-muted text-center mb-4">
                    Ingresa tu nueva contraseña para acceder a tu cuenta.
                </p>

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {success && <div className="alert alert-success py-2">{success}</div>}

                {success ? (
                    <button className="btn btn-primary w-100" onClick={() => navigate("/login")}>
                        Ir al Inicio de Sesión →
                    </button>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nueva Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repite la nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Contraseña"}
                        </button>
                    </form>
                )}

                <p className="text-center mt-3 mb-0">
                    <Link to="/login">← Volver al Inicio de Sesión</Link>
                </p>
            </div>
        </div>
    );
};