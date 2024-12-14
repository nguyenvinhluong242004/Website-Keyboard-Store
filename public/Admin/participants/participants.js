new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data() {
    return {
      idGroupby:1,
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
    async initializeData() {
      try {
        await this.fetchParticipants(); // Đợi fetchParticipants hoàn tất
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
        
        // Chờ fetchRegister hoàn tất trước khi tiếp tục
        await this.fetchRegister(); 
  
        // Nếu cần, có thể gọi fetchDetailRegister sau fetchRegister
        await this.fetchDetailRegister();
  
      } catch (error) {
        console.error("Error in mounted:", error);
      }
    },

    fetchParticipants() {
      return new Promise((resolve, reject) => {
        fetch(`/admin/d/api?page=${this.page}&perPage=${this.perPage}`)
          .then((response) => {
            if (!response.ok) {
              reject("Failed to fetch data");
            }
            return response.json();
          })
          .then((data) => {
            this.participants = data.allProductGroupBy;
            this.totalPages = data.totalPages;
            resolve(data); // Resolve với dữ liệu nhận được
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
            reject(error); // Reject nếu có lỗi
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
              console.log("register does not have enough elements.");
            }
            console.log("orderIdRegister:", this.orderIdRegister);
    
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
      console.log(this.orderIdRegister);
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
            resolve(data); // Resolve Promise với dữ liệu nhận được
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
            reject(error); // Reject Promise nếu có lỗi
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
  
    detailProductGroupBy(item,index) {
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

        this.fetchRegister();
    
    },
  },
});
