/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-25 23:41:11
 */

import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import Navigo from 'navigo'
import { html } from 'common-tags'
import ko from 'knockout'
import 'knockout.validation'
import pubsub from './pubsub'
import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar'
import Error404 from './views/pages/Error404.js'
//import Loading from './views/components/Loading'
import ShowError from './views/components/ShowError'
import Home from './views/pages/Home'
import About from './views/pages/About'
import PostShow from './views/pages/PostShow'
import Register from './views/pages/Register'
import Logout from './views/pages/Logout'
;(async () => {
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

  const timeout = ms => new Promise(res => setTimeout(res, ms))

  const renderComponent = component => {
    return async params => {
      try {
        // const loadingView = Loading.render()
        // viewModel.content(loadingView)
        // await timeout(1000)
        // if (!component) throw new Error('Invalid argument: component')
        if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')
        const result = await component.render({
          html,
          params
        })
        if (!result) return router.navigate('/')

        dataContext.content(result)
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

  const routerFactory = () => {
    const root = ''
    const useHash = true // Defaults to: false
    const hash = '#' // Defaults to: '#'
    const router = new Navigo(root, useHash, hash)
    router.hooks({
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

    return router
  }

  const dataContext = {
    header: ko.observable(),
    content: ko.observable(),
    footer: ko.observable(),
    current: null,
    loggedIn: ko.observable(false)
  }

  dataContext.loggedIn.subscribe(function(newValue) {
    console.log('loggedIn: value changed to:', newValue)

    if (newValue) {
      dataContext.header(
        Navbar.render({
          html
        })
      )
      dataContext.footer(
        Bottombar.render({
          html
        })
      )
    } else {
      dataContext.header('')
      dataContext.footer('')
    }
  })

  const hooks = {
    before(done) {
      const isLoggedIn = dataContext.loggedIn()
      if (isLoggedIn) return done()
      done(false)
      router.navigate('#/register')
    }
  }

  const router = routerFactory()
  router.on('/', renderComponent(Home), hooks)
  router.on('/about', renderComponent(About), hooks)
  router.on('/register', renderComponent(Register))
  router.on('/logout', renderComponent(Logout))
  router.on('/p/:id', renderComponent(PostShow), hooks)
  router.notFound(renderComponent(Error404))
  router.resolve()

  $(async () => {
    ko.applyBindings(dataContext)

    pubsub.subscribe('navigate', (_, value) => {
      console.log('pubsub:navigate', value)
      router.navigate(value)
    })

    pubsub.subscribe('header', (_, value) => {
      console.log('pubsub:header', value)
      dataContext.header(value)
    })

    pubsub.subscribe('footer', (_, value) => {
      console.log('pubsub:footer', value)
      dataContext.footer(value)
    })

    pubsub.subscribe('content', (_, value) => {
      console.log('pubsub:content', value)
      dataContext.content(value)
    })

    pubsub.subscribe('login', (_, value) => {
      console.log('pubsub:login', value)
      dataContext.loggedIn(value)
    })
  })
})()
