import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourses } from "../services/coursesService";
import { CourseFilterBar } from "../components/CourseFilterBar";
import { CourseCard } from "../components/CourseCard";

export const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get("q") || "");
    const [activeLevel, setActiveLevel] = useState("Todas las Rutas");

    // Carga los cursos reales desde el backend al montar la página.
    useEffect(() => {
        getCourses()
            .then((data) => setCourses(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Filtra en el navegador (client-side) por texto y por nivel.
    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title
            .toLowerCase()
            .includes(searchText.toLowerCase());
        const matchesLevel =
            activeLevel === "Todas las Rutas" || course.level === activeLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="container py-4">
            {/* Encabezado + caja "Modo Explorador" */}
            <div className="row align-items-center mb-4">
                <div className="col-md-8">
                    <span className="badge bg-primary-subtle text-primary-emphasis mb-2">
                        CATÁLOGO EDUCATIVO WEB3
                    </span>
                    <h1 className="fw-bold">Explorar Rutas de Aprendizaje</h1>
                    <p className="text-muted">
                        El paso a paso desde conceptos fundamentales
                        de criptografía y consenso distribuido hasta el desarrollo de
                        contratos inteligentes y protocolos DeFi.
                    </p>
                </div>
                <div className="col-md-4">
                    <div className="border rounded p-3">
                        <h6 className="fw-bold">
                            <i className="fa-regular fa-user me-2"></i>
                            Modo Explorador
                        </h6>
                        <p className="text-muted small">
                            Puedes consultar los temarios pero tienes que iniciar sesión para acceder a las
                            lecciones y guardar tu progreso.
                        </p>
                        <button className="btn btn-dark w-100">Registrarme Gratis</button>
                    </div>
                </div>
            </div>

            {/* Buscador y filtros por nivel */}
            <CourseFilterBar
                searchText={searchText}
                onSearchChange={setSearchText}
                activeLevel={activeLevel}
                onLevelChange={setActiveLevel}
            />

            {loading && <p className="text-muted">Cargando rutas de aprendizaje...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && filteredCourses.length === 0 && (
                <p className="text-muted">No hay rutas de aprendizaje todavía.</p>
            )}

            {/* Grilla de tarjetas de cursos */}
            <div className="row g-4 mb-5">
                {filteredCourses.map((course) => (
                    <div className="col-md-4" key={course.id}>
                        <CourseCard course={course} />
                    </div>
                ))}
            </div>

            {/* Franja de características, al final de la página */}
            <div className="row g-4 text-center">
                <div className="col-md-4">
                    <i className="fa-solid fa-file-lines fs-2 text-primary mb-2"></i>
                    <h6 className="fw-bold">Lecturas Markdown Estructuradas</h6>
                    <p className="text-muted small">
                        Contenido técnico detallado con fragmentos de código listos para
                        inspeccionar y replicar.
                    </p>
                </div>
                <div className="col-md-4">
                    <i className="fa-solid fa-circle-check fs-2 text-success mb-2"></i>
                    <h6 className="fw-bold">Evaluaciones Interactivas</h6>
                    <p className="text-muted small">
                        Quizzes al finalizar cada módulo para afianzar conceptos clave con
                        explicación didáctica.
                    </p>
                </div>
                <div className="col-md-4">
                    <i className="fa-solid fa-shield-halved fs-2 text-info mb-2"></i>
                    <h6 className="fw-bold">Acreditación Académica</h6>
                    <p className="text-muted small">
                        Certificados digitales emitidos al completar el 100% de los
                        módulos y evaluaciones.
                    </p>
                </div>
            </div>
        </div>
    );
};
