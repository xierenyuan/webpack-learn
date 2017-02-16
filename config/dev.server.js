import webpack from 'webpack';
import ora from 'ora';
// https://github.com/shelljs/shelljs
import 'shelljs/global';
import webpackConfig from './webpack.config';
import Config from './config';
let spinner = ora('dev 服务开始启动...')
spinner.start();

let assetsPath = Config.dev.dist;
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');
});