class homeController {
    home(req, res) {
        try {
            res.render("home", {
                layout: 'layout', title: 'Home',
                customHead: `
                <link rel="stylesheet" href="User/home.css">
                <script defer type="module" src="User/Home/home.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
                `
            });
        } catch (error) {
            console.error("Error rendering home page:", error);
        }
    }
};

module.exports = new homeController;