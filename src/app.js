/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-23 03:20:39
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

const appViewModel = {
  header: ko.observable(),
  content: ko.observable('<article>Loading...</article>'),
  footer: ko.observable()
}

const setup = async () => {

  appViewModel.header(await Navbar.render())
  appViewModel.footer(await Bottombar.render())

  ko.applyBindings(appViewModel)

  router.notFound(async function () {
    appViewModel.content(await Error404.render())
  })

  router.on({
    '/': async function () {
      appViewModel.content(await Home.render())
    },
    'profile': function () {
      Profile.setup()
    },
    'about': async function () {
      appViewModel.content(await About.render())
    },
    'register': async function () {
      appViewModel.content(await Register.render())
      await Register.after_render()
    },
    '/p/:id': async function (params) {
      appViewModel.content(await PostShow.render(params))
    }
  })

  return router.resolve()
}


// Listen on page load:
window.addEventListener('load', () => {
  console.log('load')
  return setup()
})

