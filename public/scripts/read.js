let all_pages = undefined;
let current_page = undefined;
let lastPage = undefined;

window.onload = (() => {

    document.onkeydown = (e) => {
        switch (e.key) {
            case "ArrowLeft":
                document.getElementById("big-black-div").style.display == 'block' && page_minus();
                break;
            case "ArrowRight":
                document.getElementById("big-black-div").style.display == 'block' && page_plus();
                break;
        };
    }

    document.getElementById("page-minus").addEventListener('click', () => page_minus());
    document.getElementById("page-plus").addEventListener('click', () => page_plus());

    document.getElementById("comic-page-no").addEventListener('input', () => {
        wanted_page = document.getElementById("comic-page-no").value;

        (wanted_page >= 1 && wanted_page <= all_pages.length) ? current_page = wanted_page : current_page = 1;
        wanted_page > all_pages.length ? current_page = all_pages.length : {};

        document.getElementById("comic-page-img").src = "../comics/" + all_pages[current_page - 1] + ".jpg";
    });
})

const sendLastPage = (lastPage) => {
    current_page == undefined ? current_page = lastPage : {};
}

const enterReadingMode = (pages) => {
    all_pages == undefined ? all_pages = pages : {};

    const black_div = document.getElementById("big-black-div");
    black_div.style.display = 'block';

    const page = document.getElementById("comic-page-img");
    page.src = "../comics/" + all_pages[current_page - 1] + ".jpg";

    document.getElementById("comic-page-no").value = current_page;

}

const page_plus = () => {
    current_page < all_pages.length ? document.getElementById("comic-page-img").src = "../comics/" + all_pages[++current_page - 1] + ".jpg" : {};
    document.getElementById("comic-page-no").value = current_page;
}

const page_minus = () => {
    current_page > 1 ? document.getElementById("comic-page-img").src = "../comics/" + all_pages[--current_page - 1] + ".jpg" : {};
    document.getElementById("comic-page-no").value = current_page;
}

const leaveReadingMode = () => {
    const black_div = document.getElementById("big-black-div");
    black_div.style.display = 'none';

    current_page = parseInt(document.getElementById("comic-page-no").value);
    lastPage = current_page;

    current_page == 1 ? document.getElementById("comic-btn").textContent = "Kreni s čitanjem" : 
        document.getElementById("comic-btn").textContent = "Nastavite gdje ste stali...";

}





