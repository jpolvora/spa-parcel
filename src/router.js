import Navigo from 'navigo'

const root = '';
const useHash = true; // Defaults to: false
const hash = '#'; // Defaults to: '#'
const router = new Navigo(root, useHash, hash);

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
});

export default router