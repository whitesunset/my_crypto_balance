// Vendor
window.jQuery = require('jquery')
require('bootstrap')

// App
require('./app.module')
require('./app.config')

// Services
require('./services/storage')

// Filters
require('./filters/text')

// States controllers
require('./controllers/states/login')
require('./controllers/states/dashboard')

// Conponents definitions
require('./components/header')
require('./components/footer')

// Conponents controllers
require('./controllers/components/header')
require('./controllers/components/footer')
require('./controllers/components/forms/settings')
require('./controllers/components/forms/coin')