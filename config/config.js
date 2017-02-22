import path from 'path';
import fs from 'fs';
export default {
    dev: {
        //生成的目录
        dist: path.join(__dirname, '../.dist/'),
        subPublic: 'static',
        port: 8000
    },
    /**
     * 
     * 传入指定路径获取 指定路径下的 文件列表 
     * @param {any} fileSrc 文件路径
     * @param {any} rule 指定规则 如 js or  html
     * @returns 返回获取的  文件列表
     */
    getFilePath(fileSrc = __dirname, rule = 'js') {
        let paths = {};
        fs.readdirSync(fileSrc)
            .filter(file => (file.indexOf('.') != 0) && (file.split('.').slice(-1)[0] === rule))
            .forEach(file => {
                paths[file] = path.join(fileSrc, file);
            });
        return paths;
    }

};