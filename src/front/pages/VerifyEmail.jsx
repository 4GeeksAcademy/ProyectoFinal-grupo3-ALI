import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

export const VerifyEmail = () => {
    const { token: paramToken } = useParams();
    const [searchParams] = useSearchParams();
    const token = paramToken || searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ success: false, message: "" });

    useEffect(() => {
        const verifyUserToken = async () => {
            if (!token) {
                setStatus({
                    success: false,
                    message: "No se proporcionó ningún token de verificación.",
                });
                setLoading(false);
                return;
            }

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al verificar la cuenta.");
                }

                setStatus({
                    success: true,
                    message: data.message || "¡Cuenta verificada exitosamente!",
                });
            } catch (error) {
                setStatus({
                    success: false,
                    message: error.message || "El enlace es inválido o ha expirado.",
                });
            } finally {
                setLoading(false);
            }
        };

        verifyUserToken();
    }, [token]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body p-5">
                            {loading ? (
                                <div>
                                    <div
                                        className="spinner-border text-primary mb-3"
                                        role="status"
                                        style={{ width: "3rem", height: "3rem" }}
                                    >
                                        <span className="visually-hidden">Verificando ...</span>
                                    </div>
                                    <h4 className="card-title">Verificando tu cuenta ...</h4>
                                    <p className="text-muted">Por favor espera un momento.</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="d-flex justify-content-center mb-3">
                                        {status.success ? (
                                            <CheckCircle2 size={64} className="text-success" />
                                        ) : (
                                            <XCircle size={64} className="text-danger" />
                                        )}
                                    </div>

                                    <h4 className="card-title mb-3">
                                        {status.success ? "Verificación Exitosa" : "Verificación Fallida"}
                                    </h4>

                                    <p className="text-muted mb-4">{status.message}</p>

                                    {status.success ? (
                                        <Link to="/login" className="btn btn-primary w-100">
                                            Ir a Iniciar Sesión <ArrowRight size={18} className="ms-1" />
                                        </Link>
                                    ) : (
                                        <Link to="/register" className="btn btn-outline-primary w-100">
                                            <RotateCcw size={18} className="me-1" /> Volver a Registrarme
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};