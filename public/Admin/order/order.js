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
    },

    imageUrl: null,
    imageUrl_2: null,
    imageUrl_3: null,
    imageUrl_4: null,
    file1: null,
    file2: null,
    file3: null,
    file4: null,
    pathImage: "",
    lastProductID:0,
    in1: "",
    in2: "",
    in3: "",
    in4: "",
  },
  methods: {
    validateForm() {
      // Kiểm tra tất cả các trường bắt buộc
      if (
        !this.form.name ||
        !this.form.price ||
        !this.table_groupbyProduct.close ||
        !this.table_groupbyProduct.expected ||
        !this.form.type ||
        !this.form.quantity ||
        !this.form.brand ||
        !this.form.describe
      ) {
        return false; // Nếu có bất kỳ trường nào trống
      }
      return true; // Tất cả các trường đều được điền
    },
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
      this.file1 = file;
      this.in1 = this.$refs.fileInput;
      this.in1.value = "";

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64

        try {
        } catch (error) {
          console.error("Lỗi upload ảnh:", error);
        }
      }
    },

    // Xử lý khi người dùng chọn ảnh
    async onFileChange_2(event) {
      const file = event.target.files[0];
      this.file2 = file;
      this.in2 = this.$refs.fileInput_2; // Tham chiếu đúng đến input
      this.in2.value = "";
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl_2 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
      }
    },
    // Xử lý khi người dùng chọn ảnh
    async onFileChange_3(event) {
      const file = event.target.files[0];
      this.file3 = file;
      this.in3 = this.$refs.fileInput_3;
      this.in3.value = "";

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl_3 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
      }
    },
    // Xử lý khi người dùng chọn ảnh
    async onFileChange_4(event) {
      const file = event.target.files[0];
      this.file4 = file;
      this.in4 = this.$refs.fileInput_4;
      this.in4.value = "";

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl_4 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
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
        describe: "",
      };
      this.table_groupbyProduct.close = "";
      this.table_groupbyProduct.expected = "";
      this.imageUrl = null;
      this.imageUrl_2 = null;
      this.imageUrl_3 = null;
      this.imageUrl_4 = null;
    },
    checkAddImage() {
      if (
        this.imageUrl === null &&
        this.imageUrl_2 === null &&
        this.imageUrl_3 === null &&
        this.imageUrl_4 === null
      ) {
        return true;
      }
      return false;
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
      console.log('bawts dau fecth Image');

      try {
        const response = await fetch("/admin/order/uploadImage", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);
        } else {
          console.error("Lỗi upload ảnh fontend:", await response.text());
        }
      } catch (error) {
        console.error("Lỗi kết nối tại up image:", error);
      }
    },

    validateCloseDate() {
      const currentDate = new Date(); // Lấy ngày hiện tại
      const closeDate = new Date(this.table_groupbyProduct.close); // Lấy ngày từ form

      // So sánh ngày close với ngày hiện tạitable_groupbyProduct
      if (closeDate <= currentDate) {
        alert("The close date must be greater than today.");
        return false;
      }
      return true;
    },
    validateDeliveryDate() {
      const currentDate = new Date(); // Lấy ngày hiện tại
      const deliveryDate = new Date(this.table_groupbyProduct.expected); // Lấy ngày từ form

      // So sánh ngày close với ngày hiện tại
      if (deliveryDate <= currentDate) {
        alert("The delivery date must be greater than today.");
        return false;
      }
      return true;
    },

    async submitForm() {
      if (!this.validateCloseDate()) {
        return; // Dừng lại nếu ngày không hợp lệ
      }
      if (!this.validateDeliveryDate()) {
        return; // Dừng lại nếu ngày không hợp lệ
      }
      if (!this.validateForm()) {
        alert("Please fill in all required fields!");
        return;
      }


      if (!this.checkAddImage()) {
        try {
          console.log('bawts dau fecth type');
          const typeResponse = await fetch(
            `/admin/order/type?typeName=${this.form.type}`
          );
          
          const typeData = await typeResponse.json();
          console.log('typdata',typeData);

          if (!typeData.success) {
            console.error("Error fetching category ID:", typeData.error);
            return;
          }

          // Lấy typeid từ dữ liệu trả về
          const typeid = typeData.typeid;

          console.log("Type id tra ve la:", typeid);

          console.log('bawts dau fecth brand');

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
          const typeProduct = 2;
          const formData = {
            description: this.form.describe,
            productname: this.form.name,
            currentprice: parseInt(this.form.price, 10),
            quantity: parseInt(this.form.quantity, 10),
            branchid: parseInt(brandid, 10),
            categoryid: parseInt(typeid, 10),
            type: typeProduct,
          };
          console.log('form data',formData);

          const response = await fetch("/admin/order/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), // Đảm bảo dữ liệu đúng định dạng
          });

          const responseData = await response.json();
         
          if (responseData.success) {
            this.lastProductID = responseData.productid;
            console.log('id product vuwaf them laf:',this.lastProductID); 
            this.pathImage = responseData.pathImage;
            console.log('then folder trar ver laf : ',this.pathImage);

            const formGroupBy = {
              enddate: this.table_groupbyProduct.close,
              estimatearrive: this.table_groupbyProduct.expected,
              productid: this.lastProductID,
            };

            console.log("du lieu gui di la:", formGroupBy);
            try {
              const response = await fetch(
                "/admin/order/insert-groupbyproduct",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(formGroupBy),
                }
              );
              const responseData = await response.json();

              if (responseData.success) {
                if(this.file1){
                  console.log(1);
                  this.uploadImage(this.file1, this.pathImage);
                }
                if(this.file2){
                  console.log(2);
                  this.uploadImage(this.file2, this.pathImage);
                }
                if(this.file3){
                  console.log(3);
                  this.uploadImage(this.file3, this.pathImage);
                }
                if(this.file4){
                  console.log(4);
                  this.uploadImage(this.file4, this.pathImage);
                }

                alert("Insert groupbyProduct success!");
                this.resetForm();

              } else {
                console.error("Error:", responseData.error);
                alert("Failed to create groupBy order.");
              }
            } catch (error) {
              console.error("Error:", error);
              alert("minhiiiiiiiiii.");
            }
          } else {
            console.error("Error:", responseData.error);
            alert("Failed to create order.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Lỗi trả về phản hồi HTML.");
        }
      } else {
        alert("Please add image for product!");
        return;
      }
    },
  },
  mounted() {
    // this.getLastProduct();
  },
});
