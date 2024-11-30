document.querySelectorAll('.badge').forEach((badge) => {
    const originalCategory = badge.textContent.trim(); // Lấy nội dung category
    const classCategory = originalCategory.replace(/\s+/g, '-'); // Thay khoảng trắng bằng "-"
    badge.classList.add(classCategory); // Thêm lớp động
});