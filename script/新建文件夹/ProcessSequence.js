//MO制程顺序221686
var isSubmit = false;
var QueryMO = '',QueryTableRelation = '';
window.socket = io.connect('https://www.kenta.cn:8892');
socket.on('connect', function (response) {
	console.log('ws已连接')
});
var socket2 = io.connect('https://www.kenta.cn:8893');
socket2.emit('storeClientInfo', ['后工序总MO列表','QueryMO','QueryTableRelation']);
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
    var fmo = _.filter(QueryMO,function(n){
        return n.结案标志=="F"
    })          
    _.map(fmo,function(n){
        $('#MO选择').append('<option class="item" value="'+n.制令单号+'">'+n.制令单号+'</option>');
    }) 
    var drawArr = []
    _.map(QueryTableRelation,function(n){
        drawArr.push(n.collectedData)
    })
    console.log("aaaaaaaaaa",drawArr)


    $("#MO选择").change(function(){
        var drawObj = (_.filter(drawArr,function(n){
            return $("#MO选择 option:selected").val()==n.MO选择
        }))[0]
        $('#工序一').append('<option selected class="item" value="'+drawObj.制程列表[0].制程代号+'——'+drawObj.制程列表[0].制程名称+'">'+drawObj.制程列表[0].制程代号+'——'+drawObj.制程列表[0].制程名称+'</option>');
        $('#工序二').append('<option selected class="item" value="'+drawObj.制程列表[1].制程代号+'——'+drawObj.制程列表[1].制程名称+'">'+drawObj.制程列表[1].制程代号+'——'+drawObj.制程列表[1].制程名称+'</option>');
        $('#工序三').append('<option selected class="item" value="'+drawObj.制程列表[2].制程代号+'——'+drawObj.制程列表[2].制程名称+'">'+drawObj.制程列表[2].制程代号+'——'+drawObj.制程列表[2].制程名称+'</option>');
        $('#工序四').append('<option selected class="item" value="'+drawObj.制程列表[3].制程代号+'——'+drawObj.制程列表[3].制程名称+'">'+drawObj.制程列表[3].制程代号+'——'+drawObj.制程列表[3].制程名称+'</option>');
        $('#工序五').append('<option selected class="item" value="'+drawObj.制程列表[4].制程代号+'——'+drawObj.制程列表[4].制程名称+'">'+drawObj.制程列表[4].制程代号+'——'+drawObj.制程列表[4].制程名称+'</option>');
        $('#工序六').append('<option selected class="item" value="'+drawObj.制程列表[5].制程代号+'——'+drawObj.制程列表[5].制程名称+'">'+drawObj.制程列表[5].制程代号+'——'+drawObj.制程列表[5].制程名称+'</option>');
        $('#工序七').append('<option selected class="item" value="'+drawObj.制程列表[6].制程代号+'——'+drawObj.制程列表[6].制程名称+'">'+drawObj.制程列表[6].制程代号+'——'+drawObj.制程列表[6].制程名称+'</option>');
        $('#工序八').append('<option selected class="item" value="'+drawObj.制程列表[7].制程代号+'——'+drawObj.制程列表[7].制程名称+'">'+drawObj.制程列表[7].制程代号+'——'+drawObj.制程列表[7].制程名称+'</option>');
        $('#工序九').append('<option selected class="item" value="'+drawObj.制程列表[8].制程代号+'——'+drawObj.制程列表[8].制程名称+'">'+drawObj.制程列表[8].制程代号+'——'+drawObj.制程列表[8].制程名称+'</option>');
        $('#工序十').append('<option selected class="item" value="'+drawObj.制程列表[9].制程代号+'——'+drawObj.制程列表[9].制程名称+'">'+drawObj.制程列表[9].制程代号+'——'+drawObj.制程列表[9].制程名称+'</option>');
        $("#工序一产能").val(drawObj.制程列表[0].标准产能);
        $("#工序二产能").val(drawObj.制程列表[1].标准产能);
        $("#工序三产能").val(drawObj.制程列表[2].标准产能);
        $("#工序四产能").val(drawObj.制程列表[3].标准产能);
        $("#工序五产能").val(drawObj.制程列表[4].标准产能);
        $("#工序六产能").val(drawObj.制程列表[5].标准产能);
        $("#工序七产能").val(drawObj.制程列表[6].标准产能);
        $("#工序八产能").val(drawObj.制程列表[7].标准产能);
        $("#工序九产能").val(drawObj.制程列表[8].标准产能);
        $("#工序十产能").val(drawObj.制程列表[9].标准产能);
    });   
});
socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {        
        $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryNewZC", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg); 
    if(msg.QueryMO != undefined) {        
        QueryMO = msg.QueryMO;              
    }
    if(msg.QueryTableRelation != undefined) {        
        QueryTableRelation = msg.QueryTableRelation;              
    }     
    if(msg.后工序总MO列表 != undefined) {        
        后工序总MO列表 = msg.后工序总MO列表;
        if(isSubmit) {
            alert('提交成功！');
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
    console.log('1层表单',allrequired)
    if(allrequired==false) {                  
        return false;
    }     
    var moSel=$("#MO选择 option:selected").val(); //获取选中的项

    var one=$("#工序一 option:selected").val(); 
    var onenum = one.split("——")[0]
    var onename = one.split("——")[1]
    var two=$("#工序二 option:selected").val(); 
    var twonum = two.split("——")[0]
    var twoname = two.split("——")[1]
    var three=$("#工序三 option:selected").val(); 
    var threenum = three.split("——")[0]
    var threename = three.split("——")[1]
    var four=$("#工序四 option:selected").val(); 
    var fournum = four.split("——")[0]
    var fourname = four.split("——")[1]
    var five=$("#工序五 option:selected").val(); 
    var fivenum = five.split("——")[0]
    var fivename = five.split("——")[1]
    var six=$("#工序六 option:selected").val(); 
    var sixnum = six.split("——")[0]
    var sixname = six.split("——")[1]
    var seven=$("#工序七 option:selected").val(); 
    var sevennum = seven.split("——")[0]
    var sevenname = seven.split("——")[1]
    var eight=$("#工序八 option:selected").val(); 
    var eightnum = eight.split("——")[0]
    var eightname = eight.split("——")[1]
    var nine=$("#工序九 option:selected").val(); 
    var ninenum = nine.split("——")[0]
    var ninename = nine.split("——")[1]
    var ten=$("#工序十 option:selected").val(); 
    var tennum = ten.split("——")[0]
    var tenname = ten.split("——")[1]

    var onecapacity = $("#工序一产能").val();
    var twocapacity = $("#工序二产能").val();
    var threecapacity = $("#工序三产能").val();
    var fourcapacity = $("#工序四产能").val();
    var fivecapacity = $("#工序五产能").val();
    var sixcapacity = $("#工序六产能").val();
    var sevencapacity = $("#工序七产能").val();
    var eightcapacity = $("#工序八产能").val();
    var ninecapacity = $("#工序九产能").val();
    var tencapacity = $("#工序十产能").val();

    var obj ={}
    obj.MO选择=moSel;
    obj.制程列表 = []        
    if(onenum!='') {obj.制程列表.push({工序顺序:1,制程代号:onenum,制程名称:onename,标准产能:onecapacity})}
    if(twonum!='') {obj.制程列表.push({工序顺序:2,制程代号:twonum,制程名称:twoname,标准产能:twocapacity})}
    if(threenum!='') {obj.制程列表.push({工序顺序:3,制程代号:threenum,制程名称:threename,标准产能:threecapacity})}
    if(fournum!='') {obj.制程列表.push({工序顺序:4,制程代号:fournum,制程名称:fourname,标准产能:fourcapacity})}
    if(fivenum!='') {obj.制程列表.push({工序顺序:5,制程代号:fivenum,制程名称:fivename,标准产能:fivecapacity})}
    if(sixnum!='') {obj.制程列表.push({工序顺序:6,制程代号:sixnum,制程名称:sixname,标准产能:sixcapacity})}
    if(sevennum!='') {obj.制程列表.push({工序顺序:7,制程代号:sevennum,制程名称:sevenname,标准产能:sevencapacity})}
    if(eightnum!='') {obj.制程列表.push({工序顺序:8,制程代号:eightnum,制程名称:eightname,标准产能:eightcapacity})}
    if(ninenum!='') {obj.制程列表.push({工序顺序:9,制程代号:ninenum,制程名称:ninename,标准产能:ninecapacity})}
    if(tennum!='') {obj.制程列表.push({工序顺序:10,制程代号:tennum,制程名称:tenname,标准产能:tencapacity})}
  
    console.log("上传数据",obj); 

    isSubmit = true;
    $('#myloader').addClass('ui active inverted dimmer');
    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d286260be727d23b4ec666b',
        collectedData: obj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };    
    console.log('post',post)    
    socket.emit('collecteddata', post);
}










































































