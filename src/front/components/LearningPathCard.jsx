const LearningPathCard = ({data}) => {

    return <div className="card">
        <img className="card-img-top" src={data.image_url}/>
        <div className="card-body">
            <h5 className="card-title">{data.title}</h5>
            <p className="card-text">{data.description}</p>
        </div>
        <div className="card-footer text-body-secondary d-flex justify-content-between">
            <div><i className="fa-solid fa-book-open"></i> {data.number_of_modules} Módulos</div>
            <div><i className="fa-regular fa-clock"></i> {data.time_required}</div>
        </div>
    </div>
}

export default LearningPathCard;