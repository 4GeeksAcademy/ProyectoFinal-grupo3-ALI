import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Correo o contraseña incorrectos");
            }

            // Guarda el token y el usuario en el store global (store.js).
            dispatch({ type: "set_token", payload: data.token });
            dispatch({ type: "set_user", payload: data.user });

            // También lo guardamos en localStorage para no perder la sesión
            // si el usuario recarga la página.
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                navigate("/admin");
            }

            if (data.user.role === "student") {
                getUserProgress(data.user.id);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUserProgress = async (user_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener el progreso del usuario");
            }

            const data = await response.json();

            if (data.length === 0) {
                getAllLessons(user_id);
            }
            else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.log(error);
        }
    }

    const getAllLessons = async (user_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lessons`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error("No se pudo obtener información");
            }

            const data = await response.json();
            const initialProgress = data.map((value, index) => ({
                user_id: user_id,
                lesson_id: value.id,
                quiz_score: 0,
                is_completed: false
            }))
            createProgress(initialProgress);

        } catch (error) {
            console.log(error);
        }
    }

    const createProgress = async (initialProgress) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(initialProgress)
            });

            if (!response.ok) {
                throw new Error("No se pudo inicializar el progreso");
            }

            const data = await response.json();
            navigate("/dashboard");

        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="card p-4 pb-5 shadow-sm w-100 mb-5" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h3 className="text-center mb-4">Iniciar Sesión</h3>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="estudiante@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <label className="form-label">Contraseña</label>
                        <Link to="/forgot-password" className="text-primary small">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
};