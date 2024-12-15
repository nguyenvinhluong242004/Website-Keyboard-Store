new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data() {
    return {  
      sort:'enddate',
      exportRegister:[],
      idGroupby:null,
      orderIdRegister:null,
      selectedIndex: 0,
      selectedIndexRegister:0,
      shipPrice:30,
      participants: [],
      page: 1, 
      pageRegister: 1, 
      perPage: 3,
      perPageRegister: 3,
      totalPages: 1, 
      totalPagesRegister: 1, 
      totalPagesDetailRegister:1,
      detailProduct: {
        name: "name", 
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
    time(){
      this.sort ='enddate';
      this. initializeData();
      this.selectedIndex = 0;
      this.selectedIndexRegister=0
    },
    type(){
      this.sort ='categoryname';
      this. initializeData();
      this.selectedIndex = 0;
      this.selectedIndexRegister=0
    },
    brand(){
      this.sort ='brandname';
      this. initializeData();
      this.selectedIndex = 0,
      this.selectedIndexRegister=0
    },
    price(){
      this.sort ='currentprice';
      this. initializeData();
      this.selectedIndex = 0;
      this.selectedIndexRegister=0
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
            quanlity: this.participants[0].currentparticipants,
            expected: this.participants[0].estimatearrive,
            brand: this.participants[0].brandname,
            describe: this.participants[0].description,
            type: this.participants[0].categoryname,
            groupbyid: this.participants[0].groupbyid,
          };
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
        fetch(`/admin/d/api?page=${this.page}&perPage=${this.perPage}&orderby=${this.sort}`)
          .then((response) => {
            if (!response.ok) {
              reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.participants = data.allProductGroupBy;
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
        fetch(`/admin/d/api/register?page=${this.pageRegister}&perPage=${this.perPageRegister}&id=${this.idGroupby}`)
          .then((response) => {
            if (!response.ok) {
              return reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.register = data.allRegister;
            this.totalPagesRegister = data.totalPages;
    
            if (this.register.length > 1) {
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
        fetch(`/admin/d/api/exportRegister?page=${this.pageRegister}&perPage=${this.perPageRegister}&id=${this.idGroupby}`)
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
        fetch(`/admin/d/api/detailRegister?page=${this.page}&perPage=${this.perPage}&id=${orderID}`)
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
        this.fetchParticipants();
        this.selectedIndex = null;
      }
    },
    changePageRegister(newPage) {
      if (newPage >= 1 && newPage <= this.totalPagesRegister) {
        this.pageRegister = newPage;
        this.fetchRegister();
        this.selectedIndexRegister = null;
      }
    },
  
   async detailProductGroupBy(item,index) {
        this.detailProduct.images=item.imagepath;
        this.detailProduct.name=item.productname;
        this.detailProduct.price=item.currentprice;
        this.detailProduct.close=item.enddate;
        this.detailProduct.quanlity=item.currentparticipants;
        this.detailProduct.expected=item.estimatearrive;
        this.detailProduct.brand=item.brandname;
        this.detailProduct.describe=item.description;
        this.detailProduct.type=item.categoryname;
        this.idGroupby = item.groupbyid;

        this.selectedIndex = index;

        await this.fetchRegister();

        if (this.orderIdRegister != null){
          await this.fetchDetailRegister();

          this.fetchDetailRegister();
        }
        else{
          console.log('khong goi');
          this.detaiRegister=[],
          this.allProductRegiser=[]
        } 

       
    },
  },
});
