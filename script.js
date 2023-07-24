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
db.version(4).stores({items: '++id, activity, current, goal, repeats, date, creation, lastUpdate'})


changePage(1)

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

var repeats = document.querySelectorAll("#activity-repeats")

var actName = document.querySelectorAll("#activity-name")
var actGoal = document.querySelectorAll("#activity-goal")
var actCurrent = document.querySelector("#activity-current")
var actDate = document.querySelectorAll("#activity-date")
var actPeriod = document.querySelectorAll("#activity-repeat-period")


function updateRepeatActivity()
{
    if ((repeats[0].checked && addActivityPage.style.display) || (repeats[1].checked && editActivityPage.style.display))
    {
        actDate[0].parentElement.style.display = "none";
        actDate[1].parentElement.style.display = "none";
        actPeriod[0].parentElement.style.display = "";
        actPeriod[1].parentElement.style.display = "";
    }
    else
    {
        actPeriod[0].parentElement.style.display = "none";
        actPeriod[1].parentElement.style.display = "none";
        actDate[0].parentElement.style.display = "";
        actDate[1].parentElement.style.display = "";
    }
}

updateRepeatActivity()



const addActivity = async(event) =>
{
    const name = actName[0].value.toString();

    const goal = parseInt(actGoal[0].value);
    const current = 0   

    const repeat = repeats[0].checked

    var date;
    if (repeat) date = actPeriod[0].value.toString();
    else date = actDate[0].value.toString();

    const creationDate = new Date();

    let day = creationDate.getDate();
    let month = creationDate.getMonth() + 1;
    let year = creationDate.getFullYear();

    if(day < 10) day = "0" + day
    if (month < 10) month = "0" + month

    let currentDate = `${year}-${month}-${day}`;
    
    if (goal > current && name.length > 1)
    {    
        addActivityPage.style.display = "none";
        changePage(1);

        await db.items.add({
            activity: name,
            current: current,
            goal: goal,
            repeats: repeat,
            date: date,
            creation: currentDate,
            lastUpdate: currentDate
        })
        
        loadActivities()

        actName[0].value = "";
        actGoal[0].value = "";
        actDate[0].value = "";
        actCurrent.value = "";
        repeats[0].checked = false;
        updateRepeatActivity()
    }
}
    


function openEditActivity(id)
{
    updateColor(4)
    pages[1].style.display = "none";
    editActivityPage.style.display = "block";

    editActivity(id)
}

const loadActivities = async() =>
{
    const allItems = await db.items.toArray()

    var newActivity = document.createElement("div")
    activitiesParent.innerHTML = allItems.map(item => 
    {
        var current = item.current

        if(updateDate(item)) current = 0

        let dateText = item.repeats ? "OGNI<br> " + item.date : "ENTRO IL<br> " + item.date;
    
        return `
        <div class="activity" id=${item.id} onclick="openEditActivity(${item.id})">
            <div class="title">
                <h1>${item.activity}</h1>
                <p>${parseInt(current / item.goal * 100)}%</p>
            </div>
            <div class="info">
                <div class="text">
                    <p class="current">${current}</p>
                    <p class="goal">${item.goal}</p>
                </div>
            <div class="progress-bar">
                <div class="progress" style="width: calc(${parseInt(current / item.goal * 100)}% - 3%);"></div>
            </div>
        </div>
        <p class="date">${dateText}</p>
        </div>`
    })
}



function updateDate(item)
{
    const today = new Date()
    const lastUpdate = Date.parse(item.lastUpdate)

    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    if (day < 10) day = "0" + day
    if (month < 10) month = "0" + month

    let currentDate = `${year}-${month}-${day}`;

    const diffTime = Math.abs(today - lastUpdate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    var update = false;

    if(lastUpdate != today)
    {
        switch (item.date) {
            case "GIORNO":
                if (diffDays > 1) update = true;
                break;
                
                case "SETTIMANA":
                if (diffDays > 7) update = true;
                break;
                
                case "MESE":
                if (diffDays > 30) update = true;
                break;

            case "MESE":
                if (diffDays > 365) update = true;
                break;
        
            default:
                break;
    }
    }

    if (update) 
    {
        if(item.current < item.goal)
        {
            sendNotification("Attività Scaduta", "Non hai completato in tempo l'attività " + item.actiivty)
        }
        db.items.update(item.id, { current: 0, lastUpdate: currentDate })
    }
    return update
}


    
window.onload = loadActivities


    
const goalLabel = editActivityPage.querySelector(".main .info .text .goal")
var currentActivityId = -1;

function editActivity(id) {
    currentActivityId = id;


    db.open().then(function () 
    {
        return db.items
            .where('id')
            .equals(id)
            .toArray();
    }).then(function(items) 
    {
        var activity = items[0].activity;
        var goal = items[0].goal;
        var current = items[0].current;
        var repeat = items[0].repeats;
        var date = items[0].date;


        actName[1].value = activity;
        actGoal[1].value = goal;
        repeats[1].checked = repeat;
        
        actCurrent.value = current;
        goalLabel.innerHTML = goal;

        if(repeat) actPeriod[1].value = date;
        else actDate[1].value = date;
        updateRepeatActivity()
        updateProgressBar(goal, current)
    })
}

const saveActivity = async (closePage) => {
    var activity = actName[1].value;
    var current = actCurrent.value;
    var goal = actGoal[1].value;
    var repeat = repeats[1].checked;

    var date;
    if (repeat) date = actPeriod[1].value;
    else date = actDate[1].value;

    const creationDate = new Date();

    let day = creationDate.getDate();
    let month = creationDate.getMonth() + 1;
    let year = creationDate.getFullYear();

    if (day < 10) day = "0" + day
    if (month < 10) month = "0" + month

    let currentDate = `${year}-${month}-${day}`;
     
    if (parseInt(goal) < parseInt(current)) current = parseInt(goal)
    
    db.items.update(currentActivityId, { activity: activity, goal: goal, current: parseInt(current), repeats: repeat, date: date})
    await editActivity(currentActivityId);
    await loadActivities()
    
    if (closePage)
    {
        editActivityPage.style.display = "none";
        await changePage(1);
    }
}

const removeActivity = async () => {
    await db.items.delete(currentActivityId)
    await loadActivities();

    editActivityPage.style.display = "none";
    changePage(1);
}

const editProgressBar = editActivityPage.querySelector(".progress-bar .progress")

function updateProgressBar(goal, current)
{
    editProgressBar.style.width = "calc(" + current / goal * 100 + "% - 6px)";
}


const addCurrent = async() =>
{
    var newCurrent = 0;

    db.open().then(function () {
        return db.items
            .where('id')
            .equals(currentActivityId)
            .toArray();
    }).then(function (items) {
        saveActivity()
        if (items[0].current < items[0].goal) {
            newCurrent = items[0].current + 1
        }
        else newCurrent = items[0].current;

        actCurrent.value = parseInt(newCurrent);

        db.items.update(currentActivityId, { current: parseInt(newCurrent) })
        editActivity(currentActivityId)
        saveActivity(false)
    })
    
}

const removeCurrent = async() =>
{
    var newCurrent;
    
    db.open().then(function () {
        return db.items
        .where('id')
        .equals(currentActivityId)
        .toArray();
    }).then(function (items) {
        saveActivity()
        if (items[0].current > 0) {
            newCurrent = items[0].current - 1
        }
        else newCurrent = items[0].current;
        
        actCurrent.value = newCurrent;

        db.items.update(currentActivityId, { current: newCurrent })
        editActivity(currentActivityId)
        saveActivity(false)
    })
}