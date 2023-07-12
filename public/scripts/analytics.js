const isActive = (time) => {
    let timeOptions = document.getElementsByClassName("analytics-timeoption");

    for(let timeOption of timeOptions) {
        timeOption.classList.remove("active");
        timeOption.name === time && timeOption.classList.add("active");
    } 
}
