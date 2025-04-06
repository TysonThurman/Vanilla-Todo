document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todo-list") as HTMLUListElement | null;
    if (!todoList) return;
    const todoForm = document.getElementById("todo-form") as HTMLFormElement | null;
    if (!todoForm) return;
    const todoInput = document.getElementById("input-todo") as HTMLInputElement | null;
    if(!todoInput) return;
    const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement | null;
    if(!modalOverlay) return;
    const confirmYesBtn = document.getElementById("confirm-yes") as HTMLButtonElement | null;
    if(!confirmYesBtn) return;
    const confirmNoBtn = document.getElementById("confirm-no") as HTMLButtonElement | null;
    if(!confirmNoBtn) return;
    
    // Track the current task being considered for deletion
    let currentTaskToDelete: HTMLLIElement | null = null;

    interface Task {
        id: string;
        value : string;
        completed: boolean;
    }
    const loadTasks = () : void => {
        var tasks : Task[] = JSON.parse(localStorage.getItem("allTodos") || "[]");
        // Sort tasks - incomplete tasks first, completed tasks at the bottom
        tasks.sort((a, b) => Number(a.completed) - Number(b.completed));
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
            
            // Add completed tasks to the bottom, uncompleted tasks to the top
            if (completed) {
                todoList.appendChild(listItem);
            } else {
                todoList.prepend(listItem);
            }
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
            const checkbox = e.target as HTMLInputElement;
            const listItem = checkbox.closest("li");
            
            if (listItem && checkbox.checked) {
                // Move completed task to the bottom of the list
                todoList.appendChild(listItem);
            } else if (listItem && !checkbox.checked) {
                // Move uncompleted task to the top of the list
                todoList.prepend(listItem);
            }
            
            saveTasks();
        }
    });

    //Delete button functionality
    todoList.addEventListener("click", (e : Event) => {
        if ((e.target as HTMLElement).closest(".delete-btn")) {
            const li = (e.target as HTMLElement).closest("li") as HTMLLIElement | null;
            if (!li) return;
            
            // Store reference to the task being deleted
            currentTaskToDelete = li;
            
            // Show the modal - simplify animation
            modalOverlay.classList.add('active');
        }
    });

    // Handle confirm or cancel deletion
    const handleDeleteConfirmation = (confirmed: boolean) => {
        if (!currentTaskToDelete) return;
        
        setTimeout(() => {
            if (confirmed && currentTaskToDelete) {
                currentTaskToDelete.remove();
                saveTasks();
            }
            
            // Hide the modal and reset current task
            modalOverlay.classList.remove('active');
            currentTaskToDelete = null;
        }, 150); // Reduce timeout for faster response
    };

    // Yes button for deletion confirmation
    confirmYesBtn.addEventListener("click", () => {
        handleDeleteConfirmation(true);
    });

    // No button for deletion cancellation
    confirmNoBtn.addEventListener("click", () => {
        handleDeleteConfirmation(false);
    });

    // Close modal when clicking outside of it
    modalOverlay.addEventListener("click", (e: Event) => {
        if (e.target === modalOverlay) {
            handleDeleteConfirmation(false);
        }
    });

    // Keyboard support for modal
    document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (!modalOverlay.classList.contains('active')) return;
        
        if (e.key === "Escape") {
            e.preventDefault();
            handleDeleteConfirmation(false);
        } else if (e.key === "Enter") {
            e.preventDefault();
            handleDeleteConfirmation(true);
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