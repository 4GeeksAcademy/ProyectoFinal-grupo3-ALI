import React from "react";

const LEVELS = ["Todas las Rutas", "Principiante", "Intermedio", "Avanzado"];

export const CourseFilterBar = ({
    searchText,
    onSearchChange,
    activeLevel,
    onLevelChange,
}) => {
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <input
                type="text"
                className="form-control"
                style={{ maxWidth: "350px" }}
                placeholder="Buscar por título, Solidity, DeFi..."
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
            />

            <div className="d-flex flex-wrap gap-2">
                {LEVELS.map((level) => (
                    <button
                        key={level}
                        type="button"
                        className={`btn btn-sm ${activeLevel === level ? "btn-dark" : "btn-outline-secondary"
                            }`}
                        onClick={() => onLevelChange(level)}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
    );
};
