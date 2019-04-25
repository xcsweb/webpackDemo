const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin =require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
const OptimizeCssAssetsPlugin =require("optimize-css-assets-webpack-plugin");
const webpack = require('webpack');
module.exports = {
  entry: {
    main: './src/index.js' // 需要打包的文件入口
  },
  output: {
    publicPath: "./", // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 打包后生产的 js 文件
    chunkFilename: '[name].js'
  },
  mode: 'development', // 开发模式
  devtool: 'source-map', // 开启调试
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8002, // 本地服务器端口号
    hot: true, // 热重载
    overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
    proxy: {
      // 跨域代理转发
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ from: /.*/, to: '/index.html' }]
    },
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 3000,
  //     maxSize: 0,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     automaticNameDelimiter: '~',
  //     name: true,
  //     cacheGroups: {
  //       lodash: {
  //         name: 'loadsh',
  //         test: /[\\/]node_modules[\\/]_lodash@4.17.11@lodash[\\/]/,
  //         priority: 10  // 优先级要大于 vendors 不然会被打包进 vendors
  //       },
  //       commons: {
  //         name: 'commons',
  //         minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
  //         minChunks: 2, // 最小公用次数
  //         priority: 5, // 优先级
  //         reuseExistingChunk: true // 公共模块必开启
  //       },
  //       vendors: {
  //         name: 'vendors',
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // },
  module: {
    rules: [
      // {
      //   test: /\.js$/, // 使用正则来匹配 js 文件
      //   exclude: /nodes_modules/, // 排除依赖包文件夹
      //   use: {
      //     loader: 'babel-loader' // 使用 babel-loader
      //   }
      // },
      // {
      //   test: /\.js/,
      //   use: [{
      //       loader: 'babel-loader', 
      //       options: {//如果有这个设置则不用再添加.babelrc文件进行配置
      //           "babelrc": false,// 不采用.babelrc的配置
      //           "plugins": [
      //               "dynamic-import-webpack"
      //           ]
      //       }
      //   }]
      // },
      // {
      //   test: /\.css$/, // 针对 .css 后缀的文件设置 loader
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader
      //     },
      //     'css-loader'
      //   ]
      // },
      // {
      //   test: /\.css$/, // 针对 .css 后缀的文件设置 loader
      //   use: ['style-loader', 'css-loader'] // 使用 loader
      // },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader', // 使用 sass-loader 将 scss 转为 css
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          }
        ]
       }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      // chunks: ['main'] // entry中的 app 入口才会被打包
    }),
    new webpack.HotModuleReplacementPlugin(), // 热部署模块
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    }),
  
  ],
}