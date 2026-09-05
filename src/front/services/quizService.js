// TODO (conectar con backend): hoy devuelve un quiz de ejemplo (mock).
// Cuando haya quizzes cargados en la base de datos, esta es la ÚNICA función
// que hay que cambiar por un fetch real a /api/quizzes/<lesson_id>.
// Ningún componente visual debería necesitar cambios.

const MOCK_QUIZ = {
    id: 1,
    lesson_id: 1,
    title: "Evaluación: Fundamentos de Blockchain",
    description: "Pon a prueba tus conocimientos sobre bloques, consenso y claves criptográficas.",
    questions_data: [
        {
            question_text: "¿Cuál es el principal mecanismo de consenso utilizado originariamente por Bitcoin?",
            option_a: "Proof of Stake (Prueba de Participación)",
            option_b: "Proof of Work (Prueba de Trabajo)",
            option_c: "Delegated Proof of Stake (Prueba de Participación Delegada)",
            correct_option: "b",
            explanation: "Bitcoin usa Proof of Work: los mineros compiten resolviendo un problema computacional para validar bloques."
        },
        {
            question_text: "¿Qué garantiza una clave privada en una wallet?",
            option_a: "Que nadie pueda ver tu saldo",
            option_b: "Que puedas firmar transacciones y demostrar propiedad de tus fondos",
            option_c: "Que tus fondos estén asegurados contra caídas de precio",
            correct_option: "b",
            explanation: "La clave privada permite firmar transacciones. Quien la tiene, controla los fondos."
        }
    ]
};

export const getQuizByLesson = async (lessonId) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
        const res = await fetch(backendUrl + "/api/quizzes/" + lessonId);
        if (!res.ok) return MOCK_QUIZ;
        const data = await res.json();
        return {
            id: data.id,
            lesson_id: lessonId,
            title: "Evaluación",
            description: "Pon a prueba tus conocimientos.",
            questions_data: data.questions
        };
    } catch (err) {
        console.log("Error cargando quiz, usando mock:", err);
        return MOCK_QUIZ;
    }
};