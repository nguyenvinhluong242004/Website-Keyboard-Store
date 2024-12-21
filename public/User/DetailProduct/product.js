document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
   
      delimiters: ['[[', ']]'],
  
    data: {
      product:window.idProduct,

      poster:[],
      currentIndex: 0,
      imagePath: '',
      
      img: '',
      img_detail_1:'',
      img_detail_2:'',
      img_detail_3:'',
      
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
      reviews: [],
      getDB: window.data.dataProduct[0],
    },
    methods: {
      async fetchReview(){
        fetch(`/detail-product/instock/review/api?id=${this.product}`)
        .then(response => response.json())
        .then(data => {
          this.reviews = data.reviews;
          console.log("review:",this.reviews);
        })
        .catch(error => console.error('Error fetching images:', error));
      },
      async fetchImages() {
        // Gửi đường dẫn thư mục qua tham số query
        url=this.product;

        fetch(`/detail-product/instock/image/api?id=${url}`)
          .then(response => response.json())
          .then(data => {
            this.poster = data;
            this.img=this.poster[0];
            this.img_detail_1=this.poster[1];
            this.img_detail_2=this.poster[2];
            this.img_detail_3=this.poster[3];
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
     async submitForm() {
        // Thêm dữ liệu bình luận vào mảng submittedReviews
        const reviewData = {
          productid: this.product,
          email: this.email,
          reviewdate: '2024/11/22',
          comment: this.reviewContent,
          stars: 5,
        };

        // Cập nhật trạng thái và reset form sau khi submit
        this.submitted = true;
        this.name = "";
        this.email = "";
        this.reviewTitle = "";
        this.reviewContent = "";
        this.uploadedImage = null;
                                                                                 
        const response = await fetch('/detail-product/insert/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),  
        });
    
        const responseData = await response.json();
    
        if (responseData.success) {
          this.fetchReview();
          alert("Form submitted successfully!");
        }
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
      formattedDesc() {
        return this.getDB.description.replace(/\n/g, '<br>');
      },
    },
    
    mounted() {
      this.fetchReview();
      this.fetchImages(); 
    },
  });
});
