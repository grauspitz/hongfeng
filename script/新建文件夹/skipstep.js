var isSubmit = false;
window.socket = io.connect('https://www.kenta.cn:8892');
socket.on('connect', function (response) {
	console.log('ws已连接')
});
var socket2 = io.connect('https://www.kenta.cn:8893');

socket.on('postidReturn', function (response) {      
    global_json = response;
    var html = response.formhtml.slice(0,-6)+'<div classname="field"><p>'+response.other+'</p></div><div class="fluid ui submit button" onclick="FormSubmit()">提交</div><div class="ui error message"></div></div>';         
    $('#formtitle').html(response.title);
    $('#formdescription').html(response.description);
    $('#display').html(html);
    $('.ui.dropdown').dropdown();
    $('.ui.form.first').form({            
        fields:global_json.fields
    });   
    
    //标签号 enter 事件
    $('input[name="标签号"]').keydown(function (e) {
        var allFields = $('.ui.form.first').form('get values');
        var 标签号 = allFields.标签号;
        if (e.keyCode == 13) {
            if($('input[name="标签号"]').val()!='') {                                           
                var selected = _.filter(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: allFields.标签号}]}})[0];                
                if(selected==undefined) {
                    alert('标签不存在');
                    return false;
                }else {
                    var actionData = selected.领料单号.标签状态[标签号];                    
                    var QCOK = _.filter(actionData.QC记录,{检测结果:'OK'||'NG'});                            
                    var maxcount = actionData.生产计数[0].总计数;
                    var nextgxno = maxcount==0?actionData.生产计数[0].工序代号:'QC';
                    var nextgxname;
                    _.forEach(actionData.生产计数,function(n){
                        if(n.总计数 < maxcount) {
                            nextgxno = n.工序代号;
                            return false;
                        }
                    });

                    _.forEach(deskToGX,function(n){
                        if(n.制程代号 == nextgxno) {
                            nextgxname = n.制程名称;
                            return false;
                        }
                    })
                    if(nextgxno=='QC') {
                        nextgxname = '检验'
                    }
                    console.log('nextgxname',nextgxname);
                    $('input[name="下道工序"]').val(nextgxname+'——'+nextgxno)                                                                                                  
                }
            }
        }
    });
    socket2.emit('storeClientInfo', ['后工序总MO列表','桌子对应关系']);
});
socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {        
        $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QuerySkip", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);   
    if(msg.桌子对应关系 != undefined) {        
        deskToGX = msg.桌子对应关系;           
    }   
    if(msg.后工序总MO列表 != undefined) {        
        后工序总MO列表 = msg.后工序总MO列表;
        if(isSubmit) {
            var allFields = $('.ui.form.first').form('get values'); 
            alert(allFields.下道工序.split('——')[0]+'已跳过');
            $('input[name="标签号"]').val('');
            $('input[name="标签号"]').focus();
            $('input[name="下道工序"]').val('');
            $('#myloader').removeClass('active');                    
            isSubmit = false;
        }        
    }
});

//万一卡socket返回 就自动去掉loading
setInterval(function(){
    if(isSubmit) {        
        isSubmit = false;
        alert('提交成功！');
        $('#myloader').removeClass('active');
    }
},10000);

function RenderForm(id) {
    currentUser.loginrequired = true;
    var allowed = ['jiaming.liu','ricky.ngai','xiaoyu.ye'];
    currentUser.loginrequired = true;  
    if(currentUser.loginrequired == true && currentUser.user_name == '') {        
        $('#formwindow').attr('class','ui segment none');
        $('#login').attr('class','ui form');
    }else { 
        if(currentUser.loginrequired == true) {
            console.log(currentUser)
            // if(allowed.indexOf(currentUser.user_name)==-1) {
            //     alert('您没有权限访问此页!');
            //     return false;
            // }   
        }       
        $('#formwindow').attr('class','ui segment');
        $('#login').attr('class','none');
        socket.emit('postid', id);
    }    
}

function FormSubmit() {
    var allrequired = $('.ui.form.first').form('is valid');     
    if(allrequired==false) {                  
      return false;
    }     
    var allFields = $('.ui.form.first').form('get values');         
    if(allFields.下道工序.split('——')[1]=='QC') {
        alert('下道工序为QC,不可跳!');        
        return false;
    }

    isSubmit = true;
    $('#myloader').addClass('ui active inverted dimmer');
    var obj = {        
        标签号:allFields.标签号,
        工序代号:allFields.下道工序.split('——')[1],
        工序名称:allFields.下道工序.split('——')[0],
        操作时间:moment().format('YYYY-MM-DD HH:mm:ss')
    }
    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d284ffdbe727d23b4ec6666',
        collectedData: obj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };    
    console.log('post',post)    
    socket.emit('collecteddata', post);     
}