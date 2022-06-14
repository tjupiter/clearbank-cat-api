
// to start with, fetch 20 cat images and display them
// with flexbox. Add some animation to it
// 

// 2/ display 1 cat image using react
// 3) display 20 images using react
// 4) add selector for the number of images you want to display. Display them with animation




let catData

async function fetchCatData(){
    const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=10&page=10&order=Desc', {
        headers: {
            'X-API-KEY': '24d14f66-0979-47e9-bbbb-a813b8223ae4'
        }
    })
        const data = await res.json()
        catData = data;
        console.log('fetchCatData has run')
        console.log(catData)
}

async function presentCatPhoto() {
    mainCatContainer = document.querySelector('.main-cat-container')

    mainCatContainer.innerHTML = `
        <div>Loading new kitties ... </div>
    `
    const getCat = await fetchCatData()
    let myPromise = new Promise(function (resolve, reject) {
        resolve(getCat)
        mainCatContainer.innerHTML = ""
    })

    for (let i = 0; i < catData.length ; i++) {
        
        mainCatContainer.innerHTML +=  `
            <div class="cat-container">
                <img src="${catData[i].url}" alt="cat" class="cat-image"/>
            </div>
        `
    }

}

let el = document.getElementById('get-cat')
if (el) {
    el.addEventListener('click', presentCatPhoto)
}


