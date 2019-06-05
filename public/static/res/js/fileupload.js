// console.log(1111);
// $(document).ready(function() {
//     console.log(2222);
//     $('#file').fileinput({
//         language:'zh',
//         // theme: 'fa',
//         // theme: 'explorer-fa',
//         uploadUrl: "uploader",
//         // enableResumableUpload: true,
//         textEncoding : "UTF-8",//文本编码
//         // previewFileIcon: "<i class='glyphicon glyphicon-file'></i>",
//         layoutTemplates:{
//             actionUpload: '',       //取消预览图中上传按钮
//         },
//         // reversePreviewOrder: true,
//         // initialPreviewAsData: true,
//         // overwriteInitial: false,
//         // showPreview: false,
//         allowedPreviewTypes: ['image'], // 仅允许预览图像和文本文件
//         previewFileIconSettings: {  //每个文件扩展名（类型）的预览图标标记设置
//             'doc': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-DOCtubiao"></use></svg>',
//             'xls': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-XSLtubiao"></use></svg>',
//             'ppt': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-PPTtubiao"></use></svg>',
//             'jpg': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-JPGtubiao"></use></svg>',
//             'png': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-PNGtubiao"></use></svg>',
//             'gif': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-GIFtubiao"></use></svg>',
//             'pdf': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-PDFtubiao"></use></svg>',
//             'zip': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-ZIPtubiao"></use></svg>',
//             'rar': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-RARtubiao"></use></svg>',
//             '7z': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-Ztubiao"></use></svg>',
//             'mp4': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-MPtubiao"></use></svg>',
//             'mp3': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-MPtubiao1"></use></svg>',
//             'html': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-HTMLtubiao"></use></svg>',
//             'txt': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-TXTtubiao"></use></svg>',
//             'exe': '<svg class="icon" aria-hidden="true" style="width: 40%;height: 40%;"><use xlink:href="#icon-EXEtubiao"></use></svg>',
//         },
//     });
//     $("#file").on('fileuploaded', function(event, data, previewId, index) {//异步上传成功结果处理
//         console.log('上传成功返回函数！')
//         var form = data.form, files = data.files, extra = data.extra,
//             response = data.response, reader = data.reader;
//         console.log(form);
//         console.log(files);
//         console.log(extra);
//         console.log(response);
//         console.log(reader);
//         console.log('---------------上传成功返回函数！结束-----------------')
//     });
//
//     // $("#filefloder").fileinput({
//     //     language:'zh',
//     //     uploadUrl: "uploader",
//     //     browseLabel: '选择文件夹',
//     //     // previewFileIcon: '<i class="fas fa-file"></i>',
//     //     c: null, // set to empty, null or false to disable preview for all types
//     //     // previewFileIconSettings: {
//     //     //     'doc': '<i class="fas fa-file-word text-primary"></i>',
//     //     //     'xls': '<i class="fas fa-file-excel text-success"></i>',
//     //     //     'ppt': '<i class="fas fa-file-powerpoint text-danger"></i>',
//     //     //     'jpg': '<i class="fas fa-file-image text-warning"></i>',
//     //     //     'pdf': '<i class="fas fa-file-pdf text-danger"></i>',
//     //     //     'zip': '<i class="fas fa-file-archive text-muted"></i>',
//     //     //     'htm': '<i class="fas fa-file-code text-info"></i>',
//     //     //     'txt': '<i class="fas fa-file-alt text-info"></i>',
//     //     //     'mov': '<i class="fas fa-file-video text-warning"></i>',
//     //     //     'mp3': '<i class="fas fa-file-audio text-warning"></i>',
//     //     // },
//     //     // previewFileExtSettings: {
//     //     //     'doc': function(ext) {
//     //     //         return ext.match(/(doc|docx)$/i);
//     //     //     },
//     //     //     'xls': function(ext) {
//     //     //         return ext.match(/(xls|xlsx)$/i);
//     //     //     },
//     //     //     'ppt': function(ext) {
//     //     //         return ext.match(/(ppt|pptx)$/i);
//     //     //     },
//     //     //     'jpg': function(ext) {
//     //     //         return ext.match(/(jp?g|png|gif|bmp)$/i);
//     //     //     },
//     //     //     'zip': function(ext) {
//     //     //         return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
//     //     //     },
//     //     //     'htm': function(ext) {
//     //     //         return ext.match(/(php|js|css|htm|html)$/i);
//     //     //     },
//     //     //     'txt': function(ext) {
//     //     //         return ext.match(/(txt|ini|md)$/i);
//     //     //     },
//     //     //     'mov': function(ext) {
//     //     //         return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
//     //     //     },
//     //     //     'mp3': function(ext) {
//     //     //         return ext.match(/(mp3|wav)$/i);
//     //     //     },
//     //     // }
//     // });
// });