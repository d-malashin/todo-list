let tasks = {};

(function(arrOfTasks) {

  if (localStorage.getItem('tasks')) {
    const storageArr = JSON.parse(localStorage.getItem('tasks'))
    const sortedTasks = Object.values(storageArr).sort((prev, next) => prev.date > next.date ? -1 : 1)

    tasks = sortedTasks.reduce((acc, task) => {
      acc[task._id] = task
      return acc
    }, {})
    
  }



  // UI elements

  const listContainer = document.querySelector('.tasks-list-section .list-group')
  const form = document.forms['addTask']
  const inputTitle = form.elements['title']
  const inputBody = form.elements['body']






  // Events

  renderAllTasks(tasks);
  form.addEventListener('submit', onFormSubmitHandler)
  listContainer.addEventListener('click', onDeleteHandler)




  // Functions

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.warn("No tasks in list!");
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      const listItem = listItemTemplate(task);
      fragment.appendChild(listItem)
    });
    listContainer.appendChild(fragment)
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

    li.setAttribute('data-task-id', _id)

    const span = document.createElement('span')
    span.textContent = title
    span.style.fontWeight = 'bold'

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete task'
    deleteButton.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn')

    const article = document.createElement('p')
    article.textContent = body
    article.classList.add('mt-2', 'w-100')

    const arrOfElements = []
    arrOfElements.push(span, deleteButton, article)
    arrOfElements.forEach(element => li.appendChild(element))

    return li
  };

  function onFormSubmitHandler(e) {
    e.preventDefault()
    const titleValue = inputTitle.value
    const bodyValue = inputBody.value

    if (!titleValue || !bodyValue) {
      alert('Please fill title and body')
      return
    }

    const task = createNewTask(titleValue, bodyValue)
    const listItem = listItemTemplate(task)
    tasks[task._id] = task
    listContainer.insertAdjacentElement('afterbegin', listItem)
    form.reset()
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      date: new Date,
      completed: false,
      _id: `task_${Math.floor(Math.random()*1000+Math.random()*100)}`
    }

    tasks[newTask._id] = newTask

    return { ...newTask }
  }

  function deleteTask(id) {
    const { title } = tasks[id]
    const isConfirmed = confirm(`Are you shure you want to delete task ${title}`)
    if (!isConfirmed) {
      return
    }
    delete tasks[id]
    return isConfirmed
  }

  function deleteTaskFromHTML(isConfirmed, element, id) {
    if (!isConfirmed) return
    element.remove()
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]')
      const id = parent.dataset.taskId
      const confirmed = deleteTask(id)
      deleteTaskFromHTML(confirmed, parent, id)
    }
  }





})(tasks);
