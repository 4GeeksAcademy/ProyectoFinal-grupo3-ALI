import React from "react";
import { Link } from "react-router-dom";

// Colores del badge de nivel, según el diseño.
const LEVEL_BADGE_CLASS = {
	Principiante: "bg-info-subtle text-info-emphasis",
	Intermedio: "bg-warning-subtle text-warning-emphasis",
	Avanzado: "bg-danger-subtle text-danger-emphasis",
};

export const CourseCard = ({ course }) => {
	const badgeClass = LEVEL_BADGE_CLASS[course.level] || "bg-secondary-subtle";

	return (
		<div className="card h-100 shadow-sm">
			{course.image_url ? (
				<img
					src={course.image_url}
					alt={course.title}
					className="card-img-top"
					style={{ height: "160px", objectFit: "cover" }}
				/>
			) : (
				<div className="bg-dark" style={{ height: "160px" }}></div>
			)}

			<div className="card-body d-flex flex-column">
				<div className="d-flex justify-content-between align-items-center mb-2">
					<span className={`badge ${badgeClass}`}>{course.level}</span>
					{course.duration_hours && (
						<small className="text-muted">
							<i className="fa-regular fa-clock me-1"></i>
							{course.duration_hours}
						</small>
					)}
				</div>

				<h5 className="card-title">{course.title}</h5>
				<p className="card-text text-muted flex-grow-1">
					{course.description}
				</p>

				<div className="d-flex justify-content-between align-items-center mt-3">
					<small className="text-muted">
						{course.modules_count} módulo{course.modules_count === 1 ? "" : "s"}
					</small>
					<Link
						to={`/course/${course.id}`}
						className="btn btn-dark btn-sm"
					>
						Ver Temario
					</Link>
				</div>
			</div>
		</div>
	);
};
