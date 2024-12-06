
class orderItemController{

    order(req,res){
        res.render('Admin/order',{
            layout:'layoutAdmin',
            title:'Order',
            customHead:`<link rel="stylesheet" href="/Admin/order/style.css">
            <script defer type="module" src="/Admin/order/order.js"></script>
            `
        });
    }
}

module.exports = new orderItemController;