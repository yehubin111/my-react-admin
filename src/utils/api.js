export default {
    // common
    login: '/backUser/login', // 登录
    upload: 'http://up.qiniu.com/', // 七牛上传
    qiniutoken: '/common/getQiniuToken', // 获取七牛token
    // base基础数据
    basetopic: '/topic/idNameList', // 专题下拉列表
    basebrand: '/brand/idNameList', // 品牌下拉列表
    baseseason: '/season/getList', // 品牌下拉列表
    baserule: '/rules/idNameList', // 采购规则列表
    // 商品中心
    spulist: '/spu/getList', // 商品管理列表
    batchexport: '/spu/export', // 批量导出
    // 用户管理
    userlist: '/user/getList', // 用户管理列表
    invitecodelist: '/inviteCode/getList', // 邀请码管理列表
    changeinvitecode: '/inviteCode/update', // 新建/编辑/禁用/启用邀请码
    // 运营管理
    bannerlist: '/column/getList', // banner管理列表
    bannersort: '/column/saveSort', // banner管理排序
    bannerstatus: '/column/update', // 新增/编辑/上下架banner
    
}