import Navigo from 'navigo'
import $ from 'jquery'
import pubsub from './pubsub'

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

const timeout = ms => new Promise(res => setTimeout(res, ms))

import Error404 from './views/pages/Error404.js'
import Loading from './views/components/Loading'
import ShowError from './views/components/ShowError'

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
    }
  })

  return router
}

export default class App {
  constructor(cfg = {}) {
    this.shell = cfg.shell
    this.pubsub = pubsub()
    this.router = routerFactory()
    this.router.notFound(this.renderComponent(Error404))

    for (const key in cfg.routes) {
      const element = cfg.routes[key]
      this.router.on(key, this.renderComponent(element))
    }
    this.router.resolve()
  }

  get Router() {
    return this.router
  }

  get Pubsub() {
    return this.pubsub
  }

  async render(selector) {
    const rootEl = $(selector)[0]
    rootEl.innerHTML = await this.shell.render()
    ko.applyBindings(this.shell.data, rootEl)
  }

  async renderError(error) {
    const html = ShowError.render(error)
    return this.shell.data.content(html)
  }

  renderComponent(component) {
    return async (params) => {
      try {
        const loadingView = Loading.render()
        this.shell.data.content(loadingView)
        await timeout(100)
        if (!component) throw new Error('Invalid argument: component')
        if (typeof component.render !== 'function') throw new Error('Invalid component: render function is required')

        const html = await component.render(params)
        this.shell.data.content(`<div id='shell'>${html}</div>`)

        if (typeof component.after_render === 'function') {
          await component.after_render(params)
        }
      } catch (e) {
        console.error(e)
        return this.renderError(e)
      }
    }
  }
}