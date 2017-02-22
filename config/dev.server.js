import webpack from 'webpack';
import ora from 'ora';
// https://github.com/shelljs/shelljs
import 'shelljs/global';
import express from 'express';
import opn from 'opn';
import webpackConfig from './webpack.config';
import Config from './config';
import path from 'path';


let spinner = ora('dev 服务开始启动...')
spinner.start();

const app = express();
// 重点
app.use(require('connect-history-api-fallback')());



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

app.use('/', express.static(path.join(__dirname, '../.dist')));

const port = process.env.PORT || Config.dev.port;

export default app.listen(port, err => {
    if (err) {
        console.log(err)
        return
    }
    let uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
    opn(uri)
});