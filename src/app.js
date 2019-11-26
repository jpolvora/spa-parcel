/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-26 11:28:04
 */

import $ from 'jquery'
//import swal from 'sweetalert'
import './vendor/pace.min.js'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'gasparesganga-jquery-loading-overlay/dist/loadingoverlay'
import Navigo from 'navigo'
import { html } from 'common-tags'
import ko from 'knockout'
import 'knockout.validation'
import pubsub from './pubsub'
import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar'
import ShowError from './views/components/ShowError'
import Home from './views/pages/Home'
import About from './views/pages/About'
//import PostShow from './views/pages/PostShow'
import Register from './views/pages/Register'
import Logout from './views/pages/Logout'
import { checkLogin } from './services/api'
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
        //const loadingView = Loading.render({ html })
        //dataContext.content(loadingView)

        // if (!component) throw new Error('Invalid argument: component')
        if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')
        const result = await component.render({ html, params })
        if (!result) return router.navigate('/')

        dataContext.content(result)
        if (typeof component.after_render === 'function') {
          await timeout(100)
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
    return router
  }

  const dataContext = {
    isBusy: ko.observable(false),
    current: ko.observable(),
    loggedIn: ko.observable(false),

    header: ko.observable(),
    content: ko.observable(),
    footer: ko.observable()
  }

  dataContext.loggedIn.subscribe(function(newValue) {
    console.log('loggedIn: value changed to:', newValue)
    if (newValue) {
      dataContext.header(Navbar.render({ html }))
      dataContext.footer(Bottombar.render({ html }))
    } else {
      dataContext.header('')
      dataContext.footer('')
    }
  })

  const hooks = {
    before(done, params) {
      console.debug('router:before', params)
      const last = router.lastRouteResolved()
      const routeName = (last && last.name) || ''
      const isLoggedIn = dataContext.loggedIn()
      console.log('routeName: "%s", isLoggedIn: %s', routeName, isLoggedIn)
      if (!isLoggedIn) {
        if (routeName === 'register') {
          return done()
        }
        done(false)
        return router.navigate('/register')
      }

      if (routeName !== 'register') {
        return done()
      }
      done(false)
      return router.navigate('/register')
    },
    after(params) {
      console.debug('router:after', params)
      router.updatePageLinks()
      const data = router.lastRouteResolved()
      dataContext.current(data)
    },
    leave(params) {
      console.debug('router:leave', params)
    },
    already(params) {
      console.debug('router:already', params)
    }
  }

  const router = routerFactory()

  router
    .on({
      '/': { as: 'home', uses: renderComponent(Home), hooks },
      '/about': { as: 'about', uses: renderComponent(About), hooks },
      '/logout': { as: 'logout', uses: renderComponent(Logout), hooks },
      '/register': { as: 'register', uses: renderComponent(Register), hooks }
    })
    .notFound(function() {
      console.log('route not found!')
      router.navigate('/')
    })

  $(async () => {
    ko.applyBindings(dataContext)

    let isLoggedIn = false
    try {
      const result = await checkLogin()
      console.debug(result)
      isLoggedIn = !!result.success
    } catch (error) {
      console.error(error)
    }

    router.resolve()

    dataContext.loggedIn(isLoggedIn)
    if (!isLoggedIn) {
      router.navigate('#/register')
    }

    pubsub.subscribe('busy', (_, value) => {
      console.log('pubsub:busy', value)
      $.LoadingOverlay(value ? 'show' : 'hide')
    })

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
      dataContext.loggedIn(value === true)
    })
  })
})()
