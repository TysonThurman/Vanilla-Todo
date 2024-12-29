const todoList = document.getElementById("todo-list");

var existingTodos = JSON.parse(localStorage.getItem("allTodos")) || [];

if(existingTodos.length != 0) {
    for (let i = 0; i < existingTodos.length; i++) {
        var id = existingTodos[i]["id"];
        var listItem = document.createElement("li");
        listItem.className = 'todo-list__item';
        listItem.innerHTML = `${existingTodos[i]["value"]}<i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>`
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
    todoItem.innerHTML = `${todoObject.value} <i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>`
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

function handleClick() {
    if(this.classList.contains("delete-todo-btn")) {
        console.log("delete button clicked");
    }

    if(this.classList.contains("edit-todo-btn")) {
        console.log("Edit button clicked");
    }
}