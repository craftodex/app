const createRouter = require('sheet-router')

const landingRoutes = require('app/landing/routes')
const todosRoutes = require('app/todos/routes')
const fourOhFourRoutes = require('app/four-oh-four/routes')
const profileRoutes = require('app/profile/routes')
const highlightRoutes = require('app/highlights/routes')

const router = createRouter('/404', function (route) {
  return [
    landingRoutes(route),
    todosRoutes(route),
    fourOhFourRoutes(route),
    profileRoutes(route),
    highlightRoutes(route)
  ]
})

module.exports = router
