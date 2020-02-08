
const el = {
    menu:               document.querySelector('.el-menu'),
    menuBack:           document.querySelector('.el-menu .back'),
    menuHelp:           document.querySelector('.el-menu .help'),
    activator:          document.querySelector('.el-intro-button'),
    screens:            [...document.querySelectorAll('.screen')],
    screenId:           id=>document.querySelector('#'+id),
    productsContainer:  document.querySelector('#Products'),
    sizes:              [...document.querySelectorAll('#Setup .box')],
    showSuccess:        [document.querySelector('.el-hold-the-button'),
                         document.querySelector('.el-stop-the-button')],
    goHome:             [document.querySelector('.el-thank-you')],
    goProduct:          [document.querySelector('.el-help-text'),
                         document.querySelector('.el-thank-you')]
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
        productMapEvent(productDiv)
    },
    activateProduct: el => el.addEventListener('click', ui.doSize),
    updateProduct: dna=>false,

    updateProducts: data => {
        el.productsContainer.innerHTML = ''
        data.map( o=>app.createProduct(o) )
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
    doAction: f => {
          ui.screen('Action')
    },
    doThanks: f => {
          ui.screen('Thanks')
    },
    doHelp: f => {
          ui.screen('Help')
    },
    back: f => {
        ui.screen('Intro')
    },
    updateMenu: (s = screen) => {
        if (s.current === 'Intro') app.set(el.menu,'is-intro')
        else app.unset(el.menu,'is-intro')
    },
    screen: id => {
        let prev = screen.current
        screen.current = id
        if ( prev !== id ) screen.prev = prev
        ui.updateMenu()
        el.screens.map(el=>app.unset(el,'is-active'))
        app.set(el.screenId(id),'is-active')
    }
}

el.activator.addEventListener('click', ui.doActivate)
el.menuBack.addEventListener('click', ui.back)
el.menuHelp.addEventListener('click', ui.doHelp)
el.goProduct.map(el=>el.addEventListener('click', ui.doActivate))
el.showSuccess.map(el=>el.addEventListener('click', ui.doThanks))
el.goHome.map(el=>el.addEventListener('click', ui.doHome))
el.sizes.map(el=>el.addEventListener('click', ui.doAction))
let productMapEvent = el => el.addEventListener('click', ui.doSetup)

/* EOF ui */
