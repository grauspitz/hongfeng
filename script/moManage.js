//220084  5d25a4ba0e6cc83fa41c9519
var global_tagArray = [];
var isSubmit = false; 
var hgx_port = fortest?'8896':'8893';
window.socket = io.connect('https://www.kenta.cn:8892');
socket.on('connect', function (response) {
	console.log('ws已连接')
});
var socket2 = io.connect('https://www.kenta.cn:'+hgx_port);

socket.on('postidReturn', function (response) {
    global_json = response;
    var html = response.formhtml.slice(0,-6)+'<div class="ui three column grid"><div class="column"><button class="ui grey button" data-type="stop"  onclick="FormSubmit(this)">选中停产</button></div><div class="column"><button class="ui grey button" data-type="recover"  onclick="FormSubmit(this)">选中恢复</button></div><div class="column"><button class="ui grey button" onclick="_selectAll()">全选</button></div></div><div class="field"><label>提交说明</label><input type="text" id="remarks"></div><table id="listArea" class="ui celled table"></table><div class="ui error message"></div></div>';    
    $('#formtitle').html(response.title);
    $('#formdescription').html(response.description);
    $('#display').html(html);
    $('.ui.dropdown').dropdown();
    $('.ui.form.first').form({            
        fields:global_json.fields
    });   
        
    socket2.emit('storeClientInfo', ['后工序总MO列表']);
});
socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {        
        $.get("https://www.kenta.cn:"+hgx_port+"/type=callfunction?dataname=QueryBan", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);      
    if(msg.后工序总MO列表 != undefined) {        
        后工序总MO列表 = msg.后工序总MO列表;
        $('#listArea').html('');
        console.log('后工序总MO列表',后工序总MO列表)
        var theadstr = '<thead><th>选择</th><th>制令单号</th><th>说明</th><th>生产状态</th><th>操作时间</th></thead>';
        var tbodystr = '<tbody>'; 
        _.map(后工序总MO列表,function(value){     
            var mostatus = value.moStatus;
            mostatus.status = mostatus.status=='recover'?'生产中':'停产中';                      
            tbodystr+='<tr><td><input type="checkbox" class="checkchoice" id="'+value.MO+'"></td><td>'+value.MO+'</td><td>'+mostatus.remarks+'</td><td>'+mostatus.status+'</td><td>'+mostatus.actionTime+'</td></tr>';  
        });
        tbodystr+='</tbody>';
        $('#listArea').append(theadstr);
        $('#listArea').append(tbodystr);
        if(isSubmit) {
            alert('提交成功！');
            $('#myloader').removeClass('active');                       
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
            isSubmit = false;
            $.get('https://www.kenta.cn:8893/type=getdata?dataname=后工序总MO列表',function(n){
                后工序总MO列表 = n; 
            },'json');
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

function FormSubmit(e) {   
    var type = e.getAttribute("data-type"); 
    var allrequired = $('.ui.form.first').form('is valid'); 
    console.log('1层表单',allrequired);
    if(allrequired==false) {                  
        return false;
    }    

    var postobj = {},selected = [],error = [];
    _.forEach(后工序总MO列表,function(value){
        if($('#'+value.MO).is(':checked')) {//表示被选中
            if(value.moStatus == type) {
                error.push(value.MO);
            }else {
                selected.push(value.MO);
            }            
        }
    });
    if(error.length>0) {
        if(type=='stop') {
            alert(error+'本身处在停产中');
        }else {
            alert(error+'本身处在生产中');
        }        
        return false;
    }
    console.log(selected);

    postobj.提交时间 = moment().format('YYYY-MM-DD HH:mm:ss');
    postobj.user = currentUser; 
    postobj.remarks = $('#remarks').val();   
    postobj.MOrray = selected;
    postobj.status = type;     
          
    isSubmit = true;
    $('#myloader').addClass('ui active inverted dimmer');
    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d3184f5e55fa25dac5760b9',
        collectedData: postobj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fortest:fortest
    };            
    socket.emit('collecteddata', post);
    intervarCheck()
}


