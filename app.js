var deleteBtnArray = document.getElementsByClassName("delete-todo-btn");

for (let i = 0; i < deleteBtnArray.length; i++) {
    deleteBtnArray[i].addEventListener("click", handleDelete);
  }

var editBtnArray = document.getElementsByClassName("edit-todo-btn");

for (let i = 0; i < editBtnArray.length; i++) {
    editBtnArray[i].addEventListener("click", handleEdit);
  }

function handleDelete() {
    console.log("Delete button clicked");
}  

function handleEdit() {
    console.log("Edit button clicked");
}  
