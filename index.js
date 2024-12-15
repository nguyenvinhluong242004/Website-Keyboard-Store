// Load biến môi trường từ file .env
require('dotenv').config();

// Import các module cần thiết
const path = require('path'); // Xử lý đường dẫn tệp
const express = require('express'); // Web framework cho Node.js
const morgan = require('morgan'); // Module ghi log
const expressHandlebars = require('express-handlebars'); // Template engine
const session = require('express-session');

const app = express();
const port = 4001; // Cổng để chạy server

// Object để lưu trữ các biến cần chia sẻ
const dataTempServer = {
    dataUser: null,
    storedCode: 88888,
    storedEmail: "example@gmail.com",
    setDataUser(user) {
        this.dataUser = user;
    },
    setStoredCode(code) {
        this.storedCode = code;
    },
    setStoredEmail(email) {
        this.storedEmail = email;
    },
    getDataUser() {
        return this.dataUser;
    }
};

module.exports = dataTempServer;

// Load biến môi trường từ file .env
require('dotenv').config({ path: './.env' });
const bodyParser = require('body-parser'); // Xử lý dữ liệu từ các yêu cầu HTTP

const route = require('./routes/app.routes');
const pool = require('./app/config/database');
const passport = require('./app/config/passport');


// Middleware session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Middleware để parse dữ liệu JSON
app.use(bodyParser.json());

// Cấu hình thư mục tĩnh cho các file CSS, JS, hình ảnh
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined')); // Cấu hình ghi log HTTP requests
app.use(express.json()); // Xử lý dữ liệu JSON từ yêu cầu HTTP

// Cấu hình Handlebars làm template engine
app.engine('hbs', expressHandlebars.engine({
    extname: 'hbs',
    defaultLayout: 'layoutUser',
    layoutsDir: __dirname + '/resources/views/layouts',
    partialsDir: __dirname + '/resources/views/partials/',
    helpers: {
        eq: (a, b) => a === b,
        add: (a, b) => a + b,
        range: (start, end) => {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        } 
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views')); // Đặt thư mục views


// // Helper handlebars paging
// Handlebars.registerHelper('gt', function (a, b) {
//     return a > b;
// });

// Handlebars.registerHelper('lt', function (a, b) {
//     return a < b;
// });

// Handlebars.registerHelper('inc', function (a) {
//     return a + 1;
// });

// Handlebars.registerHelper('dec', function (a) {
//     return a - 1;
// });



// Kiểm tra kết nối với PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Kết nối đến PostgreSQL thất bại!', err);
    }
    console.log('Kết nối đến PostgreSQL thành công!');
    release();
});



// Route init
route(app);


// Lắng nghe trên localhost
app.listen(port, () => console.log(`Example: at http://localhost:${port}`));
