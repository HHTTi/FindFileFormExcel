const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');

class excelAndDownloadFile {
    constructor(excleUrl, outputUrl) {
        this.excleUrl = excleUrl;
        this.outputUrl = outputUrl;
        this.fileLength = 0;
        this.successData = [
            ['NAME', 'CID']
        ]
        this.errorData = [
            ['NAME', 'CID']
        ]
    }

    init() {
        try {
            var excel = xlsx.parse(`${this.excleUrl}`)[1].data;
            this.fileLength = excel.length;


            fs.ensureDirSync(this.outputUrl);

            Array.isArray(excel) && excel.map((item, index) => {
                if (index > 0) {
                    let filename = `Structure2D_CID_${item[1]}`
                    let url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${item[1]}/record/SDF/?record_type=2d&response_type=save&response_basename=Structure2D_CID_${item[1]}`;
                    setTimeout(() => {
                        this.downloadFile(url, filename, item, index)
                    }, index * 3)
                }
            })

        } catch (error) {
            errlog.error('init出错：', error)
        }

    }
    callback(item, index) {
        this.successData.push(item)
        infolog.info("下载成功 " + item[0] + " .");
        if (index === this.fileLength) {
            let data = [{ name: '下载成功', data: this.successData }]
            this.writeExcel(data)
        }
    }

    downloadFile(url, filename, item, index) {
        var _this = this;
        let filePath = path.join(this.outputUrl, filename)
        // var stream = fs.createWriteStream(filePath);
        // request(url).pipe(stream).on('close', () => _this.callback.call(_this, item, index));

        let fileStream = fs.createWriteStream(filePath, { autoClose: true })
        request(url).pipe(fileStream);
        fileStream.on('finish', function () {
            _this.successData.push(item)
            infolog.info("下载成功 " + item[1]);
            if (index === _this.fileLength) {
                let data = [{ name: '下载成功', data: _this.successData }]
                _this.writeExcel(data)
            }
        })
    }


    writeExcel(newData) {
        let file = path.join(this.outputUrl, '化合物下载11_25.xlsx')

        fs.writeFile(file, xlsx.build(newData), function (err) {
            if (err) {
                errlog.error("Write " + '化合物下载11_25' + " failed: " + err);
                return;
            }

            infolog.info("Write " + '化合物下载11_25' + " completed.");
        });

    }


}

module.exports = excelAndDownloadFile;