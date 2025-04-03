document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todo-list") as HTMLUListElement | null;
    if (!todoList) return;
    const todoForm = document.getElementById("todo-form") as HTMLFormElement | null;
    if (!todoForm) return;
    const todoInput = document.getElementById("input-todo") as HTMLInputElement | null;
    if(!todoInput) return;
    

    interface Task {
        id: string;
        value : string;
        completed: boolean;
    }
    const loadTasks = () : void => {
        var tasks : Task[] = JSON.parse(localStorage.getItem("allTodos") || "[]");
        tasks.forEach(({ id, value, completed }) => {
            addTaskToDOM(id, value, completed);
        });
    }

    const saveTasks = () : void => {
        const tasks : Task[] = [];
        document.querySelectorAll("#todo-list li").forEach((li) => {
            const value = (li.querySelector(".task-text") as HTMLElement).textContent || "";
            const completed = (li.querySelector(".task-checkbox") as HTMLInputElement).checked;
            const id = li.id;
            tasks.push({ id, value, completed });
        });
        localStorage.setItem("allTodos", JSON.stringify(tasks));
    }

    const addTaskToDOM = (id: string, value: string, completed = false) => {
            var listItem = document.createElement("li");
            listItem.className = 'todo-list__item';
            listItem.innerHTML = `
                <label class="task">
                    <input id="${id}" type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
                    <span class="task-text">${value}</span>
                </label>
                <div id="${id}" class="actions">
                    <button data-id="${id}" class="edit-btn"><i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i></button>
                    <button data-id="${id}" class="delete-btn"><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i></button>
                </div>
                `
            listItem.setAttribute("id", id);
            todoList.appendChild(listItem);
    }

    const handleSubmit = (e : Event) => {
        e.preventDefault();
        var value = todoInput.value.trim();
        var id = "id" + Math.random().toString(16).slice(2);
        var completed = false;
        if(value) {
            addTaskToDOM(id, value, completed);
            saveTasks();
            todoInput.value = "";
        }
    }

    todoForm.addEventListener("submit", handleSubmit);

    //Checkbox functionality
    todoList.addEventListener("change", (e : Event) => {
        if ((e.target as HTMLElement ).classList.contains("task-checkbox")) {
            saveTasks();
        }
    });

    //Delete button functionality
    todoList.addEventListener("click", (e : Event) => {
        if ((e.target as HTMLElement).closest(".delete-btn")) {
            const parentButton = (e.target as HTMLElement).closest("button") as HTMLButtonElement | null;
            const li = (e.target as HTMLElement).closest("li") as HTMLLIElement | null;
            if (!li) return;
            const id = li.id;
            var confirmationDiv = document.createElement('div');
            confirmationDiv.classList.add(`confirmation-text-${id}`);
            confirmationDiv.setAttribute("id", id);
            confirmationDiv.innerHTML = `
                <span>Confirm Deletion?</span> 
                <button id="${id}" class="confirm-btn yes-btn">Yes</button> 
                <button id="${id}" class="confirm-btn no-btn">No</button> 
            `;
            li.appendChild(confirmationDiv);
            var buttons = document.querySelectorAll('.confirm-btn');
            buttons.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    if ((e.target as HTMLElement).classList.contains('yes-btn')) {
                        if(li.id === btn.id) {
                            li.remove();
                            saveTasks();
                        }
                    }
                    if ((e.target as HTMLElement).classList.contains('no-btn')) {
                        if(confirmationDiv.id === btn.id) {
                            confirmationDiv.remove();
                            if (parentButton) parentButton.disabled = true;
                        }
                    }
                });
            })
            if (parentButton) parentButton.disabled = true;
        }
    });

    //Edit button functionality
    todoList.addEventListener("click", (e : Event) => {
        if ((e.target as HTMLElement).closest(".edit-btn")) {
            const li = (e.target as HTMLElement).closest("li");
            if(!li) return;
            const span = li.querySelector('span') as HTMLSpanElement;
            const label = li.querySelector('label') as HTMLLabelElement;
            const buttonContainer = li.querySelector('.actions') as HTMLDivElement;

            //Change the button entirely
            const id = (li.querySelector(".edit-btn") as HTMLElement).id;

            buttonContainer.innerHTML = `
                <button id="${id}" class="save-btn">
                    <i class="fa-solid fa-check todo-btn save-todo-btn" style="color: #0a4d80;"></i>
                </button>
                <button id="${id}" class="delete-btn">
                    <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
                </button>
            `;

            //replace the todo text with an edit input field
            var editInput = document.createElement("input");
            editInput.setAttribute("type", "text");
            editInput.value = span.innerText;
            editInput.classList.add("edit-input");
            label.replaceChild(editInput, span);

            //Save the change if the Enter button is pressed while in the input field.
            editInput.addEventListener("keydown", (e) => {
                if(e.key == 'Enter') {
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

    //Save button functionality
    todoList.addEventListener("click", (e) => {
        if((e.target as HTMLElement).closest(".save-btn")) {
            const li = (e.target as HTMLElement).closest("li");
            if(!li) return;
            const label = li.querySelector('label') as HTMLLabelElement;
            const buttonContainer = li.querySelector('.actions') as HTMLDivElement | null;
            if (!buttonContainer) return;
            const id = li.id;

            // //replace the todo text with an edit input field
            var editInput = li.querySelector('.edit-input') as HTMLInputElement | null;
            if (!editInput) return;
            const span =document.createElement('span');
            span.classList.add('task-text');
            span.innerText = (editInput as HTMLInputElement).value;

            label.replaceChild(span, (editInput as HTMLInputElement));
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