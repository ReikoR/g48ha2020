
    const el = {
        menu:               document.querySelector('.el-menu'),
        menuBack:           document.querySelector('.el-menu .back'),
        menuHelp:           document.querySelector('.el-menu .help'),
        activator:          document.querySelector('.el-intro-button'),
        screens:            [...document.querySelectorAll('.screen')],
        screenId:           id=>document.querySelector('#'+id),
        products:           [...document.querySelectorAll('#Products .box')],
        productsContainer:  document.querySelector('#Products')

    }

    const app = {

        set:   (el,classname) => el.classList.add(classname),
        unset: (el,classname) => el.classList.remove(classname),

        createProduct: dna => {
            let productDiv = document.createElement('div')
            productDiv.classList.add('box')
            productDiv.setAttribute('style','--instock:'+dna.vol)
            productDiv.innerText = dna.label
            productDiv.id = 'Product' + dna.id
            app.activateProduct(productDiv)
            el.productsContainer.appendChild(productDiv)
        },

        activateProduct: el => el.addEventListener('click', ui.doSize),

        updateProducts: data => {
            el.productsContainer.innerHTML = ''
            data.map( o=>app.createProduct(o) )
        }
    }

    const ui = {
        doActivate: f => {
            app.unset(el.menu,'is-intro')
            ui.screen('Products')
        },
        doHome: f => {
            app.set(el.menu,'is-intro')
            ui.screen('Intro')
        },
        doSize: f => {
              ui.screen('Size')
        },
        screen: id => {
            el.screens.map(el=>app.unset(el,'is-active'))
            app.set(el.screenId(id),'is-active')
        }
    }

    el.activator.addEventListener('click', ui.doActivate)
    el.menuBack.addEventListener('click', ui.doHome)
    el.products.map(el=>el.addEventListener('click', ui.doSize))
