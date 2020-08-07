//重工制程设置
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
    socket2.emit('storeClientInfo', ['后工序总MO列表','桌子状态']);
});
socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {
        console.log('写入')
        $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryReworkSetting", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);      
    if(msg.后工序总MO列表 != undefined) {                
        if(isSubmit) {            
            alert("提交成功")          
            $('#myloader').removeClass('ui active inverted dimmer');
            isSubmit = false;
        }
    }
    if(msg.桌子状态 != undefined) {
        桌子状态 = msg.桌子状态;
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
    console.log('1层表单',allrequired)
    if(allrequired==false) {                  
      return false;
    } 
    var allFields = $('.ui.form.first').form('get values');   
    var tableCode = allFields.桌子编号;
    var obj ={}
    obj.桌子编号=tableCode;
    obj.制程名称='重工';
    obj.相关MO = allFields.相关MO;
    obj.备注 = allFields.备注;
    console.log("上传数据",obj);
    var selected = _.filter(桌子状态,{桌号:tableCode});
    if(selected.length>0) {
        if(selected[0].正在生产中产品) {
        alert('当前桌子有产品在生产,不能更改工序!');
        $('#myloader').removeClass('ui active inverted dimmer');
        return false;
        }
    }    

    isSubmit = true;
    $('#myloader').addClass('ui active inverted dimmer');
    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d27178478a9d03e1c5a8af1',
        collectedData: obj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };    
    console.log('post',post)    
    socket.emit('collecteddata', post);   
}

