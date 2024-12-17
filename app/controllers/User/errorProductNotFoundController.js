const controller ={}

//Render Error Product Not Found
controller.showErrorProductNotFound = (req, res) => {
    const searchQuery = req.query.search;

    res.render('User/errorProductNotFound', {layout: 'layoutUser', title: 'Error Product Not Found',
        customHead: `
        `,
        searchQuery: searchQuery
     });
};

module.exports = controller;