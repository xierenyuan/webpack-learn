import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import OccurrenceOrderPlugin from 'webpack/lib/optimize/OccurrenceOrderPlugin';
import NoEmitOnErrorsPlugin from 'webpack/lib/NoEmitOnErrorsPlugin';
import Config from './config';

let wepackConfig = {
    entry: {},
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue'
        }
    },
    watch: true,
    plugins: [
        new OccurrenceOrderPlugin(),
        new NoEmitOnErrorsPlugin()
    ]
};

//输出
wepackConfig.output = {
    path: Config.dev.dist,
    filename: path.join(Config.dev.subPublic, 'js/[name].bundle.js')
};

//loader 配置
let loaders = [{
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader'
}];

wepackConfig.module = {
    loaders: loaders
};

//多页面的情况下 获取 examples 下的多个页面维度进行配置
let viewPageFile = path.join(__dirname, '../examples');
let viewpages = Config.getFilePath(viewPageFile, 'html');

const NodeModules = path.join(__dirname, '../node_modules');

// 提取通用模块  参考 vue-cli
wepackConfig.plugins.push(new CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module, count) => {
        return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(NodeModules) === 0
        )
    }
}));
wepackConfig.plugins.push(new CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['vendor']
}));

//插件
Object.keys(viewpages).forEach(key => {
    ///  根据examples 的html 文件 来决定有几个入口
    let name = key.split('.')[0];
    //入口 模块 因为 入口的在 src 下 所以 此处写
    wepackConfig.entry[name] = [`./src/${name}.js`];

    //html 配置
    let htmlPlugin = new HtmlWebpackPlugin({
        filename: key,
        template: viewpages[key],
        inject: true,
        chunks: ['vendor', 'manifest', name]
    });

    wepackConfig.plugins.push(htmlPlugin);

});

export default wepackConfig;