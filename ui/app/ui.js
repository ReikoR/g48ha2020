const dom = {
    ad: (el,classname) => el.classList.add(classname),
    rm: (el,classname) => el.classList.remove(classname),
    sw: (el,classname) => el.classList.toggle(classname),
    f:  (path) => document.querySelector(path),
    ff: (path) => [...document.querySelectorAll(path)],
    fid:  (id) => document.querySelector('#'+id),

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

const ui = {
    getReady: f => {
        ui.goScreen('Launch')
    },
    launchApp: f => {
        app.goFullScreen()
        ui.goScreen('Intro')
        api.messageOfUserStart()
    },
    menuBackButton: f => {
        if (app.screen.current === 'Products')
            ui.goScreen('Intro')
        else
            ui.goScreen('Products')
    },
    menuHelpButton: f => ui.goScreen('Help'),
    menuStopButton: f => ui.goScreen('Products'),

    confirmationButton: f => {
        if (app.screen.current === 'Prepare')
            ui.goScreen('Action')
        else
            app.confirmToCompleteOrder()
    },
    
    clickOnProduct: f => {
        ui.goScreen('Prepare')
    },
    goScreen: id => {
        if (app.screen.current)
            ui.deactivateScreenFx(app.screen.current)
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

     // Volume Digits
        if (id === 'Action' || id === 'Pump')
            dom.ad(dom.fid('PumpNumbers'),'is-active')
        else
            dom.rm(dom.fid('PumpNumbers'),'is-active')

    },
    deactivateScreenFx: id => {
        if (id !== 'Intro') dom.rm(dom.f('.el-menu'),'is-intro')
    },
    setCurrentScreen: id => {
     // Screen log
        let prev = app.screen.current
        app.screen.current = id
        if ( prev !== id ) app.screen.prev = prev
     // Active class
        dom.ff('.screen').map( el=>dom.rm(el,'is-active') )
        dom.ad( dom.fid(id), 'is-active' )
    }

    
}

const app = {

    load: f => {
        app.EventMapper()
    },
    
    start: (id='Launch') => ui.goScreen(id),

    home: f => ui.goScreen('Products'),

    screen: {
        current: '',
        prev: ''
    },

    EventMapper: f => {
        let story = [
            {
                s: '.el-launch-app',
                f: ui.launchApp
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
                s: '.el-menu .good',
                f: ui.confirmationButton
            },
            {
                s: '.el-menu .stop',
                f: ui.menuStopButton
            },
            {
                s: '.el-intro-button',
                f: app.home
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
                f: f => ui.goScreen('Pump')
            },
            {
                s: '.el-machine',
                f: f => ui.goScreen('Action')
            }
        ]
        let start = dom.findAndMapEvents(story)
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
    }

}
// autoinit
app.load()


/* EOF ui */
