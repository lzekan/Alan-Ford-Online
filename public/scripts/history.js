const showReadOnes = (data, progress, areRead) => {
    let listComics = document.getElementById("list-comics");
    listComics.innerHTML = "";

    let counter = 0;

    for(let _data of data) {
        if(areRead && parseInt(progress[counter].page) == 62 || !areRead && parseInt(progress[counter].page) < 62){

            let listProgress = document.createElement("div");
            listProgress.classList.add("list-progress");

            let listProgressImgDiv = document.createElement("div");
            listProgressImgDiv.classList.add("list-progress-img-div");

            let listProgressImg = document.createElement("img");
            listProgressImg.src = _data.cover;
            listProgressImg.classList.add("list-progress-img");

            listProgressImgDiv.appendChild(listProgressImg);
            listProgress.appendChild(listProgressImgDiv);

            let listProgressInfo = document.createElement("div");
            let listProgressInfoP = document.createElement("p");
            let listProgressInfoProgress = document.createElement("progress");

            listProgressInfo.classList.add("list-progress-info");

            listProgressInfoP.textContent = _data.title;
            listProgressInfoProgress.value = progress[counter].page;
            listProgressInfoProgress.max = 62;

            listProgressInfo.appendChild(listProgressInfoP)
            listProgressInfo.appendChild(listProgressInfoProgress);
            listProgress.appendChild(listProgressInfo);

            listProgressA = document.createElement("a");
            listProgressA.classList.add("list-progress-btn");
            listProgressA.href = "/read/" + parseInt(_data.title.split(' ')[0]);
            areRead == true ? listProgressA.textContent = "Pročitaj ponovno" : listProgressA.textContent = "Nastavi s čitanjem";

            listProgress.appendChild(listProgressA);
            listComics.appendChild(listProgress);
        }
        counter++;
    }

    if(listComics.innerHTML == "") {
        let empty = document.createElement("p");
        empty.textContent = "Ova kategorija je prazna.";
        empty.classList.add("list-empty");
        listComics.appendChild(empty);
    }

    let read = document.getElementById("option-read");
    let unread = document.getElementById("option-unread");

    if(areRead) {
        read.classList.add("option-clicked");
        unread.classList.remove("option-clicked");
    } else {
        unread.classList.add("option-clicked");
        read.classList.remove("option-clicked");
    }



}