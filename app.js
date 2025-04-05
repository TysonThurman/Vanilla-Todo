document.addEventListener("DOMContentLoaded", function () {
    // ─── Grab the key elements ───────────────────────────────────────────────────
    var todoList = document.getElementById("todo-list");
    if (!todoList) return;

    var todoForm = document.getElementById("todo-form");
    if (!todoForm) return;

    var todoInput = document.getElementById("input-todo");
    if (!todoInput) return;

    // ─── Load tasks from localStorage and render them ────────────────────────────
    var loadTasks = function () {
        var tasks = JSON.parse(localStorage.getItem("allTodos") || "[]");
        tasks.forEach(function ({ id, value, completed }) {
            addTaskToDOM(id, value, completed);
        });
    };

    // ─── Serialize current list into localStorage ────────────────────────────────
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

    // ─── Create a new <li> for one task and append it ───────────────────────────
    var addTaskToDOM = function (id, value, completed) {
        if (completed === void 0) { completed = false; }

        var listItem = document.createElement("li");
        listItem.className = "todo-list__item";
        listItem.setAttribute("id", id);

        listItem.innerHTML = `
        <label class="task">
          <input
            id="${id}"
            type="checkbox"
            class="task-checkbox"
            ${completed ? "checked" : ""}
          >
          <span class="task-text">${value}</span>
        </label>
        <div id="${id}" class="actions">
          <button data-id="${id}" class="edit-btn">
            <i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i>
          </button>
          <button data-id="${id}" class="delete-btn">
            <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
          </button>
        </div>
      `;

        todoList.appendChild(listItem);
    };

    // ─── Handle new-task form submission ────────────────────────────────────────
    var handleSubmit = function (e) {
        e.preventDefault();

        var value = todoInput.value.trim();
        if (!value) return;

        var id = "id" + Math.random().toString(16).slice(2);
        var completed = false;

        addTaskToDOM(id, value, completed);
        saveTasks();
        todoInput.value = "";
    };
    todoForm.addEventListener("submit", handleSubmit);

    // ─── Update storage when a checkbox is toggled ──────────────────────────────
    todoList.addEventListener("change", function (e) {
        if (e.target.classList.contains("task-checkbox")) {
            saveTasks();
        }
    });

    // ─── Delete-confirmation flow ───────────────────────────────────────────────
    todoList.addEventListener("click", function (e) {
        if (!e.target.closest(".delete-btn")) return;

        var deleteBtn = e.target.closest("button");
        var li = e.target.closest("li");
        if (!li) return;

        var id = li.id;
        // create confirmation UI
        var confirmationDiv = document.createElement("div");
        confirmationDiv.classList.add("confirmation-text-" + id);
        confirmationDiv.setAttribute("id", id);
        confirmationDiv.innerHTML = `
        <span>Confirm Deletion?</span>
        <button id="${id}" class="confirm-btn yes-btn">Yes</button>
        <button id="${id}" class="confirm-btn no-btn">No</button>
      `;
        li.appendChild(confirmationDiv);

        // hook up Yes/No
        confirmationDiv.querySelectorAll(".confirm-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                // Yes → remove
                if (e.target.classList.contains("yes-btn") && li.id === btn.id) {
                    li.remove();
                    saveTasks();
                }
                // No → cancel
                if (e.target.classList.contains("no-btn") && confirmationDiv.id === btn.id) {
                    confirmationDiv.remove();
                    if (deleteBtn) deleteBtn.disabled = false;
                }
            });
        });

        if (deleteBtn) deleteBtn.disabled = true;
    });

    // ─── Enter “edit mode” when pencil is clicked ───────────────────────────────
    todoList.addEventListener("click", function (e) {
        if (!e.target.closest(".edit-btn")) return;

        var li = e.target.closest("li");
        if (!li) return;

        var span = li.querySelector("span");
        var label = li.querySelector("label");
        var buttonContainer = li.querySelector(".actions");
        var id = li.querySelector(".edit-btn").id;

        // swap buttons for “save”
        buttonContainer.innerHTML = `
        <button id="${id}" class="save-btn">
          <i class="fa-solid fa-check todo-btn save-todo-btn" style="color: #0a4d80;"></i>
        </button>
        <button id="${id}" class="delete-btn">
          <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
        </button>
      `;

        // swap text for input
        var editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = span.innerText;
        editInput.classList.add("edit-input");
        label.replaceChild(editInput, span);

        // save on Enter key
        editInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                label.replaceChild(span, editInput);
                span.innerText = editInput.value;

                // restore buttons
                buttonContainer.innerHTML = `
            <button id="${id}" class="edit-btn">
              <i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i>
            </button>
            <button id="${id}" class="delete-btn">
              <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
            </button>
          `;
                saveTasks();
            }
        });
    });

    // ─── Also handle explicit “save” button clicks ─────────────────────────────
    todoList.addEventListener("click", function (e) {
        if (!e.target.closest(".save-btn")) return;

        var li = e.target.closest("li");
        if (!li) return;

        var label = li.querySelector("label");
        var buttonContainer = li.querySelector(".actions");
        var editInput = li.querySelector(".edit-input");
        var id = li.id;

        if (!editInput || !buttonContainer) return;

        // replace input with text
        var span = document.createElement("span");
        span.classList.add("task-text");
        span.innerText = editInput.value;
        label.replaceChild(span, editInput);

        // restore buttons
        buttonContainer.innerHTML = `
        <button id="${id}" class="edit-btn">
          <i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i>
        </button>
        <button id="${id}" class="delete-btn">
          <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
        </button>
      `;
        saveTasks();
    });

    // ─── Kick things off by loading any saved tasks ─────────────────────────────
    loadTasks();
});
