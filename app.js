let tasks = {};

(function (arrOfTasks) {
  const themes = {
    default: {
      "--base-text-color": "#212529",
      "--header-bg": "#007bff",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#007bff",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#0069d9",
      "--default-btn-border-color": "#0069d9",
      "--danger-btn-bg": "#dc3545",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#bd2130",
      "--danger-btn-border-color": "#dc3545",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#80bdff",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
    },
    dark: {
      "--base-text-color": "#212529",
      "--header-bg": "#343a40",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#58616b",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#292d31",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#b52d3a",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#88222c",
      "--danger-btn-border-color": "#88222c",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
    light: {
      "--base-text-color": "#212529",
      "--header-bg": "#fff",
      "--header-text-color": "#212529",
      "--default-btn-bg": "#fff",
      "--default-btn-text-color": "#212529",
      "--default-btn-hover-bg": "#e8e7e7",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#f1b5bb",
      "--danger-btn-text-color": "#212529",
      "--danger-btn-hover-bg": "#ef808a",
      "--danger-btn-border-color": "#e2818a",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
  };

  // UI elements

  const listContainer = document.querySelector(
    ".tasks-list-section .list-group"
  );
  const form = document.forms["addTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const themeSelector = document.getElementById("themeSelect");

  let currentTheme = "default";



  // Events

  onLoad();
  renderAllTasks(tasks);
  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeleteHandler);
  themeSelector.addEventListener("change", onThemeSelectHandler);



  // Functions

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.warn("No tasks in list!");
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const listItem = listItemTemplate(task);
      fragment.appendChild(listItem);
    });
    listContainer.appendChild(fragment);
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );

    li.setAttribute("data-task-id", _id);

    const span = document.createElement("span");
    span.textContent = title;
    span.style.fontWeight = "bold";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete task";
    deleteButton.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    const arrOfElements = [];
    arrOfElements.push(span, deleteButton, article);
    arrOfElements.forEach((element) => li.appendChild(element));

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Please fill title and body");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    tasks[task._id] = task;
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      date: new Date(),
      completed: false,
      _id: `task_${Math.floor(Math.random() * 1000 + Math.random() * 100)}`,
    };

    tasks[newTask._id] = newTask;

    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = tasks[id];
    const isConfirmed = confirm(
      `Are you shure you want to delete task ${title}`
    );
    if (!isConfirmed) {
      return;
    }
    delete tasks[id];
    return isConfirmed;
  }

  function deleteTaskFromHTML(isConfirmed, element, id) {
    if (!isConfirmed) return;
    element.remove();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHTML(confirmed, parent, id);
    }
  }

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelector.value;
    setTheme(selectedTheme);
  }

  function setTheme(name = "default") {
    currentTheme = name;
    const selectedThemeObject = themes[name];
    Object.entries(selectedThemeObject).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem("theme", name);
  }

  function onLoad() {
    if (localStorage.getItem("theme")) {
      currentTheme = localStorage.getItem("theme");
      themeSelector.value = localStorage.getItem("theme");
    }

    if (localStorage.getItem("tasks")) {
      const storageArr = JSON.parse(localStorage.getItem("tasks"));
      const sortedTasks = Object.values(storageArr).sort((prev, next) =>
        prev.date > next.date ? -1 : 1
      );

      tasks = sortedTasks.reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
      }, {});
    }
  }

  setTheme(currentTheme);
})(tasks);
