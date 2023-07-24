function sendNotification(title, text)
{
    Notification.requestPermission().then(perm =>
    {
        if(perm === "granted")
        {
            const notification = new Notification(title, {
                body: text
            });
        
            notification.addEventListener("error", e => alert("error"))
        }
    })
}