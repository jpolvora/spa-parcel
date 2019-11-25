/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 15:24:24
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-25 10:42:06
 */

'use strict'
import $ from 'jquery'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import App from './framework'
import Shell from './views/components/Shell'
import Home from './views/pages/Home'
import About from './views/pages/About'
import PostShow from './views/pages/PostShow'
import Register from './views/pages/Register'

$(async () => {
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

  await app.render('#app')
})