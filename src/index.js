/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-28 09:24:04
 */

import $ from 'jquery'
import page from 'page'
import 'gasparesganga-jquery-loading-overlay'
import swal from 'sweetalert'
import 'bootstrap/dist/js/bootstrap.bundle'
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
import Error404 from './views/pages/Error404'
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
    return async ctx => {
      try {
        if (!component) throw new Error('Invalid argument: component')
        let beforeRenderResult = true

        if (typeof component.beforeRender === 'function') {
          beforeRenderResult = await component.beforeRender({ dataContext, ctx })
        }

        if (beforeRenderResult === false) return false
        if (typeof beforeRenderResult === 'string') {
          return page.redirect(beforeRenderResult)
        }

        if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')
        const result = await component.render({ html, ctx })
        dataContext.content(result)

        if (typeof component.afterRender === 'function') {
          await timeout(100)
          await component.afterRender(ctx)
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

  const dataContext = {
    isBusy: ko.observable(false),
    current: ko.observable(),
    loggedIn: ko.observable(false),

    header: ko.observable(Navbar.render({ html })),
    content: ko.observable(Loading.render({ html })),
    footer: ko.observable(Bottombar.render({ html }))
  }

  //page.base('/')
  page('/', renderComponent(Home))
  page('/about', renderComponent(About))
  page('/logout', renderComponent(Logout))
  page('/register', renderComponent(Register))
  page('*', renderComponent(Error404))

  const showMessage = async value => {
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
  }

  $(async () => {
    pubsub.subscribe('showMessage', (_, value) => {
      console.log('pubsub:busy', value)
      return showMessage(value || '')
    })

    pubsub.subscribe('busy', (_, value) => {
      console.log('pubsub:busy', value)
      dataContext.isBusy(value)
      $('#main').LoadingOverlay(value ? 'show' : 'hide')
    })

    pubsub.subscribe('navigate', (_, value) => {
      console.log('pubsub:navigate', value)
      page(value)
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

    ko.applyBindings(dataContext, $('#app')[0])

    page()
  })
})()
