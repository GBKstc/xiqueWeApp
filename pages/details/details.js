var util = require('../../utils/util');
var carousel = require("../../component/carousel/carousel");
let pageObj = {
  data: {

  }
};
util.mergeComponents(pageObj, carousel);

Page(pageObj);