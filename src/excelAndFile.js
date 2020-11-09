const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const fs = require('fs-extra');
const path = require('path');

class excelAndFile {
    constructor(excleUrl, inputUrl, outputUrl) {
        this.excleUrl = excleUrl;
        this.inputUrl = inputUrl;
        this.outputUrl = outputUrl;
        this.filePathList = [];
    }

    init() {
        try {
            var excel = xlsx.parse(`${this.excleUrl}`)[0].data;
            var successData = [
                [ 'NAME', 'CID' ]
            ]
            var errorData = [
                [  'NAME','CID' ]
            ]


            fs.ensureDirSync(this.outputUrl);

            Array.isArray(excel) && excel.map((item, index) => {
                if (index > 0) {
                    let id = String(item[1]).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''),
                        input = path.join(this.inputUrl, 'Structure2D_CID_' + id + '.mol2'),
                        output = path.join(this.outputUrl, 'Structure2D_CID_' + id + '.mol2')

                    // input = this.filePath(this.inputUrl, 'Structure2D_CID_' + id + '.mol2')
                    // console.log(input, 'input');

                    if (fs.existsSync(input)) {
                        fs.copySync(input, output)
                        infolog.info('copy file to ' + 'Structure2D_CID_' + id + '.mol2' + ' success;')
                        successData.push(item)
                    } else {
                        errlog.error('文件不存在：', ' Structure2D_CID_' + id + '.mol2')
                        errorData.push(item)
                    }
                }
            })
            infolog.info('init done!')
            let newData = [
                { name: '归类成功',data:successData },
                { name: '归类失败',data:errorData },
            ]
            this.writeExcel(newData)
        } catch (error) {
            errlog.error('init出错：', error)
        }

    }

    filePath(path, it) {
        let dirList = fs.readdirSync(path);
        for (let i = 0; i < dirList.length; i++) {
            let item = dirList[i];
            if (fs.statSync(path + '/' + item).isDirectory()) {
                if (item == it) {
                    return path + '/' + item;
                } else {
                    let j = this.filePath(path + '/' + item, it);
                    if (j) {
                        return j;
                    } else {
                        continue;
                    }
                }
            } else if (fs.statSync(path + '/' + item).isFile()) {
                if (item == it) {
                    return path + '/' + item;
                }
            }
        }
        return false;
    }

    getFilePathList(pathDir){
        let p = fs.readdirSync(pathDir);

        p.forEach(ele => {
            let currentPath = path.join(pathDir,ele)
            let item = fs.statSync(currentPath)	
            if(item.isDirectory()){
                this.getFilePathList(currentPath);
            }else{
                this.filePathList.push(currentPath)
            }	
        })
    }


    writeExcel(newData){
        let file = path.join(this.outputUrl,'黄酮化合物归类第四次.xlsx') 

        fs.writeFile(file, xlsx.build(newData), function (err) {
            if (err) {
                errlog.error("Write " + '黄酮化合物归类第四次' + " failed: " + err);
                return;
            }

            infolog.info("Write " + '黄酮化合物归类第四次' + " completed.");
        });

    }


}

module.exports = excelAndFile;