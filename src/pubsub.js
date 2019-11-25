import $ from 'jquery'

const factory = () => {
  var target = $({})
  var knownEvents = {}
  return {
    subscribe: function () {
      target.on.apply(target, arguments)

    },
    unsubscribe: function () {
      target.off.apply(target, arguments)
    },
    publish: function () {
      var ch = arguments[0]
      knownEvents[ch] = null
      console.dir(arguments)
      target.trigger.apply(target, arguments)
    },
    listEvents: function () {
      return Object.keys(knownEvents)
    }
  }
}

/*singleton*/
const singleton = factory()
export default singleton