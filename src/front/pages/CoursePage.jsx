import { useParams } from "react-router-dom";
import CourseDescription from "../components/CourseDescription";
import ModuleCard from "../components/ModuleCard";
import { useEffect, useState } from "react";

const CoursePage = () => {

    const [learningPath, setLearningPath] = useState();
    const params = useParams();

    const getLearningPath = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/learning-paths/${params.theId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error("No es posible acceder a la información");
            }
            const data = await response.json();
            setLearningPath(data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getLearningPath();
    }, [])

    return <div className="container">
        <CourseDescription data={learningPath} />
        <div className="row my-3">
            <div className="col-md-6 col-sm-12">
                <div className="d-flex justify-content-between">
                    <h3>Módulos</h3>
                    <p>{learningPath?.number_of_modules} módulos</p>
                </div>
                {learningPath?.modules.map((module, index) => {
                    return <div key={module.id} className="mb-4">
                        <ModuleCard data={module} />
                    </div>
                })}
            </div>
            <div className="col-md-6 col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <h4>Estado de tu aprendizaje</h4>
                        <p>Progreso de la ruta</p>
                        <p>0 % (0/N lecciones)</p>
                        <div className="progress" role="progressbar">
                            <div className="progress-bar" style={{ width: "0%" }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CoursePage;