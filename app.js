// DOM Elements
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const tasksCounter = document.getElementById('tasks-counter');
const allFilter = document.getElementById('all-filter');
const activeFilter = document.getElementById('active-filter');
const completedFilter = document.getElementById('completed-filter');
const clearCompletedButton = document.getElementById('clear-completed');

// App State
let todos = [];
let currentFilter = 'all';

// Load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add a new todo
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    todos.push(newTodo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle todo completion status
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// Clear all completed todos
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// Filter todos based on current filter
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Update the active filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    [allFilter, activeFilter, completedFilter].forEach(button => {
        button.classList.remove('active');
    });
    
    switch (filter) {
        case 'active':
            activeFilter.classList.add('active');
            break;
        case 'completed':
            completedFilter.classList.add('active');
            break;
        default:
            allFilter.classList.add('active');
    }
    
    renderTodos();
}

// Render todos to the DOM
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    // Clear the list
    todoList.innerHTML = '';
    
    // Add each todo item
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteButton);
        
        todoList.appendChild(todoItem);
    });
    
    // Update tasks counter
    const activeTodos = todos.filter(todo => !todo.completed).length;
    tasksCounter.textContent = `${activeTodos} task${activeTodos !== 1 ? 's' : ''} left`;
}

// Event Listeners
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

allFilter.addEventListener('click', () => setFilter('all'));
activeFilter.addEventListener('click', () => setFilter('active'));
completedFilter.addEventListener('click', () => setFilter('completed'));
clearCompletedButton.addEventListener('click', clearCompleted);

// Initialize the app
loadTodos();
