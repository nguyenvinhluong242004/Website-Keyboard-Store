
class orderItemController{

    order(req,res){
        res.render('Admin/order',{
            layout:'layoutAdmin',
            title:'Order',
            customHead:`<link rel="stylesheet" href="/Admin/order/style.css"`
        });
    }
}

module.exports = new orderItemController;