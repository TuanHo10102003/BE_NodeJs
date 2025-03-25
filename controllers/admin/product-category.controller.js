const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");

const searchHelper = require("../../helpers/search");

const paginationHelper = require("../../helpers/pagination");
//[GET] /admin/products-category

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  //filterStatus
  const filterStatus = filterStatusHelper(req.query);

  if (req.query.status) {
    find.status = req.query.status;
  }
  //search
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // Pageination

  const count = await ProductCategory.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      limitItem: 5,
      currentPage: 1,
    },
    req.query,
    count
  );

  //Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] =
      req.query.sortValue.toLowerCase() === "asc" ? 1 : -1;
  } else {
    sort.position = -1; // Mặc định sắp xếp giảm dần
  }

  const records = await ProductCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[GET] /admin/products-category/create

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  function createTree(arr, parentId = "") {
    const tree = [];
  
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }
  
  const records = await ProductCategory.find(find);

  const newRecords = createTree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    records: newRecords,
  });
};

//[POST] /admin/products-category/create

module.exports.createPost = async (req, res) => {
  try {
    // Nếu position không tồn tại hoặc không phải số, gán giá trị mặc định
    if (!req.body.position || isNaN(parseInt(req.body.position))) {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1; // Gán giá trị mặc định
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error("Lỗi khi tạo danh mục sản phẩm:", error);
    res.status(500).send("Có lỗi xảy ra, vui lòng thử lại!");
  }
};


//[PATCH] /admin/products-category/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật thành công");
  res.redirect(`back`);
};

//[PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "active" }
      );
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
      break;

    case "inactive":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" }
      );
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
      break;
    case "delete-all":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);

      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, { position: position });
      }
      break;
    default:
      break;
  }

  res.redirect("back");
};

//[DELETE] /admin/products-category/delete/:id

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true },
    { deletedAt: new Date() }
  );

  req.flash("success", "Xóa thành công");

  res.redirect("back");
};


//[GET] /admin/products-category/edit/:id

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const records = await ProductCategory.findOne(find);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Cập nhật sản phẩm",
      records: records,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

//[PATCH] /admin/products-category/edit/:id

module.exports.editPatch = async (req, res) => {
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    await ProductCategory.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cập nhật thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }
  res.redirect(`back`);
};

//[GET] /admin/products-category/detail/:id

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const records = await ProductCategory.findOne(find);

    res.render("admin/pages/products-category/detail", {
      pageTitle: records.title,
      records: records,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
