const CourseDescription = ({ data }) => {

    return <div className="container bg-secondary rounded-4 p-4">
        <div className="row">
            <div className="col-md-6 d-flex flex-column justify-content-between">
                <div className="row">
                    <div className="col-auto bg-success-subtle rounded ms-3 mb-1">
                        Nivel
                    </div>
                    <div className="col-auto bg-white rounded ms-3 mb-1">
                        <i className="fa-regular fa-clock"></i> {data?.time_required}
                    </div>
                    <div className="col-auto bg-white rounded ms-3 mb-1">
                        <i className="fa-solid fa-book"></i> Lecciones
                    </div>
                </div>
                <div className="row">
                    <h3 className="fs-1">{data?.title}</h3>
                    <p>{data?.description}</p>
                </div>
                <div className="row justify-content-start">
                    <div className="col-auto my-1">
                        <button className="btn btn-info rounded-5">
                            <i className="fa-solid fa-circle-play"></i> Ingresar a esta ruta
                        </button>
                    </div>
                    <div className="col-auto my-1">
                        <button className="btn btn-outline-light rounded-5">
                            <i className="fa-solid fa-arrow-left-long"></i> Ver todas las rutas
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-6 align-content-center">
                <img className="img-fluid float-end rounded" src={data?.image_url} />
            </div>
        </div>
    </div>
}

export default CourseDescription;