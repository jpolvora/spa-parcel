import { html } from 'common-tags'
import { observable as o } from 'knockout'

import Navbar from '../components/Navbar.js'
import Bottombar from '../components/Bottombar'


export default class {
  constructor() {
    this.data = {
      header: o(Navbar.render()),
      content: o(),
      footer: o(Bottombar.render())
    }
  }

  render() {
    return html`
    <header data-bind="html: header"></header>
    <main role="main" class="flex-shrink-0" data-bind="html: content"></main>
    <footer class="footer mt-auto py-3" data-bind="html: footer"></footer>
    `
  }
}
