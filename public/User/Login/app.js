// app.js

new Vue({
    el: '#login-control',
    data: {
        loginEmail: '',
        loginPassword: '',
        isHiddenPassword: true,
        signupEmail: '',
        signupPassword: '',
        confirmPassword: '',
        recoveryEmail: '',
        accountData: [],

        // Properly parse JSON data from the server
        dataUser: {},

        verificationCode: '',
        newPassword: '',
        confirmNewPassword: '',
        timer: 60, // Thời gian đếm ngược bắt đầu (60 giây)
        timerInterval: null,

        isChangeInformation: false,
        newUsername: '',
        newUserSdt: '',
        newUserEmail: '',
        newUserAddress: '',
    },
    methods: {
        goToLogin() {
            window.location.href = '/login';
        },
        goToRegister() {
            window.location.href = '/register';
        },
        goToDetailAccount() {
            window.location.href = '/account';
        },
        goToComfirmMail() {
            window.location.href = '/confirm-mail';
        },
        goToResetPassword() {
            window.location.href = '/reset-password';
        },
        goLoginFromGG() {
            window.location.href = '/auth/google';
        },
        setHiddenPassword() {
            this.isHiddenPassword = !this.isHiddenPassword;
        },
        // Logout
        async logout() {
            try {
                const response = await axios.post('/account/logout');
                if (response.data.success) {
                    $('#notificationMessage').text('Đăng xuất thành công'); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal
                    // this.goToDetailAccount();

                    // Gắn sự kiện cho nút "Đóng"
                    $('#closeNotificationBtn').on('click', () => {
                        this.goToLogin(); // Gọi hàm sau khi modal đóng
                    });
                } else {
                    $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi đăng xuất', error);

                $('#notificationMessage').text('Có lỗi khi đăng xuất. Vui lòng thử lại'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
            }
        },
        // Xử lý đăng nhập
        async login() {
            if (this.loginEmail && this.loginPassword) {
                try {
                    const response = await axios.post('/login/api', {
                        loginEmail: this.loginEmail,
                        loginPassword: this.loginPassword
                    });

                    if (response.data.success) {
                        $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                        $('#notificationModal').modal('show');   // Hiển thị modal
                        // this.goToDetailAccount();

                        // Gắn sự kiện cho nút "Đóng"
                        $('#closeNotificationBtn').on('click', () => {
                            this.goToDetailAccount(); // Gọi hàm sau khi modal đóng
                        });
                    } else {
                        $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                        $('#notificationModal').modal('show');   // Hiển thị modal
                    }
                } catch (error) {
                    console.error('Lỗi đăng nhập:', error);
                    $('#notificationMessage').text('Có lỗi xảy ra khi đăng nhập'); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal
                }
            } else {
                $('#notificationMessage').text('Vui lòng nhập đầy đủ thông tin đăng nhập.'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
            }
        },
        // Xử lý đăng ký
        async signup() {
            const regexEmail = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,}){1,4}$/;
            if (!this.signupEmail.match(regexEmail)) {
                $('#notificationMessage').text('Email không hợp lệ!'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
                return;
            }
            if (this.signupPassword !== this.confirmPassword) {
                $('#notificationMessage').text('Mật khẩu và mật khẩu xác nhận không khớp.'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
            } else if (this.signupEmail && this.signupPassword) {
                try {
                    const response = await axios.post('/register/api', {
                        signupEmail: this.signupEmail,
                        signupPassword: this.signupPassword
                    });

                    if (response.data.success) {
                        $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                        $('#notificationModal').modal('show');   // Hiển thị modal

                        // Gắn sự kiện cho nút "Đóng"
                        $('#closeNotificationBtn').on('click', () => {
                            this.goToLogin(); // Gọi hàm sau khi modal đóng
                        });
                    } else {
                        $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                        $('#notificationModal').modal('show');   // Hiển thị modal
                    }
                } catch (error) {
                    console.error('Lỗi đăng ký:', error);
                    $('#notificationMessage').text('Có lỗi xảy ra khi đăng ký'); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal
                }
            } else {
                $('#notificationMessage').text('Vui lòng nhập đầy đủ thông tin đăng ký. Vui lòng thử lại'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
            }
        },
        // Hàm gọi api gửi code xác thực
        async sendCodeToMail() {
            const regexEmail = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,}){1,4}$/;
            if (!this.recoveryEmail.match(regexEmail)) {
                $('#notificationMessage').text('Email không hợp lệ!'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
                return;
            }
            try {
                // status: true --> email được lấy là email trong thẻ input
                // status: false --> email được lấy là email đã lưu ở server
                const response = await axios.post('/confirm-mail/send-code/api', { email: this.recoveryEmail, status: true });
                if (response.data.success) {
                    $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal

                    // Gắn sự kiện cho nút "Đóng"
                    $('#closeNotificationBtn').on('click', () => {
                        this.goToResetPassword(); // Gọi hàm sau khi modal đóng
                    });
                } else {
                    $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi gửi mã xác thực:', error);

                $('#notificationMessage').text('Có lỗi xảy ra khi gửi mã xác thực. Vui lòng thử lại.'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
            }
        },
        // Hàm gửi mã xác thực lại
        async resendCode() {
            if (this.timer === 0) {
                // Gửi lại mã xác thực
                console.log('Mã xác thực đã được gửi lại!');
                $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
                try {
                    // status: true --> email được lấy là email trong thẻ input
                    // status: false --> email được lấy là email đã lưu ở server
                    const response = await axios.post('/confirm-mail/send-code/api', { email: this.recoveryEmail, status: false });
                    if (response.data.success) {
                        $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                        $('#notificationModal').modal('show');   // Hiển thị modal

                        // Gắn sự kiện cho nút "Đóng"
                        $('#closeNotificationBtn').on('click', () => {
                            this.startTimer(); // Khởi động lại bộ đếm sau khi gửi lại mã
                        });
                    } else {
                        $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                        $('#notificationModal').modal('show');   // Hiển thị modal
                    }
                } catch (error) {
                    console.error('Có lỗi xảy ra khi gửi mã xác thực:', error);

                    $('#notificationMessage').text('Có lỗi xảy ra khi gửi mã xác thực. Vui lòng thử lại'); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal
                }
            }
        },
        // Khởi động bộ đếm ngược 60 giây
        startTimer() {
            console.log("start time");
            this.timer = 60;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);  // Dừng bộ đếm nếu có trước đó
            }
            this.timerInterval = setInterval(() => {
                if (this.timer > 0) {
                    console.log(this.timer);
                    this.timer--;
                } else {
                    clearInterval(this.timerInterval);
                }
            }, 1000);
        },
        // Hàm đặt lại mật khẩu
        async resetPassword() {
            // Gửi yêu cầu đặt lại mật khẩu
            try {
                const response = await axios.post('/reset-password/api', {
                    newPassword: this.newPassword,
                    confirmNewPassword: this.confirmNewPassword,
                    verificationCode: this.verificationCode,
                    timeCode: this.timer
                });

                if (response.data.success) {
                    $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal

                    // Gắn sự kiện cho nút "Đóng"
                    $('#closeNotificationBtn').on('click', () => {
                        this.goToLogin();
                    });
                } else {
                    $('#notificationMessage').text(response.data.message); // Cập nhật nội dung thông báo
                    $('#notificationModal').modal('show');   // Hiển thị modal
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi đặt lại mật khẩu:', error);
                $('#notificationMessage').text('Không thể đặt lại mật khẩu. Vui lòng thử lại!'); // Cập nhật nội dung thông báo
                $('#notificationModal').modal('show');   // Hiển thị modal
            }

        },
        // Lấy dữ liệu từ API khi trang được mount
        async fetchData() {
            try {
                const response = await axios.post('/account/get-info/api');
                this.dataUser = response.data.dataUser;
                console.log(this.dataUser.email)
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        },
        // Thay đổi thông tin
        changeInformation() {
            console.log('change')
            this.isChangeInformation = !this.isChangeInformation;
        },
        // Hàm yêu cầu thay đổi thông tin
        async requireChangeInformation() {
            try {
                const response = await axios.post('/account/change-info/api', {
                    username: this.dataUser.username,
                    sdt: this.dataUser.phone,
                    email: this.dataUser.email
                });
                if (response.data.success) {
                    alert(response.data.message);
                    this.goToDetailAccount();
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi gửi yêu cầu thay đổi thông tin:', error);

                alert(response.data.message);
            }
        },
    },
    mounted() {
        // Chỉ khởi động bộ đếm nếu ở trang reset-password
        if (window.location.pathname.includes('/reset-password')) {
            this.startTimer();
        }
        if (window.location.pathname.includes('/account')) {
            this.fetchData();
        }
    }

});
