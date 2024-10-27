const form = document.getElementById('form');
const input = document.getElementById('input');
const todosUL = document.getElementById('todos');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// Load todos from localStorage
const todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initial render
renderTodos();
updateItemsLeft();

// Event Listeners
form.addEventListener('submit', handleSubmit);
clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update current filter and re-render
        currentFilter = e.target.dataset.filter;
        renderTodos();
    });
});

function handleSubmit(e) {
    e.preventDefault();
    addTodo();
}

function addTodo() {
    const todoText = input.value.trim();

    if(todoText) {
        const todo = {
            text: todoText,
            completed: false,
            id: Date.now()
        };

        todos.push(todo);
        renderTodos();
        updateLS();
        updateItemsLeft();
        input.value = '';
    }
}

function renderTodos() {
    todosUL.innerHTML = '';
    
    let filteredTodos = todos;
    
    // Apply filter
    if(currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if(currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        const todoEl = document.createElement('li');
        todoEl.setAttribute('data-id', todo.id);
        
        if(todo.completed) {
            todoEl.classList.add('completed');
        }

        todoEl.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <i class="fas fa-check"></i>
        `;

        // Left click to toggle
        todoEl.addEventListener('click', () => {
            toggleTodo(todo.id);
        });

        // Right click to delete
        todoEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            deleteTodo(todo.id);
        });

        todosUL.appendChild(todoEl);
    });
}

function toggleTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if(todo) {
        todo.completed = !todo.completed;
        updateLS();
        renderTodos();
        updateItemsLeft();
    }
}

function deleteTodo(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if(index > -1) {
        todos.splice(index, 1);
        updateLS();
        renderTodos();
        updateItemsLeft();
    }
}

function clearCompleted() {
    const incompleteTodos = todos.filter(todo => !todo.completed);
    todos.length = 0;
    todos.push(...incompleteTodos);
    updateLS();
    renderTodos();
    updateItemsLeft();
}

function clearAll() {
    todos.length = 0;
    updateLS();
    renderTodos();
    updateItemsLeft();
}

function updateItemsLeft() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}

function updateLS() {
    localStorage.setItem('todos', JSON.stringify(todos));
}