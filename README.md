This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


# React-Admin后台管理系统开发文档

### 技术选型
* 基础框架：react
* 脚手架：create-react-app (cra)
* 路由：react-router
* 状态管理：react-redux
* 网络请求：axios
* css预处理：sass scss
* 组件库：antd
* ui风格参考：[ant-pro](https://preview.pro.ant.design/) 


### 开发规范
###### 一、主要目录结构
1. public
* 主要存放无需编译的js文件、favicon等静态文件资源
2. src
* actions 存放redux actions操作
* assets 存放项目图片、css等一些静态资源
* components 全局通用组件
* constants redux动作命名规范
* layouts 结构布局相关组件
* pages 页面
* reducers redux状态处理存放
* router 路由配置、一级路由生成
* service 网络请求api封装
* utils 工具类js
* defaultConfig.js 项目基本配置文件
* index.js 入口文件
* setupProxy.js 配置网络请求域名代理

二、命名规范
1.函数方法
a)驼峰命名方式
b)动作+语义化的动作对象
场景	动作关键字	说明	举例
页面	get	获取数据	getBannerList 获取banner管理列表数据
	change	改变状态（多用于页面内弹框的显示隐藏操作）	changeAddStatus 改变新增动作弹框状态
	set	设置数据	setSortData 设置筛选数据
	to	其他操作（edit，create，delete）页面操作相关方法	toEditBanner 去编辑banner
redux	request	网络请求api（service文件夹下，封装网络请求api专用）	requestBannerList 
requestBannerListStatus
	save	保存数据（actions文件夹下，存储数据到reducers专用）	saveUserList 保存用户列表
组件	on	传递给组件的方法映射（建议不要超过2个单词）	onChange/onSubmit
	handle	传递给组件的回调函数	handleChange/handleSubmit
2.变量
a)驼峰命名方式
b)不要与功能方法、组件回调方法命名规则冲突
3.常量
a)全大写，下划线分割 比如PROCESS_ENV
4. 组件
a)首字母大写的驼峰命名方式 比如 BannerTable
5. 类
a)首字母大写的驼峰命名方式 比如 class Axios { }


全局组件




