const ModuleCard = ({data}) => {



    return <div className="card">
        <div className="card-header">
            <div className="d-flex justify-content-between">
                <div className="bg-secondary-subtle rounded-2 px-2">
                    Módulo {data?.id}
                </div>
                <div>
                    Número de lecciones
                </div>
            </div>
            <h4>{data?.title}</h4>
            <p>Descripción del módulo</p>
        </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item container">
                <div className="row justify-content-between align-items-center">
                    <div className="col d-flex align-items-center">
                        <i className="fa-solid fa-circle-check fa-2xl" style={{ color: "rgb(99, 230, 190)" }}></i>
                        <div className="d-flex flex-column justify-content-center ms-3">
                            <h6>Nombre de la lección</h6>
                            <div><i className="fa-regular fa-clock"></i> Tiempo • Nivel</div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-outline-success rounded-5">
                            Repasar <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </li>
        </ul>
        <div className="card-footer d-flex justify-content-between align-items-center">
            <div>
                <i className="fa-solid fa-graduation-cap"></i> Evaluación: Nombre
            </div>
            <div>
                <button className="btn btn-primary rounded-5">Realizar Quiz</button>
            </div>
        </div>
    </div>
}

export default ModuleCard