let catData

async function fetchCatData(){
    const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=100&page=10&order=Desc', {
        headers: {
            'X-API-KEY': '24d14f66-0979-47e9-bbbb-a813b8223ae4'
        }
    })
        const data = await res.json()
        catData = data;
}

async function populateCatPhotos() {
    mainCatContainer = document.querySelector('.main-cat-container')

    mainCatContainer.innerHTML = `
        <div>Loading new kitties ... </div>
    `
    const getCats = await fetchCatData()

    new Promise(function (resolve, reject) {
        resolve(getCats)
        mainCatContainer.innerHTML = ""
    })
    
    for (let i = 0; i < catData.length ; i++) {
        const newDiv = document.createElement('div')
        
        // add classes for funky grid layout
        if (i % 4 === 0 && i % 6 !== 0) {
            newDiv.classList.add('vertical')
        } else if (i % 5 === 0) {
            newDiv.classList.add('horizontal')
        } else if (i % 6 === 0) {
            newDiv.classList.add('bigbox')
        }

        newDiv.classList.add('cat-container')
        newDiv.innerHTML = `
                <img 
                    src="${catData[i].url}" 
                    alt="cat" 
                    class="cat-image"
                />
        `
        mainCatContainer.appendChild(newDiv)
    }
  
    // GSAP ANIMATION
    // more info:
    // --> https://greensock.com/docs/v3/Plugins/ScrollTrigger
    // -->  https://codepen.io/GreenSock/pen/dyGyopR/823312ec3785be7b25315ec2efd517d8
    batch(".cat-image", {
        interval: 0.1, 
        batchMax: 3,  
        onEnter: batch => gsap.to(batch, { opacity: 1, autoAlpha: 1, stagger: 0.15, overwrite: true }),
        onLeave: batch => gsap.set(batch, { opacity: 0, autoAlpha: 0, overwrite: true }),
        onEnterBack: batch => gsap.to(batch, { autoAlpha: 1, stagger: 0.15, overwrite: true }),
        onLeaveBack: batch => gsap.set(batch, { autoAlpha: 0, overwrite: true }),
        markers: true,
        start: "20px 80%",
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

populateCatPhotos();



