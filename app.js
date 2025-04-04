document.addEventListener("DOMContentLoaded", function () {
    var todoList = document.getElementById("todo-list");
    if (!todoList)
        return;
    var todoForm = document.getElementById("todo-form");
    if (!todoForm)
        return;
    var todoInput = document.getElementById("input-todo");
    if (!todoInput)
        return;
    var loadTasks = function () {
        var tasks = JSON.parse(localStorage.getItem("allTodos") || "[]");
        tasks.forEach(function (_a) {
            var id = _a.id, value = _a.value, completed = _a.completed;
            addTaskToDOM(id, value, completed);
        });
    };
    var saveTasks = function () {
        var tasks = [];
        document.querySelectorAll("#todo-list li").forEach(function (li) {
            var value = li.querySelector(".task-text").textContent || "";
            var completed = li.querySelector(".task-checkbox").checked;
            var id = li.id;
            tasks.push({ id: id, value: value, completed: completed });
        });
        localStorage.setItem("allTodos", JSON.stringify(tasks));
    };
    var addTaskToDOM = function (id, value, completed) {
        if (completed === void 0) { completed = false; }
        var listItem = document.createElement("li");
        listItem.className = 'todo-list__item';
        listItem.innerHTML = "\n                <label class=\"task\">\n                    <input id=\"".concat(id, "\" type=\"checkbox\" class=\"task-checkbox\" ").concat(completed ? "checked" : "", ">\n                    <span class=\"task-text\">").concat(value, "</span>\n                </label>\n                <div id=\"").concat(id, "\" class=\"actions\">\n                    <button data-id=\"").concat(id, "\" class=\"edit-btn\"><i class=\"fa-solid fa-pencil todo-btn edit-todo-btn\" style=\"color: #0a4d80;\"></i></button>\n                    <button data-id=\"").concat(id, "\" class=\"delete-btn\"><i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i></button>\n                </div>\n                ");
        listItem.setAttribute("id", id);
        todoList.appendChild(listItem);
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        var value = todoInput.value.trim();
        var id = "id" + Math.random().toString(16).slice(2);
        var completed = false;
        if (value) {
            addTaskToDOM(id, value, completed);
            saveTasks();
            todoInput.value = "";
        }
    };
    todoForm.addEventListener("submit", handleSubmit);
    //Checkbox functionality
    todoList.addEventListener("change", function (e) {
        if (e.target.classList.contains("task-checkbox")) {
            saveTasks();
        }
    });
    //Delete button functionality
    todoList.addEventListener("click", function (e) {
        if (e.target.closest(".delete-btn")) {
            var parentButton_1 = e.target.closest("button");
            var li_1 = e.target.closest("li");
            if (!li_1)
                return;
            var id = li_1.id;
            var confirmationDiv = document.createElement('div');
            confirmationDiv.classList.add("confirmation-text-".concat(id));
            confirmationDiv.setAttribute("id", id);
            confirmationDiv.innerHTML = "\n                <span>Confirm Deletion?</span> \n                <button id=\"".concat(id, "\" class=\"confirm-btn yes-btn\">Yes</button> \n                <button id=\"").concat(id, "\" class=\"confirm-btn no-btn\">No</button> \n            ");
            li_1.appendChild(confirmationDiv);
            var buttons = document.querySelectorAll('.confirm-btn');
            buttons.forEach(function (btn) {
                btn.addEventListener("click", function (e) {
                    if (e.target.classList.contains('yes-btn')) {
                        if (li_1.id === btn.id) {
                            li_1.remove();
                            saveTasks();
                        }
                    }
                    if (e.target.classList.contains('no-btn')) {
                        if (confirmationDiv.id === btn.id) {
                            confirmationDiv.remove();
                            if (parentButton_1)
                                parentButton_1.disabled = true;
                        }
                    }
                });
            });
            if (parentButton_1)
                parentButton_1.disabled = true;
        }
    });
    //Edit button functionality
    todoList.addEventListener("click", function (e) {
        if (e.target.closest(".edit-btn")) {
            var li = e.target.closest("li");
            if (!li)
                return;
            var span_1 = li.querySelector('span');
            var label_1 = li.querySelector('label');
            var buttonContainer_1 = li.querySelector('.actions');
            //Change the button entirely
            var id_1 = li.querySelector(".edit-btn").id;
            buttonContainer_1.innerHTML = "\n                <button id=\"".concat(id_1, "\" class=\"save-btn\">\n                    <i class=\"fa-solid fa-check todo-btn save-todo-btn\" style=\"color: #0a4d80;\"></i>\n                </button>\n                <button id=\"").concat(id_1, "\" class=\"delete-btn\">\n                    <i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i>\n                </button>\n            ");
            //replace the todo text with an edit input field
            var editInput = document.createElement("input");
            editInput.setAttribute("type", "text");
            editInput.value = span_1.innerText;
            editInput.classList.add("edit-input");
            label_1.replaceChild(editInput, span_1);
            //Save the change if the Enter button is pressed while in the input field.
            editInput.addEventListener("keydown", function (e) {
                if (e.key == 'Enter') {
                    label_1.replaceChild(span_1, editInput);
                    span_1.innerText = editInput.value;
                    buttonContainer_1.innerHTML = "\n                        <button id=\"".concat(id_1, "\" class=\"edit-btn\">\n                            <i class=\"fa-solid fa-pencil todo-btn edit-todo-btn\" style=\"color: #0a4d80;\"></i>\n                        </button>\n                        <button id=\"").concat(id_1, "\" class=\"delete-btn\">\n                            <i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i>\n                        </button>\n                    ");
                    saveTasks();
                }
            });
        }
    });
    //Save button functionality
    todoList.addEventListener("click", function (e) {
        if (e.target.closest(".save-btn")) {
            var li = e.target.closest("li");
            if (!li)
                return;
            var label = li.querySelector('label');
            var buttonContainer = li.querySelector('.actions');
            if (!buttonContainer)
                return;
            var id = li.id;
            // //replace the todo text with an edit input field
            var editInput = li.querySelector('.edit-input');
            if (!editInput)
                return;
            var span = document.createElement('span');
            span.classList.add('task-text');
            span.innerText = editInput.value;
            label.replaceChild(span, editInput);
            buttonContainer.innerHTML = "\n                <button id=\"".concat(id, "\" class=\"edit-btn\">\n                    <i class=\"fa-solid fa-pencil todo-btn edit-todo-btn\" style=\"color: #0a4d80;\"></i>\n                </button>\n                <button id=\"").concat(id, "\" class=\"delete-btn\">\n                    <i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i>\n                </button>\n            ");
            saveTasks();
        }
    });
    loadTasks();
});
