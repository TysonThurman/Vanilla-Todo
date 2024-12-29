const todoList = document.getElementById("todo-list");

var existingTodos = JSON.parse(localStorage.getItem("allTodos")) || [];

if(existingTodos.length != 0) {
    for (let i = 0; i < existingTodos.length; i++) {
        var id = existingTodos[i]["id"];
        var listItem = document.createElement("li");
        listItem.className = 'todo-list__item';
        listItem.innerHTML = `
            <span>${existingTodos[i]["value"]}</span>
            <div id="${existingTodos[i]["id"]}" class="actions">
                <button id="${existingTodos[i]["id"]}" class="edit-btn"><i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i></button>
                <button id="${existingTodos[i]["id"]}" class="delete-btn"><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i></button>
            </div>
            `
        listItem.setAttribute("id", id);
        todoList.appendChild(listItem);
    }
}

addEventListenerButtons();

var todoForm = document.getElementById('todo-form');
todoForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    //add the todo objects to the local storage
    var newTodoValue = document.getElementById('input-todo').value;
    var id = "id" + Math.random().toString(16).slice(2);
    var todoObject = {"id": id, "value": newTodoValue};
    localStorage.setItem("newTodo", JSON.stringify(todoObject));
    existingTodos.push(todoObject);
    localStorage.setItem("allTodos", JSON.stringify(existingTodos));

    //add new todo to the DOM list
    var todoItem = document.createElement("li");
    todoItem.className = 'todo-list__item';
    todoItem.innerHTML = `
    <span>${todoObject.value}</span>
    <div id="${todoObject.id}" class="actions">
        <button id="${todoObject.id}" class="edit-btn"><i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i></button>
        <button id="${todoObject.id}" class="delete-btn"><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i></button>
    </div>
    `
    todoItem.setAttribute("id", id);
    todoList.appendChild(todoItem);

    //clear the input box
    document.getElementById('input-todo').value = '';

    addEventListenerButtons();
}

function addEventListenerButtons() {
    const todoButtonArray = document.getElementsByClassName("todo-btn");

    for (let i = 0; i < todoButtonArray.length; i++) {
    todoButtonArray[i].addEventListener("click", handleClick);
    }
}

function handleClick(e) {
    if(this.classList.contains("delete-todo-btn")) {
        //remove the item from DOM
        var itemId = e.target.parentNode.id;
        document.getElementById(itemId).remove();
        //remove the item from localStorage
        existingTodos = existingTodos.filter(todo => todo.id !== itemId);
        localStorage.setItem("allTodos", JSON.stringify(existingTodos));

    }

    if(this.classList.contains("edit-todo-btn")) {
        console.log("Edit button clicked");
        console.log(e.target.parentNode.id);
    }
}