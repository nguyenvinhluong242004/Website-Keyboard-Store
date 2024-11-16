const loginRouter = require('./login.route');
const registerRouter = require('./register.route');
const accountRouter = require('./account.route');
const confirmMailRouter = require('./confirmMail.route');
const resetPassRouter = require('./resetPass.route');
const authLoginGGRouter = require('./authLoginGG.route');

function route(app){

    app.use('/login', loginRouter); // trang login
    
    app.use('/register', registerRouter); // trang register
    
    app.use('/account', accountRouter); // trang register
    
    app.use('/confirm-mail', confirmMailRouter); // trang confirm mail

    app.use('/reset-password', resetPassRouter); // trang forget pass
    
    app.use('/auth/google', authLoginGGRouter); // trang login với google

}

module.exports = route;