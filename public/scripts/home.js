$(document).ready(function () {
    appendDataToPage(1, true);
    document.getElementById("filter").addEventListener('input', function () {
        filterComics(1);
    });
})

let comicsList = [];

const renderPageNumbers = (number) => {
    let numberOfPages = Math.ceil(number / 10);

    for (let i = 0; i < numberOfPages; i++) {
        let div = $(".container-pages");
        let link = document.createElement("a");

        link.classList.add("container-pages-page");

        let pageID = i + 1;
        link.innerText = pageID;
        link.id = pageID;

        link.addEventListener("click", function (e) {
            filterComics(e.target.id);
        });

        div.append(link);
    }
}

const appendDataToPage = (pageNumber, isFirstTime) => {
    let numberOfComics = 0;

    let content = document.getElementById("container-content");
    content.innerHTML = "";

    $.ajax({
        url: "home/getdata",
        async: false,
        success: function (result) {
            result.forEach(el => {
                numberOfComics++;
                comicsList.push(el);

                el.pageNumber = numberOfComics % 10 == 0 ? numberOfComics / 10 : Math.floor(numberOfComics / 10) + 1;
                (el.pageNumber == pageNumber) && content.appendChild(comic(el));
            });
        }
    });

    // axios.get("getdata")
        // .then((res) => {
            // res.data.forEach(el => {
                // numberOfComics++;
                // comicsList.push(el);

                // if (el.pageNumber == undefined) {
                    // let comicNo = numberOfComics;
                    // el.pageNumber = comicNo % 10 == 0 ? comicNo / 10 : Math.floor(comicNo / 10) + 1;
                // }

                // (el.pageNumber == pageNumber) && content.appendChild(comic(el));
            // })
        // })
        // .catch(err)

    isFirstTime && renderPageNumbers(numberOfComics);
    highlightActiveLink(pageNumber);
}

const filterComics = (pageNumber) => {

    let numberOfComics = 0;
    let filter = document.getElementById("filter").value;

    let content = document.getElementById("container-content");
    content.innerHTML = "";

    comicsList.map(el => {
        if (el.title.toLowerCase().includes(filter.toString().toLowerCase())) {
            numberOfComics++;
            el.pageNumber = numberOfComics % 10 == 0 ? numberOfComics / 10 : Math.floor(numberOfComics / 10) + 1;

            (el.pageNumber == pageNumber) && content.appendChild(comic(el));
        }

        document.getElementById("container-pages").innerHTML = "";
        renderPageNumbers(numberOfComics);
    })

    highlightActiveLink(pageNumber);
}

const highlightActiveLink = (pageNumber) => {
    let links = document.getElementsByClassName("container-pages-page");
    for (let link of links) {
        link.classList = "";
        link.classList.add("container-pages-page");
        link.textContent == pageNumber && link.classList.add("page-active");
    }
}

const comic = (el) => {
    let item = document.createElement("div");
    let div_image = document.createElement("img");
    let div_title = document.createElement("p");

    item.classList.add("item");

    div_image.src = el.cover;
    item.appendChild(div_image);

    div_title.textContent = el.title;
    item.appendChild(div_title);

    item.addEventListener('click', () => {
        location.href = "/read/" + parseInt(el.title.split(' ')[0]);
    })

    return item;
}