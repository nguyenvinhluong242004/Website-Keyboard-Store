new Vue({
  el: "#app",
  delimiters: ['[[', ']]'],
  data() {
    return {
      participants: [],
      page: 1, 
      perPage: 3,
      totalPages: 1, 
      totalPagesRegister: 1, 
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
      totalPagesDetailRegister:0,
    };
  },
  mounted() {
    this.fetchParticipants();
  },
  methods: {

    fetchParticipants() {
      fetch(`/admin/d/api?page=${this.page}&perPage=${this.perPage}`) 
        .then((response) => response.json())
        .then((data) => {
          this.participants = data.allProductGroupBy;
          this.totalPages = data.totalPages;
        })
        .catch((error) => {
          console.error("Error fetching participants:", error);
        });
    },

    fetchRegister(idGroupby) {
      fetch(`/admin/d/api/register?page=${this.page}&perPage=${this.perPage}&id=${idGroupby}`)
        .then((response) => response.json())
        .then((data) => {
          this.register = data.allRegister;
          this.totalPagesRegister = data.totalPages;
        })
        .catch((error) => {
          console.error("Error fetching participants:", error);
        });
    },

    fetchDetailRegister(orderid) {
        console.log(orderid);
        fetch(`/admin/d/api/detailRegister?page=${this.page}&perPage=${this.perPage}&id=${orderid}`) 
        .then((response) => response.json())
        .then((data) => {
          this.detaiRegister = data.allRegister;
          this. allProductRegiser = data.allProduct;
        })
        .catch((error) => {
          console.error("Error fetching participants:", error);
        });
    },

    // Hàm thay đổi trang
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchParticipants();
      }
    },
    //view detail product group by
    detailProductGroupBy(item) {
        this.detailProduct.images=item.imagepath;
        this.detailProduct.name=item.productname;
        this.detailProduct.price=item.currentprice;
        this.detailProduct.close=item.enddate;
        this.detailProduct.quanlity=item.currentparticipants;
        this.detailProduct.min=item.minparticipants;
        this.detailProduct.expected=item.estimatearrive;
        this.detailProduct.brand=item.brandname;
        this.detailProduct.describe=item.description;
        this.detailProduct.type=item.categoryname;

        this.fetchRegister(item.groupbyid);
    
    },
  },
});
