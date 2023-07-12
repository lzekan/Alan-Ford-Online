window.onload = (async () => {

    let pp = document.querySelector("#pp-btn");
    pp.addEventListener('click', async () => {
        let file = document.querySelector("#pp-input").files[0];

        let newUrl = "";

        const { url } = await fetch("/profile/s3Url").then(res => res.json());    
        console.log(url);

        await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: file
        }).then(res => newUrl = res.url)
        .catch(err => {
            console.log('eej' + err.message)
        })
        
        const imageUrl = newUrl.split('?')[0];
        console.log(imageUrl);

        console.log("tu sam")

        // const ppImgs = document.getElementsByClassName("pp-img");
        // for(let img of ppImgs) {
        //     img.src = imageUrl;
        // }

        
        setTimeout(function(){
            location.reload();
        }, 1000);


    }); 
})



