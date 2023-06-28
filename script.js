const pages = document.querySelector(".pages").children
const buttons = document.querySelectorAll(".btn")
const navbar = document.querySelector(".navbar")
const headers = document.querySelectorAll(".header .circle")

var selectedPageId = 0

const colors = ["linear-gradient(45deg, rgba(244, 133, 145, 1) 0%, rgba(244, 99, 114, 1) 100%)", "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)", "linear-gradient(45deg, #0ba360 0%, #3cba92 100%)", "linear-gradient(45deg, #13547a 0%, #80d0c7 100%)", "linear-gradient(45deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)"]

const activityTemplate = document.getElementById("activity-template")
const addActivityPage = document.querySelector(".add-activity-page")
const activitiesParent = document.querySelector(".activities .content")
const editActivityPage = document.querySelector(".edit-activity-page")


const db = new Dexie('Planify')
db.version(2).stores({items: '++id, activity, current, goal, repeats, date'})


changePage(0)

function changePage(id){
    if (addActivityPage.style.display == "block")
    {
        addActivityPage.style.display = "none";
        changePage(1)
    }

    if (editActivityPage.style.display == "block")
    {
        editActivityPage.style.display = "none";
        changePage(1)
    }

    buttons.forEach(button => {
        button.classList.remove("selected")
    });
    
    updateColor(id)

    if(id > 2) return;

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

    pages[id].classList.add("selected")
    selectedPageId = id
}

function updateColor(btnId)
{
    buttons.forEach(button =>
    {
            button.style.background = "transparent";
    });
    
    if(colors.length - 1 < btnId) return;
    
    headers[btnId].style.background = colors[btnId]
    navbar.style.background = colors[btnId]
    
    if (btnId > 2) buttons[1].style.background = colors[btnId]
    else buttons[btnId].style.background = colors[btnId]
}



function createActivity()
{
    updateColor(3)
    pages[1].style.display = "none";
    addActivityPage.style.display = "block";
}

var repeats = document.querySelector("#activity-repeats")

var actName = document.querySelector("#activity-name")
var actGoal = document.querySelector("#activity-goal")
var actDate = document.querySelector("#activity-date")
var actPeriod = document.querySelector("#activity-repeat-period")


function updateRepeatActivity()
{
    if(repeats.checked)
    {
        actDate.parentElement.style.display = "none";
        actPeriod.parentElement.style.display = "";
    }
    else
    {
        actPeriod.parentElement.style.display = "none";
        actDate.parentElement.style.display = "";
    }
}

updateRepeatActivity()





const addActivity = async(event) =>
{
    const name = actName.value.toString();
    const goal = parseInt(actGoal.value);
    const repeat = repeats.checked
    const current = 0
    
    var date;
    
    if (repeat) date = actPeriod.value.toString();
    else date = actDate.value.toString();
    
    if (goal > current && name.length > 1)
    {    
        addActivityPage.style.display = "none";
        changePage(1);

        await db.items.add({
            activity: name,
            current: current,
            goal: goal,
            repeats: repeat,
            date: date
        })
        
        loadActivities()

        actName.value = "";
        actGoal.value = "";
        actDate.value = "";
        repeats.checked = false;
    }
}
    


function openEditActivity(id)
{
    updateColor(4)
    pages[1].style.display = "none";
    editActivityPage.style.display = "block";

    editActivity(id)
}

function editActivity(id)
{

}


const loadActivities = async() =>
{
    const allItems = await db.items.toArray()

    var newActivity = document.createElement("div")
    activitiesParent.innerHTML = allItems.map(item => {
        let dateText = item.repeats ? "OGNI<br> " + item.date : "ENTRO IL<br> " + item.date;
        
        return `
        <div class="activity" id=${item.id} onclick="openEditActivity(${item.id})">
                <h1 class="name">${item.activity} (${parseInt(item.current / item.goal * 100)}%)</h1>
                <div class="info">
                    <div class="text">
                        <p class="current">${item.current}</p>
                        <p class="goal">${item.goal}</p>
                    </div>
                <div class="progress-bar">
                    <div class="progress" style="width: calc(${parseInt(item.current / item.goal * 100)}% - 6px);"></div>
                </div>
            </div>
            <p class="date">${dateText}</p>
        </div>
    `})
}


window.onload = loadActivities