document.addEventListener("DOMContentLoaded", function () {
    var todoList = document.getElementById("todo-list");
    var todoForm = document.getElementById("todo-form");
    var todoInput = document.getElementById("input-todo");
    // Load tasks from localStorage
    var loadTasks = function () {
        var tasks = JSON.parse(localStorage.getItem("allTodos") || "[]");
        tasks.forEach(function (_a) {
            var id = _a.id, value = _a.value, completed = _a.completed;
            addTaskToDOM(id, value, completed);
        });
    };
    // Save tasks to localStorage
    var saveTasks = function () {
        var tasks = [];
        document.querySelectorAll("#todo-list li").forEach(function (li) {
            var value = li.querySelector(".task-text").textContent || "";
            var checkbox = li.querySelector(".task-checkbox");
            var completed = checkbox.checked;
            var id = checkbox.id;
            tasks.push({ id: id, value: value, completed: completed });
        });
        localStorage.setItem("allTodos", JSON.stringify(tasks));
    };
    // Add task to DOM
    var addTaskToDOM = function (id, value, completed) {
        if (completed === void 0) { completed = false; }
        var listItem = document.createElement("li");
        listItem.className = "todo-list__item";
        listItem.innerHTML = "\n              <label class=\"task\">\n                  <input id=\"".concat(id, "\" type=\"checkbox\" class=\"task-checkbox\" ").concat(completed ? "checked" : "", ">\n                  <span class=\"task-text\">").concat(value, "</span>\n              </label>\n              <div id=\"").concat(id, "\" class=\"actions\">\n                  <button id=\"").concat(id, "\" class=\"edit-btn\"><i class=\"fa-solid fa-pencil todo-btn edit-todo-btn\" style=\"color: #0a4d80;\"></i></button>\n                  <button id=\"").concat(id, "\" class=\"delete-btn\"><i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i></button>\n              </div>\n          ");
        listItem.setAttribute("id", id);
        todoList.appendChild(listItem);
    };
    // Handle form submission
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
    // Checkbox functionality
    todoList.addEventListener("change", function (e) {
        var target = e.target;
        if (target.classList.contains("task-checkbox")) {
            saveTasks();
        }
    });
    // Delete button functionality
    todoList.addEventListener("click", function (e) {
        var target = e.target;
        if (target.closest(".delete-btn")) {
            var parentButton_1 = target.parentNode;
            var li_1 = target.closest("li");
            var id = li_1.id;
            var confirmationDiv_1 = document.createElement("div");
            confirmationDiv_1.classList.add("confirmation-text-".concat(id));
            confirmationDiv_1.setAttribute("id", id);
            confirmationDiv_1.innerHTML = "\n                  <span>Confirm Deletion?</span> \n                  <button id=\"".concat(id, "\" class=\"confirm-btn yes-btn\">Yes</button> \n                  <button id=\"").concat(id, "\" class=\"confirm-btn no-btn\">No</button> \n              ");
            li_1.appendChild(confirmationDiv_1);
            var buttons = document.querySelectorAll(".confirm-btn");
            buttons.forEach(function (btn) {
                btn.addEventListener("click", function (e) {
                    var buttonTarget = e.target;
                    if (buttonTarget.classList.contains("yes-btn")) {
                        if (li_1.id === btn.id) {
                            li_1.remove();
                            saveTasks();
                        }
                    }
                    if (buttonTarget.classList.contains("no-btn")) {
                        if (confirmationDiv_1.id === btn.id) {
                            confirmationDiv_1.remove();
                            parentButton_1.disabled = false;
                        }
                    }
                });
            });
            parentButton_1.disabled = true;
        }
    });
    // Edit button functionality
    todoList.addEventListener("click", function (e) {
        var target = e.target;
        if (target.closest(".edit-btn")) {
            var li = target.closest("li");
            var span_1 = li.querySelector("span");
            var label_1 = li.querySelector("label");
            var buttonContainer_1 = li.querySelector(".actions");
            // Change the button entirely
            var id_1 = li.querySelector(".edit-btn").id;
            buttonContainer_1.innerHTML = "\n                  <button id=\"".concat(id_1, "\" class=\"save-btn\">\n                      <i class=\"fa-solid fa-check todo-btn save-todo-btn\" style=\"color: #0a4d80;\"></i>\n                  </button>\n                  <button id=\"").concat(id_1, "\" class=\"delete-btn\">\n                      <i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i>\n                  </button>\n              ");
            // Replace the todo text with an edit input field
            var editInput_1 = document.createElement("input");
            editInput_1.setAttribute("type", "text");
            editInput_1.setAttribute("value", li.innerText);
            editInput_1.classList.add("edit-input");
            label_1.replaceChild(editInput_1, span_1);
            // Save the change if the Enter button is pressed while in the input field
            editInput_1.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    label_1.replaceChild(span_1, editInput_1);
                    span_1.innerText = editInput_1.value;
                    buttonContainer_1.innerHTML = "\n                          <button id=\"".concat(id_1, "\" class=\"edit-btn\">\n                              <i class=\"fa-solid fa-pencil todo-btn edit-todo-btn\" style=\"color: #0a4d80;\"></i>\n                          </button>\n                          <button id=\"").concat(id_1, "\" class=\"delete-btn\">\n                              <i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i>\n                          </button>\n                      ");
                    saveTasks();
                }
            });
        }
    });
    // Save button functionality
    todoList.addEventListener("click", function (e) {
        var target = e.target;
        if (target.closest(".save-btn")) {
            var li = target.closest("li");
            var label = li.querySelector("label");
            var buttonContainer = li.querySelector(".actions");
            var id = li.querySelector(".save-btn").id;
            // Replace the todo text with an edit input field
            var editInput = document.querySelector(".edit-input");
            var span = document.createElement("span");
            span.classList.add("task-text");
            span.innerText = editInput.value;
            label.replaceChild(span, editInput);
            buttonContainer.innerHTML = "\n                  <button id=\"".concat(id, "\" class=\"edit-btn\">\n                      <i class=\"fa-solid fa-pencil todo-btn edit-todo-btn\" style=\"color: #0a4d80;\"></i>\n                  </button>\n                  <button id=\"").concat(id, "\" class=\"delete-btn\">\n                      <i class=\"fa-solid fa-trash-can todo-btn delete-todo-btn\" style=\"color: #da1010;\"></i>\n                  </button>\n              ");
            saveTasks();
        }
    });
    loadTasks();
});
