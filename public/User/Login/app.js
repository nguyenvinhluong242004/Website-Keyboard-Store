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
                    this.goToLogin();
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi đăng xuất', error);

                alert(response.data.message);
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
                        alert(response.data.message);
                        this.goToDetailAccount();
                    } else {
                        alert(response.data.message);
                    }
                } catch (error) {
                    console.error('Lỗi đăng nhập:', error);
                    alert('Có lỗi xảy ra khi đăng nhập');
                }
            } else {
                alert('Vui lòng nhập đầy đủ thông tin đăng nhập.');
            }
        },
        // Xử lý đăng ký
        async signup() {
            if (this.signupPassword !== this.confirmPassword) {
                alert('Mật khẩu và mật khẩu xác nhận không khớp.');
            } else if (this.signupEmail && this.signupPassword) {
                try {
                    const response = await axios.post('/register/api', {
                        signupEmail: this.signupEmail,
                        signupPassword: this.signupPassword
                    });

                    if (response.data.success) {
                        alert(response.data.message);
                        this.goToLogin();
                    } else {
                        alert('Có lỗi xảy ra khi đăng ký');
                    }
                } catch (error) {
                    console.error('Lỗi đăng ký:', error);
                    alert('Có lỗi xảy ra khi đăng ký');
                }
            } else {
                alert('Vui lòng nhập đầy đủ thông tin đăng ký.');
            }
        },
        // Hàm gọi api gửi code xác thực
        async sendCodeToMail() {
            try {
                // status: true --> email được lấy là email trong thẻ input
                // status: false --> email được lấy là email đã lưu ở server
                const response = await axios.post('/confirm-mail/send-code/api', { email: this.recoveryEmail, status: true });
                if (response.data.success) {
                    alert(response.data.message);
                    this.goToResetPassword();
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi gửi mã xác thực:', error);

                alert(response.data.message);
            }
        },
        // Hàm gửi mã xác thực lại
        async resendCode() {
            if (this.timer === 0) {
                // Gửi lại mã xác thực
                console.log('Mã xác thực đã được gửi lại!');
                try {
                    // status: true --> email được lấy là email trong thẻ input
                    // status: false --> email được lấy là email đã lưu ở server
                    const response = await axios.post('/confirm-mail/send-code/api', { email: this.recoveryEmail, status: false });
                    if (response.data.success) {
                        alert(response.data.message);
                        this.startTimer(); // Khởi động lại bộ đếm sau khi gửi lại mã
                    } else {
                        alert(response.data.message);
                    }
                } catch (error) {
                    console.error('Có lỗi xảy ra khi gửi mã xác thực:', error);

                    alert(response.data.message);
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
                    alert(response.data.message);
                    this.goToLogin(); // Điều hướng đến trang đăng nhập hoặc một trang xác nhận
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi đặt lại mật khẩu:', error);
                alert('Không thể đặt lại mật khẩu. Vui lòng thử lại!');
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
