const Product = require("../../models/product.model")

const filterStatusHelper = require("../../helpers/filterStatus")

const searchHelper = require("../../helpers/search")

const paginationHelper = require("../../helpers/pagination")
//[GET] /admin/products
module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    }

    //filterStatus
    const filterStatus = filterStatusHelper(req.query);

    if(req.query.status){
        find.status = req.query.status;
    }
    //search
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex){
        find.title = objectSearch.regex
    }
    // Pageination

    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
    {
        limitItem: 5,
        currentPage: 1
    },
    req.query,
    countProducts
)
    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};