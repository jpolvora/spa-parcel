/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-25 14:54:13
 */

'use strict'
import $ from 'jquery'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import Navigo from 'navigo'
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

import pubsub from './pubsub'

const timeout = ms => new Promise(res => setTimeout(res, ms))

import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar'

import Home from './views/pages/Home'
import About from './views/pages/About'
import PostShow from './views/pages/PostShow'
import Register from './views/pages/Register'

const routerFactory = () => {
  const root = ''
  const useHash = true // Defaults to: false
  const hash = '#' // Defaults to: '#'
  const router = new Navigo(root, useHash, hash)

  router.hooks({
    before: function (done, params) {
      console.log('router before', params)
      return done()
    },
    after: function (params) {
      console.log('router after', params)
    },
    leave: function (params) {
      console.log('router leave', params)
    },
    already: function (params) {
      console.log('router altready', params)
    }
  })

  return router
}

const viewModel = {
  header: ko.observable(Navbar.render()),
  content: ko.observable(),
  footer: ko.observable(Bottombar.render()),
  loggedIn: ko.observable(false)
}

const routes = {
  '/': Home,
  'about': About,
  'register': Register,
  '/p/:id': PostShow,
  '/error': {}
}

const renderComponent = (component) => {
  return async (params) => {
    try {
      //const loadingView = Loading.render()
      //this.shell.data.content(loadingView)
      //await timeout(100)
      if (!component) throw new Error('Invalid argument: component')
      if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')

      const html = await component.render(params)
      viewModel.content(html)
      await timeout(100)
      if (typeof component.after_render === 'function') {
        await component.after_render(params)
      }
    } catch (e) {
      console.error(e)
      return this.renderError(e)
    }
  }
}

const router = routerFactory()
for (const key in routes) {
  const element = routes[key]
  router.on(key, renderComponent(element))
}
router.resolve()

$(async () => {
  ko.applyBindings(viewModel)

  pubsub.subscribe('loggedIn', (value) => {
    viewModel.loggedIn(value || false)
  })
})