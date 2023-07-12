window.onload = (() => {
    document.getElementById("searchbar-arrow").addEventListener('mouseenter', () => {
        document.getElementById("searchbar-arrow").style.display = 'none';
        document.getElementById("searchbar").style.display = 'block';
        document.getElementById("searchbar").style.top = 0;
    })
    
    document.getElementById("searchbar").addEventListener('mouseleave', () => {
        document.getElementById("searchbar").style.top = "-7.5rem";
        document.getElementById("searchbar").style.display = 'none';
        document.getElementById("searchbar-arrow").style.display = 'block';
    })
})