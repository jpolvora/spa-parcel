/**
 * @ Author: Jone Pólvora
 * @ Create Time: 2019-11-21 19:16:31
 * @ Description:
 * @ Modified by: Jone Pólvora
 * @ Modified time: 2019-11-23 02:00:45
 */


import Navigo from 'navigo'

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
  leave: function () {
    console.log('router leave')
  }
})

export default router