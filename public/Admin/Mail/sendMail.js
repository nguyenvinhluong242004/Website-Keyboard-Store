document.addEventListener('DOMContentLoaded', () => {
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
        const selectedEmails = Array.from(emailCheckboxes) // Chuyển NodeList thành Array
            .filter(checkbox => checkbox.checked) // Lọc checkbox được chọn
            .map(checkbox => checkbox.value); // Lấy giá trị email từ checkbox
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        // Kiểm tra ràng buộc
        if (selectedEmails.length === 0) {
            alert("Please select at least one email before sending.");
            return; // Ngừng gửi nếu không có email nào được chọn
        }

        if (!subject || !message) {
            alert("Please fill in both the subject and message fields.");
            return; // Ngừng gửi nếu không nhập tiêu đề hoặc nội dung
        }

        // Chuẩn bị dữ liệu để gửi
        const requestData = {
            emails: selectedEmails,
            subject: subject,
            message: message,
        };

        try {
            // Gửi request đến server
            const response = await fetch('/admin/mail/send-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Emails sent successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to send emails.");
            }
        } catch (err) {
            console.error("Error sending emails:", err);
            alert("An error occurred while sending emails. Please try again.");
        }
    });
});
