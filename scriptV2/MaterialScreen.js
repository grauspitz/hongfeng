//220084  5d25a4ba0e6cc83fa41c9519
var global_tagArray = [];
var isSubmit = false;

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

    $('input[name="领料单号_input"]').keydown(function (e) {
        if (e.keyCode == 13) {  
            var allFields = $('.ui.form.first').form('get values');
            var inputvalue = $('input[name="领料单号_input"]').val();
            if(allFields.领料单号.indexOf(inputvalue)>-1) {
                alert('此领料单号已存在');
            }else {
                var tmp = allFields.领料单号==""?[]:allFields.领料单号.split(',');
                var currentvalue = _.map(tmp,function(n){
                    return {
                        name:n,
                        value:n,
                        selected:true
                    }
                });

                currentvalue.push({
                    name:inputvalue,
                    value:inputvalue,
                    selected:true
                });
                
                var op = '<div class="item" data-value="'+inputvalue+'">'+inputvalue+'</div>';
                $('.menu.领料单号').append(op);
                $('#领料单号').dropdown({values:currentvalue});
            }
            $('input[name="领料单号_input"]').val('');
            $('input[name="领料单号_input"]').focus();
        }
    });
    socket2.emit('storeClientInfo', ['后工序总MO列表']);
});
socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {        
        $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryBan", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);      
    if(msg.后工序总MO列表 != undefined) {        
        后工序总MO列表 = msg.后工序总MO列表;
        if(isSubmit) {
            alert('提交成功！');
            $('#myloader').removeClass('active'); 
            if($('.ui.celled.table tbody td').html() == '无数据') {
                $('.ui.celled.table tbody tr').remove();
            }                
            $('input[name="领料单号_input"]').val('');
            $('input[name="暂存区条码"]').val('');
            $('#领料单号').dropdown({values:[]});
            $('input[name="领料单号_input"]').focus();            
            isSubmit = false;
        }        
    }
});

//万一卡socket返回 就自动去掉loading
setInterval(function(){
    if(isSubmit) {        
        isSubmit = false;
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
            if(allowed.indexOf(currentUser.user_name)==-1) {
                alert('您没有权限访问此页!');
                return false;
            }   
        }       
        $('#formwindow').attr('class','ui segment');
        $('#login').attr('class','none');
        socket.emit('postid', id);
    }    
}

function FormSubmit() {    
    var allrequired = $('.ui.form.first').form('is valid'); 
    console.log('1层表单',allrequired);
    if(allrequired==false) {                  
        return false;
    }    

    var allFields = $('.ui.form.first').form('get values'),postobj = {};
    global_tagArray = allFields.领料单号.split(',');
    postobj.提交时间 = moment().format('YYYY-MM-DD HH:mm:ss');
    postobj.user = currentUser;   
    postobj.领料单号 = global_tagArray;
    postobj.暂存区条码 = allFields.暂存区条码;
    var existed = [];
    _.forEach(global_tagArray, function(n) {
        var boselected = _.filter(后工序总MO列表, {领料记录: [{领料单号: n}]});
        if(boselected.length > 0) {
            existed.push(n)
        }
    })
    if(existed.length > 0) {
        isSubmit = false;
        alert(existed + '——已领过料');
        $('#myloader').removeClass('active');
        return false;
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
        templateid:'5d25a4ba0e6cc83fa41c9519',
        collectedData: postobj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };    
    console.log('post',post)    
    socket.emit('collecteddata', post);
}


