var pages = document.querySelector(".pages").children
var buttons = document.querySelectorAll(".btn")
var navbar = document.querySelector(".navbar")

var selectedPageId = 0

var colors = ["linear-gradient(45deg, rgba(244, 133, 145, 1) 0%, rgba(244, 99, 114, 1) 100%)", "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)", "linear-gradient(45deg, #0ba360 0%, #3cba92 100%)"]

changePage(0)

function changePage(id){
    buttons.forEach(button => {
        button.classList.remove("selected")
    });
    
    buttons[id].classList.add("selected")
    
    pages[selectedPageId].classList.remove("selected")
    if(selectedPageId == 2 || id == 2)
    {
        if(id == 0) pages[1].style.left = "-150vw";
        if(selectedPageId == 0) pages[1].style.left = "150vw";
        
        pages[1].style.display = "block";
        pages[1].classList.add("selected")
        selectedPageId = 1
    }

    pages[selectedPageId].classList.remove("selected")
    pages[id].style.display = "block";

    switch (id) {
        case 0:
            if(selectedPageId == 2) pages[1].style.display = "none";
            pages[1].style.left = "150vw";
            break;

        case 1:
            if(selectedPageId == 0) pages[1].style.left = "150vw";
            else if(selectedPageId == 2) pages[1].style.left = "-150vw";
            pages[1].style.left = "0";
            break;

        case 2:
            if (selectedPageId == 0) pages[1].style.display = "none";
            pages[1].style.left = "-150vw";
            break;
            
        default:
            break;
    }
    updateColor(id)

    pages[id].classList.add("selected")
    selectedPageId = id
}


function updateColor(btnId)
{
    buttons.forEach(button =>
    {
        button.style.background = "transparent";
    });

    buttons[btnId].style.background = colors[btnId]
    navbar.style.background = colors[btnId]
}