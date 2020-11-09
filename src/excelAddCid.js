const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const fs = require('fs-extra');
const path = require('path');

class excelAddCid {
    constructor(excleUrl, inputUrl, outputUrl,name,startId) {
        this.excleUrl = excleUrl;
        this.inputUrl = inputUrl;
        this.outputUrl = outputUrl;
        this.name = name;
        this.startId = startId || 0;
        this.filePathList = [];
    }

    init() {
        try {
            var excel = xlsx.parse(`${this.excleUrl}`)[1].data;

            var fileList = this.getFilePathList(this.inputUrl);
            var reg =new RegExp('Structure2D_CID_' + this.startId + '.mol2') 
            var start = fileList.findIndex(e => reg.test(e))

            var successData = [
                [ 'CID', 'ID',	'Name',	'Total_Score,','Crash,','Polar','Similarity','D_score','PMF_score','G_score','ChemScore','CSCORE' ]
            ]

            fs.ensureDirSync(this.outputUrl);
            if(Array.isArray(excel)) {
                excel[0].unshift('CID')
                for (let i = 1; i < excel.length; i++) {
                    let id = fileList[start + i -1 ].match(/Structure2D_CID_(\S*).mol2/)[1] || ''

                    excel[i].unshift(id)

                    if(id) {
                        infolog.info('id与数据对应成功',id)
                    }else {
                        errlog.error('id '+id+' 与数据 '+ excel[i][2]+' 对应失败')
                    }
                }
            }

            infolog.info('init done!')
            let newData = [
                { name: '对应处理数据', data: excel },
            ]
            this.writeExcel(newData)
        } catch (error) {
            errlog.error('init出错：', error)
        }

    }

    getFilePathList(dir) {
        let files = fs.readdirSync(dir);
        files.sort(function (a, b) {
            return fs.statSync(path.join(dir, a)).mtime.getTime() - fs.statSync(path.join(dir, b)).mtime.getTime();
        });

        return files;
    }

    writeExcel(newData){
        let file = path.join(this.outputUrl,this.name + '对应处理数据.xlsx') 

        fs.writeFile(file, xlsx.build(newData), function (err) {
            if (err) {
                errlog.error("Write " + '对应处理数据' + " failed: " + err);
                return;
            }

            infolog.info("Write " + '对应处理数据' + " completed.");
        });

    }

}

module.exports = excelAddCid;