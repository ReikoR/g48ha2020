/* DOM manipulations */

const dom = {
    ad: (el,classname) => el.classList.add(classname),
    rm: (el,classname) => el.classList.remove(classname),
    sw: (el,classname) => el.classList.toggle(classname),
    f:  (path) => document.querySelector(path),
    ff: (path) => [...document.querySelectorAll(path)],
    fid:  (id) => document.querySelector('#'+id),
    txt:  (el,txt) => { el.innerHTML = txt + '' },

 // dom api

    clickListener: (els,f) =>
        els.map(el=>el.addEventListener('click', f)),

    findAndMapEvent: (selector, f) =>
        dom.clickListener( dom.ff(selector), f ),

    findAndMapEvents: arr =>
        arr.map( e=>dom.findAndMapEvent(e.s, e.f) ),

    /*redrawProducts: new_products => {
        //let new_products = [...app.products]
        let productsWrap = dom.f('#Products')
        let productWizzard = dna => {
            let productDiv = document.createElement('div')
            dom.ad(productDiv,'box')
            if (dna.vol < 0.25)
                dom.ad(productDiv,'is-empty')
            productDiv.setAttribute('style','--instock:'+dna.vol)
            productDiv.innerText = dna.label
            productDiv.id = 'Product' + dna.id
            return productDiv
        }
        productsWrap.innerHTML = ''
        new_products.map( dna => productsWrap.appendChild(productWizzard(dna)))
        dom.clickListener( dom.ff('#Products>.box'), ui.clickOnProduct )
    },*/
    redrawCurrentProducts: f => {
        let productsWrap = dom.f('#Products')
        let productWizzard = id => {
            let dna =  app.products[id]
            let productDiv = document.createElement('div')
            dom.ad(productDiv,'box')
            if (dna.vol < 0.25)
                dom.ad(productDiv,'is-empty')
            productDiv.setAttribute('style','--instock:'+dna.vol)
            productDiv.innerText = dna.label
            productDiv.id = 'Product' + dna.id
            return productDiv
        }
        productsWrap.innerHTML = ''
        for (id in app.products)
            productsWrap.appendChild(productWizzard(id))
        dom.clickListener( dom.ff('#Products>.box'), ui.clickOnProduct )
    }

}

/* Screens & Screen components */

const ui = {

    screen: {
        current: '',
        prev: ''
    },

    counters: {
        elVolume: dom.f('.gas-volume-value'),
        elPrice:  dom.f('.gas-price-value'),
        volume: 0,
        price:  0,
        updateVolume: x => {
            ui.counters.volume = x
            let mililitres = ui.counters.volume * 1000
            dom.txt(ui.counters.elVolume, mililitres.toFixed(0))
        },
        updatePrice:  x => {
            ui.counters.price  = x
            dom.txt(ui.counters.elPrice,  ui.counters.price.toFixed(2))
        },
        reset: f => {
            ui.counters.updateVolume(0)
            ui.counters.updatePrice(0)
        }
    },

    menuBackButton: f => {
        if (ui.screen.current === 'Products')
            ui.goScreen('Intro')
        else
            ui.goScreen('Products')
    },

    menuHelpButton: f => ui.goScreen('Help'),

    menuStopButton: f => {
        ui.goScreen('Products')
        ui.counters.reset()
    },

    confirmationButton: f => {    // DEPRECATED
        if (ui.screen.current === 'Prepare')
            ui.goScreen('Action')
        else
            app.confirmToCompleteOrder()
    },
    
    clickOnProduct: f => {
        ui.goScreen('Prepare')
    },

    goScreen: id => {
        if (ui.screen.current)
            ui.deactivateScreenFx(ui.screen.current)
        ui.setCurrentScreen(id)
        ui.activateScreenFx(id)
    },

    activateScreenFx: id => {

     // Menu state

        let menu = dom.f('.el-menu')

        if (id === 'Intro')
            dom.ad(menu,'is-intro')
        else
            dom.rm(menu,'is-intro')
        
        if (id === 'Launch' || id === 'Pump')
            dom.ad(menu,'is-hidden')
        else
            dom.rm(menu,'is-hidden')
        
        if (id === 'Action' || id === 'Prepare')
            dom.ad(menu,'close-only')
        else
            dom.rm(menu,'close-only')

        if (id === 'Help')
            dom.ad(menu,'hide-help')
        else
            dom.rm(menu,'hide-help')

     // Counter appears

        if (id === 'Action' || id === 'Pump')
            dom.ad(dom.fid('PumpCounter'),'is-active')
        else
            dom.rm(dom.fid('PumpCounter'),'is-active')

    },

    deactivateScreenFx: id => {
        if (id !== 'Intro') dom.rm(dom.f('.el-menu'),'is-intro')
    },

    setCurrentScreen: id => {
     // Screen log
        let prev = ui.screen.current
        ui.screen.current = id
        if ( prev !== id ) ui.screen.prev = prev
     // Active class
        dom.ff('.screen').map( el=>dom.rm(el,'is-active') )
        dom.ad( dom.fid(id), 'is-active' )
    },

    connectionScreen: status => {
        let elScreen = dom.fid('Connection')
        if (status)
            dom.ad(elScreen, 'is-visible')
        else
            dom.rm(elScreen, 'is-visible')
    },

    dispencingScreen: status => {
        if (status) ui.goScreen('Pump')
        else        ui.goScreen('Action')
    }

}

/* UI Logic */

const app = {

    products: {},
    updateProduct: dna => {
        if (!dna || !dna.id) return false
        let id  = dna.id
        if (!app.products[id]) app.products[id] = {id}
        let p = app.products[id]
        app.products[id].type      = dna.type      || p.type      || 'other'
        app.products[id].label     = dna.name      || p.label     || 'Liquid'
        app.products[id].price     = dna.price     || p.price     || 0
        app.products[id].capacity  = dna.capacity  || p.capacity  || 0
        app.products[id].available = dna.available || p.available ||0
        app.products[id].filled    = dna.filled    || p.filled    || 0
        app.products[id].paid      = dna.paid      || p.paid      || 0
        let vol = p => {
            if ( !p.capacity || !p.available ) return 0
            return p.available / p.capacity
        }
        app.products[id].vol = vol(app.products[id])
    },

    updateProducts: (arr=false) => {
        if (arr) {
            app.products = {}
            arr.map(el=>app.updateProduct(el))
        }
        dom.redrawCurrentProducts()
    },

    updateCounters: dna => {
        let v = dna.filled || 0
        let p = dna.paid   || 0
        ui.counters.updateVolume(v)
        ui.counters.updatePrice(p)
    },

    load: f => {
        app.EventMapper()
    },

    run: (id='Launch') => ui.goScreen(id),

    getReady: f => {
        if (api.fullscreen) {
            app.goFullScreen()
            api.fullscreen = false
        }
    
        api.messageOfConfirmedAction()
        dom.ad(dom.fid('Launch'), 'is-ready')
        ui.goScreen('Launch')
    },

    play: f => {
        api.messageOfUserStart()
        ui.goScreen('Intro')
    },

    start: f => {
        ui.counters.reset()
        app.home()
    },

    home: f => ui.goScreen('Products'),

    EventMapper: f => {
        let story = [
            {
                s: '.el-ready-app',
                f: app.getReady
            },
            {
                s: '.el-launch-app',
                f: app.play
            },
            {
                s: '.el-intro-button',
                f: app.start
            },
            {
                s: '.el-menu .back',
                //f: ui.menuBackButton
                f: f => {
                    app.getReady()
                    //app.home()
                }
            },
            {
                s: '.el-menu .help',
                f: ui.menuHelpButton
            },
            {
                s: '.el-menu .good',    // DEPRECATED
                f: ui.confirmationButton
            },
            {
                s: '.el-menu .stop',
                f: ui.menuStopButton
            },
            {
                s: '.el-confirmation-button',
                f: f => ui.goScreen('Action')
            },
            {
                s: '.el-finish-pump',
                f: app.confirmToCompleteOrder
            },
            {
                s: '.el-about-illustration',
                f: app.home
            },
            {
                s: '.el-thank-you',
                f: app.home
            },
            {
                s: '.el-hold-the-button',
                f: app.refillingImitation
            },
            {
                s: '.el-machine',
                f: f => ui.goScreen('Action')
            },
            {
                s: '.el-server-fallback',
                f: app.skipServerWelcome
            }
        ]
        let start = dom.findAndMapEvents(story)
    },

    refillingImitation: f => {
        const randomVolumer = f => {
            if ( ui.screen.current !== 'Pump' ) return false
            let d = Math.round(Math.random()*5+1)
            let p = Math.round(Math.random()*5+1) / 100
            ui.counters.updateVolume( 1*ui.counters.volume + d )
            ui.counters.updatePrice( 1*ui.counters.price   + p )
            let t = 250
            setTimeout( randomVolumer, t )
        }
        ui.goScreen('Pump')
        randomVolumer()
    },

    goFullScreen: f => {
        function launchIntoFullscreen(element) {
          if(element.requestFullscreen) {
            element.requestFullscreen();
          } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        }
        launchIntoFullscreen(document.documentElement);
    },

    confirmToCompleteOrder: f => {
        ui.goScreen('Thanks')
        api.messageOfConfirmedAction()
        ui.counters.reset()
    },

    skipServerWelcome: f => api.confirmedServerResponce()

}
// autoinit
app.load()


/* EOF ui */
