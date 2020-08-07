//桌子打卡
var isSubmit = false;
var hgx_port = fortest?'8896':'8893';
window.socket = io.connect('https://www.kenta.cn:8892');
socket.on('connect', function (response) {
	console.log('ws已连接')
});
var socket2 = io.connect('https://www.kenta.cn:'+hgx_port);

socket.on('postidReturn', function (response) {      
    global_json = response;
    var html = response.formhtml.slice(0,-6)+'<div classname="field"><p>'+response.other+'</p></div><div class="fluid ui submit button" onclick="FormSubmit()">提交</div><div class="ui error message"></div></div>';
    // console.log(html);       
    $('#formtitle').html(response.title);
    $('#formdescription').html(response.description);
    $('#display').html(html);
    $('.ui.dropdown').dropdown();
    $('.ui.radio.checkbox').checkbox();
    $('.ui.form.first').form({            
        fields:global_json.fields
    }); 
    $.get("https://www.kenta.cn:"+hgx_port+"/type=getdata?dataname=桌子对应关系",function(data,status){ 
        $('body').toast({message: '桌子对应关系已下载 !'});                           
        _.map(data,function(n,key){              
          $('#桌子选择').append('<option class="item" value="'+key+'——'+n.制程名称+'">'+key+'——'+n.制程名称+'</option>');
        })
    });
    socket2.emit('storeClientInfo', ['桌子对应关系','QueryTableName']);
});

socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {
        console.log('写入')
        $.get("https://www.kenta.cn:"+hgx_port+"/type=callfunction?dataname=QueryTableName", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);      
    if(msg.QueryTableName != undefined) {                
        if(isSubmit) {            
            alert("提交成功")
            $('#myloader').removeClass('ui active inverted dimmer');
            isSubmit = false;
        }
        $('#myloader').removeClass('ui active inverted dimmer');
    }
});

//万一卡socket返回 就自动去掉loading
function intervarCheck() {
    setTimeout(function(){
        if(isSubmit) {        
            isSubmit = false;
            $.get('https://www.kenta.cn:8893/type=getdata?dataname=后工序总MO列表',function(n){
                后工序总MO列表 = n; 
            },'json');
            alert('提交成功！');
            $('#myloader').removeClass('active');
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
    isSubmit = true;
    var allrequired = $('.ui.form.first').form('is valid'); 
    console.log('1层表单',allrequired)
    if(allrequired==false) {                  
      return false;
    } 
    $('#myloader').addClass('ui active inverted dimmer');
    var allFields = $('.ui.form.first').form('get values');
          
   var date = $("#日期").val();
   var time = $("#时间").val();

   var nowdate = moment().locale('zh-cn').format('YYYY-MM-DD');
   var nowtime = moment().locale('zh-cn').format('HH:mm:ss');

     var obj ={}
    obj.桌号=allFields.桌子选择.split('——')[0];
    obj.工序=allFields.桌子选择.split('——')[1];
    obj.工号=allFields.工号;
    obj.工作状态=allFields.workstatus;
    if(date==""&&time==""){
      obj.时间=nowdate+"\xa0"+nowtime;
    } else if(date==""&&time!=""){
      obj.时间=nowdate+"\xa0"+time;
    } else{
      obj.时间=date+"\xa0"+time;

    }
    console.log(allFields,obj);
    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d281b9471e7a243849213af',
        collectedData: obj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fortest:fortest
    };  
    socket.emit('collecteddata', post); 
    intervarCheck()
}

