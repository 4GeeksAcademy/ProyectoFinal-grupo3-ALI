import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
	const año = new Date().getFullYear();

	return (
		<footer className="mt-auto pt-5 pb-4" style={{ backgroundColor: "#111827" }}>
			<div className="container text-white">
				<div className="row g-4">
					<div className="col-12 col-md-5">
						<h5 className="fw-bold mb-2">BlockScholar</h5>
						<p className="text-white-50 small mb-0" style={{ maxWidth: "320px" }}>
							Aprende blockchain con contenido técnico serio, sin hype ni promesas
							de rendimientos.
						</p>
					</div>

					<div className="col-6 col-md-3">
						<h6 className="fw-bold mb-3">Plataforma</h6>
						<ul className="list-unstyled small">
							<li className="mb-2">
								<Link to="/courses" className="text-white-50 text-decoration-none">
									Rutas de aprendizaje
								</Link>
							</li>
							<li className="mb-2">
								<Link to="/dashboard" className="text-white-50 text-decoration-none">
									Mi progreso
								</Link>
							</li>
							<li>
								<Link to="/register" className="text-white-50 text-decoration-none">
									Crear cuenta
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-6 col-md-4">
						<h6 className="fw-bold mb-3">Proyecto</h6>
						<p className="text-white-50 small mb-0">
							Proyecto final del bootcamp Full Stack de 4Geeks Academy.
							Construido con React, Flask y PostgreSQL.
						</p>
					</div>
				</div>

				<hr className="border-secondary my-4" />

				<div className="text-white-50 small text-center">
					© {año} BlockScholar
				</div>
			</div>
		</footer>
	);
};
