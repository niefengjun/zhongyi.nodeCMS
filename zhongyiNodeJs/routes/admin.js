var express = require('express');
var url = require('url');
var router = express.Router();


var siteConfig = require('../public/config/zy_Config');
var adminFunc = require('../models/zy_AdminFunc');
var SystemRoleGroup = require('../models/zy_SystemRoleGroup');
var SystemUser = require('../models/zy_SystemUser');
var InfoModel= require('../models/zy_Info');
var KindModel= require('../models/zy_Kind');
var DBHelper = require('../models/zyDBHelper/zy_Dbopt');

//管理主页面
router.get('/', function (req, res) {
    res.render('manager/index_v7');
});

//后台欢迎页面
router.get('/manager', function (req, res) {
    res.render('manager/welcome', adminFunc.setPageInfo(req, res, 'xxx'));
});


//聚合页
// router.get('/manager/managerUser', function (req, res) {
//     res.render('manager/managerUser');
// });

//用户管理
router.get('/manager/managerUser', function (req, res) {
    res.render('manager/managerUser');
});

//添加用户
router.get('/manager/SystemUserAdd', function (req, res) {
    res.render('manager/addSystemUser')
});

//编辑用户
router.get('/manager/SystemUser/:id', function (req, res) {
    res.render('manager/addSystemUser')
});


//用户组管理
router.get('/manager/managerUserGroup', function (req, res) {
    res.render('manager/managerUserGroup');
});

//添加用户组
router.get('/manager/SystemRoleAdd', function (req, res) {
    res.render('manager/addSystemRole');
});
//编辑用户组
router.get('/manager/SystemRole/:defaultParam', function (req, res) {
    //传入附带信息
    adminFunc.renderPageWithCondition(req, res, 'manager/addSystemRole');
});


//提交数据
router.post('/manager/:defaultUrl/add', function (req, res) {
    var targetUrl = req.params.defaultUrl;
    var targetObject = adminFunc.getTargetObjectByUrl(targetUrl);
    if (targetObject == SystemRoleGroup) {
        addSystemGroup(req, res);
    }
    else if (targetObject == SystemUser) {
        addSystemUser(req, res, SystemUser);
    }
});

//修改
router.post('/manager/:defaultUrl/modify', function (req, res) {
    var targetUrl = req.params.defaultUrl;
    var targetObject = adminFunc.getTargetObjectByUrl(targetUrl);
    DBHelper.updateOndeById(targetObject, req, res);
});

//删除
router.get('/manager/:defaultUrl/delete', function (req, res) {
    console.log('-------------111---------------');
    var targetUrl = req.params.defaultUrl;
    var targetId = req.query.id;
    var targetObject = adminFunc.getTargetObjectByUrl(targetUrl);

    DBHelper.deleteOneById(targetObject, req, res);

});
//批量删除
router.get('/manager/:defaultUrl/mutiDelete',function (req,res) {
    var targetObject=adminFunc.getTargetObjectByUrl(req.params.defaultUrl);
    var idsArray=req.query.ids.split(',');
    //todo:目前批量删除针对资讯,其他暂不支持,如有需要,请自行扩展
    if(targetObject==InfoModel)
    {
        targetObject.remove({_id:{$in:idsArray}},function (error) {
            if(error){
                res.end(error);
            }else {
                res.end('success');
            }
        });
    }else
    {
        res.end('目前批量删除针对资讯,其他暂不支持,如有需要,请自行扩展 in admin.js');
    }
});
router.get('/manager/:defaultUrl/item', function (req, res) {

    var currentPage = req.params.defaultUrl;
    var targetObject = adminFunc.getTargetObjectByUrl(currentPage);
    var targetId = req.query.id;
    var params = url.parse(req.url, true);
    var id = params.query.id;






    if (targetObject == SystemRoleGroup) {
        SystemRoleGroup.getOneItem(res, targetId, function (result) {
            return res.json(result);
        });
    }
    else if(targetObject==InfoModel)
    {
        InfoModel.getOneItem(res,targetId,function (result) {
            return res.json(result);
        });
    }
    else {
       return DBHelper.findOne(targetObject, req, res);
    }
});
//添加角色组
function addSystemGroup(req, res, targetObject) {
    DBHelper.insertModel(req, res, targetObject);
}
//添加角色组
function addSystemUser(req, res, targetObject) {
    DBHelper.insertModel(req, res, targetObject);
}
router.get('/manager/getDocumentList/:defaultUrl', function (req, res) {

    var targetObj = adminFunc.getTargetObjectByUrl(req.params.defaultUrl);

    var params = url.parse(req.url, true);
    var searchWords = params.query.searchKey;
    var wheres = [];
    if (searchWords) {
        var regkey = new RegExp(searchWords, 'i');
        if (targetObj == SystemRoleGroup) {
            wheres.push({'name': {$regex: regkey}});
        }
    }

    DBHelper.queryDocumentsByConditions(req, res, targetObj, wheres);
});

//用户管理
router.get('/manager/:targetUrl/add', function (req, res) {
    res.render('manager/' + req.params.targetUrl);
});

//资讯列表
router.get('/cms/infolist',function (req,res) {

    res.render('manager/managerInfo');
});
//分类列表
router.get('/cms/kindlist',function (req,res) {
    console.log('列表首页');
});
//添加分类
router.get('/cms/kind/add',function (req,res) {
    console.log('managerkind/kind/add');
});
//修改分类
router.get('/cms/kind/modify',function (req,res) {
    console.log('managerkind/kind/add');
});
//添加资讯
router.get('/cms/info/add',function (req,res) {
     res.render('manager/addinfo');
});
//修改资讯
router.get('/cms/info/modify/:id',function (req,res) {

    res.render('manager/addinfo');
});
router.get('/cms/info/delete',function (req,res) {
    var targetId=req.query.id;
    DBHelper.deleteOneById(InfoModel,req,res);
});
//提交数据
router.post('/cms/info/add', function (req, res) {

    var _tempInfo=new InfoModel(req.body);

    _tempInfo.save(function (error) {
        if(!error){
            res.end('success');
        }else
            res.end('info insert failed');
    });
});
//修改数据
router.post('/cms/info/modify',function (req,res) {
    DBHelper.updateOndeById(InfoModel,req,res);
});

module.exports = router;