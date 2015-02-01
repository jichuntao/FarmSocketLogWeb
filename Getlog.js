/**
 * Created with JetBrains WebStorm.
 * User: jichuntao
 * Date: 13-9-13
 * Time: 下午3:53
 * To change this template use File | Settings | File Templates.
 */
var ndir = require('ndir');
var fs = require('fs');
var query = require("querystring");

//var dir = './xxx/2015_1_30/farm-tw';
var dir = '/mnt/farmSocketLog/';
var i = 0;
var debug_args = arguments[0];
var files ;

var users=[];
var user;
function exe(req, res, rf, data) {
    console.log(data);
    var qu = query.parse(data);
    datedir = qu['date'];
    langdir = qu['lang'];
    dir =  '/mnt/farmSocketLog/'+datedir+'/farm-'+langdir;
    files = fs.readdirSync(dir+'/');
    files = ignoreArr(files);
    user=null;
    users=[];
    i=0;
    start(function(){
        var ret={};
        var jj=0;
        ret.allNum=users.length;
        ret.errorNum=0;
        ret.loginNum=0;
        ret.closeNum=0;
        var outTimeArr=[];
        var inTimeArr=[];
        var outPrecentArr=[];
        for(jj=0;jj<users.length;jj++)
        {

            var u=users[jj];

            var loadingTime=Math.round(u.loadingTime/1000);
            if(u.status=='error'){
                ret.errorNum++;
                if(!outPrecentArr[u.percent]){
                    outPrecentArr[u.percent]=0;
                }
                outPrecentArr[u.percent]++;
            }
            else if(u.status=='login'){
                ret.loginNum++;
                if(!inTimeArr[loadingTime]){
                    inTimeArr[loadingTime]=0;
                }
                inTimeArr[loadingTime]++;
            }
            else if(u.status=='close'){
                ret.closeNum++;
                if(!outTimeArr[loadingTime]){
                    outTimeArr[loadingTime]=0;
                }
                outTimeArr[loadingTime]++;
                if(!outPrecentArr[u.percent]){
                    outPrecentArr[u.percent]=0;
                }
                outPrecentArr[u.percent]++;
            }else{
                if(u.percent==100){
                    ret.loginNum++;
                    if(!inTimeArr[loadingTime]){
                        inTimeArr[loadingTime]=0;
                    }
                    inTimeArr[loadingTime]++;
                }else {
                    ret.closeNum++;
                    if(!outTimeArr[loadingTime]){
                        outTimeArr[loadingTime]=0;
                    }
                    outTimeArr[loadingTime]++;
                    if(!outPrecentArr[u.percent]){
                        outPrecentArr[u.percent]=0;
                    }
                    outPrecentArr[u.percent]++;
                }
            }
        }

        
        res.write('<p> 总的统计人数: '+ret.allNum+'</p>');
        res.write('<p> 成功进入人数: '+ret.loginNum+'</p>');
        res.write('<p> 离开人数: '+ret.closeNum+'</p>');
        res.write('<p> 加载报错人数: '+ret.errorNum+'</p>');
        res.write('<p> 未进入人数比例: '+(ret.errorNum+ret.closeNum)+'/'+ret.allNum+'&nbsp;&nbsp;&nbsp;&nbsp;('+Math.round(((ret.errorNum+ret.closeNum)/ret.allNum)*10000)/100+'%)</p>');
        res.write('</br>');
        var sum=0;
        for(jj=0;jj<outTimeArr.length;jj++){
            if(outTimeArr[jj]){
                sum+=outTimeArr[jj];
            }
            //var sp='&nbsp;&nbsp;&nbsp;&nbsp;('+Math.round((sum/outTimeArr.length)*100)+'%)';
            if(jj==5){
                 res.write('<p> 5秒离开人数: '+sum+'</p>');
            }else if(jj==10){
                 res.write('<p> 10秒离开人数: '+sum+'</p>');
            }else if(jj==15){
                 res.write('<p> 15秒离开人数: '+sum+'</p>');
            }else if(jj==20){
                 res.write('<p> 20秒离开人数: '+sum+'</p>');
            }else if(jj==30){
                 res.write('<p> 30秒离开人数: '+sum+'</p>');
            }else if(jj==40){
                 res.write('<p> 40秒离开人数: '+sum+'</p>');
            }else if(jj==60){
                 res.write('<p> 60秒离开人数: '+sum+'</p>');
            }else if(jj==80){
                 res.write('<p> 80秒离开人数: '+sum+'</p>');
            }else if(jj==(outTimeArr.length-1)){
                 res.write('<p> 80秒以上离开人数: '+sum+'</p>');
            }
        }
        res.write('</br>');
        sum=0;
        for(jj=0;jj<outPrecentArr.length;jj++){
            if(outPrecentArr[jj]){
                sum+=outPrecentArr[jj];
            }
            if(jj==10){
                 res.write('<p> 加载到10%离开人数: '+sum+'</p>');
            }else if(jj==20){
                 res.write('<p> 加载到20%离开人数: '+sum+'</p>');
            }else if(jj==50){
                 res.write('<p> 加载到50%离开人数: '+sum+'</p>');
            }else if(jj==80){
                 res.write('<p> 加载到80%离开人数: '+sum+'</p>');
            }else if(jj==90){
                 res.write('<p> 加载到90%离开人数: '+sum+'</p>');
            }else if(jj==(outPrecentArr.length-1)){
                 res.write('<p> 加载到90%以上离开人数: '+sum+'</p>');
            }
        }
        res.write('</br>');
        sum=0;
        for(jj=0;jj<inTimeArr.length;jj++){
            if(inTimeArr[jj]){
                sum+=inTimeArr[jj];
            }
            if(jj==5){
                 res.write('<p> 5秒内进入人数: '+sum+'</p>');
            }else if(jj==10){
                 res.write('<p> 10秒内进入人数: '+sum+'</p>');
            }else if(jj==15){
                 res.write('<p> 15秒内进入人数: '+sum+'</p>');
            }else if(jj==20){
                 res.write('<p> 20秒内进入人数: '+sum+'</p>');
            }else if(jj==30){
                 res.write('<p> 30秒内进入人数: '+sum+'</p>');
            }else if(jj==40){
                 res.write('<p> 40秒内进入人数: '+sum+'</p>');
            }else if(jj==60){
                 res.write('<p> 60秒内进入人数: '+sum+'</p>');
            }else if(jj==80){
                 res.write('<p> 80秒内进入人数: '+sum+'</p>');
            }else if(jj==100){
                 res.write('<p> 100秒内进入人数: '+sum+'</p>');
            }else if(jj==120){
                 res.write('<p> 120秒内进入人数: '+sum+'</p>');
            }else if(jj==180){
                 res.write('<p> 180秒内进入人数: '+sum+'</p>');
            }else if(jj==(inTimeArr.length-1)){
                 res.write('<p> 180秒以上进入人数: '+sum+'</p>');
            }
        }
        res.end();
    });
   
}




//开始执行
function start(cb) {
    var path = dir +'/'+ files[i] ;
    i++;
    user={};
    //console.log("Start read:" + path);
    openfile(path,callback);
    function callback(){
        if(user && user.uid){
           users.push(user);
        }
        if (i == files.length){
            cb();
            return;
        }
        path = dir +'/'+ files[i] ;
        i++;
        user={};
        //console.log("Start read:" + path);
        openfile(path,callback);
    }
}

function exec(strs) {
    try {
        strs = strs.replace(/\'/g, '"');
        var data = strs.substr(strs.indexOf('{'));
        var key = strs.substring(0, strs.indexOf('{') - 1);
        var obj = JSON.parse(data);
        var logtime = key.split('-')[0];
        var action = obj.action;
        if(action == 'login'){
            user.uid=obj.uid;
        }
        else if(action=='loading')
        {
            if(!user.percent){
                user.percent=obj.percent;
                user.loadingTime=obj.time;
            }
            if(obj.percent>user.percent){
                user.percent=obj.percent;
                user.loadingTime=obj.time;
            }
        }
        else if(action=='logout')
        {
            user.loadingTime=obj.time;
            user.status='login';
        }
        else if(action=='load_error')
        {
            user.loadingTime=obj.time;
            user.status='error';
        }
        else if(action=='close' && user.status!='error')
        {
            user.loadingTime=obj.time;
            user.status='close';
        }
    }
    catch (err) {
        console.log(err + " # " + strs);
    }
}


//开始打开文件
function openfile(filename,cb) {
    var file = ndir.createLineReader(filename);
    file.on('line', function (line) {
        exec(line.toString());
    });
    file.on('end', function () {
       // console.log('over:' + filename);
        cb();
    });
    file.on('error', function (err) {
        console.log('fileErr:' + err);
        //cb();
    });
}

//过滤数组
function ignoreArr(arr) {
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '.DS_Store') {
            continue;
        }
        ret.push(arr[i]);
    }
    return ret;
}
exports.exe=exe;