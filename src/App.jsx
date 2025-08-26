import NewProject from "./components/NewProject.jsx";
import ProjectSideBar from "./components/ProjectSideBar.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import SelectedProject from "./components/SelectedProject.jsx";
import Author from "./components/Author.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase.js";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: [],
  });
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [user, setUser] = useState(null);

  const newProjectRef = useRef();

  // Добавляем эффект для получения пользователя
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      3000
    );
  };

  // Обновляем загрузку проектов с учетом пользователя
  useEffect(() => {
    async function loadProjects() {
      if (!user) return;

      try {
        const { data: projects, error: errorProject } = await supabase
          .from("Projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (errorProject) {
          console.error("Ошибка загрузки проектов:", errorProject);
          return;
        }

        setProjectsState((prevState) => ({
          ...prevState,
          projects: projects || [],
        }));
      } catch (error) {
        console.error("Ошибка при загрузке проектов:", error);
      }
    }

    loadProjects();
  }, [user]);

  // Обновляем загрузку задач с учетом пользователя
  useEffect(() => {
    async function loadTasks() {
      if (!user || !projectsState.selectedProjectId) return;

      try {
        const { data: tasks, error: errorTask } = await supabase
          .from("Tasks")
          .select("*")
          .eq("projectId", projectsState.selectedProjectId)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (errorTask) {
          console.error("Ошибка загрузки задач:", errorTask);
          return;
        }

        setProjectsState((prevState) => ({
          ...prevState,
          tasks: tasks || [],
        }));
      } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
      }
    }

    loadTasks();
  }, [projectsState.selectedProjectId, user]);

  // Обновляем добавление задачи с user_id
  async function handleAddTask(text) {
    if (!projectsState.selectedProjectId || !user) return;

    try {
      const { data, error } = await supabase
        .from("Tasks")
        .insert({
          projectId: projectsState.selectedProjectId,
          text: text,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Ошибка добавления задачи:", error);
        return;
      }

      setProjectsState((prevState) => ({
        ...prevState,
        tasks: [data, ...prevState.tasks],
      }));
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  }

  // Обновляем добавление проекта с user_id
  async function handleAddProject(projectData) {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("Projects")
        .insert({
          title: projectData.title,
          description: projectData.description,
          dueDate: projectData.dueDate,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Ошибка добавления проекта:", error);
        return;
      }

      setProjectsState((prevState) => ({
        ...prevState,
        selectedProjectId: undefined,
        projects: [...prevState.projects, data],
      }));

      showNotification("success", "Проект успешно создан!");
    } catch (error) {
      console.error("Ошибка при добавлении проекта:", error);
      showNotification("error", "Ошибка при создании проекта");
    }
  }

  // Удаление задачи
  async function handleDeleteTask(id) {
    try {
      const { error } = await supabase.from("Tasks").delete().eq("id", id);

      if (error) {
        console.error("Ошибка удаления задачи:", error);
        return;
      }

      setProjectsState((prevState) => ({
        ...prevState,
        tasks: prevState.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  }

  // Начало добавления проекта
  function handleStartAddProject() {
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: null,
    }));
  }

  // Отмена добавления проекта
  function handleCancelAddProject() {
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: undefined,
    }));
  }

  // Выбор проекта
  async function handleSelectProject(id) {
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: id,
      tasks: [], // Очищаем задачи перед загрузкой новых
    }));
  }

  // Удаление проекта
  async function handleDeleteProject() {
    if (!projectsState.selectedProjectId) {
      console.error("Не выбран проект для удаления");
      return;
    }

    try {
      // Сначала удаляем все задачи проекта
      const { error: tasksError } = await supabase
        .from("Tasks")
        .delete()
        .eq("projectId", projectsState.selectedProjectId);

      if (tasksError) {
        console.error("Ошибка удаления задач проекта:", tasksError);
      }

      // Затем удаляем сам проект
      const { error: projectError } = await supabase
        .from("Projects")
        .delete()
        .eq("id", projectsState.selectedProjectId);

      if (projectError) {
        console.error("Ошибка удаления проекта:", projectError);
        throw projectError;
      }

      // Обновляем локальное состояние
      setProjectsState((prevState) => ({
        ...prevState,
        selectedProjectId: undefined,
        projects: prevState.projects.filter(
          (project) => project.id !== prevState.selectedProjectId
        ),
        tasks: [],
      }));

      showNotification("success", "Проект успешно удален!");
    } catch (error) {
      console.error("Ошибка при удалении проекта:", error);
      showNotification("error", "Ошибка при удалении проекта");
    }
  }

  // Добавляем функцию выхода
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Ошибка выхода:", error);
    }
  }

  // Находим выбранный проект
  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId
  );

  // Определяем отображаемый контент
  let content;

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject
        ref={newProjectRef}
        onAdd={handleAddProject}
        onCancel={handleCancelAddProject}
      />
    );
  } else if (selectedProject) {
    content = (
      <SelectedProject
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onDelete={handleDeleteProject}
        project={selectedProject}
        tasks={projectsState.tasks}
      />
    );
  } else {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (
    <ProtectedRoute>
      <div className="app-container">
        {/* Уведомление */}
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.type === "success" ? "✅" : "❌"}{" "}
            {notification.message}
          </div>
        )}

        {/* Добавляем кнопку выхода */}
        {user && (
          <div className="user-header">
            <span>
              Добро пожаловать, {user.user_metadata?.name || user.email}!
            </span>
            <button onClick={handleLogout} className="btn-secondary btn-sm">
              Выйти
            </button>
          </div>
        )}

        <div className="main-content">
          <ProjectSideBar
            projects={projectsState.projects}
            onStartAddProject={handleStartAddProject}
            onSelectProject={handleSelectProject}
            selectedProjectId={projectsState.selectedProjectId}
          />

          <div className="content-area">{content}</div>
        </div>

        <Author />
      </div>
    </ProtectedRoute>
  );
}

export default App;
