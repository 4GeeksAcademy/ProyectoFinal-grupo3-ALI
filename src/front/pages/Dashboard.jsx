import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si no hay sesión iniciada, no tiene caso mostrar el panel: mandamos a login.
        if (!store.token) {
            navigate("/login");
            return;
        }

        const cargarDatos = async () => {
            try {
                // 1. Trae los datos del usuario logueado.
                const dashboardResp = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/dashboard`,
                    { headers: { Authorization: `Bearer ${store.token}` } }
                );
                if (!dashboardResp.ok) throw new Error("No se pudo cargar tu perfil");
                const dashboardData = await dashboardResp.json();
                dispatch({ type: "set_user", payload: dashboardData.user });

                // 2. Trae el progreso de lecciones de ese usuario.
                const progressResp = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/progress/${dashboardData.user.id}`,
                    { headers: { Authorization: `Bearer ${store.token}` } }
                );
                if (!progressResp.ok) throw new Error("No se pudo cargar tu progreso");
                const progressData = await progressResp.json();
                setProgress(progressData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [store.token]);

    if (loading) {
        return <div className="container py-5 text-center text-muted">Cargando tu progreso...</div>;
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    const completadas = progress.filter((p) => p.is_completed).length;
    const total = progress.length;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-1">Panel del Estudiante</h2>
            <p className="text-secondary mb-4">
                Bienvenido{store.user?.email ? `, ${store.user.email}` : ""}
            </p>

            <div className="card border mb-4">
                <div className="card-body">
                    <h5 className="fw-bold">Tu progreso general</h5>
                    <p className="text-muted mb-2">
                        {porcentaje}% completado ({completadas}/{total} lecciones)
                    </p>
                    <div className="progress" role="progressbar" style={{ height: "10px" }}>
                        <div
                            className="progress-bar bg-success"
                            style={{ width: `${porcentaje}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="card border">
                <div className="card-header bg-white">
                    <h5 className="fw-bold mb-0">Lecciones</h5>
                </div>
                <div className="card-body">
                    {total === 0 && (
                        <p className="text-muted mb-0">
                            Todavía no has empezado ninguna lección.{" "}
                            {/* TODO: cuando exista un botón "Ingresar a esta ruta" que llame a
                                POST /api/progress, aquí empezarán a aparecer filas. */}
                        </p>
                    )}
                    {progress.map((item, i) => (
                        <div
                            key={i}
                            className="d-flex justify-content-between align-items-center border-bottom py-2"
                        >
                            {/* TODO: el backend hoy solo da lesson_id, no el título de la
                                lección — pedirle a nuestro lider Luis o al equipo que /api/progress incluya
                                lesson_title para mostrar algo más claro que un número. */}
                            <span>Lección #{item.lesson_id}</span>
                            <span className={`badge ${item.is_completed ? "bg-success" : "bg-secondary"}`}>
                                {item.is_completed ? "Completada" : "En progreso"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
