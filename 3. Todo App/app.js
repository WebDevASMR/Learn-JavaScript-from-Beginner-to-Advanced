/* elements and global variables */
const addTodoBtn = document.getElementById('add-todo-btn');
const todosNav = document.getElementById('todos-nav');
let todoListArray = [];
let todosFilter = 'all';
let filteredTodos = [];

/* localStorage functions */
const saveTodos = () => {
  const todoListJson = JSON.stringify(todoListArray);
  localStorage.setItem('todoList', todoListJson);
};

const getTodos = () => JSON.parse(localStorage.getItem('todoList')) || [];

// add a new todo
addTodoBtn.addEventListener('click', (event) => {
  event.preventDefault();

  // get the todo text and date from inputs
  const todoText = document.getElementById('todo-text').value;
  const todoDate = document.getElementById('todo-date').value;

  // if the text and date are not empty
  if (todoText && todoDate) {
    // create a new todo object
    const todo = {
      text: todoText,
      date: todoDate,
      state: 'pending',
      id: new Date().getTime(),
    };

    // add the todo to the array
    todoListArray = [...todoListArray, todo];

    // save & load the todos
    saveTodos();
    if (todosFilter === 'all') {
      loadTodos();
    } else {
      filterTodos(todosFilter);
    }

    // reset the form
    document.getElementById('todo-text').value = '';
    document.getElementById('todo-date').value = '';
  }
});

// load todos
const loadTodos = (filter, filteredTodos) => {
  const todosList = sortTodos(filteredTodos);
  const todoList = document.getElementById('todos-list');
  todoList.innerHTML = '';

  if (todosList.length === 0) {
    // if there are no todos display an empty list message
    const emptyListString = filter
      ? `No ${filter} todo's!`
      : `No todo's added!`;
    todoList.innerHTML = `<p style="text-align:center;">${emptyListString}</p>`;
  } else {
    // if the list is not empty, loop through each todo
    todosList.forEach((todo) => {
      // create a list item and set its dataset id and class
      const todoItem = document.createElement('li');
      todoItem.dataset.id = todo.id;
      todoItem.classList = todo.state;

      // create the html for the todo and add it to the list item
      const todoElement = createTodoElement(todo);
      todoItem.innerHTML = todoElement;
      todoList.appendChild(todoItem);
    });
  }
};

// sort todos by date
const sortTodos = (filteredTodos) => {
  const todoList = filteredTodos ? filteredTodos : getTodos();
  todoListArray = getTodos();

  todoList.sort((a, b) => {
    // compare the states
    if (a.state === b.state) {
      // if the states are the same, compare the dates
      return new Date(a.date) - new Date(b.date);
    } else {
      // if the states are different, completed tasks come last
      return a.state === 'completed' ? 1 : -1;
    }
  });

  return todoList;
};

// create the todo element
const createTodoElement = (todo) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const overdue =
    dateStringToDate(formatDate(todo.date)) < today && todo.state === 'pending';
  const todoDateClass = overdue ? 'todo-date overdue' : 'todo-date';
  const todoButtonIconClass =
    todo.state === 'pending' ? 'fa-circle' : 'fa-circle-check';

  return `
    <div class="todo">
      <button class="todo-btn"><i class="fa-regular ${todoButtonIconClass}"></i></button>
      <div>
        <p class="todo-text">${todo.text}</p>
        <span class="${todoDateClass}">${formatDate(todo.date)}</span>
      </div>
    </div>
    <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
  `;
};

/* managing todos */
// check for todo state or delete btn click
document.body.addEventListener('click', (event) => {
  if (event.target.closest('.todo-btn')) {
    const todoItem = event.target.closest('li');
    toggleTodoState(todoItem);
  }

  if (event.target.closest('.delete-btn')) {
    const todoItem = event.target.closest('li');
    deleteTodo(todoItem);
  }
});

// toggle todo state
const toggleTodoState = (todoItem) => {
  const todo = todoListArray.find(
    (todo) => todo.id === Number(todoItem.dataset.id)
  );

  // toggle the state
  if (todo.state === 'pending') {
    todo.state = 'completed';
    todoItem.classList = 'completed';
    todoItem.querySelector('.fa-regular').classList =
      'fa-regular fa-circle-check';
  } else if (todo.state === 'completed') {
    todo.state = 'pending';
    todoItem.classList = 'pending';
    todoItem.querySelector('.fa-regular').classList = 'fa-regular fa-circle';
  }

  saveTodos();
};

const deleteTodo = (todoItem) => {
  let todos = filteredTodos.length > 0 ? filteredTodos : todoListArray;

  // remove the todo from both the filtered list and the main list
  todos = todos.filter((todo) => todo.id !== Number(todoItem.dataset.id));
  todoListArray = todoListArray.filter(
    (todo) => todo.id !== Number(todoItem.dataset.id)
  );

  saveTodos();
  loadTodos(todosFilter, todos);
};

/* filter todos */
todosNav.addEventListener('click', (event) => {
  const navButtons = todosNav.querySelectorAll('button');

  // remove the active class from all buttons
  navButtons.forEach((button) => (button.classList = ''));

  // add the active class to the clicked button
  const button = event.target.closest('button');
  if (button) {
    button.classList = 'active';
    const filter = button.dataset.filter;
    filterTodos(filter);
  }
});

const filterTodos = (filter) => {
  todosFilter = filter;
  const today = new Date().setHours(0, 0, 0, 0);

  switch (filter) {
    case 'today':
      filteredTodos = getTodayTodos(today);
      loadTodos(filter, filteredTodos);
      break;

    case 'overdue':
      filteredTodos = getOverdueTodos(today);
      loadTodos(filter, filteredTodos);
      break;

    case 'scheduled':
      filteredTodos = getScheduledTodos(today);
      loadTodos(filter, filteredTodos);
      break;

    case 'pending':
      filteredTodos = getStateTodos('pending');
      loadTodos(filter, filteredTodos);
      break;

    case 'completed':
      filteredTodos = getStateTodos('completed');
      loadTodos(filter, filteredTodos);
      break;

    case 'all':
    default:
      filteredTodos = [];
      loadTodos();
      break;
  }
};

const getTodayTodos = (today) => {
  const todayFormatted = formatDate(today);
  const todayTodos = todoListArray.filter(
    (todo) =>
      formatDate(todo.date) === todayFormatted && todo.state === 'pending'
  );

  return todayTodos;
};

const getOverdueTodos = (today) => {
  const overdueTodos = todoListArray.filter(
    (todo) =>
      dateStringToDate(formatDate(todo.date)) < today &&
      todo.state === 'pending'
  );

  return overdueTodos;
};

const getScheduledTodos = (today) => {
  const scheduledTodos = todoListArray.filter(
    (todo) =>
      dateStringToDate(formatDate(todo.date)) > today &&
      todo.state === 'pending'
  );

  return scheduledTodos;
};

const getStateTodos = (state) => {
  const stateTodos = todoListArray.filter((todo) => todo.state === state);
  return stateTodos;
};

/* utility functions */
// convert date string to date object for comparison
const dateStringToDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

// format todo date to dd/mm/yyyy
const formatDate = (todoDate) => {
  const date = new Date(todoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// load todos on page load
loadTodos();
