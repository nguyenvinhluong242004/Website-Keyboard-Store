// Import các module cần thiết
const path = require('path'); // Xử lý đường dẫn tệp
const express = require('express'); // Web framework cho Node.js
const morgan = require('morgan'); // Module ghi log
const expressHandlebars = require('express-handlebars'); // Template engine
const session = require('express-session');
const app = express();
const port = 3000; // Cổng để chạy server

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

const route = require('./routes');
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
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/resources/User/views/layouts',
    partialsDir: __dirname + '/resources/User/views/partials/',
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/User/views')); // Đặt thư mục views



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
