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
    <div data-bind="html: header"></div>
    <div data-bind="html: content" class="container pageEntry"></div>
    <div data-bind="html: footer"></div>`
  }
}
