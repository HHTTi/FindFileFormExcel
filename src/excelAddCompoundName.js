const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const fs = require('fs-extra');
const path = require('path');

class excelAddCompoundName {
    constructor(excleUrl, inputUrl, outputUrl,name) {
        this.excleUrl = excleUrl;
        this.inputUrl = inputUrl;
        this.outputUrl = outputUrl;
        this.name = name;
        this.filePathList = [];
    }

    init() {
        try {
            var excel = xlsx.parse(`${this.excleUrl}`)[0].data;
            var inputExcel = xlsx.parse(`${this.inputUrl}`)[0].data;


            var successData = [
                [ 'CID', 'ID',	'Name',	'Total_Score,','Crash,','Polar','Similarity','D_score','PMF_score','G_score','ChemScore','CSCORE' ]
            ]

            fs.ensureDirSync(this.outputUrl);

            if(Array.isArray(excel)) {
                excel[0].unshift('CompoundName')

                for (let i = 1; i < excel.length; i++) {
                    let cid = excel[i][0]
                    let compound = inputExcel.find(e => e[1].toString() === cid.toString() )

                    if(compound) {
                        excel[i].unshift(compound[0])
                        infolog.info('id与数据对应成功',cid)
                    }else {
                        excel[i].unshift('')
                        errlog.error('id '+ cid  +' 对应失败')
                    }
                }
            }

            infolog.info('init done!')
            let newData = [
                { name: '数据结果', data: excel },
            ]
            this.writeExcel(newData)
        } catch (error) {
            errlog.error('init出错：', error)
        }

    }

    writeExcel(newData){
        let file = path.join(this.outputUrl,this.name + '数据结果.xlsx') 

        fs.writeFile(file, xlsx.build(newData), function (err) {
            if (err) {
                errlog.error("Write " + '数据结果' + " failed: " + err);
                return;
            }

            infolog.info("Write " + '数据结果' + " completed.");
        });

    }

}

module.exports = excelAddCompoundName;