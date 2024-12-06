new Vue({
  el: "#app",
  data: {
    form: {
      name: "",
      price: "",
      close: "",
      expected: "",
      type: "lua_chon_1",
      brand: "",
      describe: "",
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
        name: "",
        price: "",
        close: "",
        expected: "",
        type: "lua_chon_1",
        brand: "",
        describe: "",
      };
      this.imageUrl= null;
      this.imageUrl_2= null;
      this.imageUrl_3= null;
      this.imageUrl_4= null;
    },
  },
});
