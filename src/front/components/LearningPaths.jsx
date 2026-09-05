import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import LearningPathCard from "./LearningPathCard";

const LearningPaths = () => {

    const { store, dispatch } = useGlobalReducer();

    const getLearningPaths = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/learning-paths`);
            const data = await response.json();
            dispatch({ type: "set_learning_paths", payload: data })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getLearningPaths();
    }, [])

    return <div className="container">
        <div className="row text-start">
            <h3>Rutas de Aprendizaje</h3>
        </div>
        <div className="row pb-5">
            {store.learningPaths?.map((value, index) => {
                return <div key={value.id} className="col-md-4 col-xs-8">
                    <LearningPathCard data={value} />
                </div>
            })}
        </div>
    </div>
}

export default LearningPaths;