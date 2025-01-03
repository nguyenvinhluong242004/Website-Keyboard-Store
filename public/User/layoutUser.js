new Vue({
  el: "#footer",
  delimiters: ["[[", "]]"],
  data: {
    darkMode: false,
    newsletterEmail: "",
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      $("html").attr("data-bs-theme", this.darkMode ? "dark" : "light");
    },

    subscribeNewsletter() {
      if (!this.validateEmail()) {
        return;
      }
      axios
        .post("/subscribe-news-letter/api", { email: this.newsletterEmail })
        .then((response) => {
          alert(response.data.message);
        })
        .catch((error) => {
          alert("Subscription failed. Please try again.");
        });
    },

    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.newsletterEmail)) {
        alert("Please enter a valid email address.");
        return false;
      } else if (!this.newsletterEmail.endsWith(".com")) {
        alert("Email must end with .com");
        return false;
      } else {
        return true;
      }
    },
  },
});

new Vue({
  el: "#header",
  delimiters: ["[[", "]]"],
  data: {
    searchQuery: "",
    categorys:[],
  },
  mounted(){
    this.fetchCategory();
  },
  methods: {
    search() {
      if (this.searchQuery === "") {
        alert("Please enter a search query.");
        return;
      }
      const encodedQuery = encodeURIComponent(this.searchQuery);
      window.location.href = `/search?search=${encodedQuery}`;
    },
    fetchCategory() {
      const url = "/api/category";
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
            if(data.success){
                this.categorys = data.data;
                console.log(this.categorys);
            }else{
                console.log('Dont get data category success');
            }
         
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    },
  },
});
