document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todo-list") as HTMLUListElement | null;
    if (!todoList) return;
    const todoForm = document.getElementById("todo-form") as HTMLFormElement | null;
    if (!todoForm) return;
    const todoInput = document.getElementById("input-todo") as HTMLInputElement | null;
    if(!todoInput) return;
    const modeSwitch = document.getElementById("mode-switch-container");
    if(!modeSwitch) return

    const switchMode = (e) => {
        if(e.target.classList.contains('light') || e.target.classList.contains('fa-sun')){
            document.getElementsByTagName('body')[0].classList.remove('darkmode');
        }
        if(e.target.classList.contains('dark') || e.target.classList.contains('fa-moon')){
            document.getElementsByTagName('body')[0].classList.add('darkmode');
        };

    }

    modeSwitch.addEventListener('click', switchMode);
    const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement | null;
    if(!modalOverlay) return;
    const confirmYesBtn = document.getElementById("confirm-yes") as HTMLButtonElement | null;
    if(!confirmYesBtn) return;
    const confirmNoBtn = document.getElementById("confirm-no") as HTMLButtonElement | null;
    if(!confirmNoBtn) return;
    
    // Auto-focus the input field when the page loads
    todoInput.focus();
    
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
            listItem.innerHTML = `
                <label class="task">
                    <input id="${id}" type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
                    <span class="task-text">${value}</span>
                </label>
                <div id="${id}" class="actions">
                    <button id="${id}" class="edit-btn"><i class="fa-solid fa-pencil todo-btn edit-todo-btn"></i></button>
                    <button id="${id}" class="delete-btn"><i class="fa-solid fa-trash-can todo-btn delete-todo-btn"></i></button>
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
                // Refocus on input field after deletion
                todoInput.focus();
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
            
            // Add editing class for visual feedback
            li.classList.add('editing');

            //Change the button container
            const id = li.id;

            buttonContainer.innerHTML = `
                <div class="edit-buttons">
                    <button id="${id}" class="save-btn" title="Save changes">
                        <i class="fa-solid fa-check todo-btn save-todo-btn"></i>
                    </button>
                    <button id="${id}" class="cancel-btn" title="Cancel editing">
                        <i class="fa-solid fa-xmark todo-btn cancel-todo-btn"></i>
                    </button>
                </div>
            `;

            //replace the todo text with an edit input field
            var editInput = document.createElement("input");
            editInput.setAttribute("type", "text");
            editInput.value = span.innerText;
            editInput.classList.add("edit-input");
            label.replaceChild(editInput, span);
            
            // Auto focus the input field
            editInput.focus();

            // Save the original text for cancel functionality
            editInput.dataset.originalText = span.innerText;

            //Save the change if the Enter button is pressed while in the input field.
            editInput.addEventListener("keydown", (e) => {
                if(e.key === 'Enter') {
                    saveEdit(li, label, editInput, span, buttonContainer, id);
                } else if(e.key === 'Escape') {
                    cancelEdit(li, label, editInput, span, buttonContainer, id);
                }
            });
        }
    });

    // Helper function to save edits
    const saveEdit = (li: HTMLElement, label: HTMLLabelElement, editInput: HTMLInputElement, 
                      span: HTMLSpanElement, buttonContainer: HTMLDivElement, id: string) => {
        span.innerText = editInput.value;
        label.replaceChild(span, editInput);
        restoreButtons(buttonContainer, id);
        li.classList.remove('editing');
        saveTasks();
        // Refocus on input field after saving edit
        todoInput.focus();
    }

    // Helper function to cancel edits
    const cancelEdit = (li: HTMLElement, label: HTMLLabelElement, editInput: HTMLInputElement, 
                        span: HTMLSpanElement, buttonContainer: HTMLDivElement, id: string) => {
        // Restore original text
        span.innerText = editInput.dataset.originalText || '';
        label.replaceChild(span, editInput);
        restoreButtons(buttonContainer, id);
        li.classList.remove('editing');
        // Refocus on input field after canceling edit
        todoInput.focus();
    }

    // Helper function to restore buttons
    const restoreButtons = (buttonContainer: HTMLDivElement, id: string) => {
        buttonContainer.innerHTML = `
            <button id="${id}" class="edit-btn" title="Edit task">
                <i class="fa-solid fa-pencil todo-btn edit-todo-btn"></i>
            </button>
            <button id="${id}" class="delete-btn" title="Delete task">
                <i class="fa-solid fa-trash-can todo-btn delete-todo-btn"></i>
            </button>
        `;
    }

    //Save button functionality
    todoList.addEventListener("click", (e) => {
        if((e.target as HTMLElement).closest(".save-btn")) {
            const li = (e.target as HTMLElement).closest("li");
            if(!li) return;
            const label = li.querySelector('label') as HTMLLabelElement;
            const buttonContainer = li.querySelector('.actions') as HTMLDivElement | null;
            if (!buttonContainer) return;
            const id = li.id;

            var editInput = li.querySelector('.edit-input') as HTMLInputElement | null;
            if (!editInput) return;
            const span = document.createElement('span');
            span.classList.add('task-text');
            span.innerText = (editInput as HTMLInputElement).value;

            label.replaceChild(span, (editInput as HTMLInputElement));
            restoreButtons(buttonContainer, id);
            li.classList.remove('editing');
            saveTasks();
            // Refocus on input field after saving edit
            todoInput.focus();
        }
    });

    // Cancel button functionality
    todoList.addEventListener("click", (e) => {
        if((e.target as HTMLElement).closest(".cancel-btn")) {
            const li = (e.target as HTMLElement).closest("li");
            if(!li) return;
            const label = li.querySelector('label') as HTMLLabelElement;
            const buttonContainer = li.querySelector('.actions') as HTMLDivElement | null;
            if (!buttonContainer) return;
            const id = li.id;

            var editInput = li.querySelector('.edit-input') as HTMLInputElement | null;
            if (!editInput) return;
            const span = document.createElement('span');
            span.classList.add('task-text');
            span.innerText = editInput.dataset.originalText || '';

            label.replaceChild(span, (editInput as HTMLInputElement));
            restoreButtons(buttonContainer, id);
            li.classList.remove('editing');
            // Refocus on input field after canceling edit
            todoInput.focus();
        }
    });

    loadTasks();
});