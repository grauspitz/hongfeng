var isSubmit = false;
var hgx_port = fortest?'8896':'8893';
var nextgxname = '';
window.socket = io.connect('https://www.kenta.cn:8892');
socket.on('connect', function (response) {
	console.log('ws已连接')
});
var socket2 = io.connect('https://www.kenta.cn:'+hgx_port);

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
    $('input[name="所选标签号_input"]').keydown(function (e) {
        var allFields = $('.ui.form.first').form('get values');
        var 标签号 = allFields.所选标签号_input;
        if (e.keyCode == 13) {
            if($('input[name="所选标签号"]').val()=='') {                                           
                var selected = _.find(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: 标签号}]}});
                if(selected==undefined) {
                    alert('标签不存在');
                    $('input[name="所选标签号_input"]').val('');
                    $('input[name="所选标签号_input"]').focus()
                }else {
                    if(selected.moStatus.status == 'stop') {
                        alert('所选标签订单已暂停\n暂停原因:'
                        +selected.moStatus.remarks+'\n责任人:'
                        +selected.moStatus.user.real_name+'('+selected.moStatus.user.workno+')\n暂停时间:'
                        +selected.moStatus.actionTime);
                        $('input[name="标签号"]').val('');
                        $('input[name="标签号"]').focus();
                    }
                    var actionData = selected.领料单号.标签状态[标签号];
                    var maxcount = actionData.生产计数[0].总计数;
                    var nextgxno = maxcount==0?actionData.生产计数[0].工序代号:'QC';
                    if(maxcount==0) {
                        nextgxno = actionData.生产计数[0].工序代号;
                    }else {
                        var lastaction = selected.小标签流信息[标签号][selected.小标签流信息[标签号].length-1];   
                        if(lastaction.detailType!='QC') {
                            nextgxno = 'QC'
                        }else {
                            if(lastaction.检测结果 == 'NG') {
                                nextgxno = actionData.生产计数[0].工序代号;
                            }else {
                                nextgxno = '包装';
                            }
                        }
                    }                    
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
                    if(nextgxno=='包装') {
                        nextgxname = '包装'
                    }
                    console.log('nextgxname',nextgxname);
                    $('input[name="下道工序"]').val(nextgxname+'——'+nextgxno)     
                    var tmp = allFields.所选标签号==""?[]:allFields.所选标签号.split(',');
                    var currentvalue = _.map(tmp,function(n){
                        return {
                            name:n,
                            value:n,
                            selected:true
                        }
                    });
                    
                    currentvalue.push({
                        name:标签号,
                        value:标签号,
                        selected:true
                    });  
                    console.log('currentvalue',currentvalue);                                                                  
                    var op = '<div class="item" data-value="'+标签号+'">'+标签号+'</div>';
                    $('.menu.所选标签号').append(op);
                    $('#所选标签号').dropdown({values:currentvalue});      
                    $('input[name="所选标签号_input"]').val('');
                    $('input[name="所选标签号_input"]').focus()                                                                                         
                }
            }else {
                var selected = _.filter(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: 标签号}]}})[0];                
                if(selected==undefined) {
                    alert('标签不存在');
                    $('input[name="所选标签号_input"]').val('');
                    $('input[name="所选标签号_input"]').focus()
                    return false;
                }else {
                    var actionData = selected.领料单号.标签状态[标签号];
                    var maxcount = actionData.生产计数[0].总计数;
                    var nextgxno = maxcount==0?actionData.生产计数[0].工序代号:'QC';
                    if(maxcount==0) {
                        nextgxno = actionData.生产计数[0].工序代号;
                    }else {
                        var lastaction = selected.小标签流信息[标签号][selected.小标签流信息[标签号].length-1];   
                        if(lastaction.detailType!='QC') {
                            nextgxno = 'QC'
                        }else {
                            if(lastaction.检测结果 == 'NG') {
                                nextgxno = actionData.生产计数[0].工序代号;
                            }else {
                                nextgxno = '包装';
                            }
                        }
                    }
                    var mynextgxname;
                    _.forEach(actionData.生产计数,function(n){
                        if(n.总计数 < maxcount) {
                            nextgxno = n.工序代号;
                            return false;
                        }
                    });

                    _.forEach(deskToGX,function(n){
                        if(n.制程代号 == nextgxno) {
                            mynextgxname = n.制程名称;
                            return false;
                        }
                    })
                    if(nextgxno=='QC') {
                        mynextgxname = '检验'
                    }
                    if(nextgxno=='包装') {
                        mynextgxname = '包装'
                    }
                    console.log('mynextgxname',mynextgxname);
                    if(mynextgxname != nextgxname) {
                        alert(标签号+'下道工序非'+nextgxname);
                        $('input[name="所选标签号_input"]').val('');
                        $('input[name="所选标签号_input"]').focus()
                        return false;
                    }   
                    var tmp = allFields.所选标签号==""?[]:allFields.所选标签号.split(',');
                    var currentvalue = _.map(tmp,function(n){
                        return {
                            name:n,
                            value:n,
                            selected:true
                        }
                    });
                    
                    currentvalue.push({
                        name:标签号,
                        value:标签号,
                        selected:true
                    });                                                                    
                    var op = '<div class="item" data-value="'+标签号+'">'+标签号+'</div>';
                    $('.menu.所选标签号').append(op);
                    $('#所选标签号').dropdown({values:currentvalue});  
                    $('input[name="所选标签号_input"]').val('');
                    $('input[name="所选标签号_input"]').focus()                                                                                           
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
        $.get("https://www.kenta.cn:"+hgx_port+"/type=callfunction?dataname=QuerySkip", function(response) {},'json');           
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
function intervarCheck() {
    setTimeout(function(){
        if(isSubmit) {        
            var allFields = $('.ui.form.first').form('get values'); 
            alert(allFields.下道工序.split('——')[0]+'已跳过');
            $('input[name="标签号"]').val('');
            $('input[name="标签号"]').focus();
            $('input[name="下道工序"]').val('');
            $('#myloader').removeClass('active');  
            $.get('https://www.kenta.cn:8893/type=getdata?dataname=后工序总MO列表',function(n){
                后工序总MO列表 = n; 
            },'json');                  
            isSubmit = false;
        }
    },3000)
}

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
    if(allFields.下道工序.split('——')[1]=='包装') {
        alert('下道工序为包装,不可跳!');        
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
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fortest:fortest
    };        
    socket.emit('collecteddata', post);   
    intervarCheck()  
}