import { Link } from "react-router-dom"

const ModuleCard = ({ path, data, order, userType, userProgress }) => {

    const verifyProgress = (lesson) => {
        const progress = userProgress?.find(progress => progress.lesson_id === lesson.id);
        if (!progress) return false;

        return progress.is_completed;
    }

    return <div className="card h-100">
        <div className="card-header">
            <div className="d-flex justify-content-between">
                <div className="bg-secondary-subtle rounded-2 px-2">
                    Módulo {order}
                </div>
                <div>
                    {data?.lessons.length} {data?.lessons.length === 1 ? "lección" : "lecciones"}
                </div>
            </div>
            <h4>{data?.title}</h4>
        </div>
        <ul className="list-group list-group-flush h-100">
            {data?.lessons.sort((a, b) => a.id - b.id).map((lesson, index) => {
                return <li key={lesson.id} className="list-group-item container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col d-flex align-items-center">
                            {verifyProgress(lesson) ?
                                <i className="fa-solid fa-circle-check fa-2xl" style={{ color: "green" }}></i>
                                : <i className="fa-regular fa-file-lines"></i>}
                            <div className="d-flex flex-column justify-content-center ms-3">
                                <h6 className="m-0">{lesson.title}</h6>
                            </div>
                        </div>
                        {userType === "student" ?
                            <div className="col-auto">
                                {verifyProgress(lesson) ?
                                    <Link to={`/lesson/${path}/${lesson.id}`}
                                        className="btn btn-outline-success py-1 rounded-5">
                                        Repasar <i className="fa-solid fa-arrow-right"></i>
                                    </Link>
                                    : <Link to={`/lesson/${path}/${lesson.id}`}
                                        className="btn btn-outline-dark py-1 rounded-5">
                                        Leer Lección <i className="fa-solid fa-arrow-right"></i>
                                    </Link>}
                            </div>
                            : userType === "admin" ?
                                <div className="col-auto"><Link to={`/lesson/${path}/${lesson.id}`}
                                    className="btn btn-outline-dark py-1 rounded-5">
                                    Ver Lección</Link></div> : ""}
                    </div>
                </li>
            })}
        </ul>
        <div className="card-footer d-flex justify-content-between align-items-center my-1">
            <div>
                <i className="fa-solid fa-graduation-cap"></i> Evaluación del módulo
            </div>
            <div>
                {data?.lessons?.length === 0 ?
                    <span className="text-muted small">Sin lecciones aún</span>
                    : userType === "student" ?
                        <Link to={`/quizzes/${data.lessons[data.lessons.length - 1].id}`} className="btn btn-primary py-1 rounded-5">
                            Realizar Quiz<i className="fa-solid fa-play fa-2xs ms-2"></i>
                        </Link>
                        : userType === "admin" ?
                            <Link to={`/quizzes/${data.lessons[data.lessons.length - 1].id}`} className="btn btn-outline-dark py-1 rounded-5">
                                Ver Quiz
                            </Link> : ""}
            </div>
        </div>
    </div>
}

export default ModuleCard