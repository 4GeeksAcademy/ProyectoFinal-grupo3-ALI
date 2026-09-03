import React, { useState, useEffect } from "react";

export const Admin = () => {
    const [formAbierto, setFormAbierto] = useState(null);
    const [tituloLeccion, setTituloLeccion] = useState("");
    const [contenidoLeccion, setContenidoLeccion] = useState("");
    const [rutas, setRutas] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [moduloElegido, setModuloElegido] = useState("");
    const [usuario, setUsuario] = useState(null);

    const stats = {
        rutas: 4,
        modulos: 6,
        lecciones: 8,
        usuarios: 2
    };

    useEffect(() => {

        const userGuardado = localStorage.getItem("user");
        if (userGuardado) {
            setUsuario(JSON.parse(userGuardado));
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        fetch(backendUrl + "/api/learning-paths")
            .then((res) => res.json())
            .then((data) => setRutas(data))
            .catch((err) => console.log("Error cargando rutas:", err));

        fetch(backendUrl + "/api/modules")
            .then((res) => res.json())
            .then((data) => setModulos(data))
            .catch((err) => console.log("Error cargando módulos:", err));
    }, []);

    const guardarLeccion = async (rutaId) => {
        console.log("BOTÓN PRESIONADO", rutaId);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const res = await fetch(backendUrl + "/api/lessons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title: tituloLeccion,
                    content: contenidoLeccion,
                    module_id: Number(moduloElegido),
                    order_number: 1
                })
            });
            const data = await res.json();
            console.log("Respuesta:", data);

            setTituloLeccion("");
            setContenidoLeccion("");
            setModuloElegido("");
            setFormAbierto(null);
        } catch (err) {
            console.log("Error guardando:", err);
        }
    };

    if (!usuario || usuario.role !== "admin") {
        return (
            <div className="container py-5 text-center">
                <h3 className="fw-bold">Acceso restringido</h3>
                <p className="text-secondary">
                    Esta sección es solo para administradores.
                </p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center gap-2 mb-1">
                <h2 className="fw-bold mb-0">Panel de Administración</h2>
                <span className="badge bg-danger rounded-pill">ADMIN</span>
            </div>
            <p className="text-secondary small">
                Administra rutas, módulos y lecciones de la plataforma.
            </p>

            <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3">
                    <div className="card border p-3">
                        <div className="text-secondary small text-uppercase">Rutas</div>
                        <div className="fs-4 fw-bold">{stats.rutas}</div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card border p-3">
                        <div className="text-secondary small text-uppercase">Módulos</div>
                        <div className="fs-4 fw-bold">{stats.modulos}</div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card border p-3">
                        <div className="text-secondary small text-uppercase">Lecciones</div>
                        <div className="fs-4 fw-bold">{stats.lecciones}</div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card border p-3">
                        <div className="text-secondary small text-uppercase">Usuarios</div>
                        <div className="fs-4 fw-bold">{stats.usuarios}</div>
                    </div>
                </div>
            </div>

            <div className="card border">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Rutas de aprendizaje</h5>
                    <button className="btn btn-dark btn-sm rounded-pill px-3">
                        + Nueva ruta
                    </button>
                </div>
                <div className="card-body">
                    {rutas.map((ruta) => (
                        <div className="border rounded p-3 mb-3" key={ruta.id}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">{ruta.title}</span>
                                <button
                                    className="btn btn-sm btn-outline-dark rounded-pill"
                                    onClick={() => setFormAbierto(formAbierto === ruta.id ? null : ruta.id)}
                                >
                                    {formAbierto === ruta.id ? "Cancelar" : "+ Lección"}
                                </button>
                            </div>
                            {formAbierto === ruta.id && (
                                <div className="border-top mt-3 pt-3">
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold">Módulo</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={moduloElegido}
                                            onChange={(e) => setModuloElegido(e.target.value)}
                                        >
                                            <option value="">Selecciona un módulo</option>
                                            {modulos.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold">Título de la lección</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Ej. Qué es una llave privada"
                                            value={tituloLeccion}
                                            onChange={(e) => setTituloLeccion(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold">Contenido</label>
                                        <textarea
                                            className="form-control form-control-sm"
                                            rows="4"
                                            placeholder="Escribe el contenido de la lección..."
                                            value={contenidoLeccion}
                                            onChange={(e) => setContenidoLeccion(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <button
                                        className="btn btn-dark btn-sm rounded-pill px-3"
                                        onClick={() => guardarLeccion(ruta.id)}
                                    >
                                        Guardar lección
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};