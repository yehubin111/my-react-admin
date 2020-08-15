// export default {
//     // common
//     login: '/backUser/login', // 登录
//     upload: 'http://up.qiniu.com/', // 七牛上传
//     qiniutoken: '/common/getQiniuToken', // 获取七牛token
//     // base基础数据
//     basetopic: '/topic/idNameList', // 专题下拉列表
//     basebrand: '/brand/idNameList', // 品牌下拉列表
//     baseseason: '/season/getList', // 品牌下拉列表
//     baserule: '/rules/idNameList', // 采购规则列表
//     // 商品中心
//     spulist: '/spu/getList', // 商品管理列表
//     batchexport: '/spu/export', // 批量导出
//     productaudit: '/spu/goodsAudit', // 商品下架
//     productstand: '/spu/goodsStandOrDown', // 商品上架
//     // 用户管理
//     userlist: '/user/getList', // 用户管理列表
//     invitecodelist: '/inviteCode/getList', // 邀请码管理列表
//     changeinvitecode: '/inviteCode/update', // 新建/编辑/禁用/启用邀请码
//     // 运营管理
//     bannerlist: '/column/getList', // banner管理列表
//     bannersort: '/column/saveSort', // banner管理排序
//     bannerstatus: '/column/update', // 新增/编辑/上下架banner
    
// }

export default {
    // common
    login: '/backUser/login', // 登录
    upload: 'http://up.qiniu.com/', // 七牛上传
    qiniutoken: '/common/getQiniuToken', // 获取七牛token
    // base基础数据
    basetopic: '/topic/idNameList', // 专题下拉列表
    brandIdNameList: '/brand/idNameList', // 品牌下拉列表
    originGetList: '/origin/getList', // 产地下拉
    seasonGetList: '/season/getList', // 季节下拉列表
    baserule: '/rules/idNameList', // 采购规则列表
    categoryIdNameList: '/category/idNameList', // 类目下拉列表
    storageGetList: '/storage/getList', // 仓库下拉列表
    rulesIdNameList: '/rules/idNameList', // 采购规则下拉
    // 商品中心
    spulist: '/spu/getList', // 商品管理列表
    batchexport: '/spu/export', // 批量导出
    productaudit: '/spu/goodsAudit', // 商品下架
    productstand: '/spu/goodsStandOrDown', // 商品上架
    catelist: '/category/getList', // 类目列表
    spuGetDetial: '/spu/getDetial', // 编辑获取商品详情
    spuUpdate: '/spu/update', // 编辑商品
    // 用户管理
    userGetList: '/user/getList', // 用户管理列表
    invitecodelist: '/inviteCode/getList', // 邀请码管理列表
    changeinvitecode: '/inviteCode/update', // 新建/编辑/禁用/启用邀请码
    // 运营管理
    bannerlist: '/column/getList', // banner管理列表
    bannersort: '/column/saveSort', // banner管理排序
    bannerstatus: '/column/update', // 新增/编辑/上下架banner
    systemlist: '/config/getList', // 运营配置列表
    topiclist: '/topic/getList', // 专题库列表
    topicspulist: '/topicSpu/getList', // 专题库商品列表
    topicsort: '/topicSpu/saveSort', // 专题库商品保存排序
    topicdel: '/topic/removeSpu', // 专题库商品保存删除
    // 采购单管理
    orderlist: '/order/list', // 采购单列表
    // 权限管理
    backUserList: 'backUser/list', // 人员管理列表
    
}