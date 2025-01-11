new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data() {
    return {  
      check:false,
      searchQuery:'',
      sort:'enddate',
      exportRegister:[],
      idGroupby:null,
      orderIdRegister:null,
      selectedIndex: 0,
      selectedIndexRegister:0,
      shipPrice:30,
      participants: [],
      page: 1, 
      pageRegister: 0,
      pageDetailRegister:1,
      perPageDetailRegister:3,
      perPage: 3,
      perPageRegister: 3,
      totalPages: 1, 
      totalPagesRegister: 1, 
      totalPagesDetailRegister:1,
      detailProduct: {
        name:[], 
        images: "image",
        price: 0, 
        close: "close", 
        type:"type",
        brand:"brand",
        describe:"describe",
        expected:"expected",
        quanlity:0,
        groupbyid:0,
      },

      register:[],

      detaiRegister:[],
      allProductRegiser:[],
      per:1,
      
    };
  },
  computed: {
    calculatedProducts() {
      return this.allProductRegiser.map((product) => ({
        ...product,
        totalPrice: parseInt(product.quantity) * parseInt(product.unitprice),
      }));
    },
    totalSum() {
      // Tính tổng tất cả `totalPrice`
      return this.calculatedProducts.reduce((sum, product) => sum + product.totalPrice, 0);
    },
    totalWithShip() {
      // Tính tổng giá bao gồm phí ship
      return this.totalSum + (parseInt(this.shipPrice) || 0);
    },
  },
  
  mounted() {
    this.initializeData();
  },
  
  methods: {
    deleteForm() {
      axios.put(`/admin/detail-participants/update/${this.idGroupby}`)
        .then(response => {
          if (response.data.success) {
            alert(`Product with ID ${this.idGroupby} delete form successfully`);
            this.initializeData(); // F5 lại trang
            this.selectedIndex = 0;
            // Thực hiện hành động khác nếu cần
          } else {
            console.error('Failed to delete product:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error deleting product:', error);
        });
    },
    closeForm() {
      axios.put(`/admin/detail-participants/close/${this.idGroupby}`)
        .then(response => {
          if (response.data.success) {
            alert(`Product with ID ${this.idGroupby} close form successfully`);
            this.initializeData(); // F5 lại trang
            this.selectedIndex = 0;
            // Thực hiện hành động khác nếu cần
          } else {
            console.error('Failed to delete product:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error deleting product:', error);
        });
    },
    handleInput(event) {
      if (this.perPageRegister < 1) {
        this.perPageRegister = 1; // Nếu người dùng cố nhập nhỏ hơn 1, giá trị sẽ tự sửa thành 1
      }
      this.perPageRegister = event.target.value;
      this. fetchRegister();
    },
    async searchV2(){
      this.pageRegister = 1;
      this.search();
    },
    async search() {

      if (this.searchQuery.trim() === '') {
        return; 
      }

      return new Promise((resolve, reject) => {
        fetch(`/admin/detail-participants/api/searchRegister?q=${encodeURIComponent(this.searchQuery)}&page=${this.pageRegister}&perPage=${this.perPageRegister}&id=${this.idGroupby}`)
          .then((response) => {
            if (!response.ok) {
              return reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.register = data.result;
            this.totalPagesRegister = data.totalPagesSearch;
    
            if (this.register.length >= 1) {
              this.orderIdRegister = this.register[0].orderid;
            } else {
              this.orderIdRegister = null;
              console.log("register does not have enough elements.");
            }
            
            //console.log("orderIdRegister:", this.orderIdRegister);
            this.fetchDetailRegister();
            
            resolve(data); 
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
            reject(error); 
          });
      });
    },

    time(){
      this.sort ='enddate';
      this. initializeData();
      this.selectedIndex = 0;
      this.selectedIndexRegister=0
      this.searchQuery = '';
      this.pageRegister = 1;
    },
    type(){
      this.sort ='categoryname';
      this. initializeData();
      this.selectedIndex = 0;
      this.selectedIndexRegister=0
      this.searchQuery = '';
      this.pageRegister = 1;
    },
    brand(){
      this.sort ='brandname';
      this. initializeData();
      this.selectedIndex = 0,
      this.selectedIndexRegister=0
      this.searchQuery = '';
      this.pageRegister = 1;
    },
    price(){
      this.sort ='currentprice';
      this. initializeData();
      this.selectedIndex = 0;
      this.selectedIndexRegister=0
      this.searchQuery = '';
      this.pageRegister = 1;
    },
    async promptFileName() {

      await this.fetchAllRegister();

      const fileName = prompt("Nhập tên file (không cần thêm đuôi):", "MyData");
      if (fileName) {
        this.exportToExcel(this.exportRegister, fileName);
      } else {
        alert("Tên file không được để trống!");
      }
    },
    exportToExcel(data, fileName) {
        // 1. Chuyển dữ liệu JSON thành worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // 2. Tạo workbook và thêm worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        
        // 3. Xuất file Excel
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    },
    async initializeData() {
      try {
        await this.fetchParticipants();
        if (this.participants.length > 0) {
          this.detailProduct = {
            name: this.participants[0].productname,
            images: this.participants[0].imagepath,
            price: this.participants[0].currentprice,
            close: this.participants[0].enddate,
            quanlity: this.participants[0].quantity,
            expected: this.participants[0].estimatearrive,
            brand: this.participants[0].brandname,
            describe: this.participants[0].description,
            type: this.participants[0].categoryname,
            groupbyid: this.participants[0].groupbyid,
          };
          console.log('so luong sau khi close:',this.detailProduct.quanlity);
        }
        
        this.idGroupby = this.participants[0].groupbyid;

        await this.fetchRegister(); 

        if (this.orderIdRegister != null){
          await this.fetchDetailRegister();
        }
        else{
          console.log('khong goi');
          this.detaiRegister=[],
          this.allProductRegiser=[]
        } 
  
      } catch (error) {
        console.error("Error in mounted:", error);
      }
    },

    fetchParticipants() {
      return new Promise((resolve, reject) => {
        const url = `/admin/detail-participants/api?page=${this.page}&perPage=${this.perPage}&orderby=${this.sort}`;
        console.log('url participants: ',url);
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.participants = data.allProductGroupBy;
            console.log('participants:',this.participants);
            this.totalPages = data.totalPages;
            resolve(data); 
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
            reject(error); 
          });
      });
    },
    

    fetchRegister() {
      return new Promise((resolve, reject) => {
        const url = `/admin/detail-participants/api/register?page=${this.pageRegister}&perPage=${this.perPageRegister}&id=${this.idGroupby}`;
        console.log(url);
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              return reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.register = data.allRegister;
            this.totalPagesRegister = data.totalPages;
    
            if (this.register.length >= 1) {
              this.orderIdRegister = this.register[0].orderid;
            } else {
              this.orderIdRegister = null;
              console.log("register does not have enough elements.");
            }
            console.log("orderIdRegister:", this.orderIdRegister);
    
            resolve(data); 
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
            reject(error); // Reject Promise nếu có lỗi
          });
      });
    },

    fetchAllRegister() {
      return new Promise((resolve, reject) => {
        fetch(`/admin/detail-participants/api/exportRegister?page=${this.pageRegister}&perPage=${this.perPageRegister}&id=${this.idGroupby}`)
          .then((response) => {
            if (!response.ok) {
              return reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.exportRegister = data.export;
            console.log(this.exportRegister);

            resolve(data); // Resolve Promise với dữ liệu nhận được
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
            reject(error); // Reject Promise nếu có lỗi
          });
      });
    },
    

    fetchDetailRegister(orderid, index) {
      let orderID = orderid || this.orderIdRegister;

      this.selectedIndexRegister = index ||0;
      return new Promise((resolve, reject) => {
       const  url = `/admin/detail-participants/api/detailRegister?groupbyID=${this.idGroupby}&id=${orderID}`;
       console.log(url);
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              return reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.detaiRegister = data.allRegister;
            this.allProductRegiser = data.allProduct;
            resolve(data); 
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
            reject(error); 
          });
      });
    },
    

  
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.initializeData();
        this.selectedIndex = 0;
      }
    },
    async changePageRegister(newPage) {
      if (newPage >= 1 && newPage <= this.totalPagesRegister) {
        this.pageRegister = newPage;

        if(this.searchQuery != ''){
          await this.search();
          this.selectedIndexRegister = 0;
        }
        else{

          await this.fetchRegister();
          this.selectedIndexRegister = 0;
  
          if (this.orderIdRegister != null){
            await this.fetchDetailRegister();
          }
          else{
            console.log('khong goi');
            this.detaiRegister=[],
            this.allProductRegiser=[]
          } 

        }
      }
    },
  
   async detailProductGroupBy(item,index) {
        this.searchQuery = '';
        this.pageRegister =1;
        this.pageRegister = 1;

        this.detailProduct.images=item.imagepath;
        this.detailProduct.name=item.productname;
        this.detailProduct.price=item.currentprice;
        this.detailProduct.close=item.enddate;
        this.detailProduct.quanlity=item.quantity;
        this.detailProduct.expected=item.estimatearrive;
        this.detailProduct.brand=item.brandname;
        this.detailProduct.describe=item.description;
        this.detailProduct.type=item.categoryname;
        this.idGroupby = item.groupbyid;

        this.selectedIndex = index;

        await this.fetchRegister();

        if (this.orderIdRegister != null){
          await this.fetchDetailRegister();

        }
        else{
          console.log('khong goi');
          this.detaiRegister=[],
          this.allProductRegiser=[]
        } 
    },
  },
 
});
