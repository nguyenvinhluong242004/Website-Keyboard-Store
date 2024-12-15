document.addEventListener('DOMContentLoaded', () => {
    // const sendMailForm = document.getElementById('sendMailForm');
    const emailCheckboxes = document.getElementsByName('selectedEmails');
    const BccInput = document.querySelector('.form-group input.form-input'); // Trường BCC input
    const subjectInput = document.getElementById('subject'); // Trường nhập tiêu đề
    const messageInput = document.getElementById('message'); // Trường nhập nội dung
    const sendButton = document.getElementById('sendButton'); // Nút gửi email

    // Hàm cập nhật trường BCC
    const updateBCCField = () => {
        const selectedEmails = Array.from(emailCheckboxes) // Chuyển NodeList thành Array
            .filter(checkbox => checkbox.checked) // Lọc checkbox được chọn
            .map(checkbox => checkbox.value); // Lấy giá trị email từ checkbox

        BccInput.value = selectedEmails.join(', '); // Cập nhật giá trị vào BCC
    };

    // Gán sự kiện cho từng checkbox
    emailCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', updateBCCField); // Cập nhật BCC khi checkbox thay đổi
    });

    // Gửi form khi nhấn nút Send
    sendButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Ngăn chặn reload trang mặc định

        // Thu thập dữ liệu từ form
        const selectedEmails = Array.from(BccInput.value.split(',')).map(email => email.trim());
        const subject = subjectInput.value;
        const message = messageInput.value;

        // Kiểm tra dữ liệu đầu vào
        if (selectedEmails.length === 0) {
            alert('Vui lòng chọn ít nhất một email!');
            return;
        }
        if (!subject) {
            alert('Vui lòng nhập tiêu đề!');
            return;
        }
        if (!message) {
            alert('Vui lòng nhập nội dung email!');
            return;
        }

        // Chuẩn bị dữ liệu gửi
        const requestData = {
            emails: selectedEmails,
            subject: subject,
            message: message,
        };

        try {
            const response = await fetch('/admin/mail/send-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Gửi email thất bại! Vui lòng thử lại.');
        }
    });
});
