function sendNotification(title, text)
{
    Notification.requestPermission().then(perm =>
    {
        console.log(perm)
        if(perm === "granted")
        {
            const notification = new Notification(title, {
                body: text,
                icon: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Trollface_non-free.png/220px-Trollface_non-free.png"
            })
        
            notification.addEventListener("error", e => alert("error"))
        }
    })
}