
new Vue({
    el: '#footer',
    data: {
        darkMode: false,
        newsletterEmail: ''
    },
    methods: {
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            $('html').attr('data-bs-theme', this.darkMode ? 'dark' : 'light');
        },

        subscribeNewsletter() {
            axios.post('/subscribe-news-letter/api', { email: this.newsletterEmail })
                    .then(response => {
                        alert(response.data.message);
                    })
                    .catch(error => {
                        alert('Subscription failed. Please try again.');
                    });
        },
    }
});

new Vue({
    el: '#header',
    data: {
        searchQuery: ''
    },
    methods: {
        search() {
            if (this.searchQuery === '') {
                alert('Please enter a search query.');
                return;
            }
            const encodedQuery = encodeURIComponent(this.searchQuery);
            window.location.href = `/search?search=${encodedQuery}`;
        },
    }
});