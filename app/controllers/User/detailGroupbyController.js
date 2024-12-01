const controller ={}

// Render Kit Phim
controller.showDetailGroupby = (req, res) => {
    res.render('detail-groupby', {layout: 'layout', title: 'DetailGroupby',
        customHead: `
        <link rel="stylesheet" href="User/DetailGroupBy/detail-groupby.css">
        <script src="User/DetailGroupBy/groupby.js"></script>
        `
     });
};


module.exports = controller;
