/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-23 05:10:14
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
import Loading from './views/components/Loading'
import ShowError from './views/components/ShowError'

import Home from './views/pages/Home.js'
import About from './views/pages/About.js'
import Error404 from './views/pages/Error404.js'
import PostShow from './views/pages/PostShow.js'
import Register from './views/pages/Register.js'
import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar.js'
//import Profile from './components/profile'

const shellViewModel = {
  header: ko.observable(),
  content: ko.observable(),
  footer: ko.observable()
}

const timeout = ms => new Promise(res => setTimeout(res, ms))

async function renderError(error) {
  const html = ShowError.render(error)
  return shellViewModel.content(html)
}

function renderComponent(component) {
  return async (params) => {
    try {
      const loadingView = Loading.render()
      shellViewModel.content(loadingView)
      await timeout(100)
      if (!component) throw new Error('Invalid argument: component')
      if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')

      const html = await component.render(params)
      shellViewModel.content(`<div id='shell'>${html}</div>`)

      if (typeof component.after_render === 'function') {
        await component.after_render(params)
      }
    } catch (e) {
      console.error(e)
      return renderError(e)
    }
  }
}


const setup = async () => {

  shellViewModel.header(Navbar.render())
  shellViewModel.content(Loading.render())
  shellViewModel.footer(Bottombar.render())

  ko.applyBindings(shellViewModel)

  router.notFound(renderComponent(Error404))

  router.on({
    '/': renderComponent(Home),
    'about': renderComponent(About),
    'register': renderComponent(Register),
    '/p/:id': renderComponent(PostShow),
    '/error': renderComponent(false)
  })

  return router.resolve()
}


// Listen on page load:
window.addEventListener('load', () => {
  console.log('load')
  return setup()
})

