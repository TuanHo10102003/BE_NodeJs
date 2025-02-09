const dashboardRouter = require("./dashboard.route");
const productRouter = require("./product.route");



const systemConfig = require("../../config/system")
module.exports = (app) => {

    app.use(systemConfig.prefixAdmin + '/dashboard', dashboardRouter);
    app.use(systemConfig.prefixAdmin + '/products', productRouter);

}

  