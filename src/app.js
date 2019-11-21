"use strict";
import Home from './views/pages/Home.js'
import About from './views/pages/About.js'
import Error404 from './views/pages/Error404.js'
import PostShow from './views/pages/PostShow.js'
import Register from './views/pages/Register.js'

import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar.js'

import Utils from './services/Utils.js'

import Navigo from 'navigo'


const setContent = async (fnRenderer, params = {}) => {
    const content = document.getElementById('shell')
    content.innerHTML = await fnRenderer.render(params)
    await fnRenderer.after_render()
}


const setup = async () => {

    const header_container = document.getElementById('header_container')
    header_container.innerHTML = await Navbar.render()
    const footer_container = document.getElementById('footer_container')
    footer_container.innerHTML = await Bottombar.render()

    const root = null;
    const useHash = true; // Defaults to: false
    const hash = '#'; // Defaults to: '#'
    const router = new Navigo(root, useHash, hash);

    router.hooks({
        before: function (done, params) {
            console.log('router before', params)
            return done()
        },
        after: function (params) {
            console.log('router after', params)
        },
        leave: function () {
            console.log('router leave')
        }
    });

    router.notFound(function () {
        setContent(Error404)
    })

    router.on({
        '/': function () {
            setContent(Home, {});
        },
        'about': function () {
            setContent(About, {});
        },
        'register': function () {
            setContent(Register, {});
        },
        '/p/:id': function (params) {
            setContent(PostShow, params);
        }
    })

    return router.resolve();
}


// Listen on page load:
window.addEventListener('load', () => {
    console.log('load')
    return setup()
});

