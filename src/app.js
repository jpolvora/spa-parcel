/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-25 20:56:40
 */

'use strict'
import $ from 'jquery'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import Navigo from 'navigo'
import { html } from 'common-tags'
import ko from 'knockout'
import 'knockout.validation'
ko.validation.rules.pattern.message = 'Invalid.'
ko.validation.init(
  {
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
  },
  true
)

import pubsub from './pubsub'

const timeout = ms => new Promise(res => setTimeout(res, ms))

const renderComponent = component => {
  return async params => {
    try {
      // const loadingView = Loading.render()
      // viewModel.content(loadingView)
      // await timeout(1000)
      // if (!component) throw new Error('Invalid argument: component')
      if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')
      const view = await component.render({ html, params })
      dataContext.content(view)
      if (typeof component.after_render === 'function') {
        await timeout(1000)
        await component.after_render(params)
      }
    } catch (e) {
      console.error(e)
      return renderError(e)
    }
  }
}

const renderError = async error => {
  const html = ShowError.render(error)
  return dataContext.content(html)
}

import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar'
import Error404 from './views/pages/Error404.js'
//import Loading from './views/components/Loading'
import ShowError from './views/components/ShowError'
import Home from './views/pages/Home'
import About from './views/pages/About'
import PostShow from './views/pages/PostShow'
import Register from './views/pages/Register'

const routerFactory = routes => {
  const root = ''
  const useHash = true // Defaults to: false
  const hash = '#' // Defaults to: '#'
  const router = new Navigo(root, useHash, hash)
  router.hooks({
    before: function(done, params) {
      console.log('router before', params)
      return done()
    },
    after: function(params) {
      console.log('router after', params)
    },
    leave: function(params) {
      console.log('router leave', params)
    },
    already: function(params) {
      console.log('router altready', params)
    }
  })

  for (const key in routes) {
    const element = routes[key]
    router.on(key, renderComponent(element))
  }

  return router
}

const dataContext = {
  header: ko.observable(),
  content: ko.observable(),
  footer: ko.observable(),
  current: null,
  loggedIn: ko.observable(false)
}

const routes = {
  '/': Home,
  about: About,
  register: Register,
  '/p/:id': PostShow,
  '/error': {}
}

const router = routerFactory(routes, renderComponent)
router.notFound(renderComponent(Error404))
router.resolve()

const handleLogin = value => {
  if (value === true) {
    dataContext.loggedIn(true)
    dataContext.header(Navbar.render())
    dataContext.footer(Bottombar.render())
    router.navigate('/')
  } else {
    dataContext.loggedIn(false)
    dataContext.header('')
    dataContext.footer('')
    router.navigate('/register')
  }
}

$(async () => {
  ko.applyBindings(dataContext)

  handleLogin(false)

  pubsub.subscribe('get:login', (_, cb) => {
    cb(dataContext.loggedIn())
  })

  pubsub.subscribe('navigate', (_, value) => {
    console.log('pubsub:navigate')
    router.navigate(value)
  })

  pubsub.subscribe('header', (_, value) => {
    console.log(value)
    console.log('pubsub:header')
    dataContext.header(value)
  })

  pubsub.subscribe('footer', (_, value) => {
    console.log('pubsub:footer')
    dataContext.footer(value)
  })

  pubsub.subscribe('content', (_, value) => {
    console.log('pubsub:content')
    dataContext.content(value)
  })

  pubsub.subscribe('login', (_, value) => {
    console.log('pubsub:login')
    handleLogin(value)
  })
})
