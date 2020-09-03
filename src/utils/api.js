export default {
    // common
    backUserLogin: '/backUser/login', // 登录
    upload: 'http://up.qiniu.com/', // 七牛上传
    commonGetQiniuToken: '/common/getQiniuToken', // 获取七牛token
    // base基础数据
    topicIdNameList: '/topic/idNameList', // 专题下拉列表
    brandIdNameList: '/brand/idNameList', // 品牌下拉列表
    originGetList: '/origin/getList', // 产地下拉
    seasonGetList: '/season/getList', // 季节下拉列表
    categoryIdNameList: '/category/idNameList', // 类目下拉列表
    storageGetList: '/storage/getList', // 仓库下拉列表
    rulesIdNameList: '/rules/idNameList', // 采购规则下拉
    // 商品中心
    spuGetList: '/spu/getList', // 商品管理列表
    categoryGetList: '/category/getList', // 类目列表
    spuGetDetial: '/spu/getDetial', // 编辑获取商品详情
    spuUpdate: '/spu/update', // 编辑商品
    spuExport: '/spu/export', // 商品中心批量导出
    spuAddToTopic: '/spu/addToTopic', // 商品中心批量加入专题
    spuGoodsAudit: '/spu/goodsAudit', // 商品中心批量审核上架
    spuGoodsStandOrDown: '/spu/goodsStandOrDown', // 商品中心批量下架
    spuSetRules: '/spu/setRules', // 商品中心批量设置采购规则
    categoryUpdate: '/category/update', // 新增/编辑类目
    rulesGetList: '/rules/getList', // 采购规则配置列表
    rulesUpdate: '/rules/update', // 新增/编辑/删除采购规则
    brandGetList: '/brand/getList', // 品牌管理列表
    brandUpdate: '/brand/update', // 新增/编辑品牌
    // 用户管理
    userGetList: '/user/getList', // 用户管理列表
    inviteCodeGetList: '/inviteCode/getList', // 邀请码管理列表
    inviteCodeUpdate: '/inviteCode/update', // 新建/编辑/禁用/启用邀请码
    // 运营管理
    columnGetList: '/column/getList', // banner管理列表
    columnSaveSort: '/column/saveSort', // banner管理排序
    columnUpdate: '/column/update', // 新增/编辑/上下架banner
    configGetList: '/config/getList', // 运营配置列表
    topicGetList: '/topic/getList', // 专题库列表
    topicSpuGetList: '/topicSpu/getList', // 专题库商品列表
    topicSpuSaveSort: '/topicSpu/saveSort', // 专题库商品保存排序
    topicRemoveSpu: '/topic/removeSpu', // 专题库商品保存删除
    // 采购单管理
    orderList: '/order/list', // 采购单列表
    orderAddressUpdate: '/order/address/update', // 收货人详情编辑
    orderSetPaid: '/order/setPaid', // 确认付款
    orderCancel: '/order/cancel', // 订单取消
    orderLogisticsList: '/order/logistics/list', // 订单物流信息
    // 权限管理
    backUserList: 'backUser/list', // 人员管理列表
    backUserAddOrUpdate: '/backUser/addOrUpdate', // 新增/编辑用户
    backRoleList: '/backRole/list', // 角色列表
    backMenuList: '/backMenu/list', // 权限菜单列表
    backRoleAddOrUpdate: '/backRole/addOrUpdate', // 新增/编辑角色
    
}