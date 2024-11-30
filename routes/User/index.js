const loginRouter = require('./login.route');
const registerRouter = require('./register.route');
const accountRouter = require('./account.route');
const confirmMailRouter = require('./confirmMail.route');
const resetPassRouter = require('./resetPass.route');
const authLoginGGRouter = require('./authLoginGG.route');

const kitPhimRouter = require('./kitPhim.route');
const keCapRouter = require('./keCap.route');
const switchRouter = require('./switch.route');
const accessoriesRouter = require('./accessories.route');
const groupByRouter = require('./groupby.route');

const serviceRouter = require('./service.route'); 
const introductionRouter = require('./introduction.route');

const homepageRouter = require('./homepage.route')


function route(app){

    app.use('/', homepageRouter); // home page

    app.use('/login', loginRouter); // trang login
    
    app.use('/register', registerRouter); // trang register
    
    app.use('/account', accountRouter); // trang register
    
    app.use('/confirm-mail', confirmMailRouter); // trang confirm mail

    app.use('/reset-password', resetPassRouter); // trang forget pass
    
    app.use('/auth/google', authLoginGGRouter); // trang login với google

    app.use('/kitPhim', kitPhimRouter) // kit phim page

    app.use('/keCap', keCapRouter) // keCap page

    app.use('/switch', switchRouter) // switch page

    app.use('/accessories', accessoriesRouter) // accessories page

    app.use('/group-by-product', groupByRouter) // group by product page

    app.use('/service', serviceRouter); // service page

    app.use('/introduction', introductionRouter); // introduction page
}

module.exports = route;