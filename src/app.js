/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-24 23:28:21
 */

'use strict'
import App from './framework'
import $ from 'jquery'
import Shell from './views/components/Shell'
import Home from './views/pages/Home.js'
import About from './views/pages/About.js'
import PostShow from './views/pages/PostShow.js'
import Register from './views/pages/Register.js'

/**
  anatomy of a component
  comp.render()
  comp.data
 */

const app = new App({
  shell: new Shell(),
  routes: {
    '/': Home,
    'about': About,
    'register': Register,
    '/p/:id': PostShow,
    '/error': {}
  }
})

$(async () => {
  console.log('jquery ready')
  await app.render('#app')
  console.log('app rendered')
})