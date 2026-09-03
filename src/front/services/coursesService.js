// Antes esta función devolvía datos de ejemplo (mock).
// Ahora consulta el backend real: GET /api/learning-paths
// (el modelo LearningPath ya tiene description, image_url, time_required y level).
export const getCourses = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/learning-paths`,
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar las rutas de aprendizaje");
  }

  const data = await response.json();

  // Se traduce la forma de la respuesta del backend a la forma que
  // ya usan CourseCard y CourseFilterBar, para no tener que tocarlos.
  return data.map((path) => ({
    id: path.id,
    title: path.title,
    description: path.description,
    level: path.level,
    duration_hours: path.time_required,
    modules_count: path.number_of_modules,
    image_url: path.image_url,
  }));
};
