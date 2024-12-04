const userRoutes = require('./User/indexUser.routes');
const adminRoutes = require('./Admin/indexAdmin.routes');

function route(app){

    app.use('/admin', adminRoutes); // trang admin

    app.use('/', userRoutes); // trang user

}

module.exports = route;
