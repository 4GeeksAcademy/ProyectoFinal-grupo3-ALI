import { Link } from "react-router-dom"

const ModuleCard = ({ data, userProgress }) => {

    return <div className="card">
        <div className="card-header">
            <div className="d-flex justify-content-between">
                <div className="bg-secondary-subtle rounded-2 px-2">
                    Módulo {data?.id}
                </div>
                <div>
                    {data?.lessons.length} lecciones
                </div>
            </div>
            <h4>{data?.title}</h4>
            <p>Descripción del módulo</p>
        </div>
        <ul className="list-group list-group-flush">
            {data?.lessons.map((lesson, index) => {
                return <li key={lesson.id} className="list-group-item container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col d-flex align-items-center">
                            {userProgress?.find(progress => progress.lesson_id === 1).is_completed ?
                                <i className="fa-solid fa-circle-check fa-2xl" style={{ color: "green" }}></i>
                                : <i className="fa-regular fa-file-lines"></i>}
                            <div className="d-flex flex-column justify-content-center ms-3">
                                <h6>{lesson.title}</h6>
                                <div><i className="fa-regular fa-clock"></i> Tiempo • Nivel</div>
                            </div>
                        </div>
                        <div className="col-auto">
                            {userProgress?.find(progress => progress.lesson_id === 1).is_completed ?
                                <Link to={`/lesson/${lesson.id}`}
                                    className="btn btn-outline-success rounded-5">
                                    Repasar <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                                : <Link to={`/lesson/${lesson.id}`}
                                    className="btn btn-outline-dark rounded-5">
                                    Leer Lección <i className="fa-solid fa-arrow-right"></i>
                                </Link>}

                        </div>
                    </div>
                </li>
            })}
        </ul>
        <div className="card-footer d-flex justify-content-between align-items-center">
            <div>
                <i className="fa-solid fa-graduation-cap"></i> Evaluación: Nombre
            </div>
            <div>
                <button className="btn btn-primary rounded-5">
                    Realizar Quiz<i className="fa-solid fa-play fa-2xs ms-2"></i>
                </button>
            </div>
        </div>
    </div>
}

export default ModuleCard