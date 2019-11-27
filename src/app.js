/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-27 11:33:04
 */

import $ from 'jquery'
import 'gasparesganga-jquery-loading-overlay'
import swal from 'sweetalert'
import 'bootstrap/dist/js/bootstrap.bundle'
import Navigo from 'navigo'
import { html } from 'common-tags'
import ko from 'knockout'
import 'knockout.validation'
import pubsub from './pubsub'
import Loading from './views/components/Loading'
import Navbar from './views/components/Navbar.js'
import Bottombar from './views/components/Bottombar'
import ShowError from './views/components/ShowError'
import Home from './views/pages/Home'
import About from './views/pages/About'
//import PostShow from './views/pages/PostShow'
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
        if (!component) throw new Error('Invalid argument: component')
        let willRender = true
        if (typeof component.beforeRender === 'function') {
          willRender = await component.beforeRender({ params, dataContext })
        }

        if (willRender === false) return

        if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')
        const result = await component.render({ html, params })
        if (!result) return router.navigate('/')

        dataContext.content(result)
        if (typeof component.afterRender === 'function') {
          await timeout(100)
          await component.afterRender(params)
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

    header: ko.observable(Navbar.render({ html })),
    content: ko.observable(Loading.render({ html })),
    footer: ko.observable(Bottombar.render({ html }))
  }

  const router = routerFactory()

  router.hooks({
    before(done) {
      return done()
    },
    after(params) {
      const last = router.lastRouteResolved()
      dataContext.current({ name: last.name, url: last.url, params: params })
    }
  })

  router.on({
    '/': { as: 'home', uses: renderComponent(Home) },
    '/about': { as: 'about', uses: renderComponent(About) },
    '/logout': { as: 'logout', uses: renderComponent(Logout) },
    '/register': { as: 'register', uses: renderComponent(Register) },
    '*': renderComponent(Home)
  })

  $(async () => {
    ko.applyBindings(dataContext)

    router.resolve()

    pubsub.subscribe('showMessage', (_, value) => {
      console.log('pubsub:busy', value)
      //icons: ['warning', 'error', 'success', 'info']
      const options = {
        text: (value && value.text) || value || 'empty message',
        title: (value && value.title) || 'Mensagem',
        icon: (value && value.icon) || 'info'
      }
      const promise = swal(options)
      if (value && value.callback && typeof value.callback === 'function') {
        promise.then(value.callback)
      }
    })

    pubsub.subscribe('busy', (_, value) => {
      console.log('pubsub:busy', value)
      dataContext.isBusy(value)
      $('#shell').LoadingOverlay(value ? 'show' : 'hide')
    })

    pubsub.subscribe('navigate', (_, value) => {
      console.log('pubsub:navigate', value)
      router.navigate(value)
    })

    /** sets the header content */
    pubsub.subscribe('header', (_, value) => {
      console.log('pubsub:header', value)
      dataContext.header(value)
    })

    /** sets the footer content */
    pubsub.subscribe('footer', (_, value) => {
      console.log('pubsub:footer', value)
      dataContext.footer(value)
    })

    /** sets the main content */
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
