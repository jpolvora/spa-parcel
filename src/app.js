/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-23 02:00:36
 */

'use strict'

import ko from 'knockout'
import 'knockout.validation'
ko.validation.rules.pattern.message = 'Invalid.'

ko.validation.init({
  registerExtenders: true,
  messagesOnModified: true,
  insertMessages: true,
  parseInputAttributes: true,
  messageTemplate: null
}, true)

import router from './router'

import Home from './views/pages/Home.js'
import About from './views/pages/About.js'
import Error404 from './views/pages/Error404.js'
import PostShow from './views/pages/PostShow.js'
import Register from './views/pages/Register.js'
import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar.js'

import Profile from './components/profile'

const setContent = async (component, params = {}) => {
  const root = document.getElementById('shell')
  if (root) {        
    //clean(content)
    try {            
      ko.cleanNode(root)
      root.innerHTML = await component.render(params)
      await component.after_render(root)
    } catch (error) {
      console.error(error)
      root.innerHTML = error            
    }
  }
}


const setup = async () => {

  const header_container = document.getElementById('header_container')
  header_container.innerHTML = await Navbar.render()
  const footer_container = document.getElementById('footer_container')
  footer_container.innerHTML = await Bottombar.render()

  router.notFound(function () {
    setContent(Error404)
  })

  router.on({
    '/': function () {
      setContent(Home, {})
    },
    'profile': function () {
      Profile.setup()
    },
    'about': function () {
      setContent(About, {})
    },
    'register': function () {
      setContent(Register, {})
    },
    '/p/:id': function (params) {
      setContent(PostShow, params)
    }
  })

  return router.resolve()
}


// Listen on page load:
window.addEventListener('load', () => {
  console.log('load')
  return setup()
})

