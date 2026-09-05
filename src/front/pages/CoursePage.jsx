import { useParams } from "react-router-dom";
import CourseDescription from "../components/CourseDescription";
import ModuleCard from "../components/ModuleCard";
import { useEffect, useState } from "react";

const CoursePage = () => {

    const [learningPath, setLearningPath] = useState();
    const [userProgress, setUserProgress] = useState();
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

    const getUserProgress = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener el progreso del usuario");
            }
            const data = await response.json();
            setUserProgress(data);

        } catch (error) {
            console.log(error);
        }
    }

    const totalLessonsOfPath = () => {
        return learningPath?.modules.reduce((num, module) => num + module.lessons.length, 0);
    }

    const lessonsDoneOfPath = () => {
        return userProgress?.filter(progress => progress.is_completed === true).length;
    }

    const progressPath = () => {
        return lessonsDoneOfPath()*100/totalLessonsOfPath();
    }

    useEffect(() => {
        getLearningPath();
        getUserProgress();
    }, [])

    return <div className="container mt-4">
        <CourseDescription data={learningPath} />
        <div className="row my-3">
            <div className="col-md-6 col-sm-12">
                <div className="d-flex justify-content-between">
                    <h3>Módulos</h3>
                    <p>{learningPath?.number_of_modules} módulos</p>
                </div>
                {learningPath?.modules.map((module, index) => {
                    return <div key={module.id} className="mb-4">
                        <ModuleCard data={module} userProgress={userProgress}/>
                    </div>
                })}
            </div>
            <div className="col-md-6 col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <h4>Estado de tu aprendizaje</h4>
                        <p>Progreso de la ruta</p>
                        <p>{progressPath()} % ({lessonsDoneOfPath()}/{totalLessonsOfPath()} lecciones)</p>
                        <div className="progress" role="progressbar">
                            <div className="progress-bar"
                            style={{ width: `${progressPath()}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CoursePage;