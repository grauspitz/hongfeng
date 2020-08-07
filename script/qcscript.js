//QC
var isSubmit = false;
var hgx_port = fortest?'8896':'8911';
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
    $('.ui.radio.checkbox').checkbox();
    $('.ui.form.first').form({            
        fields:global_json.fields
    });           
    $('input[name="标签号"]').focus(); 
    
    //标签号 enter 事件
    $('input[name="标签号"]').keydown(function (e) {
        if (e.keyCode == 13) {
            if($('input[name="标签号"]').val()!='') {
                $('#QCArea').html('');
                $('.ui.radio.checkbox').checkbox('set unchecked');
                $('input[name="hgxname"]').val('');
                $('.menu.hgxname').html('');
                $('.ui.selection.dropdown .text').addClass('default');
                $('.ui.selection.dropdown .text').html('返工工序');                    
                var tag = $('input[name="标签号"]').val();
                var result = _.find(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: tag}]}});            
                                
                if(result==undefined) {
                    alert('标签号有误，请检查！');
                    $('input[name="标签号"]').val('');
                    $('input[name="标签号"]').focus();
                }else {
                    if(result.moStatus.status == 'stop') {
                        alert('所选标签订单已暂停\n暂停原因:'
                        +result.moStatus.remarks+'\n责任人:'
                        +result.moStatus.user.real_name+'('+result.moStatus.user.workno+')\n暂停时间:'
                        +result.moStatus.actionTime);
                        $('input[name="标签号"]').val('');
                        $('input[name="标签号"]').focus();
                    }else {
                        $('#QCArea').html('正在检验:'+$('input[name="标签号"]').val());
                        var oparr = [];
                        var sortResult = _.groupBy(result.制程,function(value){
                            return value.工序顺序;
                        });
                        oparr = _.map(sortResult,function(value,sortkey){
                            return ('<div class="item" data-value="'+sortkey+'--'+value[0].制程代号+'">'+sortkey+'--'+value[0].制程名称+'</div>')
                        });
                        $('.menu.hgxname').append(oparr);
                        $('select.dropdown').dropdown();
                    }
                }     
            }
        }
    });  
    socket2.emit('storeClientInfo', ['后工序总MO列表']);
});
socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {        
        $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryQCTest", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);  
    if(msg.桌子状态 != undefined) { 
        桌子状态 = msg.桌子状态;
    }    
    if(msg.后工序总MO列表 != undefined) {        
        后工序总MO列表 = msg.后工序总MO列表;
        if(isSubmit) {
            alert('提交成功！');
            $('#myloader').removeClass('active');             
            $('input[name="标签号"]').val('');
            $('#QCArea').html('');
            $('.ui.radio.checkbox').checkbox('set unchecked');
            $('input[name="hgxname"]').val('');
            $('.menu.hgxname').html('');
            $('.ui.selection.dropdown .text').addClass('default');
            $('.ui.selection.dropdown .text').html('返工工序');
            $('input[name="标签号"]').focus();                          
            isSubmit = false;
        }        
    }
});

//万一卡socket返回 就自动去掉loading
function intervarCheck() {
    setTimeout(function(){
        if(isSubmit) {        
            alert('提交成功！');
            $('#myloader').removeClass('active');             
            $('input[name="标签号"]').val('');
            $('#QCArea').html('');
            $('.ui.radio.checkbox').checkbox('set unchecked');
            $('input[name="hgxname"]').val('');
            $('.menu.hgxname').html('');
            $('.ui.selection.dropdown .text').addClass('default');
            $('.ui.selection.dropdown .text').html('返工工序');
            $('input[name="标签号"]').focus();  
            $.get('https://www.kenta.cn:8911/type=getdata?dataname=后工序总MO列表',function(n){
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
    var allFields = $('.ui.form.first').form('get values'),postobj = {};                        
    var selectedmo = _.filter(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: allFields.标签号}]}})[0]; 
    var selected = selectedmo.领料单号.标签状态[allFields.标签号];                       
    
    if(allFields.QC == false) {
        alert('QC检测结果不能为空');
        return false;
    }
    if(_.filter(桌子状态,{正在生产中产品:[{物料标签号:allFields.标签号}]}).length>0) {
        alert('标签正在生产,不能进行QC检验!');
        return false;
    }
    
    isSubmit = true;
    submitType = '重工报工';
    $('#myloader').addClass('ui active inverted dimmer');

    postobj.提交时间 = moment().format('YYYY-MM-DD HH:mm:ss');
    postobj.user = currentUser;   
    postobj.标签号 = allFields.标签号;
    postobj.检测结果 = allFields.QC;
    postobj.返工工序顺序 = allFields.QC=='NG'?allFields.hgxname.split('--')[0]:'无需返工';
    postobj.返工工序代号 = allFields.QC=='NG'?allFields.hgxname.split('--')[1]:'无需返工';
    postobj.NG计数 = selected.生产计数[selected.生产计数.length-1].NG计数;                                    

    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d27f9d171e7a243849213a9',
        collectedData: postobj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fortest:fortest
    };        
    socket.emit('collecteddata', post);   
    intervarCheck()               
}

