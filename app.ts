// Define interfaces for our data structures
interface TodoTask {
    id: string;
    value: string;
    completed: boolean;
}

document.addEventListener("DOMContentLoaded", (): void => {
    const todoList = document.getElementById("todo-list") as HTMLUListElement;
    const todoForm = document.getElementById("todo-form") as HTMLFormElement;
    const todoInput = document.getElementById("input-todo") as HTMLInputElement;

    // Load tasks from localStorage
    const loadTasks = (): void => {
        const tasks: TodoTask[] = JSON.parse(
            localStorage.getItem("allTodos") || "[]"
        );
        tasks.forEach(({ id, value, completed }) => {
            addTaskToDOM(id, value, completed);
        });
    };

    // Save tasks to localStorage
    const saveTasks = (): void => {
        const tasks: TodoTask[] = [];
        document.querySelectorAll("#todo-list li").forEach((li: Element) => {
            const value =
                (li.querySelector(".task-text") as HTMLSpanElement).textContent || "";
            const checkbox = li.querySelector(".task-checkbox") as HTMLInputElement;
            const completed = checkbox.checked;
            const id = checkbox.id;
            tasks.push({ id, value, completed });
        });
        localStorage.setItem("allTodos", JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (
        id: string,
        value: string,
        completed: boolean = false
    ): void => {
        const listItem = document.createElement("li");
        listItem.className = "todo-list__item";
        listItem.innerHTML = `
              <label class="task">
                  <input id="${id}" type="checkbox" class="task-checkbox" ${completed ? "checked" : ""
            }>
                  <span class="task-text">${value}</span>
              </label>
              <div id="${id}" class="actions">
                  <button id="${id}" class="edit-btn"><i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i></button>
                  <button id="${id}" class="delete-btn"><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i></button>
              </div>
          `;
        listItem.setAttribute("id", id);
        todoList.appendChild(listItem);
    };

    // Handle form submission
    const handleSubmit = (e: Event): void => {
        e.preventDefault();
        const value = todoInput.value.trim();
        const id = "id" + Math.random().toString(16).slice(2);
        const completed = false;
        if (value) {
            addTaskToDOM(id, value, completed);
            saveTasks();
            todoInput.value = "";
        }
    };

    todoForm.addEventListener("submit", handleSubmit);

    // Checkbox functionality
    todoList.addEventListener("change", (e: Event): void => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("task-checkbox")) {
            saveTasks();
        }
    });

    // Delete button functionality
    todoList.addEventListener("click", (e: Event): void => {
        const target = e.target as HTMLElement;
        if (target.closest(".delete-btn")) {
            const parentButton = target.parentNode as HTMLButtonElement;
            const li = target.closest("li") as HTMLLIElement;
            const id = li.id;

            const confirmationDiv = document.createElement("div");
            confirmationDiv.classList.add(`confirmation-text-${id}`);
            confirmationDiv.setAttribute("id", id);
            confirmationDiv.innerHTML = `
                  <span>Confirm Deletion?</span> 
                  <button id="${id}" class="confirm-btn yes-btn">Yes</button> 
                  <button id="${id}" class="confirm-btn no-btn">No</button> 
              `;
            li.appendChild(confirmationDiv);

            const buttons = document.querySelectorAll(".confirm-btn");
            buttons.forEach((btn: Element) => {
                btn.addEventListener("click", (e: Event): void => {
                    const buttonTarget = e.target as HTMLElement;
                    if (buttonTarget.classList.contains("yes-btn")) {
                        if (li.id === btn.id) {
                            li.remove();
                            saveTasks();
                        }
                    }
                    if (buttonTarget.classList.contains("no-btn")) {
                        if (confirmationDiv.id === btn.id) {
                            confirmationDiv.remove();
                            parentButton.disabled = false;
                        }
                    }
                });
            });
            parentButton.disabled = true;
        }
    });

    // Edit button functionality
    todoList.addEventListener("click", (e: Event): void => {
        const target = e.target as HTMLElement;
        if (target.closest(".edit-btn")) {
            const li = target.closest("li") as HTMLLIElement;
            const span = li.querySelector("span") as HTMLSpanElement;
            const label = li.querySelector("label") as HTMLLabelElement;
            const buttonContainer = li.querySelector(".actions") as HTMLDivElement;

            // Change the button entirely
            const id = (li.querySelector(".edit-btn") as HTMLButtonElement).id;

            buttonContainer.innerHTML = `
                  <button id="${id}" class="save-btn">
                      <i class="fa-solid fa-check todo-btn save-todo-btn" style="color: #0a4d80;"></i>
                  </button>
                  <button id="${id}" class="delete-btn">
                      <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
                  </button>
              `;

            // Replace the todo text with an edit input field
            const editInput = document.createElement("input");
            editInput.setAttribute("type", "text");
            editInput.setAttribute("value", li.innerText);
            editInput.classList.add("edit-input");
            label.replaceChild(editInput, span);

            // Save the change if the Enter button is pressed while in the input field
            editInput.addEventListener("keydown", (e: KeyboardEvent): void => {
                if (e.key === "Enter") {
                    label.replaceChild(span, editInput);
                    span.innerText = editInput.value;
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
        }
    });

    // Save button functionality
    todoList.addEventListener("click", (e: Event): void => {
        const target = e.target as HTMLElement;
        if (target.closest(".save-btn")) {
            const li = target.closest("li") as HTMLLIElement;
            const label = li.querySelector("label") as HTMLLabelElement;
            const buttonContainer = li.querySelector(".actions") as HTMLDivElement;
            const id = (li.querySelector(".save-btn") as HTMLButtonElement).id;

            // Replace the todo text with an edit input field
            const editInput = document.querySelector(
                ".edit-input"
            ) as HTMLInputElement;
            const span = document.createElement("span");
            span.classList.add("task-text");
            span.innerText = editInput.value;

            label.replaceChild(span, editInput);
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

    loadTasks();
});
