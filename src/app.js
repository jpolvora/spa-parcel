/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-25 17:03:02
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


const renderComponent = (component) => {
  return async (params) => {
    try {
      // const loadingView = Loading.render()
      // viewModel.content(loadingView)
      // await timeout(1000)
      // if (!component) throw new Error('Invalid argument: component')
      if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')
      const html = await component.render(params)
      viewModel.content(html)
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

const renderError = async (error) => {
  const html = ShowError.render(error)
  return viewModel.content(html)
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

const routerFactory = (routes) => {
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

  for (const key in routes) {
    const element = routes[key]
    router.on(key, renderComponent(element))
  }

  return router
}

const viewModel = {
  header: ko.observable(),
  content: ko.observable(),
  footer: ko.observable(),
  loggedIn: ko.observable(false)
}

const routes = {
  '/': Home,
  'about': About,
  'register': Register,
  '/p/:id': PostShow,
  '/error': {}
}

const router = routerFactory(routes, renderComponent)
router.notFound(renderComponent(Error404))
router.resolve()

const handleLogin = (value) => {
  if (value === true) {
    viewModel.loggedIn(true)
    viewModel.header(Navbar.render())
    viewModel.footer(Bottombar.render())
    router.navigate('/')
  } else {
    viewModel.loggedIn(false)
    viewModel.header('')
    viewModel.footer('')
    router.navigate('/register')
  }
}


$(async () => {
  ko.applyBindings(viewModel)

  handleLogin(false)

  pubsub.subscribe('navigate', (_, value) => {
    console.log('pubsub:navigate')
    router.navigate(value)
  })

  pubsub.subscribe('header', (_, value) => {
    console.log(value)
    console.log('pubsub:header')
    viewModel.header(value)
  })

  pubsub.subscribe('footer', (_, value) => {
    console.log('pubsub:footer')
    viewModel.footer(value)
  })

  pubsub.subscribe('content', (_, value) => {
    console.log('pubsub:content')
    viewModel.content(value)
  })

  pubsub.subscribe('login', (_, value) => {
    console.log('pubsub:login')
    handleLogin(value)
  })
})