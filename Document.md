
先升级create-react-app

create-react-app额外配置
暴露配置：npm run eject

配置proxy

"proxy":{
	"/api":{
		"target":"",
		"changeOrigin":true
	}
}

配置css预处理less/sass

yarn add less-loader -D
yarn add sass-loader node-sass -D

加入
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
文件中搜索 oneof，在sass后面接着加上

{
  test: lessRegex,
  exclude: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    },
    'less-loader'
  ),
  // Don't consider CSS imports dead code even if the
  // containing package claims to have no side effects.
  // Remove this when webpack adds a warning or an error for this.
  // See https://github.com/webpack/webpack/issues/6571
  sideEffects: true,
},
// Adds support for CSS Modules, but using SASS
// using the extension .module.scss or .module.sass
{
  test: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    },
    'less-loader'
  ),
},

配置热更新
(最新版本貌似已经自带了，不用配置)
yarn add react-hot-loader -D

webpack.config.dev.js中
entry:[
	'react-hot-loader/patch'
]

babel-loader中添加plugins
plugins:[
	'react-hot-loader/babel'
]

入口文件index.js中

import { AppContainer } from 'react-hot-loader'
const render = Component=>{
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('root')
	)
}

render(App)

if(module.hot){
	module.hot.accept('./App',()=>{
	render(App)
})
}

配置antd
yarn add antd -S
yarn add babel-plugin-import -D

在.babelrc或者babel-loader的options中

{
	"plugins:[
		["import",{"libraryName":"antd","libraryDirectory":"es","style":true}]
	]
}


在less-loader的options中，必須用less3.0以下的版本
{
	test: /\.css|less$/,
	use: [
		require.resolve('style-loader'),
		{
			loader: require.resolve('css-loader'),
			options: {
				importLoaders: 2
			},
		},
		{
			loader: require.resolve('postcss-loader'),
			options: {
				// Necessary for external CSS imports to work
				// https://github.com/facebookincubator/create-react-app/issues/2677
				ident: 'postcss',
				plugins: () => [
					require('postcss-flexbugs-fixes'),
					autoprefixer({
						browsers: [
							'>1%',
							'last 4 versions',
							'Firefox ESR',
							'not ie < 9', // React doesn't support IE8 anyway
						],
						flexbox: 'no-2009',
					}),
				],
			},
		},{
			loader: 'less-loader',
			options: {
				javascriptEnabled: true,
				modifyVars: {
					"@primary-color": "#01D39F" ,
						// "@link-color": "#1890ff",                            // 链接色
						// "@success-color": "#52c41a",                         // 成功色
						// "@warning-color": "#faad14",                         // 警告色
						// "@error-color": "#f5222d",                           // 错误色
						// "@font-size-base": "14px",                           // 主字号
						// "@heading-color": "rgba(0, 0, 0, .85)",              // 标题色
						 "@text-color": "rgba(255, 255, 255, 1)",                // 主文本色
						 "@text-color-secondary" : "rgba(1, 211, 159, 1)",       // 次文本色
						// "@disabled-color" : "rgba(0, 0, 0, .25)",            // 失效色
						// "@border-radius-base": "4px",                        // 组件/浮层圆角
						// "@border-color-base": "#d9d9d9",                     // 边框色
						// "@box-shadow-base": "0 2px 8px rgba(0, 0, 0, .15)"  // 浮层阴影
						//"@modal-mask-bg":"rgba(0,0,0,0.24)"                  //遮罩
						"@table-selected-row-bg":"rgba(1,211,159,0.4)",        //表格选中背景色
						 "@table-row-hover-bg":"rgba(1,211,159,0.48)",            //表格hover背景色
						 "@menu-bg":"#0f153a",                                   //导航飘出部分颜色
						 "@input-bg":"rgba(0,0,0,0.24)",                         //输入框背景颜色
						 "@input-color":"#fff",                                  //输入框文字颜色
						 "@input-border-color":"rgba(1,211,159,0.56)",           //输入框边框颜色
						 "@btn-default-color":"rgba(51, 51, 51, 0.8)",           //取消&删除按钮字体色
						 "@tabs-card-head-background":"rgba(0,0,0,0.2)",        //tabs待选bar颜色
						 "@popover-bg":"rgba(21,35,84,0.88)",                    //气泡背景颜色
						 "@label-color ":"#01D39F"                              //标签字体颜色（基本设置）
				}
			},
		}
	],
},


配置字体图标
yarn add react-icon  
https://react-icons.netlify.com/

<Font name="rocket" />

配置滚动条
yarn add react-custom-scrollbars -S

import Scrollbars from 'react-custom-scrollbars'
<Scrollbars style={{"width":"100%","height":"300px"}}>
	<div></div>
</Scrollbars>


antd图标离线访问（antd默认为阿里CDN读取图标字体）
//貌似新版本已经解决这个问题
cnpm install antd-iconfont -S
找到文件node_modules/antd/es/style/core/iconfont.less
加入 @icon-url: "../../../../antd-iconfont/iconfont";



配置emotion


/** @jsx jsx */
import { jsx, css, Global, ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
