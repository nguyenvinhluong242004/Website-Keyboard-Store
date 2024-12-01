
new Vue({
  el: "#app",
  data: {
    name: "",
    email: "",
    quanlity: "1",
    reviewTitle: "",
    reviewContent: "",
    isComment: false,
    uploadedImage: null,
    reviewButtonText: "Write review",
    submitted: false, // trạng thái submit
    submittedData: {
      name: "",
      email: "",
      reviewTitle: "",
      reviewContent: "",
      imageName: "",
    },
    submittedReviews: [],
  },
  methods: {
    submitForm() {
      // Thêm dữ liệu bình luận vào mảng submittedReviews
      this.submittedReviews.push({
        name: this.name,
        email: this.email,
        reviewTitle: this.reviewTitle,
        reviewContent: this.reviewContent,
        imageName: this.uploadedImage ? this.uploadedImage.name : "",
      });

      // Cập nhật trạng thái và reset form sau khi submit
      this.submitted = true;
      this.name = "";
      this.email = "";
      this.reviewTitle = "";
      this.reviewContent = "";
      this.uploadedImage = null;

      alert("Form submitted successfully!");
    },
    handleFileUpload(event) {
      this.uploadedImage = event.target.files[0];
    },
    cancelReview() {
      this.isComment = !this.isComment;
      this.reviewButtonText = this.isComment
        ? "Cancel review"
        : "Write review";
    },
  },
});