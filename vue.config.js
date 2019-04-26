// // const PrerenderSPAPlugin = require('prerender-spa-plugin');
// // const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// // const path = require('path');

// module.exports = {
//     devServer: {
//         disableHostCheck: true,
//         proxy: {
//             '/frontend-api': {                        // 自訂 local 端的位置
//                 target: 'https://frontend-api.devel.starlordtech.com/',  // 遠端 URL Domain
//                 changeOrigin: true,
//                 pathRewrite: {
//                     '^/frontend-api': ''
//                 }
//             }
//         }
//     },
//     css: {
//         loaderOptions: {
//             // 给 sass-loader 传递选项
//             sass: {
//                 // @/ 是 src/ 的别名
//                 // 所以这里假设你有 `src/variables.scss` 这个文件

//                 data:
//                     `@import "@/assets/css/base/_reset.scss";
// 				    @import "@/assets/css/layout/_layout.scss";
// 				    @import "@/assets/css/components/_components.scss";`

//             }
//         }
//     },
//     chainWebpack: config => {
//         config.module.rule('pug')
//             .test(/\.pug$/)
//             .use('pug-html-loader')
//             .loader('pug-html-loader')
//             .end()
//     }
//     // configureWebpack: () => {
//     //     if (process.env.NODE_ENV !== 'production') return;
//     //     return {
//     //         plugins: [
//     //             new PrerenderSPAPlugin({
//     //                 // 生成文件的路径，也可以与webpakc打包的一致。
//     //                 // 下面这句话非常重要！！！
//     //                 // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
//     //                 staticDir: path.join(__dirname, 'dist'),

//     //                 // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
//     //                 routes: ['/'],

//     //                 // 这个很重要，如果没有配置这段，也不会进行预编译
//     //                 renderer: new Renderer({
//     //                     inject: {
//     //                         foo: 'bar'
//     //                     },
//     //                     // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
//     //                     renderAfterDocumentEvent: 'render-event',
//     //                     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     //                 })
//     //             })
//     //         ]
//     //     };
//     // }
// }
