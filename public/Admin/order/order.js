new Vue({
  el: "#app",
  data: {
    productID:0,
    form: {
      name: '1',
      price: 1,
      describe: '1',
      quantity: 1,
      
      // type: '',
    
      // brand: '',
     
    },
    table_groupbyProduct:{
      close: '',
      expected: '',
      productid:0,
    },

    imageUrl: null,
    imageUrl_2: null,
    imageUrl_3: null,
    imageUrl_4: null,
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
      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageUrl = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
          };
          reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
        }
      },
      // Xử lý khi người dùng chọn ảnh
      onFileChange_2(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageUrl_2 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
          };
          reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
        }
      },
      // Xử lý khi người dùng chọn ảnh
      onFileChange_3(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageUrl_3 = e.target.result; // Lưu ảnh dưới dạng base64 vào imageUrl
          };
          reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
        }
      },
      // Xử lý khi người dùng chọn ảnh
      onFileChange_4(event) {
        const file = event.target.files[0];
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
        name: '',
        price: 0,
        close: '',
        expected: '',
        type: '',
        quantity: 0,
        //brand: '',
        describe: '',
      };
      this.imageUrl= null;
      this.imageUrl_2= null;
      this.imageUrl_3= null;
      this.imageUrl_4= null;
    },
    async submitForm() {
      // Đảm bảo typeName đã được điền vào form
      if (!this.form.type) {
        alert('Please select a type.');
        return;
      }
    
      try {
        const typeResponse = await fetch(`/admin/order/type?typeName=${this.form.type}`);
        const typeData = await typeResponse.json();
    
        if (!typeData.success) {
          console.error('Error fetching category ID:', typeData.error);
          alert('dit me no.');
          return;
        }
    
        // Lấy typeid từ dữ liệu trả về
        const typeid = typeData.typeid;
    
        const formData = {
          description: this.form.describe,
          productname: this.form.name,
          currentprice: parseInt(this.form.price, 10),
          quantity: parseInt(this.form.quantity, 10),
          categoryid: parseInt(typeid, 10),
        };
    
        const response = await fetch('/admin/order/insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),  // Đảm bảo dữ liệu đúng định dạng
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
            const response = await fetch('/admin/order/insert-groupbyproduct', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formGroupBy),
            });
    
            const responseData = await response.json();
    
            if (responseData.success) {
              alert('Insert groupbyProduct success!');
              this.resetForm();
            } else {
              console.error('Error:', responseData.error);
              alert('Failed to create groupBy order.');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
          }
        } else {
          console.error('Error:', responseData.error);
          alert('Failed to create order.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
      }
    }
  },
});
