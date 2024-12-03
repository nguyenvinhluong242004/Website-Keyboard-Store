document.addEventListener("DOMContentLoaded", function () {
  console.log("Initial window.data:", window.data);
  new Vue({
    el: "#app",
    data: {
      img: "/image/detail_product/1.jpg",
      img_detail_1:"/image/detail_product/2.jpg",
      img_detail_2:"/image/detail_product/3.jpg",
      img_detail_3:"/image/detail_product/4.jpg",
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
      getDB: window.data.dataProduct[0],
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
    computed: {
      formattedDescription() {
        return this.getDB.specification.replace(/\n/g, '<br>');
      },
    },
    mounted() {
      console.log("Vue instance has been mounted and script is loaded.");
      console.log("Data from server (window.data):", this.getDB);
    },
  });
});
