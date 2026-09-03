import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getCourses } from "../services/coursesService";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();
	const [searchText, setSearchText] = useState("");
	const [suggestionsOpen, setSuggestionsOpen] = useState(false);
	const [courses, setCourses] = useState([]);

	// Carga la lista de cursos una sola vez, para poder sugerirlos
	// mientras el usuario escribe. Si falla, simplemente no hay
	// sugerencias de cursos.
	useEffect(() => {
		getCourses()
			.then((data) => setCourses(data))
			.catch(() => setCourses([]));
	}, []);

	const handleLogout = () => {
		dispatch({ type: "logout" });
		localStorage.removeItem("token");
		navigate("/");
	};

	const handleSearch = (e) => {
		e.preventDefault();
		navigate(`/courses?q=${encodeURIComponent(searchText)}`);
		setSuggestionsOpen(false);
	};

	const goTo = (path) => {
		navigate(path);
		setSearchText("");
		setSuggestionsOpen(false);
	};

	// Opciones fijas del buscador. "Mis Cursos" solo aparece con sesión
	// iniciada. "Admin" nunca se incluye aquí a propósito.
	const staticOptions = [{ label: "Rutas de Aprendizaje", path: "/courses" }];
	if (store.token) {
		staticOptions.push({ label: "Mis Cursos", path: "/dashboard" });
	}

	const query = searchText.toLowerCase();
	const matchingStatic = staticOptions.filter((o) =>
		o.label.toLowerCase().includes(query)
	);
	const matchingCourses = courses
		.filter((c) => c.title.toLowerCase().includes(query))
		.map((c) => ({ label: c.title, path: `/course/${c.id}` }));

	const suggestions = [...matchingStatic, ...matchingCourses];

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex align-items-center justify-content-between">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Plataforma Blockchain</span>
				</Link>

				<form
					onSubmit={handleSearch}
					className="flex-grow-1 d-flex justify-content-center px-4 position-relative"
				>
					<input
						type="text"
						className="form-control"
						style={{ maxWidth: "400px" }}
						placeholder="¿Qué quieres aprender hoy?"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onFocus={() => setSuggestionsOpen(true)}
						onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
					/>

					{suggestionsOpen && suggestions.length > 0 && (
						<ul
							className="list-group position-absolute shadow-sm"
							style={{ top: "100%", width: "400px", zIndex: 1000 }}
						>
							{suggestions.map((item, i) => (
								<li key={i} className="list-group-item p-0">
									<button
										type="button"
										className="btn w-100 text-start"
										onMouseDown={() => goTo(item.path)}
									>
										{item.label}
									</button>
								</li>
							))}
						</ul>
					)}
				</form>

				<div className="d-flex align-items-center gap-2">
					<Link to="/courses" className="btn btn-outline-dark">
						Explorar Rutas
					</Link>

					{store.token ? (
						<>
							<span className="position-relative me-1">
								<i className="fa-regular fa-bell fs-5"></i>
								<span
									className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
									style={{ width: "8px", height: "8px" }}
								>
									<span className="visually-hidden">Notificaciones nuevas</span>
								</span>
							</span>
							<Link to="/dashboard" className="btn btn-outline-primary">
								Mis Cursos
							</Link>
							<button className="btn btn-outline-danger" onClick={handleLogout}>
								Cerrar Sesión
							</button>
						</>
					) : (
						<>
							<Link to="/register" className="btn btn-outline-primary">
								Registrarse
							</Link>
							<Link to="/login" className="btn btn-primary">
								Iniciar Sesión
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};