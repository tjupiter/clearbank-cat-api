
// to start with, fetch 20 cat images and display them
// with flexbox. Add some animation to it
// 

// 2/ display 1 cat image using react
// 3) display 20 images using react
// 4) add selector for the number of images you want to display. Display them with animation




let catData

async function fetchCatData(){
    const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=100&page=10&order=Desc', {
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
                <img 
                    src="${catData[i].url}" 
                    alt="cat" 
                    class="cat-image"
                />
            </div>
        `
    }

    batch(".cat-container", {
        interval: 0.1, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
        batchMax: 3,   // maximum batch size (targets)
        onEnter: batch => gsap.to(batch, { autoAlpha: 1, stagger: 0.45, overwrite: true }),
        onLeave: batch => gsap.set(batch, { autoAlpha: 0, overwrite: true }),
        onEnterBack: batch => gsap.to(batch, { autoAlpha: 1, stagger: 0.45, overwrite: true }),
        onLeaveBack: batch => gsap.set(batch, { autoAlpha: 0, overwrite: true })
        // you can also define things like start, end, etc.
    });




    // the magical helper function (no longer necessary in GSAP 3.3.1 because it was added as ScrollTrigger.batch())...
    function batch(targets, vars) {
        let varsCopy = {},
            interval = vars.interval || 0.1,
            proxyCallback = (type, callback) => {
                let batch = [],
                    delay = gsap.delayedCall(interval, () => { callback(batch); batch.length = 0; }).pause();
                return self => {
                    batch.length || delay.restart(true);
                    batch.push(self.trigger);
                    vars.batchMax && vars.batchMax <= batch.length && delay.progress(1);
                };
            },
            p;
        for (p in vars) {
            varsCopy[p] = (~p.indexOf("Enter") || ~p.indexOf("Leave")) ? proxyCallback(p, vars[p]) : vars[p];
        }
        gsap.utils.toArray(targets).forEach(target => {
            let config = {};
            for (p in varsCopy) {
                config[p] = varsCopy[p];
            }
            config.trigger = target;
            ScrollTrigger.create(config);
        });
    }

}



let el = document.getElementById('get-cat')
if (el) {
    el.addEventListener('click', presentCatPhoto)
}


