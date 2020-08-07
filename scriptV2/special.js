//219999
var global_tagArray = [],global_hgxArray = [],BGArray = [],tableSearch_displaydata=[],selectedtable='';
var detailTable,getTable;
var isSubmit = false,submitType = '';
var socket2 = io.connect('https://www.kenta.cn:8893');
socket2.emit('storeClientInfo', ['桌子对应关系','后工序总MO列表','桌子状态']);
socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);      
    if(msg.桌子对应关系 != undefined) {        
        deskToGX = msg.桌子对应关系;        
    }
    if(msg.后工序总MO列表 != undefined) {        
        if(isSubmit) {
            if(submitType=='投料') {
                alert('投料记录写入完成');
                $('#myloader').removeClass('active');                
                var theadstr = '<thead><th>标签号</th><th>制令单号</th><th>制程名称</th><th>工序顺序</th><th>桌号</th></tr></thead>';
                var tbodystr = '<tbody>';
                _.map(global_hgxArray,function(value){
                    tbodystr+='<tr><td>'+value.标签号+'</td><td>'+value.制令单号+'</td><td>'+value.制程名称+'</td><td>'+value.工序顺序+'</td><td>'+value.桌号+'</td></tr>';                
                });   
                tbodystr+='</tbody>';
                $('#detail_1').html('');                 
                $('#detail_1').append(theadstr); 
                $('#detail_1').append(tbodystr); 
                $('input[name="桌子编号"]').val('');
                $('input[name="标签号_input"]').val('');
                $('input[name="桌子编号"]').focus();
                $('#标签号').dropdown({values:[]});
                submitType = '';
            }
            if(submitType=='重工投料') {
                alert('重工投料记录写入完成');
                $('#myloader').removeClass('active');
                $('input[name="桌子编号"]').val('');
                $('input[name="标签号_input"]').val('');
                $('input[name="桌子编号"]').focus();
                $('#标签号').dropdown({values:[]});
                submitType = '';
            }
            if(submitType=='暂停') {
                alert('暂停记录写入完成');
                $('#myloader').removeClass('active');
                $('input[name="桌子编号"]').val('');
                $('input[name="标签号_input"]').val('');
                $('input[name="桌子编号"]').focus();
                $('#标签号').dropdown({values:[]});
                $('#detail_2').html('');
                $('#pauseselect').attr('disabled',true)
                $('#continueselect').attr('disabled',true)  
                $('#pauseall').attr('disabled',true)
                $('#continueall').attr('disabled',true)
                tableSearch_displaydata = []; 
                submitType = '';                               
            }
            if(submitType=='恢复') {
                alert('恢复记录写入完成');
                $('#myloader').removeClass('active');
                $('input[name="桌子编号"]').val('');
                $('input[name="标签号_input"]').val('');
                $('input[name="桌子编号"]').focus();
                $('#标签号').dropdown({values:[]});   
                $('#detail_2').html(''); 
                $('#pauseselect').attr('disabled',true)
                $('#continueselect').attr('disabled',true)  
                $('#pauseall').attr('disabled',true)
                $('#continueall').attr('disabled',true)
                tableSearch_displaydata = [];  
                submitType = '';                                           
            }
            if(submitType=='报工') {                  
                alert('报工记录写入完成');
                $('#myloader').removeClass('active');                         
                var printResult = "";
                // _.forEach(smallLogistics, function(m, key) {
                //     console.log(1)
                //     printResult += "客户编码：" + m.客户编码 + "\n健大品号：" + m.健大品号 + "\n客户品号：" + m.客户品号 + "\n插针MO：" + m.插针MO +"\n";
                //     _.forEach(m.工序, function(t) {
                //         console.log(m.t)
                //         printResult += t + "：" + m.t + "（"+ m.t.不良品数 +"）\n";
                //     })
                // })
                // console.log(printResult)
                // sunmiInnerPrinter.printString(printResult + "\n\n")
    
                //清空
                $('#detail_3').html('');
                $('#workfinish').attr('disabled',true);
                BGArray = [];            
                submitType = '';                                           
            }
            if(submitType=='重工报工') {  
                $('#myloader').removeClass('active');             
                submitType = '';                                           
            }
            isSubmit = false;
        }  
        后工序总MO列表 = msg.后工序总MO列表;    
    }
    if(msg.桌子状态 != undefined) {
        桌子状态 = msg.桌子状态;
    }
});
socket.on('postidReturn', function (response) {      
    global_json = response;
    var html = response.formhtml.slice(0,-6)+'<div classname="field"><p>'+response.other+'</p></div><div class="ui error message"></div></div>';
    //console.log(html);       
    $('#formtitle').html(response.title);
    $('#formdescription').html(response.description);
    $('#display').html(html);
    $('.ui.dropdown').dropdown();        
    $('.ui.form.first').form({
        fields:global_json.fields
    });   
    

    $("#display").append('<div class="ui top attached tabular menu"><a class="active item" data-tab="first">开工</a><a class="item" data-tab="second">暂停/恢复</a><a class="item" data-tab="third">报工</a></div><div class="ui bottom attached active tab segment" data-tab="first"><button class="ui grey button" onclick="tagFeeding()">开工</button><table id="detail_1" class="ui celled table"></table></div><div class="ui five column grid bottom attached tab segment" data-tab="second"><div class="column"><button class="ui grey button" onclick="tableSearch()">桌号搜索</button></div><div class="column"><button class="ui grey button" id="pauseselect" disabled=true onclick="machinePause()">暂停下机</button></div><div class="column"><button class="ui grey button" id="continueselect" disabled=true onclick="machineContinue()">恢复上机</button></div><div class="column"><button class="ui grey button" id="pauseall" disabled=true onclick="pauseAll()">暂停全部</button></div><div class="column"><button class="ui grey button" id="continueall" disabled=true onclick="continueAll()">恢复全部</button></div><table id="detail_2" class="ui celled table"></table></div><div class="ui bottom attached tab segment" data-tab="third"><button class="ui grey button" onclick="getSearching()">报工搜索</button><button class="ui grey button" id="workfinish" disabled=true onclick="tagGetting()">报工</button><table id="detail_3" class="ui celled table"></table></div>')        
    $('.menu .item').tab();       

    //桌号 enter 事件
    $('input[name="桌子编号"]').keydown(function (e) {
        if (e.keyCode == 13) {
            $('#MOArea').html('');
            _.forEach(deskToGX,function(n,key){
                if(key==$('input[name="桌子编号"]').val()) {
                    selectedtable = n;
                }
            })
            if(selectedtable=='') {
                alert('桌号有误');
                return false;
            }else {                                
                if(selectedtable.制程名称 == '重工') {
                    $('#MOArea').html('重工MO:'+selectedtable.相关MO)
                }
                $('input[name="标签号_input"]').focus()
            }                          
            $('input[name="标签号_input"]').focus()
        }
    });

    $('input[name="标签号_input"]').keydown(function (e) {
        if (e.keyCode == 13) {  
            var allFields = $('.ui.form.first').form('get values');                
            var inputvalue = $('input[name="标签号_input"]').val();
            if(allFields.标签号.split(',').indexOf(inputvalue)>-1) {
                alert('此标签已存在');
            }else {    
                $('#detail').html('')                                    
                var tmp = allFields.标签号==""?[]:allFields.标签号.split(',');
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
                $('.menu.标签号').append(op);
                $('#标签号').dropdown({values:currentvalue});                                         
            }      
            $('input[name="标签号_input"]').val('');
            $('input[name="标签号_input"]').focus()              
        }
    });
    //socket2.emit('storeClientInfo', ['后工序总MO列表']);
});

socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {
        if(submitType=='投料') {            
            $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryTou", function(response) {},'json');
        }
        if(submitType=='重工投料') {            
            $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryTou", function(response) {},'json');
        }   
        if(submitType=='暂停') {            
            $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryStop", function(response) {},'json');
        }  
        if(submitType=='恢复') {            
            $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryRecovery", function(response) {},'json');
        } 
        if(submitType=='报工') {            
            $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryBao", function(response) {},'json');
        }     
        if(submitType=='重工报工') {            
            $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryBao", function(response) {},'json');
        }
    }
}) 

//万一卡socket返回 就自动去掉loading
setInterval(function(){
    if(isSubmit) {
        submitType = '';
        isSubmit = false;
    }
},10000);

//开工
function tagFeeding() {
    $('#myloader').addClass('ui active inverted dimmer');
    global_hgxArray=[];//初始化
    var allrequired = $('.ui.form.first').form('is valid');         
    $('.ui.form').form('validate form');    
    var allFields = $('.ui.form.first').form('get values');   
    var onwork = true;

    if(allFields.桌子编号=='') {
        alert('桌子编号不能为空');
        $('input[name="桌子编号"]').focus();
        $('#myloader').removeClass('active');
        return false;
    }
    if(allFields.标签号=='') {
        alert('标签号不能为空');
        $('input[name="标签号_input"]').focus();
        $('#myloader').removeClass('active');
        return false;
    }    
    $('#detail').html('')        
    if(selectedtable == '') {
        alert('未确认桌号');
        $('#myloader').removeClass('active');
        return false;
    }
    
    $.ajax({
        type:"GET",
        url:"https://www.kenta.cn:8893/type=getdata?dataname=QueryTableName",
        async:false,
        dataType:'json', //数据类型
        success:function(data){  
            if(_.filter(filterFormdata(data,'桌号'),{桌号:selectedtable.桌号}).length==0||_.filter(filterFormdata(data,'桌号'),{桌号:selectedtable.桌号})[0].工作状态=='下班') {
                onwork = false;
            }
        }
    });
    if(onwork==false) {
        alert('此桌未打卡上班!');
        $('#myloader').removeClass('active');
        return false;
    }
    isSubmit = true;
    var obj = {};
    if(selectedtable.制程名称 != '重工') {
        submitType = '投料';
        var tagarr = allFields.标签号.split(',');
        var hgxOutput = {hgxArray:[],errortags:[]};
        _.forEach(tagarr,function(n){                          
            var result = _.filter(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: n}]}})[0];
            if(result!=undefined) {
                var mygx = _.filter(result.制程,['制程代号',deskToGX[selectedtable.桌号]['制程代号']]);
                var ZCName = mygx.length>0?mygx[0].制程名称+'('+mygx[0].制程代号+')':'工序不符(本桌为'+deskToGX[selectedtable.桌号]['制程名称']+')';
                var ZCNo = mygx.length>0?mygx[0].工序顺序:'此标签非本桌生产';
                var tagstatus = result.领料单号.标签状态[n];
                var 正在生产 = _.filter(桌子状态,{正在生产中产品:[{物料标签号:n}]});
                var obj = {
                    制令单号:result.MO,
                    标签号:n,
                    制程名称:ZCName,
                    工序顺序:ZCNo,
                    桌号:selectedtable.桌号,
                    标签状态:tagstatus,
                    正在生产:正在生产
                }                                            
                hgxOutput.hgxArray.push(obj);   
            }else {                  
                hgxOutput.errortags.push(n);
            }                                     
        }); 

        console.log('hgxOutput',hgxOutput);
        var correctTagArray = [],workingTagArray = [],incorrectTagArray = [],sorterrorTagArray = [],errortags = [];  
        var errorHtml = '';
        global_hgxArray = hgxOutput.hgxArray; 
        errortags = hgxOutput.errortags
        allFields = $('.ui.form.first').form('get values');                          
        _.forEach(global_hgxArray,function(n){
            if(n.正在生产.length>0) {                    
                workingTagArray.push(n.标签号+'正在'+n.正在生产[0].桌号+'生产\n');
            }else if(n.工序顺序!='此标签非本桌生产') {                                                                         
                if(n.工序顺序=='1') {
                    if(n.标签状态.生产计数[0].总计数==n.标签状态.QC记录.length) {
                        correctTagArray.push(n.标签号);
                    }else {
                        sorterrorTagArray.push(n.标签号+'未NG到此工序');
                    }
                }else {
                    var previous = n.标签状态.生产计数[parseInt(n.工序顺序)-2],current = n.标签状态.生产计数[parseInt(n.工序顺序)-1];                        
                    if(previous.总计数-current.总计数==1) {
                        correctTagArray.push(n.标签号);
                    }else {
                        sorterrorTagArray.push(n.标签号+'前一道工序'+previous.工序名称+'('+previous.工序代号+')未完成');
                    }
                }                                      
            }else {
                incorrectTagArray.push(n.标签号);
            }
        });
        if(workingTagArray.length>0) {
            errorHtml+=workingTagArray+'\n';
        }
        if(incorrectTagArray.length>0) {
            errorHtml+=incorrectTagArray+'工序非本桌生产\n';
        }
        if(errortags.length>0) {
            errorHtml+=errortags+'标签号不存在\n';
        }
        if(sorterrorTagArray.length>0) {
            errorHtml+=sorterrorTagArray+'\n';
        }        

        if(errorHtml!='') {
            alert(errorHtml);
            $('#myloader').removeClass('active');
            return false;
        }                
        obj = {
            桌号:allFields.桌子编号,
            标签号:correctTagArray,
            工序代号:deskToGX[allFields.桌子编号]['制程代号'],
            开工时间:moment().format('YYYY-MM-DD HH:mm:ss')
        } 
    }else {
        submitType = '重工投料';
        var allFields = $('.ui.form.first').form('get values');
        var tags = allFields.标签号.split(',');
        var errortags = [],falseMOTags = [],workingTagArray = [];
        _.forEach(tags,function(value){
            var selected = _.filter(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: value}]}});
            var isworking = _.filter(桌子状态,{正在生产中产品:[{物料标签号:value}]});    console.log('isworking',isworking)                        
            if(isworking.length>0) {
                workingTagArray.push(value+'正在'+isworking[0].桌号+'生产\n');
            }                                                       
            if(selected.length==0) {
                errortags.push(value); 
            }else {
                if(selected[0].MO != selectedtable.相关MO) {
                    falseMOTags.push(value);
                }
            }
        })
        if(workingTagArray.length>0) {
            alert(workingTagArray);
            $('#myloader').removeClass('active');
            return false;
        }
        if(errortags.length>0) {
            alert(errortags+'标签不存在!');
            $('#myloader').removeClass('active');
            return false;
        }
        if(falseMOTags.length>0) {
            alert(falseMOTags+'非此重工MO!');
            $('#myloader').removeClass('active');
            return false;
        }                
        obj = {
            桌号:allFields.桌子编号,
            标签号:tags,
            工序代号:deskToGX[allFields.桌子编号]['制程代号'],
            开工时间:moment().format('YYYY-MM-DD HH:mm:ss'),
            是否重工:true
        }
        var postjson = {
            "title": "后工序投料记录",
            "discription": "所有的后工序投料记录都会记录于此",
            "type": "collecteddata",
            "formtag": "feedingrecords",
            "templateid":'219999',
            "username": "jiaming.liu",
            "collectedData":obj
        };
    }
    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d280d3771e7a243849213ae',
        collectedData: obj,                    
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };  
    console.log(22,post);
    socket.emit('collecteddata', post);    
}
//桌号搜索
function tableSearch() {  
    //清空表格 
    $('#detail_2').html(''); 
    var allFields = $('.ui.form.first').form('get values'); 
    var tableno = allFields.桌子编号;    
    var selected = _.filter(桌子状态,{桌号:tableno});
    if(selected.length==0) {
        alert('此桌无在产标签');
    }else {
        var displaydata = selected[0].正在生产中产品?selected[0].正在生产中产品:[];
        if(displaydata.length>0) {  
            $('#pauseselect').attr('disabled',false)
            $('#continueselect').attr('disabled',false)              
            $('#pauseall').attr('disabled',false)
            $('#continueall').attr('disabled',false)

            var tags = [],choosed = [];
            var theadstr = '<thead><th>选择</th><th>标签号</th><th>工序名称</th><th>工序代号</th><th>状态</th></tr></thead>';
            var tbodystr = '<tbody>';                          
            _.map(displaydata,function(value){
                tags.push(value.物料标签号);
                value.status = '生产中';
                if(value.暂停记录) {
                    value.status = '暂停中('+value.暂停记录.暂停时间+')';
                }
                tbodystr+='<tr><td><input type="checkbox" class="checkchoice" id="'+value.物料标签号+'"></td><td>'+value.物料标签号+'</td><td>'+value.工序名称+'</td><td>'+value.工序代号+'</td><td>'+value.status+'</td></tr>';  
            });
            tableSearch_displaydata = displaydata;
            tbodystr+='</tbody>';
            $('#detail_2').append(theadstr); 
            $('#detail_2').append(tbodystr); 
            $('.checkchoice').change(function(){
                var currentvalue = [];
                _.forEach(tags,function(tag){
                    if($('#'+tag).is(':checked')) {
                        choosed.push(tag);
                        currentvalue.push({
                            name:tag,
                            value:tag,
                            selected:true
                        }); 
                        var op = '<div class="item" data-value="'+tag+'">'+tag+'</div>';
                        $('.menu.标签号').append(op);
                    }
                });                
                $('#标签号').dropdown({values:currentvalue}); 
            });
        }else {
            alert('此桌无产品生产');
        }            
    }
}
//暂停下机
function machinePause() {
    var allFields = $('.ui.form.first').form('get values');   
    global_tagArray = allFields.标签号.split(',');  
    var 是否重工 = deskToGX[allFields.桌子编号].制程名称 == '重工'?true:false;             
    var errortags = [],pausedtags = [];
    _.forEach(global_tagArray,function(n){
        var selected = _.filter(tableSearch_displaydata,{物料标签号:n});
        if(selected.length>0) {
            if(selected[0].status != '生产中') {
                pausedtags.push(n);
            }
        }else {
            errortags.push(n)
        }
    });
    if(allFields.桌子编号=='') {
        alert('桌子编号不能为空');
        $('input[name="桌子编号"]').focus();        
        return false;
    }
    if(allFields.标签号=='') {
        alert('标签号不能为空');
        $('input[name="标签号_input"]').focus();        
        return false;
    }   
    if(pausedtags.length>0) {
        alert(pausedtags+'——暂停中');        
        return false;
    }
    if(errortags.length>0) {
        alert(errortags+'——非本桌生产');        
        return false;
    }

    isSubmit = true;
    submitType = '暂停';
    $('#myloader').addClass('ui active inverted dimmer');
    var obj = {
        桌号:allFields.桌子编号,
        标签号:global_tagArray,
        工序代号:deskToGX[allFields.桌子编号]['制程代号'],
        暂停时间:moment().format('YYYY-MM-DD HH:mm:ss'),
        是否重工:是否重工
    }    
    var post = {
        title: '后工序暂停下机',
        description: '后工序暂停下机',
        formtag:'后工序暂停下机',
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d283681be727d23b4ec665a',
        collectedData: obj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };    
    console.log('post',post)    
    socket.emit('collecteddata', post);              
}
//恢复上机
function machineContinue() {     
    var allFields = $('.ui.form.first').form('get values');   
    global_tagArray = allFields.标签号.split(',');    
    var 是否重工 = deskToGX[allFields.桌子编号].制程名称 == '重工'?true:false;          
    var errortags = [],workingtags = [];
    _.forEach(global_tagArray,function(n){
        var selected = _.filter(tableSearch_displaydata,{物料标签号:n});
        if(selected.length>0) {
            if(selected[0].status == '生产中') {
                workingtags.push(n);
            }
        }else {
            errortags.push(n)
        }
    });
    if(allFields.桌子编号=='') {
        alert('桌子编号不能为空');
        $('input[name="桌子编号"]').focus();        
        return false;
    }
    if(allFields.标签号=='') {
        alert('标签号不能为空');
        $('input[name="标签号_input"]').focus();        
        return false;
    }  
    if(workingtags.length>0) {
        alert(workingtags+'——正在生产中');        
        return false;
    }
    if(errortags.length>0) {
        alert(errortags+'——非本桌生产');        
        return false;
    } 

    isSubmit = true;
    submitType = '恢复';
    $('#myloader').addClass('ui active inverted dimmer');
    var obj = {
        桌号:allFields.桌子编号,
        标签号:global_tagArray,
        工序代号:deskToGX[allFields.桌子编号]['制程代号'],
        恢复时间:moment().format('YYYY-MM-DD HH:mm:ss'),
        是否重工:是否重工
    }   
    var post = {
        title: "后工序恢复上机",
        description: "后工序恢复上机",
        formtag:'后工序恢复上机',
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d283367be727d23b4ec6659',
        collectedData: obj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };    
    console.log('post',post)    
    socket.emit('collecteddata', post);   

}
//暂停全部
function pauseAll() {
    var currentvalue = [];
    _.forEach(tableSearch_displaydata,function(value){
        if(value.status=='生产中') {            
            currentvalue.push({
                name:value.物料标签号,
                value:value.物料标签号,
                selected:true
            }); 
            var op = '<div class="item" data-value="'+value.物料标签号+'">'+value.物料标签号+'</div>';
            $('.menu.标签号').append(op);
        }
    });
    $('#标签号').dropdown({values:currentvalue}); 
    machinePause();
}
//恢复全部
function continueAll() {
    var currentvalue = [];
    _.forEach(tableSearch_displaydata,function(value){
        if(value.status!='生产中') {            
            currentvalue.push({
                name:value.物料标签号,
                value:value.物料标签号,
                selected:true
            }); 
            var op = '<div class="item" data-value="'+value.物料标签号+'">'+value.物料标签号+'</div>';
            $('.menu.标签号').append(op);
        }
    });
    $('#标签号').dropdown({values:currentvalue}); 
    machineContinue();
}
//报工搜索
function getSearching() {    
    $('#detail_3').html('');
    global_hgxArray=[];//初始化

    var allrequired = $('.ui.form.first').form('is valid');         
    $('.ui.form').form('validate form');
    var $form = $('.ui.form.first'),
    allFields = $form.form('get values');   
    
    console.log(allFields.标签号,桌子状态);
    $('#workfinish').attr('disabled',false);
    var displayData = [],errortags = [];  
    var mydata;           
    _.forEach(allFields.标签号.split(','),function(o){
        var selected = _.filter(桌子状态,{正在生产中产品:[{物料标签号:o}]});  console.log('selected',o,selected)
                            
        if(selected.length==0) {
            var obj = {                        
                制程代号:'标签未在生产',
                标签号:o,
                不良品数:'',
                status:'disabled'
            }
            errortags.push(o);
        }else {
            var myindex = _.findIndex(selected[0].正在生产中产品, ['物料标签号', o]);
            mydata = selected[0].正在生产中产品[myindex]; 
            var 是否重工 = deskToGX[mydata.桌号].制程名称 == '重工'?true:false;
            var obj = {                        
                制程代号:mydata.工序代号,
                标签号:o,
                桌号:mydata.桌号,
                不良品数:'',
                是否暂停中:mydata.暂停记录==undefined?false:true,
                status:'abled',
                是否重工:是否重工
            }
            displayData.push(obj);
        }                                                                
    });
    if(errortags.length>0) {
        alert(errortags+'未在生产');
        return false;
    }
    _.map(displayData,function(o,key){
        o.index = key;
    });
    BGArray = displayData;
    var theadstr = '<thead><th>标签号</th><th>制程名称</th><th class="right aligned">不良品数</th></tr></thead>';
    var tbodystr = '<tbody>';
    _.map(BGArray,function(value){console.log(value)
        tbodystr+='<tr><td>'+value.标签号+'</td><td>'+deskToGX[mydata.桌号]['制程名称']+'('+value.制程代号+')'+'</td><td class="right aligned"><div class="ui huge icon input"><input type="number" id="ng_'+value.index+'" placeholder="填写不良品数" '+value.status+'></div></td></tr>';                
    });
    tbodystr+='</tbody>';
    $('#detail_3').html('');
    $('#detail_3').append(tbodystr);       
}
//报工
function tagGetting() {       
    var allFields = $('.ui.form.first').form('get values');   
    
    var newBGArray = [],newBGArray_normal = [],newBGArray_重工 = [];
    _.forEach(BGArray,function(n){    
        n.不良品数 = $('#ng_'+n.index).val();  
        if(n.是否重工) {
            newBGArray_重工.push(n);
        }else {
            newBGArray_normal.push(n);
        }
        newBGArray.push(n);      
    });    
    var tmp = _.chain(newBGArray).filter({是否暂停中:true}).groupBy(function(n){return n.桌号}).value();    
        
    _.forEach(tmp,function(n,key){
        var 是否重工 = deskToGX[key].制程名称 == '重工'?true:false;
        var tagarr = [];
        tagarr = _.map(n,function(m){
            return m.标签号
        });

        submitType = '恢复';
        var obj = {
            桌号:key,
            标签号:tagarr,
            工序代号:deskToGX[key]['制程代号'],
            恢复时间:moment().format('YYYY-MM-DD HH:mm:ss'),
            是否重工:是否重工
        }
   
        var post = {
            title: "后工序恢复上机",
            description: "后工序恢复上机",
            formtag:"后工序恢复上机",
            type: "collecteddata",
            username: currentUser.user_name,
            poststatus:'abled',
            templateid:'5d283367be727d23b4ec6659',
            collectedData: obj,        
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };    
        console.log('post1',post)    
        socket.emit('collecteddata', post);    
    })
    if(newBGArray_重工.length>0) {
        isSubmit = true;
        submitType = '重工报工';
        $('#myloader').addClass('ui active inverted dimmer'); 
        var obj = {        
            标签号:newBGArray_重工,        
            报工时间:moment().format('YYYY-MM-DD HH:mm:ss'),
            是否重工:true
        }
        var post = {
            title: "后工序报工记录",
            description: "所有的后工序报工记录都会记录于此",
            formtag:"gettingrecords",
            type: "collecteddata",
            username: currentUser.user_name,
            poststatus:'abled',
            templateid:'5d284e29be727d23b4ec6664',
            collectedData: obj,        
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };    
        console.log('post2',post)    
        socket.emit('collecteddata', post);       
    }
    if(newBGArray_normal.length>0) {       
        var smallLogistics = {};
       // $('#myloader').removeClass('active');
        // $('#workfinish').attr('disabled',false);

        // //小标签可能对应不同的MO
        // _.forEach(newBGArray_normal, function(a) {
        //     smallLogistics[a.标签号] = {};
        //     //查找MO，是否有不同的MO
        //     var selectBao = _.filter(后工序总MO列表, {领料单号: {最小包装标签: [{物料标签号: a.标签号}]}})[0];
        //     _.forEach(selectBao.小标签流信息[a.标签号], function(m) {
        //         if(m.detailType == '报工') {
        //             m.最小包规 = parseFloat(selectBao.最小包规);
        //             m.客户编码 = selectBao.客户代号;
        //             m.健大品号 = selectBao.成品代号;
        //             m.客户品号 = selectBao.客户料号;
        //             m.插针MO = selectBao.MO;
        //             m.工序 = [];
        //             var tmp = _.filter(selectBao.制程, function(n) {
        //                 return n.制程代号 == m.制程代号;
        //             })
        //             _.forEach(selectBao.制程, function(t) {
        //                 m.工序.push(t.制程名称);
        //                 m[t.制程名称].合格数 = 0;
        //                 m[t.制程名称].不良品数 = 0;
        //             })
        //             m[tmp[0].制程名称].不良品数 = m.不良品数 == '' ? 0 : parseFloat(m.不良品数)
        //             m[tmp[0].制程名称].合格数 = parseFloat(selectBao.最小包规) - (m.不良品数 == '' ? 0 : parseFloat(m.不良品数));
        //             Object.assign(smallLogistics[a.标签号], m);
        //         }
        //     })
        //     //将当前报工数据写入
        //     var obj = {};
        //     var tmp2 = _.filter(selectBao.制程, function(n) {
        //         return n.制程代号 == a.制程代号; 
        //     })
        //     obj.标签号 = a.标签号;
        //     obj.工序代号 = a.制程代号;
        //     obj.最小包规 = parseFloat(selectBao.最小包规);
        //     obj.客户编码 = selectBao.客户代号;
        //     obj.健大品号 = selectBao.成品代号;
        //     obj.客户品号 = selectBao.客户料号;
        //     obj.插针MO = selectBao.MO;
        //     obj.工序 = [];
        //     _.forEach(selectBao.制程, function(t) {
        //         obj.工序.push(t.制程名称);
        //         obj[t.制程名称] = '';
        //     })
        //     obj[tmp2[0].制程名称].合格数 = parseFloat(selectBao.最小包规) - (a.不良品数 == '' ? 0 : parseFloat(a.不良品数));
        //     obj[tmp2[0].制程名称].不良品数 = a.不良品数 == '' ? 0 : parseFloat(a.不良品数)
        //     obj.桌号 = a.桌号;
        //     obj.detailType = '报工';
        //     obj.开工时间 = moment().format('YYYY-MM-DD');
        //     obj.detailTime = moment().format('YYYY-MM-DD');
        //     Object.assign(smallLogistics[a.标签号], obj);
        // })

        // console.log(smallLogistics)

        isSubmit = true;
        submitType = '报工';
        $('#myloader').addClass('ui active inverted dimmer'); 
        var obj = {        
            标签号:newBGArray_normal,        
            报工时间:moment().format('YYYY-MM-DD HH:mm:ss'),
            是否重工:false
        }
        var post = {
            title: "后工序报工记录",
            description: "所有的后工序报工记录都会记录于此",
            formtag:"gettingrecords",
            type: "collecteddata",
            username: currentUser.user_name,
            poststatus:'abled',
            templateid:'5d284e29be727d23b4ec6664',
            collectedData: obj,        
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };    
        console.log('post3',post)    
        socket.emit('collecteddata', post);          
    }        
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