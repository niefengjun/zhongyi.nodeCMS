/**
 * 通用函数
 */
$(function () {

    //全局初始化
    $(':checkbox').prop('checked',false);
    $('#targetIds').val('');

    $("#chkSelectAll").change(function () {
        if($(this).prop("checked")){
            $(".datalist input[name='chkItem']").prop("checked",true);
        }else{
            $(".datalist input[name='chkItem']").prop("checked",false);
        }
        getSelectValues();
    });

});

function getSelectValues() {
    var ids=[];
    var chks= $(".datalist input[name='chkItem']:checkbox");
    if(chks.length>0){
        $(chks).each(function (i) {
            if($(this).prop('checked')){
                ids.push($(this).prop('value'));
                console.log('is checked'+$(this).prop('value'));
            }
        });
        $("#targetIds").val(ids.join(','));
    }
}
/*初始化上传图片按钮
 * id 初始化上传按钮
 * type 文件类型
 * key 上传对象是所属 管理员头像、用户头像、文档首图等，后台根据key来进行不同规格的图片压缩
 * */
function initUploadFyBtn(id,type,key,callBack){

    var typedes = 'Image Files';
    var filtertype = '*.gif; *.jpg; *.png';
    var buttonText = '上传图片';
    var uploadApi = '/system/upload';
    var autoUpdate = true;
    var sizeLimit = 1024 * 1024 * 1;
    var adminId = $('#adminId').val();
    var buttonWidth = 100;
    var buttonStyle = 'uploadify-btn-default';
    if(type == 'zip'){
        typedes = 'Zip Files';
        filtertype = '*.zip';
        buttonText = '安装本地模板(*.zip)';
        uploadApi = '/admin/manage/updateCMSTemplate';
        sizeLimit = 1024 * 1024 * 3;
        buttonWidth = 130;
        buttonStyle = 'uploadify-btn-primary';
    }
    $("#"+id).uploadify({
        //指定swf文件
        'swf': '/plugins/uploadify/uploadify.swf',
        //后台处理的页面
        'uploader': uploadApi + '?adminId='+adminId+'&type='+type+'&key='+key,
        //按钮显示的文字
        'buttonText': buttonText,
        'buttonClass' : buttonStyle,
        //显示的高度和宽度，默认 height 30；width 120
        //'height': 15,
        'width': buttonWidth,
        //上传文件的类型  默认为所有文件    'All Files'  ;  '*.*'
        //在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeDesc': typedes,
        //允许上传的文件后缀
        'fileTypeExts': filtertype,
        //发送给后台的其他参数通过formData指定
        //'formData': { 'adminUserId' : adminUserId , 'type': type, 'key': key},
        sizeLimit :sizeLimit,
        //上传文件页面中，你想要用来作为文件队列的元素的id, 默认为false  自动生成,  不带#
        //'queueID': 'fileQueue',
        //选择文件后自动上传
        'auto': autoUpdate,
        //设置为true将允许多文件上传
        'multi': false,
        //上传成功
        'onUploadSuccess' : function(file, data, response) {
            if(data === 'typeError'){
                $.tipsShow({
                    message : "文件类型不正确，请重试！",
                    type : 'warning',
                    callBack : function(){
                        return;
                    }
                });
            }else {
                callBack(data);
            }
        },
        'onComplete': function(event, queueID, fileObj, response, data) {//当单个文件上传完成后触发
            //event:事件对象(the event object)
            //ID:该文件在文件队列中的唯一表示
            //fileObj:选中文件的对象，他包含的属性列表
            //response:服务器端返回的Response文本，我这里返回的是处理过的文件名称
            //data：文件队列详细信息和文件上传的一般数据
            //alert("文件:" + fileObj.name + " 上传成功！");
            alert('ooxx');
        },
        //上传错误
        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        },
        'onError': function(event, queueID, fileObj) {//当单个文件上传出错时触发
            alert("文件:" + fileObj.name + " 上传失败！");
        }
    });
}