document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
    data: {
      poster:[],
      currentIndex: 0,
      imagePath: 'public/image/detail_product',
      
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
      async fetchImages() {
        // Gửi đường dẫn thư mục qua tham số query
        fetch('/minh?directory=public/image/detail_product')
          .then(response => response.json())
          .then(data => {
            this.poster = data;
           
          })
          .catch(error => console.error('Error fetching images:', error));
      },
      nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.poster.length;
      },
      prevSlide() {
        this.currentIndex =
          (this.currentIndex - 1 + this.poster.length) % this.poster.length;
      },
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
      formattedSpec() {
        return this.getDB.specification.replace(/\n/g, '<br>');
      },
      // formattedDesc(){
      //   return this.getDB.decscription.replace(/\n/g, '<br>');
      // }
    },
    
    mounted() {
      this.fetchImages(); 
    },
  });
});
