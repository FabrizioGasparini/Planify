var buttons = document.querySelectorAll(".page")

function changePage(id){
    buttons.forEach(button => {
        button.classList.remove("selected")
    });

    buttons[id].classList.add("selected")
}