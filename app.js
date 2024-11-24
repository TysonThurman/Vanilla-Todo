// import { todo } from './todo.js';

//Start with empty array to hold todo tasks
var todos = [];

var todoForm = document.getElementById('todo-form');
todoForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    
    //add the todo objects to the array
    var newTodoValue = document.getElementById('input-todo').value;
    var id = "id" + Math.random().toString(16).slice(2);
    var todoObject = {"id": id, "value": newTodoValue};
    todos.push(todoObject);
    console.log(todos);

    //add the todos to the DOM list
    var ul = document.getElementById("todo-list");
    var li = document.createElement("li");
    li.className = 'todo-list__item';
    li.innerHTML = `${todoObject.value} <i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>`
    li.setAttribute("id", id);
    ul.appendChild(li);
}

//Put all buttons for the todos into an array for button click functions
var todoButtonArray = document.getElementsByClassName("todo-btn");
for (let i = 0; i < todoButtonArray.length; i++) {
    todoButtonArray[i].addEventListener("click", handleClick);
}

//Run this function when a button is clicked to edit or delete a button
function handleClick() {
    //if the button is a delete button, run todo.handleDelete
    if(this.classList.contains("delete-todo-btn")) {

    }

    if(this.classList.contains("edit-todo-btn")) {

    }
}