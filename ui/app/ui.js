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

    redrawProducts: new_products => {
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
            dom.txt(ui.counters.elVolume, ui.counters.volume.toFixed(0))
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
    }

}

/* UI Logic */

const app = {

    load: f => {
        app.EventMapper()
    },

    run: (id='Launch') => ui.goScreen(id),

    play: f => {
        app.goFullScreen()
        ui.goScreen('Intro')
    },

    start: f => {
        api.messageOfUserStart()
        ui.counters.reset()
        app.home()
    },

    home: f => ui.goScreen('Products'),

    EventMapper: f => {
        let story = [
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
                f: ui.menuBackButton
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
            }
        ]
        let start = dom.findAndMapEvents(story)
    },

    refillingImitation: f => {
        const randomVolumer = f => {
            if ( ui.screen.current !== 'Pump' ) return false
            let d = Math.round(Math.random()*10)
            let p = Math.round(Math.random()*10) / 100
            ui.counters.updateVolume( 1*ui.counters.volume + d )
            ui.counters.updatePrice( 1*ui.counters.price   + p )
            setTimeout( randomVolumer, 250 )
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

    updateProducts: arr => {
        dom.redrawProducts(arr)
    },

    confirmToCompleteOrder: f => {
        ui.goScreen('Thanks')
        api.messageOfConfirmedAction()
        ui.counters.reset()
    }

}
// autoinit
app.load()


/* EOF ui */
