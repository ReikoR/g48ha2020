
const el = {
    run:                document.querySelector('.el-launch-app'),
    menu:               document.querySelector('.el-menu'),
    menuBack:           document.querySelector('.el-menu .back'),
    menuHelp:           document.querySelector('.el-menu .help'),
    activator:          document.querySelector('.el-intro-button'),
    screens:            [...document.querySelectorAll('.screen')],
    screenId:           id=>document.querySelector('#'+id),
    productsContainer:  document.querySelector('#Products'),
    sizes:              [...document.querySelectorAll('#Setup .box')],
    showSuccess:        [],
    goHome:             [document.querySelector('.el-thank-you')],
    goProduct:          [document.querySelector('.el-menu .stop'),
                         document.querySelector('.el-about-illustration')],
    goAbout:            [/*document.querySelector('.el-feedback')*/],
    goPump:             [document.querySelector('.el-hold-the-button')],
    goAction:           [document.querySelector('.el-machine')],
    menuConfirm:         document.querySelector('.el-menu .good')
}

let screen = {
    current: '',
    prev: ''
}

const app = {

    set:    (el,classname) => el.classList.add(classname),
    unset:  (el,classname) => el.classList.remove(classname),
    switch: (el,classname) => el.classList.toggle(classname),

    createProduct: dna => {
        let productDiv = document.createElement('div')
        productDiv.classList.add('box')
        if ( dna.vol < 0.25 ) productDiv.classList.add('is-empty')
        productDiv.setAttribute('style','--instock:'+dna.vol)
        productDiv.innerText = dna.label
        productDiv.id = 'Product' + dna.id
        app.activateProduct(productDiv)
        el.productsContainer.appendChild(productDiv)
        //productMapEvent(productDiv)
    },
    activateProduct: el => el.addEventListener('click', ui.doPrepare),
    updateProduct: dna=>false,

    updateProducts: data => {
        el.productsContainer.innerHTML = ''
        data.map( o=>app.createProduct(o) )
    },

    /* View in fullscreen */
    goFullScreen: f => {

        // Find the right method, call on correct element
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

        // Launch fullscreen for browsers that support it!
        launchIntoFullscreen(document.documentElement); // the whole page

    }
}

const ui = {
    doActivate: f => {
        ui.screen('Products')
    },
    doHome: f => {
        ui.screen('Intro')
    },
    doSetup: f => {
          ui.screen('Setup')
    },
    doPrepare: f => {
          ui.screen('Prepare')
    },
    doAction: f => {
          ui.screen('Action')
    },
    doThanks: f => {
          api.messageOfConfirmedAction()
          ui.screen('Thanks')
    },
    doHelp: f => {
          ui.screen('Help')
    },
    doPump: f => {
          ui.screen('Pump')
    },
    back: f => {
        if (screen.current === 'Products') ui.doHome()
        else ui.doActivate()
    },
    confirm: f => {
        if (screen.current === 'Prepare') ui.doAction()
        else ui.doThanks()
    },
    updateMenu: (s = screen) => {
        if (s.current === 'Intro') app.set(el.menu,'is-intro')
        else app.unset(el.menu,'is-intro')

        if (s.current === 'Launch' || s.current === 'Pump') app.set(el.menu,'is-hidden')
        else app.unset(el.menu,'is-hidden')

        if (s.current === 'Action' || s.current === 'Prepare') app.set(el.menu,'close-only')
        else app.unset(el.menu,'close-only')

        if (s.current === 'Help') app.set(el.menu,'hide-help')
        else app.unset(el.menu,'hide-help')

        if (s.current === 'Action' || s.current === 'Pump')
             app.set(el.screenId('PumpNumbers'),'is-active')
        else app.unset(el.screenId('PumpNumbers'),'is-active')
    },
    screen: id => {
        let prev = screen.current
        screen.current = id
        if ( prev !== id ) screen.prev = prev
        el.screens.map(el=>app.unset(el,'is-active'))
        app.set(el.screenId(id),'is-active')
        ui.updateMenu()
    }
}

el.run.addEventListener('click', f => {
    app.goFullScreen()
    ui.doHome()
    api.messageOfUserStart()
})
//el.run.addEventListener('click', )
el.activator.addEventListener('click', ui.doActivate)
el.menuBack.addEventListener('click', ui.back)
el.menuConfirm.addEventListener('click', ui.confirm)
el.menuHelp.addEventListener('click', ui.doHelp)
el.goProduct.map(el=>el.addEventListener('click', ui.doActivate))
el.goPump.map(el=>el.addEventListener('click', ui.doPump))
el.goAbout.map(el=>el.addEventListener('click', ui.doHelp))
el.goAction.map(el=>el.addEventListener('click', ui.doAction))
el.showSuccess.map(el=>el.addEventListener('click', ui.doThanks))
el.goHome.map(el=>el.addEventListener('click', ui.doHome))
el.sizes.map(el=>el.addEventListener('click', ui.doAction))
let productMapEvent = el => el.addEventListener('click', ui.doSetup)

/* EOF ui */
