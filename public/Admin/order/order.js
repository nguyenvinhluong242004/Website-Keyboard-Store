new Vue({
  el: "#app",
  data: {
    productID: 0,
    form: {
      name: "1",
      price: 1,
      describe: "1",
      quantity: 1,
      type: "",
      brand: "",
    },
    table_groupbyProduct: {
      close: "",
      expected: "",
      productid: 0,
    },

    imageUrl: null,
    imageUrl_2: null,
    imageUrl_3: null,
    imageUrl_4: null,
    pathImage: "",
    lastIndex: 0,
  },
  methods: {
    // Trigger ô nhập ảnh khi nhấn vào dấu +
    triggerFileInput() {
      this.$refs.fileInput.click(); // Gọi click() cho ô input file
    },
    triggerFileInput_2() {
      this.$refs.fileInput_2.click(); // Gọi click() cho ô input file
    },
    triggerFileInput_3() {
      this.$refs.fileInput_3.click(); // Gọi click() cho ô input file
    },
    triggerFileInput_4() {
      this.$refs.fileInput_4.click(); // Gọi click() cho ô input file
    },

    // Xử lý khi người dùng chọn ảnh
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
   

        this.uploadImage(file, this.lastIndex);
      }
    },
    // Xử lý khi người dùng chọn ảnh
    async onFileChange_2(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl_2 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
       
        this.uploadImage(file, this.lastIndex);
      }
    },
    // Xử lý khi người dùng chọn ảnh
    async onFileChange_3(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl_3 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
       
        this.uploadImage(file, this.lastIndex);
      }
    },
    // Xử lý khi người dùng chọn ảnh
    async onFileChange_4(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl_4 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
    
        this.uploadImage(file, this.lastIndex);
      }
    },
    resetForm() {
      // Đặt lại tất cả giá trị của các trường về rỗng
      this.form = {
        name: "",
        price: 0,
        close: "",
        expected: "",
        type: "",
        quantity: 0,
        //brand: '',
        describe: "",
      };
      this.imageUrl = null;
      this.imageUrl_2 = null;
      this.imageUrl_3 = null;
      this.imageUrl_4 = null;
    },
    async getLastProduct() {
      try {
          const ressult = await fetch(`/api/indexLastProduct`);
          const data = await ressult.json();
  
          // Chuyển đổi data.index sang số nguyên rồi cộng thêm 1
          this.lastIndex = parseInt(data.index, 10) + 1;
  
          console.log("Last product:", this.lastIndex);
      } catch (error) {
          console.error("Error fetching last product:", error);
      }
    },  
    async uploadImage(file, product) {
      const formData = new FormData();
      const productInfo = product;
      // Chuyển đổi đối tượng JSON thành chuỗi JSON và thêm vào FormData

      formData.append("productInfo", JSON.stringify(productInfo));

      formData.append("image", file); // Thêm file thật

      try {
        const response = await fetch("/admin/order/uploadImage", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Đường dẫn ảnh client la:", result.filePath);

          this.pathImage = result.filePath;
          console.log(this.pathImage);
        } else {
          console.error("Lỗi upload ảnh fontend:", await response.text());
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      }
    },

    async submitForm() {
    
      try {
        const typeResponse = await fetch(
          `/admin/order/type?typeName=${this.form.type}`
        );
        const typeData = await typeResponse.json();

        if (!typeData.success) {
          console.error("Error fetching category ID:", typeData.error);
          return;
        }

        // Lấy typeid từ dữ liệu trả về
        const typeid = typeData.typeid;

        const brandResponse = await fetch(
          `/admin/order/brand?brandName=${this.form.brand}`
        );
        const brandData = await brandResponse.json();

        if (!typeData.success) {
          console.error("Error fetching category ID:", typeData.error);
          return;
        }

        // Lấy branchid từ dữ liệu trả về
        const brandid = brandData.brandid;

        const formData = {
          pathimage: this.pathImage,
          description: this.form.describe,
          productname: this.form.name,
          currentprice: parseInt(this.form.price, 10),
          quantity: parseInt(this.form.quantity, 10),
          branchid: parseInt(brandid, 10),
          categoryid: parseInt(typeid, 10),
        };

        const response = await fetch("/admin/order/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Đảm bảo dữ liệu đúng định dạng
        });

        const responseData = await response.json();

        if (responseData.success) {
          this.productID = responseData.productid;
          this.resetForm();
          const formGroupBy = {
            enddate: this.table_groupbyProduct.close,
            estimatearrive: this.table_groupbyProduct.expected,
            productid: this.productID,
          };

          try {
            const response = await fetch("/admin/order/insert-groupbyproduct", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formGroupBy),
            });

            const responseData = await response.json();

            if (responseData.success) {
              alert("Insert groupbyProduct success!");
              this.resetForm();
            } else {
              console.error("Error:", responseData.error);
              alert("Failed to create groupBy order.");
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
          }
        } else {
          console.error("Error:", responseData.error);
          alert("Failed to create order.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred.");
      }
      finally{
        this.lastIndex +=1;
        console.log('sau khi submit xong:',this.lastIndex);
      }
    },
  },
  mounted() {
    this.getLastProduct();
  },
});
