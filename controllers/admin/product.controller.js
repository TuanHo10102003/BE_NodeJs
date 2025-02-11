const Product = require("../../models/product.model")

//[GET] /admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    if(req.query.status){
        const index = filterStatus.findIndex(item => item.status == req.query.status)
        filterStatus[index].class = "active"
    } else{
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class = "active"
    }

    let find = {
        deleted: false,
    }
    
    if(req.query.status){
        find.status = req.query.status;
    }
    
    let keyword = ""

    if(req.query.keyword){
        keyword = req.query.keyword

        const regex = new RegExp(keyword, "i");
        find.title = regex
    }

    // Pageination

   let objectPagination = {
    limitItem: 5,
    currentPage: 1
   }

   if(req.query.page){
    objectPagination.currentPage = parseInt(req.query.page)
   }

   objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

   const countProducts = await Product.countDocuments(find);

   const totalPage = Math.ceil(countProducts/objectPagination.limitItem);

   objectPagination.totalPage = totalPage;

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: objectPagination
    });
};