var global_tagArray = [];
var firstSelected = '', MRSY;
var tagdetailHtml = [];
var canPrint = false;
var hgx_port = fortest?'8896':'8893';
window.cpj = false;
window.selectedPrinterIndex = 0;
window.printerName = "",
window.clientPrinter = null;
window.installedPrinters = [],
window.printerNetworkIp = "",
window.printerNetworkPort = 0,
window.printerNetworkDns = "",
window.printerLptPort = "",
window.printerSerialPort = "",
window.printerSerialPortBaudRate = 0,
window.printerSerialPortParity = 0,
window.printerSerialPortStopBit = 0,
window.printerSerialPortDataBits = 0,
window.printerSerialPortFlowControl = 0


printerName = 'small';
cpj = new JSPM.ClientPrintJob();
clientPrinter = new JSPM.InstalledPrinter(printerName);
cpj.clientPrinter = clientPrinter;  
cpj.printerCommands = ''; 

var isSubmit = false;
window.socket = io.connect('https://www.kenta.cn:8892');
socket.on('connect', function (response) {
	console.log('ws已连接')
});
var socket2 = io.connect('https://www.kenta.cn:'+hgx_port);
socket2.emit('storeClientInfo', ['后工序总MO列表','MRSY']);
socket.on('postidReturn', function (response) {          
    global_json = response;
    var html = response.formhtml.slice(0,-6)+'<div class="field" id="sumdetail"></div><div class="field" id="bigtagpreview"></div><div class="fluid ui button" onclick="RePrint()">重新打印</div><div class="ui error message"></div></div>';         
    $('#formtitle').html(response.title);
    $('#formdescription').html(response.description);
    $('#display').html(html);
    $('.ui.dropdown').dropdown();
    $('.ui.form.first').form({            
        fields:global_json.fields
    });   
    
    $('input[name="被包装标签_input"]').keydown(function (e) {
        if (e.keyCode == 13) {
            console.log($('input[name="被包装标签"]').val())                      
            var inputvalue = $('input[name="被包装标签_input"]').val();            
            var selected = _.find(后工序总MO列表,{领料单号:{最小包装标签:[{物料标签号:inputvalue}]}});
            if(selected==undefined) {
                selected = _.find(后工序总MO列表,{成品标签:[{成品标签:inputvalue}]});
                if(selected == undefined) {
                    alert('标签错误,请检查!');
                    $('input[name="被包装标签_input"]').val('');
                    return false;
                }else {
                    if($('input[name="被包装标签"]').val()!='') {
                        //selected.level
                        var nextselected = _.find(selected.成品标签,{成品标签:inputvalue});
                        if(nextselected.MO != JSON.parse(firstSelected).MO) {
                            alert('非本MO标签');
                            $('input[name="被包装标签_input"]').val('');
                            return false;
                        }
                        if(nextselected.level != JSON.parse(firstSelected).bzlvl) {
                            alert('非同层包规');
                            $('input[name="被包装标签_input"]').val('');
                            return false;
                        }
                    }else {  
                        firstSelected = selected;   
                        firstSelected.bzlvl = _.find(selected.成品标签,{成品标签:inputvalue}).level;  
                        firstSelected = JSON.stringify(firstSelected);                        
                    }                    
                }
            }else {
                //小标签才会做下列判断
                if($('input[name="被包装标签"]').val()!='') {
                    //判断标签是否符合包装条件
                    var tmp = _.chain(selected.QC记录).sortBy(function(n){                
                        return n.提交时间
                    }).groupBy(function(n){return n.标签号}).value();
                    if(tmp[inputvalue]==undefined) {
                        alert(inputvalue+'未生产');
                        $('input[name="被包装标签_input"]').val('');
                        return false;
                    }
                    if(tmp[inputvalue][tmp[inputvalue].length-1].检测结果=='NG'){
                        alert(inputvalue+'未QC通过');
                        $('input[name="被包装标签_input"]').val('');
                        return false;
                    }  
                    //如果符合 再判断是否同MO和同层包规
                    var nextselected = selected;
                    nextselected.bzlvl = 0;console.log('last',JSON.parse(firstSelected),'now',nextselected)
                    if(nextselected.MO != JSON.parse(firstSelected).MO) {
                        alert('非本MO标签');
                        $('input[name="被包装标签_input"]').val('');
                        return false;
                    }
                    if(nextselected.bzlvl != JSON.parse(firstSelected).bzlvl) {
                        alert('非同层包规');
                        $('input[name="被包装标签_input"]').val('');
                        return false;
                    }                    
                }else {
                    //判断标签是否符合包装条件                    
                    var tmp = _.chain(selected.QC记录).sortBy(function(n){                
                        return n.提交时间
                    }).groupBy(function(n){return n.标签号}).value('');
                    if(tmp[inputvalue]==undefined) {
                        alert(inputvalue+'未生产');
                        $('input[name="被包装标签_input"]').val('');
                        return false;
                    }
                    if(tmp[inputvalue][tmp[inputvalue].length-1].检测结果=='NG'){
                        alert(inputvalue+'未QC通过');
                        $('input[name="被包装标签_input"]').val('');
                        return false;
                    }      
                    firstSelected = selected;
                    firstSelected.bzlvl = 0;
                    firstSelected = JSON.stringify(firstSelected);                                       
                }                             
            }
                                    
            if($('input[name="被包装标签"]').val().split(',').indexOf(inputvalue)>-1) {
                alert('此标签已存在');                
            }else {                
                var tmp = $('input[name="被包装标签"]').val()==""?[]:$('input[name="被包装标签"]').val().split(',');
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
                $('.menu.被包装标签').append(op);
                $('#被包装标签').dropdown({values:currentvalue});                                         
            }               
            $('input[name="被包装标签_input"]').val('');               
            $('input[name="被包装标签_input"]').focus()    
            preview();          
        }
    });  
    
    console.log('printStatus',printStatus)
    if(printStatus == 'offline') {
        alert('打印机离线,请检查!');
        return false;
    }  
});
socket.on('collecteddatawritedReturn', function (response) {
    if(response == 'errormsg') {
        alert('数据写入失败,请检查!');
    }else {    
        console.log('包装标签写入成功了')    
        $.get("https://www.kenta.cn:"+hgx_port+"/type=callfunction?dataname=QueryBigCards", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);      
    if(msg.后工序总MO列表 != undefined && msg.MRSY != undefined) {                
        if(isSubmit) {
            alert('提交成功！');
            $('#myloader').removeClass('active');
            console.log('can print',cpj)
            if (cpj) {                                
                cpj.sendToClient();
            }
            $('input[name="被包装标签_input"]').val('');
            $('input[name="成品标签"]').val('');
            $('#被包装标签').dropdown({values:[]});
            $('input[name="被包装标签_input"]').focus();     
            canPrint = false;         
            isSubmit = false;
        }   
        后工序总MO列表 = msg.后工序总MO列表;    
        MRSY = msg.MRSY; 
    }
});

//万一卡socket返回 就自动去掉loading
function intervarCheck() {
    setTimeout(function(){
        if(isSubmit) {
            alert('提交成功！');
            $('#myloader').removeClass('active');
            console.log('can print',cpj)
            if (cpj) {                                
                cpj.sendToClient();
            }
            $('input[name="被包装标签_input"]').val('');
            $('input[name="成品标签"]').val('');
            $('#被包装标签').dropdown({values:[]});
            $('input[name="被包装标签_input"]').focus();     
            $.get('https://www.kenta.cn:8893/type=getdata?dataname=后工序总MO列表',function(n){
                后工序总MO列表 = n; 
            },'json');
            canPrint = false;         
            isSubmit = false;
        }   
    },1000);
}

function RenderForm(id) {
    currentUser.loginrequired = true;
    var allowed = ['jiaming.liu','ricky.ngai','xiaoyu.ye','lucy.lee'];
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
 
function preview() {
    var allFields = $('.ui.form.first').form('get values'),postobj = {};   
    global_tagArray = allFields.被包装标签.split(',');   
    var xuehao = '';
    //查找对应的穴号
    var selectXue = _.filter(MRSY, {SERIAL_NUMBER: global_tagArray[0]})
    if(selectXue.length != 0) {
        xuehao = selectXue[0].MEMO;
    }
    
    var mopageinfo = {};
    var firstSelectedJson = JSON.parse(firstSelected);
    _.map(firstSelectedJson.mopageinfo,function(m,mkey){            
        if(m == "\\\\"||m == "\\") {
            mopageinfo[mkey] = "——";
        }else {
            mopageinfo[mkey] = m; 
        }            
    })  
    console.log('firstSelectedJson',firstSelectedJson);
    
    var maxSize = 0;
    if(parseInt(firstSelectedJson.mopageinfo.第4层数量)>0) {
        maxSize = 4;
    }else if(parseInt(firstSelectedJson.mopageinfo.第3层数量)>0) {
        maxSize = 3;
    }else if(parseInt(firstSelectedJson.mopageinfo.第2层数量)>0) {
        maxSize = 2;
    }else {
        maxSize =1;
    }
    
    var tableHtml = '';
    // $('#sumdetail').html(''); 
    // $('#bigtagpreview').html('');
    var outertag = moment().format("x");
    var funcObj;    
    var bztype = mopageinfo["第"+(firstSelectedJson.bzlvl+1)+"层标签类别"];
    if(maxSize == firstSelectedJson.bzlvl) {        
        $('#sumdetail').html('<h3 style="color:red">当前被包装标签已经是最大包装!</h3>')
        return false;
    }
    if(firstSelectedJson.bzlvl == 0) {//1层包规        
        var 将被包装数 = 0,最后一包之前包装数 = 0;
        var bzobj = {};
        _.map(global_tagArray,function(n,n_index){
            var selectTag = _.find(后工序总MO列表,{领料单号:{最小包装标签:[{物料标签号:n}]}});                                                   
            var mytag = selectTag.领料单号.标签状态[n];          
            bzobj[n] = (mytag.包规数 - mytag.不良品数 - mytag.被包装数);
            将被包装数 += bzobj[n];
            if(n_index<global_tagArray.length-1) {
                最后一包之前包装数 = 将被包装数;
            }               
        }); 
        postobj.level = 1;
        postobj.数量 = parseInt(firstSelectedJson.mopageinfo.第1层数量);
        postobj.包规 = parseInt(firstSelectedJson.mopageinfo.第1层数量);
        postobj.下层包规 = parseInt(firstSelectedJson.mopageinfo.第2层数量);
        if(将被包装数<postobj.包规) {
            //$('#sumdetail').html('<h3 style="color:red">理论包装数:'+postobj.包规+'\实际包装数:'+将被包装数+'</h3>')
            //var r = confirm('理论包装数:'+postobj.包规+'\n实际包装数:'+将被包装数);
            if(parseInt(firstSelectedJson.需生产数量)-firstSelectedJson.订单数量状态分布.已包装数量>postobj.包规) {                    
                $('#sumdetail').html('<h3 style="color:red">理论包装数:'+postobj.包规+'\实际包装数:'+将被包装数+'<br/>订单剩余数量大于包装包规,本次包装需补全包规数!</h3>')
                return false;
            }else {
                postobj.数量 = 将被包装数;
                postobj.小包被包装情况 = bzobj;
            }                       
        }else {
            console.log(2,将被包装数,postobj.包规) 
            if(将被包装数-postobj.包规>=parseInt(firstSelectedJson.最小包规)) {
                //表示扫描的标签超过规定数,找出最后扫进去的标签 去除
                var lasttag = $('#被包装标签').dropdown('get value').split(',');
                lasttag = lasttag[lasttag.length-1];                
                $('#sumdetail').html('<h3 style="color:red">补完数后余数多余包规,自动去除'+lasttag+'!</h3>')
                $('#被包装标签').dropdown('remove selected',lasttag);
                return false;
            } 
                   
            bzobj[global_tagArray[global_tagArray.length-1]] = postobj.数量 - 最后一包之前包装数;
            postobj.小包被包装情况 = bzobj;
        }
        funcObj = makePrintInfo(bztype,mopageinfo,false,outertag,postobj.数量, xuehao);        
    }else {
        var 将被包装数 = 0,最后一包之前包装数 = 0;
        var bzobj = {};
        _.map(global_tagArray,function(n,n_index){
            var selectTag = _.find(后工序总MO列表,{成品标签:[{成品标签:n}]});                           
            bzobj[n] = _.find(selectTag.成品标签,{成品标签:n}).数量;
            将被包装数 += bzobj[n];   
            if(n_index<global_tagArray.length-1) {
                最后一包之前包装数 = 将被包装数;
            }                
        });
        //console.log(将被包装数,firstSelectedJson.mopageinfo)
        postobj.level = firstSelectedJson.bzlvl+1;
        postobj.数量 = 将被包装数;
        postobj.包规 = parseInt(firstSelectedJson.mopageinfo['第'+(firstSelectedJson.bzlvl+1)+'层数量']);
        postobj.下层包规 = parseInt(firstSelectedJson.mopageinfo['第'+(firstSelectedJson.bzlvl+2)+'层数量']);
        if(将被包装数<postobj.包规) {
            var 已包装数量 = 0;
            _.chain(firstSelectedJson.成品标签).filter({level:firstSelectedJson.bzlvl}).map(function(value){
                已包装数量+=value.数量
            });
            if(parseInt(firstSelectedJson.需生产数量)-firstSelectedJson.订单数量状态分布.已包装数量>postobj.包规) {                    
                $('#sumdetail').html('<h3 style="color:red">理论包装数:'+postobj.包规+'\实际包装数:'+将被包装数+'<br/>订单剩余数量大于包装包规,本次包装需补全包规数!</h3>')
                return false;
            }else {
                postobj.数量 = 将被包装数;
                postobj.小包被包装情况 = bzobj;
            }                      
        }else {
            if(将被包装数-postobj.包规>=_.find(firstSelectedJson.成品标签,{成品标签:global_tagArray[0]}).包规) {  
                //表示扫描的标签超过规定数,找出最后扫进去的标签 去除
                var lasttag = $('#被包装标签').dropdown('get value').split(',');
                lasttag = lasttag[lasttag.length-1];                
                $('#sumdetail').html('<h3 style="color:red">补完数后余数多余包规,自动去除'+lasttag+'!</h3>')
                $('#被包装标签').dropdown('remove selected',lasttag);              
                return false;
            } 
            bzobj[global_tagArray[global_tagArray.length-1]] = postobj.数量 - 最后一包之前包装数;
            postobj.小包被包装情况 = bzobj;
        }
        if(maxSize - firstSelectedJson.bzlvl == 1) {//包最大箱
            funcObj = makePrintInfo(bztype,mopageinfo,false,outertag,postobj.数量, xuehao);
        }else {//包中间箱
            funcObj = makePrintInfo(bztype,mopageinfo,true,outertag,postobj.数量, xuehao);
        }
    }
    
    clientPrinter = new JSPM.InstalledPrinter(funcObj.printerName);
    cpj.clientPrinter = clientPrinter;  
    cpj.printerCommands = funcObj.printerCommands;
    tableHtml = funcObj.tableHtml;

    
    //显示预览信息   
    $('#sumdetail').html('');   
    $('#bigtagpreview').html(tableHtml);
    $('.ui.celled.table').transition('glow');

    //满足条件后直接打印
    postobj.提交时间 = moment().format('YYYY-MM-DD HH:mm:ss');
    postobj.user = window.currentUser;
    postobj.MO = firstSelectedJson.MO; 
    postobj.被包装标签 = global_tagArray;
    postobj.printerName = funcObj.printerName;
    postobj.成品标签代码 = cpj.printerCommands;
    postobj.成品标签 = outertag;

    isSubmit = true;
    $('#myloader').addClass('ui active inverted dimmer');
    var post = {
        title: global_json.title,
        description: global_json.description,
        formtag:global_json.formtag,
        type: "collecteddata",
        username: currentUser.user_name,
        poststatus:'abled',
        templateid:'5d270ceebaf2732984fb8549',
        collectedData: postobj,        
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fortest:fortest
    };    
    console.log('post2',post)           
    socket.emit('collecteddata', post);    
    var wmspost = {
        title:'WMS入库比对数据',
        description:'WMS入库比对数据',
        formtag:'WMS入库比对数据',
        type: "collecteddata",
        username: 'jiaming.liu',
        poststatus:'abled',
        templateid:'5d3004d1effc481c0cdfef57',
        collectedData:{
            包装来源:'系统包装',
            条码号:outertag,
            健大品号:mopageinfo.产品编码,
            客户料号:mopageinfo.产品名称,
            数量:postobj.数量,
            包装日期:moment().format('YYYY-MM-DD HH:mm:ss'),
            客户编号:mopageinfo.客户代号,
            后工序MO:mopageinfo.制令单号,
            包装员:currentUser.real_name+'('+currentUser.workno+')',
            单位编码:2,
            单位名称:'PCS',
        },
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fortest:fortest
    }
    socket.emit('collecteddata', wmspost);  
    intervarCheck() 
}

function makePrintInfo(bztype,mopageinfo,isMiddle,outertag,sum, xuehao) {
    var obj = {
        printerName:'',
        printerCommands:'',
        tableHtml:''
    }
    //如果没有穴号
    if(xuehao == '' || xuehao == null || xuehao == undefined || xuehao == 0) {
        if(bztype == '小标签') {
            obj.printerName = 'small';   
            obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>生产单号:</th><td>'+mopageinfo.制令单号+'</td><th>生产日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            if(isMiddle==true) {
                obj.printerCommands = '^XA^FO95,5^FO95,5^FO210,10^AF,N,,^FB620,1,0,L,0^A1N,34,30^FD健大电业制品（昆山）有限公司^FS^FO100,40^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO100,70^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户订单号:'+mopageinfo.客户单号+'^FS^FO100,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装员:'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO350,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装日期:'+moment().format('YYYY-MM-DD HH:mm')+'^FS^FO550,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装数量:'+sum+'^FS^FO550,160^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO470,40^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO440,70^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大料号:'+mopageinfo.产品编码+'^FS^FO180,130^BCN,80,Y,N,N,N^FD'+outertag+'^FS^XZ';
            }else {
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO95,5^FO95,5^FO150,10//kentaicon^FO150,10^GFA,520,520,13,,:O0LFGC,M0IFGCI0IFGE,L0GFGEN0G1GFGE,K0GFGCQ0G7GF,J0G7GFR0G1GFG8,I0G3GFU0GF,I0GFG8U0G1GC,H0G3GCW0G3G8,H0G6X0G1GC,G0G3G9GCG0G7G1HFG8G3G8G0GEG3HFGEG0GFH0G7,G0G3G9GCG0GFG1HFG8G7GCG0GEG3HFGEG1GFH0G3G8,G0G6G1GCG0GFG1HFG8GFGCG0GEG3HFGEG1GFG8H0GC,G1GCG1GCG3GEG1GCH0GFGCG0GEG0G3GEG0G3GFG8H0G7,G1G8G1GCG7GCG1GCH0HFG0GEG0G3GEG0G3GBG8H0G3,G3G0G1GCG7G8G1GCH0GFG7G0GEG0G3GEG0G3G9GEH0G1G8,G2G0G1GCGFG0G1GCH0GFG7G8GEG0G3GEG0G3G9GEI0GC,G6G0G1GDGFG0G1HFG0GFG7G8GEG0G3GEG0G7G8GEI0GC,G6G0G1GFGEG0G1HFG0GFG3G8GEG0G3GEG0G7G0GEI0GC,GCG0G1GDGFG0G1HFG0GFG3GCGEG0G3GEG0GFG0GEI0GE,GCG0G1GCG7G8G1GCH0GFG0HEG0G3GEG1GEG0GFI0GE,G6G0G1GCG7G8G1GCH0GFG0GFGEG0G3GEG1IFI0GC,G6G0G1GCG7GCG1GCH0GFG0GFGEG0G3GEG1IFI0GC,G2G0G1GCG3GEG1GCH0GFG0G7GEG0G3GEG1GCG0G7GCH0GC,G3G0G1GCG1GEG1HFG8GFG0G7GEG0G3GEG1GCG0G7GCG0G1G8,G1G8G1GCG0GFG1HFG8GFG0G3GEG0G3GEG3GCG0G7GCG0G3,G1GCG1GCG0G7G1HFG8GFG0G1GEG0G3GEG3G8G0G1GCG0G7,G0G6gG0GC,G0G7G8Y0G1G8,G0G3GCY0G7,H0G6X0G1GC,H0G1GCW0GFG8,I0GFG8U0G3GC,I0G1GFT0G1GE,J0G7GCS0G7GE,K0GFGCQ0G7GE,L0HFG8M0G1GFGE,M0G7IFG8G0G3IFGC,O0G3KFG8,^FS^FO285,15^AD,N,,^FB620,1,0,L,0^A1N,38,36^FD物料标识纸^FS//rohsicon^FO550,10^FO550,10^GFA,600,600,15,P0G3KFGC,:N0G3OFG8,L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,J0G7GEU0G7G8,:I0G1GFW0GF,I0G7G8W0G3GE,H0G1GCY0G3G8,H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,:G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,:G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,I0G7G8W0G3GE,J0GFV0G1GF,J0G3GEU0G7G8,:K0G1GFG8Q0G3GFG8,L0G3GFGEO0G7GFG8,N0G3OFG8,P0G3KF,^FS^FO105,60^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD生产单号:'+mopageinfo.制令单号+'^FS^FO665,10^FO105,90^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO105,120^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大品号:'+mopageinfo.产品编码+'^FS^FO410,65^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD生产日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO105,148^BCN,60,Y,N,N,N^FD'+outertag+'^FS^FO510,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO510,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD数量:'+sum+'^FS^FO510,160^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO510,210^AF,N,,^FB620,1,0,L,0^FDMADE IN CHINA^FS^XZ';            
            }
        }
        if(bztype == '大标签') {
            obj.printerName = 'large';        
            obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO45,15^GB730,810,1,,0^FS^FO46,16^GB728,808,1,,0^FS^FO62,32//kenta^FO62,32^GFA,3990,3990,57,,:::::::::hM0GC,gQ0G7G8H0G1GCJ0G7GEI0G1GFGCH0G1G8G1G8O0G8S0GCK0GE,gQ0G3G8I0GFJ0GFGEI0G3GFGCH0G3GCG1G8I0GFJ0G3G8H0G1GFG8I0G3G8I0GEK0GFG6H0G1GCGFG8N0GFGE,gP0G8G3GCI0GFJ0GFGCI0G3GBGCH0G3GEG1G8I0GFJ0G3I0G1GFGCI0G3G8I0GEK0G7GFH0G3GCGFGCN0HF,gO0G1GEG7GEI0GFJ0GFG8I0GFGBG8H0G1GEG1G8H0HFJ0G3I0G3GFGEI0G3G8I0G7G8J0G7GFG8G0GFGDGFGEH0GEG1GFH0G1HFG8,gO0G1GEG7GEI0GEJ0G6G3G8G0G1HFI0G5GEG1G8G0G3HFJ0G3H0G1GFGCGFI0G3G8I0G3G8J0HFG8G0GFGDGFGEG0G1GEG1GFH0G1GEG7G8,gO0G1GEG7GEI0GFJ0HFGCG0G1IFH0G7GFG9G8G0G3GCGFJ0GFH0G1GCHEI0G3G8I0G3G8I0IFH0G7G8G3GCG0G1GEG3GFG8I0G7G8,gO0G1GEG3GFG8H0HFH0G7GBGCGEG0G1IFG8G0G7G8GDG8G0G3GCGEJ0GEH0G1HFGCI0G3G8I0G3GCH0G7HEI0G3GBGFGCG0G7GEG6G3H0G1GCG7,P0G1KFGCR0G3GFG3GFG8H0HFH0G7G9GFGEG0HFG3G1G8G0G7HDG8G0G3GDGEJ0GEI0HFGCI0G3G8I0G1GCH0GFGCG7G8H0G7GBGFG8G0GFGCG6H0G1GFGCG7,O0G1NFQ0G7G9GFGCI0HFH0G7GBGFGCG1GFGEGBI0G7GFGDG8G0G3GFGCJ0GEI0GFG3G8I0G3G8G6H0G1GCH0GFG0GFGCG0G1GFGBGFG8G1GFG9G8H0G1GFGCG7,N0QFGCO0G7G9GFGCH0G1GFGCH0GFGBGFG8G1GFG6G3G8H0G7GFG9G8G0G3GFGCJ0GEI0HFG8I0G3G8GEH0G1GCH0GCG0GFGCG0G1GFGBGFG8G1GFG1G8H0G1GFG0G7,M0G3IFGCI0G1JFG8N0GFG3GBGEH0G7GFH0G1GDGBGCI0G7GFGCH0G7GCG5G8G0G3GFK0GEI0HFH0G1GEG3G8GFI0GCH0G8G3GDGEG0G1GFGBGFG8G0GCG1GCI0G6G0G7,K0G3HFGCG0G7LFG8G1HFGEL0G1GFGCGFGCG0G1GFGCH0G1GCGFG8I0G7GEH0G7G9GFGDG8G0G6G0G3GCI0GEI0G3GCGFG0G1GEG3G8G7I0GCI0HFGEG0G1GFGBG1GCH0G3GCH0G1G9GCG7,K0G7IFGEG0G1IFGEH0JFG8K0G1GFGCG7GCH0GFGCI0G8HFG8H0G7GFH0GFG9GFGDG8G0H8GFGEI0GEI0G7GFGEH0GEG3G8G7I0GCH0G7HFGEG0G1GEG3G1G8H0G3GCH0G1GFGEG7,J0G3HFG1HFM0G3GFGEG3HFL0G9GDG3GEH0G3G8J0HFG8H0G3GFGCG0GFG7G3G9G8G1GBHFGEI0GEH0G1GFG3GCH0GEG3G8GEI0GCH0G7GEG7GEG0G1GCG3GFG8H0G7G3G8G0G1GFGEG7,J0G7HFGCR0IFG8K0G1GDHFH0G1G8I0G1GBGFG8H0G7GFGEG0GEG7G3G9G8G1IFGEI0GEH0G1GFG3G8H0G6G3GFGEH0G1GCH0G7GCG7G6G0G1GCG3GFG8H0GEGBG8G0G1GEGCG7,I0G1GFGCG3GCR0GFG1GFGCK0G1GDHFH0G1GBGCH0G1HFG8H0G7GFGEG0GCH7G9G8G1GFGEHCI0GEH0G1GEG7G8H0G7HFGEH0G1GCH0G1G8G7GEG0G1GCG3HFH0HFGCG0G1GFGCG7,I0GFGEG7G0G1G8HFGCG3H0GCIFG0G4G7G3GFGCJ0G1HFI0G7G3GFG8G0G1HFH0G1GFGEH0G1HFG1G8G0GFGCGFG8I0GEH0G3G8GEG0GCG0HFG0GEH0G3G8J0GFGEG0G1GEG2G3GFG8G1HFGCH0GFG8G7,H0G1GFG7GFG0G3G9HFGEG7G0G1GDIFG0G6G0G7GBGCJ0G1HFI0G7G0GFGCG0G1GFGEH0G1G8HCG0G1GBGFG1G8G0GFGCGFG8I0GEH0G3G9GFG1GEG1GFG8G0GEH0G3G8I0G1GFGEG0G1GEG3G6G7GCG0GFG9GCH0GEG0G7,H0G1GFG8G7G0G7G9HFGEG7G0G1GDIFG0GEG0G2G7GFJ0G3IFG8G3GFG0G7GCG0G1GFGCH0G1HCGEH0GBGDG9G8G0G7GCGFG8I0G7H0G1GFG7GFGEG0GFH0G6H0G3G8I0G1GEG6G0G1GEG3GCG3G8G0GEG1GEH0G6G3GF,H0G3GFGCG7G0G7G1HFGEG7G8G1GCIFG1GFH0G6GFJ0G3IFGCG3GFG0G3GCH0GFG8I0HCGEH0G3G8GDG8G0G7G8GCG8I0G3H0G1GEG3GFGEG0G6K0G3G8I0G1GEG6G0G1GEG3GCI0GEG0GCI0G7GE,H0G7GCG0G7G0GEG1GCH0G7GCG1GCG0GFG0G1GFH0G3GFGCI0G1GEG7GFGEG3GEG0G1GCH0HFG8G0G1GFGCG6H0G3G8G7G8G0G6L0G3H0G1GEG3GFGCM0GEK0GFGEH0G6G3GCO0G3GE,H0GFGCG0G7G1GEG1GCH0G7GCG1GCG0G7G0G1GFH0G3GFGCI0G1G8G0G7GCG3G8H0GCH0G7GFG8G0G1GFGCG2J0G7G8N0G3H0G1GEG0GEN0GEK0GFGEI0G3G8O0G1GE,G0G1GFH0G6G3GCG1GCH0G7GEG1GCG0GFG0G1GBG8H0G3GEU0G1GFG8H0G9GCK0G1G8O0G8S0G8K0G1GCU0G6,G0G1GDH0G6G7G8G1GCH0G7GFG1GCG0GFG0G3GBG8H0G3G6,G0G1GCH0G7GFG0G1HFGCH7G1GCG0GFG0G7GBGCH0G2G6,G0G1GEH0G7GFG0G1HFGCG7G3G1GCG0GFG0G7G9GCI0GE,G0G3GEH0G7GFG8G1HFGCG7G3G8GCG0GFG0G7G1GCI0GE,G0G1GEH0G7G9GCG1GCG1G8G7G1HCG0GFG0G7GFGEI0G6,G0G1GCH0G7G1GCG1GCH0G7G1HCG0GFG0G7GFGEH0G3G6,G0G1GDH0G7G1GEG1GCH0G7G0GFGCG0GFG0HFGEH0G3GE,G0G1GFH0G7G0GEG1GCH0G7G0GFGCG0GFG1IFH0G7GE,H0GEGCG0G7G0G6G1GCH0G7G0G7GCG0GFG1GEG0G7H0GDGC,H0G7GEG0G7G0G7G1GCH0G7G0G7GCG0GFG1GEG0G7G0G3GFGC,H0G3GFGCG7G0G3G9HFGEG7G0G3GCG0GFG3GCG0G7G8HFY0G1G8R0GCK0G6X0GEN0G6J0G1G8,H0G1GFGCG7G0G3G9HFGEG7G0G1GCG0GFG3GCG0G7G8GFGEJ0G7GEGFG8N0G3GFGEG3GCQ0G1GEK0GEG1GCG3G8L0G1GCL0GEI0GEH0G6G0G7J0G7GCQ0GC,H0G1GFGCGEG0G1G8HFGEG7G0G1GCG0GFG3GCG0G3GEG7GCJ0G7GCGFG8N0G3HFG3GCQ0G1GEK0GEG1GEG3GCL0G3GCL0GFI0GFG0G1GFG1GFGCI0HFG8J0G3GCI0G1GC,I0G7GFGCU0G1HFK0G3GCGFO0G1GEG7G3GCR0GCK0G8G1GCG3GCL0G3GCL0G3G8H0GFG0G1GEG3GBGCI0GEG7G8J0G3GCI0G1GC,I0G3GFG1GES0G3GEG7GFK0G3GCGEK0G3I0G1GEH3GCJ0G2R0G1G8G0GCG7G8L0G3GCL0G3G8H0G7G8G1GEG3G9G8H0G3GCG3G8J0G3G8G0G3G0G1GC,J0G7GFG0GFG8P0GFGCG7GFG8K0G3G9G8G0G3I0G7G0G4G0G1GEG0G3G8G3G0G1G0GEH0G1K0G1I0G3H0GCGEM0G1G8L0G3GCH0G7G8G3GCG3G8I0G3G8G1G8J0G3H0G6H0GC,J0G1HFGEG1HFK0G7GFGCG3HFGEL0G3GDH0G7G8GFGCG7GBGFG0G1GCG0G3G8G7G8G3GCGFG7GEG3GCG7GFG3GCG7GEH0G3H0HCG0GEG7G3GFG8GFG9GFGCG7GCHFG0G1GCH0G3G8G3GCG3G8G7GFG0G3G8H0GFG8H0G3H0GFG1GFGC,K0G7GFGCG3HFGEI0G3HFGEG0HFM0G3GEG0G1GFGDGFGCG7GBGFG0G1GEG6G3G8GFGCGFGCGFG7GEGFGEG7GFG3GCGFGEH0G3H0GDGCG0GEG7G3GFG8GFG9GFGCGFGCHFG0G1GCH0G3GCG3GCG3GCHFG0G7G8G0G1GFG8H0G3H0GFG9GFGC,K0G1IFGEH0G7HFH0G1IFGCM0G3GEG0G1G9GCHEG7G3GBG8G1GFGEG3H9GCGFHEG7GFHEG7GFG9HCGEH0G3H0GFH0GEG7GBGFG8H9GFGCGEGCHFH0GCH0G7GEG3GCG3G9HEG0G7G8G0G1GFGCH0G3H0GFG1GFGC,L0G1HFGEG0G1IFGCH0HFGCN0G3GEG0G1G8HCGEG7G3GBG8G1GFGEG3G9G8JCG7G1HEG7GBG9HCGEH0G3H0GFH0G6H3G1I9GDGCGEGCGFG3H0GCH0G7GEG5GCG3G9GCGEG0G7G8G0G3G1GCH0G3H0GEG3G9GC,N0G7PFP0G3GFG8G1GFG8GCGEG3G0G7G8G1GCG0G3G9GFG8GCG0GEG7G1GCGFH3G9HCI0G3H0GDGCG0G6H3G1G8GEG1G9GCG1GCG7G3G0G1GCH0H6G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,P0MFG8Q0G3G9G8G1G8G0GCGEH3GBG8G1GCG0G3G9G8G1GCG0GCG7G1GCGFG3GBG9GDGCI0G3H0GDGEG0G6H3G1G8GFG1G9GCG6GCG7G3G0G3GCH0G6G7G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,Q0G1IFGES0G3G9GCG1G8G0GCGEH3GBG8G1GEG0G3G9G8G1GCG0GCG7G1GCGEG7G3G9HCI0G3H0GCGFG0G6H3G1G8G7H9GCGEGCG7G3G0G3G8H0G6G7GDGCG3G8HEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,gO0G3G9GEG1G8HCGEI3G8G1GEH3G9H8GCG4GCG7G1HEG7GBG9HCG2H0G3G8G0GCGFG0G6H3G1G8G3H9GDHCG7G3G0G3G8H0G6G7G9GCG3G8G7H0G3G8G1G3G0GEH0G3H0GEG7G1GC,gO0G3GCGFG1ICGEG7H3G8G1GCH3G9HCGEGCGEG7G1HEG7GBG9GCHEH0G1G8G0GCG7G8G6G7G3G1G9G1H9GDHCG7G3G0G7G8H0G6G3G9GCG3G8GFG0G6G3G8G1GBG1GCG4G0G3G0G6GEG7G9GCG8,gO0G7GCGFG9GFGDGCGEG7GBGFGCG3GEH3G9GFGCGFGCGFG7G1HEG7GBG9GCGFGEI0GCG0GCG3GCH7GBG1J9GDGEGCGFG3G0GFI0G6G3G9GCG3G9GFGCG7G3GCG7G3G9G8GCGFG3G8GEG6G7H9GC,gO0G7GCGFGCG7G1GEGFG3GBG9G8G3GFGEG3GCG7G0G3G8H7G8G3G8GFG7GBGCG7G8I0G6G1GEG3GFG7GFGBG9GCGFG3GFGCG7HFG7G1GCI0GFG0G3GEG3G8GFGEG7G0G7GEG1GFG8GCGFG3GFGEG3G1GFG9GC,gO0G1G8G1GCG7G0G4G2G0G1G8G0G1G3GCG1G8G7G0G3G0G2G3G0G3G0G6G2G1G8G3J0G6G1GCG0GEG3G8G1G9GCGEG1HCG6G0GCG3G0G8I0GEG0G1GEG3G8HFG6G0G7GCG0GFG0GCGFG3GFGCG3G0GFG9GC,jR0G1G8G3N0G7,jR0G3GCG3N0G6,jR0G3GFGEN0GE,jS0GFGC,,:::^FS^FO542,42//rohs^FO542,42^GFA,750,750,15,P0G3KFGC,:N0G3OFG8,:L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,:J0G7GEU0G7G8,I0G1GFW0GF,:I0G7G8W0G3GE,H0G1GCY0G3G8,:H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,:G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,:G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,:G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,:G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,:G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,:G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,:I0G7G8W0G3GE,J0GFV0G1GF,:J0G3GEU0G7G8,K0G1GFG8Q0G3GFG8,:L0G3GFGEO0G7GFG8,N0G3OFG8,:P0G3KF,^FS^FO682,32^FO62,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户编号:^FS^FO170,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户代号+'^FS^FO112,172^AD,N,,^FB696,1,0,L,0^FDC/N:____________________^FS^FO62,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户料号:^FS^FO170,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品名称+'^FS^FO62,232^AD,N,,^FB696,1,0,L,0^FDCustomerP/N:________________^FS^FO62,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料生产商:^FS^FO170,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料供应商+'^FS^FO62,292^AD,N,,^FB696,1,0,L,0^FDMaterialSupplier:___________^FS^FO62,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料品名:^FS^FO170,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料名称+'^FS^FO62,352^AD,N,,^FB696,1,0,L,0^FDMaterialName:_______________^FS^FO62,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料规格:^FS^FO170,382^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料规格+'^FS^FO62,412^AD,N,,^FB696,1,0,L,0^FDMaterialSpec:_______________^FS^FO62,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装员:^FS^FO170,442^FB290,1,0,C,0^A1N,24,20^FD'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO62,472^AD,N,,^FB696,1,0,L,0^FDPackager:___________________^FS^FO62,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD贸易方式:^FS^FO170,502^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.贸易方式+'^FS^FO62,532^AD,N,,^FB696,1,0,L,0^FDModeofTrade:________________^FS^FO562,112^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD_______月份Month^FS^FO450,105^FB290,1,0,C,0^A1N,24,20^FD'+(moment().get("month")+1)+'^FS^FO420,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户订单号:^FS^FO496,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户单号+'^FS^FO420,172^AD,N,,^FB696,1,0,L,0^FDPartNo.:____________________^FS^FO420,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD健大品号:^FS^FO496,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品编码+'^FS^FO420,232^AD,N,,^FB696,1,0,L,0^FDKentaP/N:___________________^FS^FO420,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FDUL号码:^FS^FO496,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.UL号+'^FS^FO420,292^AD,N,,^FB696,1,0,L,0^FDULFileNo.:__________________^FS^FO420,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD防火等级:^FS^FO496,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.防火等级+'^FS^FO420,352^AD,N,,^FB696,1,0,L,0^FDFlameClass:_________________^FS^FO420,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD数量:^FS^FO496,382^FB290,1,0,C,0^A1N,24,20^FD'+sum+'^FS^FO420,412^AD,N,,^FB696,1,0,L,0^FDQuantity:___________________^FS^FO420,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装日期:^FS^FO496,442^FB290,1,0,C,0^A1N,24,20^FD'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO420,472^AD,N,,^FB696,1,0,L,0^FDPackingDate:________________^FS^FO420,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD已验收:^FS^FO496,502^FB290,1,0,C,0^A1N,24,20^FD合格^FS^FO420,532^AD,N,,^FB696,1,0,L,0^FDQCPass:_____________________^FS^FO92,612^BCN,160,Y,N,N,A^FD'+outertag+'^FS^FO60,535^AE,N,,^FB730,1,0,L,0^FD_________________________________________________________^FS^FO550,780^AD,N,,^FB696,1,0,L,0^A1N,34,32^FDMADE IN CHINA^FS^XZ';
            obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户编号:</th><td>'+mopageinfo.客户代号+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>原料生产商:</th><td>'+mopageinfo.原料供应商+'</td><th>UL号码:</th><td>'+mopageinfo.UL号+'</td></tr><tr><th>原料品名:</th><td>'+mopageinfo.原料名称+'</td><th>防火等级:</th><td>'+mopageinfo.防火等级+'</td></tr><tr><th>原料规格:</th><td>'+mopageinfo.原料规格+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format('YYYY-MM-DD HH:mm')+'</td></tr><tr><th>贸易方式:</th><td>'+mopageinfo.贸易方式+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>'; 
        }
        if(bztype == '客制小标签') {
            obj.printerName = 'small';                
            if(mopageinfo.客户代号 == 'E-030') {                    
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO95,5^FO95,5^FO150,10^FO285,15^AD,N,,^FB620,1,0,L,0^A1N,38,36^FD物料标识纸^FS//rohsicon^FO550,10^FO550,10^GFA,600,600,15,P0G3KFGC,:N0G3OFG8,L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,J0G7GEU0G7G8,:I0G1GFW0GF,I0G7G8W0G3GE,H0G1GCY0G3G8,H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,:G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,:G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,I0G7G8W0G3GE,J0GFV0G1GF,J0G3GEU0G7G8,:K0G1GFG8Q0G3GFG8,L0G3GFGEO0G7GFG8,N0G3OFG8,P0G3KF,^FS^FO105,60^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD生产单号:'+mopageinfo.制令单号+'^FS^FO665,10^FO105,90^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO105,120^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD品号:'+mopageinfo.产品编码+'^FS^FO410,65^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD生产日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO105,148^BCN,60,Y,N,N,N^FD'+outertag+'^FS^FO510,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO510,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD数量:'+postobj.数量+'^FS^FO510,160^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO510,210^AF,N,,^FB620,1,0,L,0^FDMADE IN CHINA^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>生产单号:</th><td>'+mopageinfo.制令单号+'</td><th>生产日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }        
            if(mopageinfo.客户代号 == 'K-036') {                   
                obj.printerCommands = '^XA^FO95,5^FO95,5^FO210,10^AF,N,,^FB620,1,0,L,0^A1N,34,30^FD健大电业制品（昆山）有限公司^FS^FO100,40^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO100,70^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户订单号:'+mopageinfo.客户单号+'^FS^FO100,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装员:'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO350,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO550,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装数量:'+sum+'^FS^FO550,160^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO470,40^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO440,70^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大料号:'+mopageinfo.产品编码+'^FS^FO180,130^BCN,80,Y,N,N,N^FD231321546^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>包装数量:</th><td>'+sum+'</td><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td></tr><tr><th>FD健大料号:</th><td>'+mopageinfo.产品编码+'</td></tr></tbody></table>';
            }        
            if(mopageinfo.客户代号 == 'W-030') {                    
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO95,5^FO95,5^FO150,10//kentaicon^FO150,10^GFA,520,520,13,,:O0LFGC,M0IFGCI0IFGE,L0GFGEN0G1GFGE,K0GFGCQ0G7GF,J0G7GFR0G1GFG8,I0G3GFU0GF,I0GFG8U0G1GC,H0G3GCW0G3G8,H0G6X0G1GC,G0G3G9GCG0G7G1HFG8G3G8G0GEG3HFGEG0GFH0G7,G0G3G9GCG0GFG1HFG8G7GCG0GEG3HFGEG1GFH0G3G8,G0G6G1GCG0GFG1HFG8GFGCG0GEG3HFGEG1GFG8H0GC,G1GCG1GCG3GEG1GCH0GFGCG0GEG0G3GEG0G3GFG8H0G7,G1G8G1GCG7GCG1GCH0HFG0GEG0G3GEG0G3GBG8H0G3,G3G0G1GCG7G8G1GCH0GFG7G0GEG0G3GEG0G3G9GEH0G1G8,G2G0G1GCGFG0G1GCH0GFG7G8GEG0G3GEG0G3G9GEI0GC,G6G0G1GDGFG0G1HFG0GFG7G8GEG0G3GEG0G7G8GEI0GC,G6G0G1GFGEG0G1HFG0GFG3G8GEG0G3GEG0G7G0GEI0GC,GCG0G1GDGFG0G1HFG0GFG3GCGEG0G3GEG0GFG0GEI0GE,GCG0G1GCG7G8G1GCH0GFG0HEG0G3GEG1GEG0GFI0GE,G6G0G1GCG7G8G1GCH0GFG0GFGEG0G3GEG1IFI0GC,G6G0G1GCG7GCG1GCH0GFG0GFGEG0G3GEG1IFI0GC,G2G0G1GCG3GEG1GCH0GFG0G7GEG0G3GEG1GCG0G7GCH0GC,G3G0G1GCG1GEG1HFG8GFG0G7GEG0G3GEG1GCG0G7GCG0G1G8,G1G8G1GCG0GFG1HFG8GFG0G3GEG0G3GEG3GCG0G7GCG0G3,G1GCG1GCG0G7G1HFG8GFG0G1GEG0G3GEG3G8G0G1GCG0G7,G0G6gG0GC,G0G7G8Y0G1G8,G0G3GCY0G7,H0G6X0G1GC,H0G1GCW0GFG8,I0GFG8U0G3GC,I0G1GFT0G1GE,J0G7GCS0G7GE,K0GFGCQ0G7GE,L0HFG8M0G1GFGE,M0G7IFG8G0G3IFGC,O0G3KFG8,^FS^FO285,15^AD,N,,^FB620,1,0,L,0^A1N,38,36^FD物料标识纸^FS//rohsicon^FO550,10^FO550,10^GFA,600,600,15,P0G3KFGC,:N0G3OFG8,L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,J0G7GEU0G7G8,:I0G1GFW0GF,I0G7G8W0G3GE,H0G1GCY0G3G8,H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,:G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,:G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,I0G7G8W0G3GE,J0GFV0G1GF,J0G3GEU0G7G8,:K0G1GFG8Q0G3GFG8,L0G3GFGEO0G7GFG8,N0G3OFG8,P0G3KF,^FS//环保icon^FO665,10^GFA,350,350,7,K0IFG8,J0G3GFGCG0G6,:J0G7GFGEG0G1G8,:I0G1IF,I0G1HFGDG8G0G4,I0G3HFG8GCG0G2G4,I0G7HFG8G6G0G1GC,I0G7HFG0G6G0G1G4,I0HFGEG0G2H0G4,H0G1HFGCJ0GC,:H0G1HFG8G0G1G8G0G8,I0HFH0G2H0G8,:I0G1GFH0G1GE,:H0G1G8G6I0G3GF,GFH0G4L0GFGE,:G3G8G0G4K0G3GFGE,G0G8G0G4K0G7HF,O0G7HF,G1H0G2K0G3HF,G3H0G2K0G1HFG8,:G2H0GEK0G1HFGC,H0G1GFG8K0HFGC,GCG0H1G8K0HFGC,GCG0G2M0HFGC,:GCG0GCK0G4G0G3GFGC,H0G8K0G4G0G3GFGC,:H3K0G1GCH0GFG8,:G1G7JFH0G7IFG8,G0KFG0GCI0G1,:G0KFG1G8I0G1,G0G7JFG3,G0G3JFG3J0G6,G0G3JFG1GCI0GE,H0G7IFG0G2H0G3,M0G1G7GFGC,M0G1GE,N0G6,::^FS^FO105,60^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD生产单号:'+mopageinfo.制令单号+'^FS^FO665,10^FO105,90^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO105,120^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大品号:'+mopageinfo.产品编码+'^FS^FO410,65^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD生产日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO105,148^BCN,60,Y,N,N,N^FD'+outertag+'^FS^FO510,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO510,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD数量:'+sum+'^FS^FO510,160^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO510,210^AF,N,,^FB620,1,0,L,0^FDMADE IN CHINA^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>生产单号:</th><td>'+mopageinfo.制令单号+'</td><th>生产日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }
        }
        if(bztype == '客制大标签') {
            obj.printerName = 'large';        
            if(mopageinfo.客户代号 == 'E-030') {               
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO45,15^GB730,810,1,,0^FS^FO46,16^GB728,808,1,,0^FS^FO62,32//rohs^FO542,42^GFA,750,750,15,P0G3KFGC,:N0G3OFG8,:L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,:J0G7GEU0G7G8,I0G1GFW0GF,:I0G7G8W0G3GE,H0G1GCY0G3G8,:H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,:G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,:G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,:G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,:G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,:G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,:G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,:I0G7G8W0G3GE,J0GFV0G1GF,:J0G3GEU0G7G8,K0G1GFG8Q0G3GFG8,:L0G3GFGEO0G7GFG8,N0G3OFG8,:P0G3KF,^FS^FO682,32^FO62,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户编号:^FS^FO170,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户代号+'^FS^FO112,172^AD,N,,^FB696,1,0,L,0^FDC/N:____________________^FS^FO62,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户料号:^FS^FO170,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品名称+'^FS^FO62,232^AD,N,,^FB696,1,0,L,0^FDCustomerP/N:________________^FS^FO62,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料生产商:^FS^FO170,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料供应商+'^FS^FO62,292^AD,N,,^FB696,1,0,L,0^FDMaterialSupplier:___________^FS^FO62,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料品名:^FS^FO170,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料名称+'^FS^FO62,352^AD,N,,^FB696,1,0,L,0^FDMaterialName:_______________^FS^FO62,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料规格:^FS^FO170,382^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料规格+'^FS^FO62,412^AD,N,,^FB696,1,0,L,0^FDMaterialSpec:_______________^FS^FO62,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装员:^FS^FO170,442^FB290,1,0,C,0^A1N,24,20^FD'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO62,472^AD,N,,^FB696,1,0,L,0^FDPackager:___________________^FS^FO62,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD贸易方式:^FS^FO170,502^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.贸易方式+'^FS^FO62,532^AD,N,,^FB696,1,0,L,0^FDModeofTrade:________________^FS^FO562,112^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD_______月份Month^FS^FO450,105^FB290,1,0,C,0^A1N,24,20^FD'+(moment().get("month")+1)+'^FS^FO420,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户订单号:^FS^FO496,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户单号+'^FS^FO420,172^AD,N,,^FB696,1,0,L,0^FDPartNo.:____________________^FS^FO420,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD品号:^FS^FO496,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品编码+'^FS^FO420,232^AD,N,,^FB696,1,0,L,0^FDP/N:________________________^FS^FO420,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FDUL号码:^FS^FO496,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.UL号+'^FS^FO420,292^AD,N,,^FB696,1,0,L,0^FDULFileNo.:__________________^FS^FO420,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD防火等级:^FS^FO496,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.防火等级+'^FS^FO420,352^AD,N,,^FB696,1,0,L,0^FDFlameClass:_________________^FS^FO420,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD数量:^FS^FO496,382^FB290,1,0,C,0^A1N,24,20^FD'+sum+'^FS^FO420,412^AD,N,,^FB696,1,0,L,0^FDQuantity:___________________^FS^FO420,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装日期:^FS^FO496,442^FB290,1,0,C,0^A1N,24,20^FD'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO420,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD已验收:^FS^FO496,502^FB290,1,0,C,0^A1N,24,20^FD合格^FS^FO420,532^AD,N,,^FB696,1,0,L,0^FDQCPass:_____________________^FS^FO420,472^AD,N,,^FB696,1,0,L,0^FDPackingDate:________________^FS^FO92,612^BCN,160,Y,N,N,A^FD'+outertag+'^FS^FO60,535^AE,N,,^FB730,1,0,L,0^FD_________________________________________________________^FS^FO550,780^AD,N,,^FB696,1,0,L,0^A1N,34,32^FDMADE IN CHINA^FS^XZ';            
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户编号:</th><td>'+mopageinfo.客户代号+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>原料生产商:</th><td>'+mopageinfo.原料供应商+'</td><th>UL号码:</th><td>'+mopageinfo.UL号+'</td></tr><tr><th>原料品名:</th><td>'+mopageinfo.原料名称+'</td><th>防火等级:</th><td>'+mopageinfo.防火等级+'</td></tr><tr><th>原料规格:</th><td>'+mopageinfo.原料规格+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format('YYYY-MM-DD HH:mm')+'</td></tr><tr><th>贸易方式:</th><td>'+mopageinfo.贸易方式+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }            
            if(mopageinfo.客户代号 == 'K-036') {                                
                obj.printerCommands = '^XA^FO95,5^FO95,5^FO210,10^AF,N,,^FB620,1,0,L,0^A1N,34,30^FD健大电业制品（昆山）有限公司^FS^FO100,40^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO100,70^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户订单号:'+mopageinfo.客户单号+'^FS^FO100,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装员:'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO350,100^AD,N,,^FB625,1,0,L,0^A1N,24,20^FD包装日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO550,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装数量:'+sum+'^FS^FO550,160^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO470,40^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO440,70^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大料号:'+mopageinfo.产品编码+'^FS^FO180,130^BCN,80,Y,N,N,N^FD231321546^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>包装数量:</th><td>'+sum+'</td><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td></tr><tr><th>FD健大料号:</th><td>'+mopageinfo.产品编码+'</td></tr></tbody></table>';
            }
            if(mopageinfo.客户代号 == 'W-030') {              
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO45,15^GB730,810,1,,0^FS^FO46,16^GB728,808,1,,0^FS^FO62,32//kenta^FO62,32^GFA,3990,3990,57,,:::::::::hM0GC,gQ0G7G8H0G1GCJ0G7GEI0G1GFGCH0G1G8G1G8O0G8S0GCK0GE,gQ0G3G8I0GFJ0GFGEI0G3GFGCH0G3GCG1G8I0GFJ0G3G8H0G1GFG8I0G3G8I0GEK0GFG6H0G1GCGFG8N0GFGE,gP0G8G3GCI0GFJ0GFGCI0G3GBGCH0G3GEG1G8I0GFJ0G3I0G1GFGCI0G3G8I0GEK0G7GFH0G3GCGFGCN0HF,gO0G1GEG7GEI0GFJ0GFG8I0GFGBG8H0G1GEG1G8H0HFJ0G3I0G3GFGEI0G3G8I0G7G8J0G7GFG8G0GFGDGFGEH0GEG1GFH0G1HFG8,gO0G1GEG7GEI0GEJ0G6G3G8G0G1HFI0G5GEG1G8G0G3HFJ0G3H0G1GFGCGFI0G3G8I0G3G8J0HFG8G0GFGDGFGEG0G1GEG1GFH0G1GEG7G8,gO0G1GEG7GEI0GFJ0HFGCG0G1IFH0G7GFG9G8G0G3GCGFJ0GFH0G1GCHEI0G3G8I0G3G8I0IFH0G7G8G3GCG0G1GEG3GFG8I0G7G8,gO0G1GEG3GFG8H0HFH0G7GBGCGEG0G1IFG8G0G7G8GDG8G0G3GCGEJ0GEH0G1HFGCI0G3G8I0G3GCH0G7HEI0G3GBGFGCG0G7GEG6G3H0G1GCG7,P0G1KFGCR0G3GFG3GFG8H0HFH0G7G9GFGEG0HFG3G1G8G0G7HDG8G0G3GDGEJ0GEI0HFGCI0G3G8I0G1GCH0GFGCG7G8H0G7GBGFG8G0GFGCG6H0G1GFGCG7,O0G1NFQ0G7G9GFGCI0HFH0G7GBGFGCG1GFGEGBI0G7GFGDG8G0G3GFGCJ0GEI0GFG3G8I0G3G8G6H0G1GCH0GFG0GFGCG0G1GFGBGFG8G1GFG9G8H0G1GFGCG7,N0QFGCO0G7G9GFGCH0G1GFGCH0GFGBGFG8G1GFG6G3G8H0G7GFG9G8G0G3GFGCJ0GEI0HFG8I0G3G8GEH0G1GCH0GCG0GFGCG0G1GFGBGFG8G1GFG1G8H0G1GFG0G7,M0G3IFGCI0G1JFG8N0GFG3GBGEH0G7GFH0G1GDGBGCI0G7GFGCH0G7GCG5G8G0G3GFK0GEI0HFH0G1GEG3G8GFI0GCH0G8G3GDGEG0G1GFGBGFG8G0GCG1GCI0G6G0G7,K0G3HFGCG0G7LFG8G1HFGEL0G1GFGCGFGCG0G1GFGCH0G1GCGFG8I0G7GEH0G7G9GFGDG8G0G6G0G3GCI0GEI0G3GCGFG0G1GEG3G8G7I0GCI0HFGEG0G1GFGBG1GCH0G3GCH0G1G9GCG7,K0G7IFGEG0G1IFGEH0JFG8K0G1GFGCG7GCH0GFGCI0G8HFG8H0G7GFH0GFG9GFGDG8G0H8GFGEI0GEI0G7GFGEH0GEG3G8G7I0GCH0G7HFGEG0G1GEG3G1G8H0G3GCH0G1GFGEG7,J0G3HFG1HFM0G3GFGEG3HFL0G9GDG3GEH0G3G8J0HFG8H0G3GFGCG0GFG7G3G9G8G1GBHFGEI0GEH0G1GFG3GCH0GEG3G8GEI0GCH0G7GEG7GEG0G1GCG3GFG8H0G7G3G8G0G1GFGEG7,J0G7HFGCR0IFG8K0G1GDHFH0G1G8I0G1GBGFG8H0G7GFGEG0GEG7G3G9G8G1IFGEI0GEH0G1GFG3G8H0G6G3GFGEH0G1GCH0G7GCG7G6G0G1GCG3GFG8H0GEGBG8G0G1GEGCG7,I0G1GFGCG3GCR0GFG1GFGCK0G1GDHFH0G1GBGCH0G1HFG8H0G7GFGEG0GCH7G9G8G1GFGEHCI0GEH0G1GEG7G8H0G7HFGEH0G1GCH0G1G8G7GEG0G1GCG3HFH0HFGCG0G1GFGCG7,I0GFGEG7G0G1G8HFGCG3H0GCIFG0G4G7G3GFGCJ0G1HFI0G7G3GFG8G0G1HFH0G1GFGEH0G1HFG1G8G0GFGCGFG8I0GEH0G3G8GEG0GCG0HFG0GEH0G3G8J0GFGEG0G1GEG2G3GFG8G1HFGCH0GFG8G7,H0G1GFG7GFG0G3G9HFGEG7G0G1GDIFG0G6G0G7GBGCJ0G1HFI0G7G0GFGCG0G1GFGEH0G1G8HCG0G1GBGFG1G8G0GFGCGFG8I0GEH0G3G9GFG1GEG1GFG8G0GEH0G3G8I0G1GFGEG0G1GEG3G6G7GCG0GFG9GCH0GEG0G7,H0G1GFG8G7G0G7G9HFGEG7G0G1GDIFG0GEG0G2G7GFJ0G3IFG8G3GFG0G7GCG0G1GFGCH0G1HCGEH0GBGDG9G8G0G7GCGFG8I0G7H0G1GFG7GFGEG0GFH0G6H0G3G8I0G1GEG6G0G1GEG3GCG3G8G0GEG1GEH0G6G3GF,H0G3GFGCG7G0G7G1HFGEG7G8G1GCIFG1GFH0G6GFJ0G3IFGCG3GFG0G3GCH0GFG8I0HCGEH0G3G8GDG8G0G7G8GCG8I0G3H0G1GEG3GFGEG0G6K0G3G8I0G1GEG6G0G1GEG3GCI0GEG0GCI0G7GE,H0G7GCG0G7G0GEG1GCH0G7GCG1GCG0GFG0G1GFH0G3GFGCI0G1GEG7GFGEG3GEG0G1GCH0HFG8G0G1GFGCG6H0G3G8G7G8G0G6L0G3H0G1GEG3GFGCM0GEK0GFGEH0G6G3GCO0G3GE,H0GFGCG0G7G1GEG1GCH0G7GCG1GCG0G7G0G1GFH0G3GFGCI0G1G8G0G7GCG3G8H0GCH0G7GFG8G0G1GFGCG2J0G7G8N0G3H0G1GEG0GEN0GEK0GFGEI0G3G8O0G1GE,G0G1GFH0G6G3GCG1GCH0G7GEG1GCG0GFG0G1GBG8H0G3GEU0G1GFG8H0G9GCK0G1G8O0G8S0G8K0G1GCU0G6,G0G1GDH0G6G7G8G1GCH0G7GFG1GCG0GFG0G3GBG8H0G3G6,G0G1GCH0G7GFG0G1HFGCH7G1GCG0GFG0G7GBGCH0G2G6,G0G1GEH0G7GFG0G1HFGCG7G3G1GCG0GFG0G7G9GCI0GE,G0G3GEH0G7GFG8G1HFGCG7G3G8GCG0GFG0G7G1GCI0GE,G0G1GEH0G7G9GCG1GCG1G8G7G1HCG0GFG0G7GFGEI0G6,G0G1GCH0G7G1GCG1GCH0G7G1HCG0GFG0G7GFGEH0G3G6,G0G1GDH0G7G1GEG1GCH0G7G0GFGCG0GFG0HFGEH0G3GE,G0G1GFH0G7G0GEG1GCH0G7G0GFGCG0GFG1IFH0G7GE,H0GEGCG0G7G0G6G1GCH0G7G0G7GCG0GFG1GEG0G7H0GDGC,H0G7GEG0G7G0G7G1GCH0G7G0G7GCG0GFG1GEG0G7G0G3GFGC,H0G3GFGCG7G0G3G9HFGEG7G0G3GCG0GFG3GCG0G7G8HFY0G1G8R0GCK0G6X0GEN0G6J0G1G8,H0G1GFGCG7G0G3G9HFGEG7G0G1GCG0GFG3GCG0G7G8GFGEJ0G7GEGFG8N0G3GFGEG3GCQ0G1GEK0GEG1GCG3G8L0G1GCL0GEI0GEH0G6G0G7J0G7GCQ0GC,H0G1GFGCGEG0G1G8HFGEG7G0G1GCG0GFG3GCG0G3GEG7GCJ0G7GCGFG8N0G3HFG3GCQ0G1GEK0GEG1GEG3GCL0G3GCL0GFI0GFG0G1GFG1GFGCI0HFG8J0G3GCI0G1GC,I0G7GFGCU0G1HFK0G3GCGFO0G1GEG7G3GCR0GCK0G8G1GCG3GCL0G3GCL0G3G8H0GFG0G1GEG3GBGCI0GEG7G8J0G3GCI0G1GC,I0G3GFG1GES0G3GEG7GFK0G3GCGEK0G3I0G1GEH3GCJ0G2R0G1G8G0GCG7G8L0G3GCL0G3G8H0G7G8G1GEG3G9G8H0G3GCG3G8J0G3G8G0G3G0G1GC,J0G7GFG0GFG8P0GFGCG7GFG8K0G3G9G8G0G3I0G7G0G4G0G1GEG0G3G8G3G0G1G0GEH0G1K0G1I0G3H0GCGEM0G1G8L0G3GCH0G7G8G3GCG3G8I0G3G8G1G8J0G3H0G6H0GC,J0G1HFGEG1HFK0G7GFGCG3HFGEL0G3GDH0G7G8GFGCG7GBGFG0G1GCG0G3G8G7G8G3GCGFG7GEG3GCG7GFG3GCG7GEH0G3H0HCG0GEG7G3GFG8GFG9GFGCG7GCHFG0G1GCH0G3G8G3GCG3G8G7GFG0G3G8H0GFG8H0G3H0GFG1GFGC,K0G7GFGCG3HFGEI0G3HFGEG0HFM0G3GEG0G1GFGDGFGCG7GBGFG0G1GEG6G3G8GFGCGFGCGFG7GEGFGEG7GFG3GCGFGEH0G3H0GDGCG0GEG7G3GFG8GFG9GFGCGFGCHFG0G1GCH0G3GCG3GCG3GCHFG0G7G8G0G1GFG8H0G3H0GFG9GFGC,K0G1IFGEH0G7HFH0G1IFGCM0G3GEG0G1G9GCHEG7G3GBG8G1GFGEG3H9GCGFHEG7GFHEG7GFG9HCGEH0G3H0GFH0GEG7GBGFG8H9GFGCGEGCHFH0GCH0G7GEG3GCG3G9HEG0G7G8G0G1GFGCH0G3H0GFG1GFGC,L0G1HFGEG0G1IFGCH0HFGCN0G3GEG0G1G8HCGEG7G3GBG8G1GFGEG3G9G8JCG7G1HEG7GBG9HCGEH0G3H0GFH0G6H3G1I9GDGCGEGCGFG3H0GCH0G7GEG5GCG3G9GCGEG0G7G8G0G3G1GCH0G3H0GEG3G9GC,N0G7PFP0G3GFG8G1GFG8GCGEG3G0G7G8G1GCG0G3G9GFG8GCG0GEG7G1GCGFH3G9HCI0G3H0GDGCG0G6H3G1G8GEG1G9GCG1GCG7G3G0G1GCH0H6G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,P0MFG8Q0G3G9G8G1G8G0GCGEH3GBG8G1GCG0G3G9G8G1GCG0GCG7G1GCGFG3GBG9GDGCI0G3H0GDGEG0G6H3G1G8GFG1G9GCG6GCG7G3G0G3GCH0G6G7G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,Q0G1IFGES0G3G9GCG1G8G0GCGEH3GBG8G1GEG0G3G9G8G1GCG0GCG7G1GCGEG7G3G9HCI0G3H0GCGFG0G6H3G1G8G7H9GCGEGCG7G3G0G3G8H0G6G7GDGCG3G8HEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,gO0G3G9GEG1G8HCGEI3G8G1GEH3G9H8GCG4GCG7G1HEG7GBG9HCG2H0G3G8G0GCGFG0G6H3G1G8G3H9GDHCG7G3G0G3G8H0G6G7G9GCG3G8G7H0G3G8G1G3G0GEH0G3H0GEG7G1GC,gO0G3GCGFG1ICGEG7H3G8G1GCH3G9HCGEGCGEG7G1HEG7GBG9GCHEH0G1G8G0GCG7G8G6G7G3G1G9G1H9GDHCG7G3G0G7G8H0G6G3G9GCG3G8GFG0G6G3G8G1GBG1GCG4G0G3G0G6GEG7G9GCG8,gO0G7GCGFG9GFGDGCGEG7GBGFGCG3GEH3G9GFGCGFGCGFG7G1HEG7GBG9GCGFGEI0GCG0GCG3GCH7GBG1J9GDGEGCGFG3G0GFI0G6G3G9GCG3G9GFGCG7G3GCG7G3G9G8GCGFG3G8GEG6G7H9GC,gO0G7GCGFGCG7G1GEGFG3GBG9G8G3GFGEG3GCG7G0G3G8H7G8G3G8GFG7GBGCG7G8I0G6G1GEG3GFG7GFGBG9GCGFG3GFGCG7HFG7G1GCI0GFG0G3GEG3G8GFGEG7G0G7GEG1GFG8GCGFG3GFGEG3G1GFG9GC,gO0G1G8G1GCG7G0G4G2G0G1G8G0G1G3GCG1G8G7G0G3G0G2G3G0G3G0G6G2G1G8G3J0G6G1GCG0GEG3G8G1G9GCGEG1HCG6G0GCG3G0G8I0GEG0G1GEG3G8HFG6G0G7GCG0GFG0GCGFG3GFGCG3G0GFG9GC,jR0G1G8G3N0G7,jR0G3GCG3N0G6,jR0G3GFGEN0GE,jS0GFGC,,:::^FS^FO542,42//rohs^FO542,42^GFA,750,750,15,P0G3KFGC,:N0G3OFG8,:L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,:J0G7GEU0G7G8,I0G1GFW0GF,:I0G7G8W0G3GE,H0G1GCY0G3G8,:H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,:G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,:G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,:G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,:G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,:G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,:G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,:I0G7G8W0G3GE,J0GFV0G1GF,:J0G3GEU0G7G8,K0G1GFG8Q0G3GFG8,:L0G3GFGEO0G7GFG8,N0G3OFG8,:P0G3KF,^FS//环保icon^FO665,42^GFA,350,350,7,K0IFG8,J0G3GFGCG0G6,:J0G7GFGEG0G1G8,:I0G1IF,I0G1HFGDG8G0G4,I0G3HFG8GCG0G2G4,I0G7HFG8G6G0G1GC,I0G7HFG0G6G0G1G4,I0HFGEG0G2H0G4,H0G1HFGCJ0GC,:H0G1HFG8G0G1G8G0G8,I0HFH0G2H0G8,:I0G1GFH0G1GE,:H0G1G8G6I0G3GF,GFH0G4L0GFGE,:G3G8G0G4K0G3GFGE,G0G8G0G4K0G7HF,O0G7HF,G1H0G2K0G3HF,G3H0G2K0G1HFG8,:G2H0GEK0G1HFGC,H0G1GFG8K0HFGC,GCG0H1G8K0HFGC,GCG0G2M0HFGC,:GCG0GCK0G4G0G3GFGC,H0G8K0G4G0G3GFGC,:H3K0G1GCH0GFG8,:G1G7JFH0G7IFG8,G0KFG0GCI0G1,:G0KFG1G8I0G1,G0G7JFG3,G0G3JFG3J0G6,G0G3JFG1GCI0GE,H0G7IFG0G2H0G3,M0G1G7GFGC,M0G1GE,N0G6,::^FS^FO682,32^FO62,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户编号:^FS^FO170,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户代号+'^FS^FO112,172^AD,N,,^FB696,1,0,L,0^FDC/N:____________________^FS^FO62,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户料号:^FS^FO170,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品名称+'^FS^FO62,232^AD,N,,^FB696,1,0,L,0^FDCustomerP/N:________________^FS^FO62,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料生产商:^FS^FO170,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料供应商+'^FS^FO62,292^AD,N,,^FB696,1,0,L,0^FDMaterialSupplier:___________^FS^FO62,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料品名:^FS^FO170,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料名称+'^FS^FO62,352^AD,N,,^FB696,1,0,L,0^FDMaterialName:_______________^FS^FO62,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料规格:^FS^FO170,382^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料规格+'^FS^FO62,412^AD,N,,^FB696,1,0,L,0^FDMaterialSpec:_______________^FS^FO62,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装员:^FS^FO170,442^FB290,1,0,C,0^A1N,24,20^FD'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO62,472^AD,N,,^FB696,1,0,L,0^FDPackager:___________________^FS^FO62,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD贸易方式:^FS^FO170,502^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.贸易方式+'^FS^FO62,532^AD,N,,^FB696,1,0,L,0^FDModeofTrade:________________^FS^FO562,112^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD_______月份Month^FS^FO450,105^FB290,1,0,C,0^A1N,24,20^FD'+(moment().get("month")+1)+'^FS^FO420,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户订单号:^FS^FO496,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户单号+'^FS^FO420,172^AD,N,,^FB696,1,0,L,0^FDPartNo.:____________________^FS^FO420,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD健大品号:^FS^FO496,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品编码+'^FS^FO420,232^AD,N,,^FB696,1,0,L,0^FDKentaP/N:___________________^FS^FO420,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FDUL号码:^FS^FO496,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.UL号+'^FS^FO420,292^AD,N,,^FB696,1,0,L,0^FDULFileNo.:__________________^FS^FO420,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD防火等级:^FS^FO496,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.防火等级+'^FS^FO420,352^AD,N,,^FB696,1,0,L,0^FDFlameClass:_________________^FS^FO420,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD数量:^FS^FO496,382^FB290,1,0,C,0^A1N,24,20^FD'+sum+'^FS^FO420,412^AD,N,,^FB696,1,0,L,0^FDQuantity:___________________^FS^FO420,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装日期:^FS^FO496,442^FB290,1,0,C,0^A1N,24,20^FD'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO420,472^AD,N,,^FB696,1,0,L,0^FDPackingDate:________________^FS^FO420,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD已验收:^FS^FO496,502^FB290,1,0,C,0^A1N,24,20^FD合格^FS^FO420,532^AD,N,,^FB750,1,0,L,0^FDQCPass:_____________________^FS^FO92,612^BCN,160,Y,N,N,A^FD'+outertag+'^FS^FO60,535^AE,N,,^FB730,1,0,L,0^FD_________________________________________________________^FS^FO550,780^AD,N,,^FB696,1,0,L,0^A1N,34,32^FDMADE IN CHINA^FS^XZ';            
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户编号:</th><td>'+mopageinfo.客户代号+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>原料生产商:</th><td>'+mopageinfo.原料供应商+'</td><th>UL号码:</th><td>'+mopageinfo.UL号+'</td></tr><tr><th>原料品名:</th><td>'+mopageinfo.原料名称+'</td><th>防火等级:</th><td>'+mopageinfo.防火等级+'</td></tr><tr><th>原料规格:</th><td>'+mopageinfo.原料规格+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format('YYYY-MM-DD HH:mm')+'</td></tr><tr><th>贸易方式:</th><td>'+mopageinfo.贸易方式+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }
        }
    }else {
        //如果有穴号
        if(bztype == '小标签') {
            obj.printerName = 'small';   
            obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>生产单号:</th><td>'+mopageinfo.制令单号+'</td><th>生产日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            //标准中箱标签
            if(isMiddle == true) {
                obj.printerCommands = '^XA^FO95,5^FO95,5^FO215,2^AF,N,,^FB620,1,0,L,0^A1N,34,30^FD健大电业制品（昆山）有限公司^FS^FO100,30^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO100,55^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户订单号:'+mopageinfo.客户单号+'^FS^FO100,80^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装员:'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO350,80^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装日期:'+moment().format('YYYY-MM-DD HH:mm')+'^FS^FO550,105^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装数量:'+sum+'^FS^FO550,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO470,30^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO440,55^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大料号:'+mopageinfo.产品编码+'^FS^FO105,209^AD,N,,^FB620,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO105,105^BCN,80,Y,N,N,N^FD'+outertag+'^FS^XZ';
            }else {
                //标准小标签
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO95,5^FO95,5^FO150,10//kentaicon^FO150,2^GFA,520,520,13,,:O0LFGC,M0IFGCI0IFGE,L0GFGEN0G1GFGE,K0GFGCQ0G7GF,J0G7GFR0G1GFG8,I0G3GFU0GF,I0GFG8U0G1GC,H0G3GCW0G3G8,H0G6X0G1GC,G0G3G9GCG0G7G1HFG8G3G8G0GEG3HFGEG0GFH0G7,G0G3G9GCG0GFG1HFG8G7GCG0GEG3HFGEG1GFH0G3G8,G0G6G1GCG0GFG1HFG8GFGCG0GEG3HFGEG1GFG8H0GC,G1GCG1GCG3GEG1GCH0GFGCG0GEG0G3GEG0G3GFG8H0G7,G1G8G1GCG7GCG1GCH0HFG0GEG0G3GEG0G3GBG8H0G3,G3G0G1GCG7G8G1GCH0GFG7G0GEG0G3GEG0G3G9GEH0G1G8,G2G0G1GCGFG0G1GCH0GFG7G8GEG0G3GEG0G3G9GEI0GC,G6G0G1GDGFG0G1HFG0GFG7G8GEG0G3GEG0G7G8GEI0GC,G6G0G1GFGEG0G1HFG0GFG3G8GEG0G3GEG0G7G0GEI0GC,GCG0G1GDGFG0G1HFG0GFG3GCGEG0G3GEG0GFG0GEI0GE,GCG0G1GCG7G8G1GCH0GFG0HEG0G3GEG1GEG0GFI0GE,G6G0G1GCG7G8G1GCH0GFG0GFGEG0G3GEG1IFI0GC,G6G0G1GCG7GCG1GCH0GFG0GFGEG0G3GEG1IFI0GC,G2G0G1GCG3GEG1GCH0GFG0G7GEG0G3GEG1GCG0G7GCH0GC,G3G0G1GCG1GEG1HFG8GFG0G7GEG0G3GEG1GCG0G7GCG0G1G8,G1G8G1GCG0GFG1HFG8GFG0G3GEG0G3GEG3GCG0G7GCG0G3,G1GCG1GCG0G7G1HFG8GFG0G1GEG0G3GEG3G8G0G1GCG0G7,G0G6gG0GC,G0G7G8Y0G1G8,G0G3GCY0G7,H0G6X0G1GC,H0G1GCW0GFG8,I0GFG8U0G3GC,I0G1GFT0G1GE,J0G7GCS0G7GE,K0GFGCQ0G7GE,L0HFG8M0G1GFGE,M0G7IFG8G0G3IFGC,O0G3KFG8,^FS^FO285,2^AD,N,,^FB620,1,0,L,0^A1N,38,36^FD物料标识纸^FS//rohsicon^FO550,0^FO550,10^GFA,600,600,15,P0G3KFGC,:N0G3OFG8,L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,J0G7GEU0G7G8,:I0G1GFW0GF,I0G7G8W0G3GE,H0G1GCY0G3G8,H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,:G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,:G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,I0G7G8W0G3GE,J0GFV0G1GF,J0G3GEU0G7G8,:K0G1GFG8Q0G3GFG8,L0G3GFGEO0G7GFG8,N0G3OFG8,P0G3KF,^FS^FO105,50^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD生产单号:'+mopageinfo.制令单号+'^FS^FO665,10^FO105,75^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD客户料号:'+mopageinfo.产品名称+'^FS^FO105,100^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD健大品号:'+mopageinfo.产品编码+'^FS^FO410,50^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD生产日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO105,125^BCN,60,Y,N,N,N^FD'+outertag+'^FS^FO105,209^AD,N,,^FB620,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO510,75^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD客户代号:'+mopageinfo.客户代号+'^FS^FO510,100^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD数量:'+sum+'^FS^FO510,125^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD已验收:合格^FS^FO510,165^AF,N,,^FB620,1,0,L,0^FDMADE IN CHINA^FS^XZ';
            }
        }
        if(bztype == '大标签') {
            obj.printerName = 'large';        
            obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO45,15^GB730,810,1,,0^FS^FO46,16^GB728,808,1,,0^FS^FO62,32//kenta^FO62,32^GFA,3990,3990,57,,:::::::::hM0GC,gQ0G7G8H0G1GCJ0G7GEI0G1GFGCH0G1G8G1G8O0G8S0GCK0GE,gQ0G3G8I0GFJ0GFGEI0G3GFGCH0G3GCG1G8I0GFJ0G3G8H0G1GFG8I0G3G8I0GEK0GFG6H0G1GCGFG8N0GFGE,gP0G8G3GCI0GFJ0GFGCI0G3GBGCH0G3GEG1G8I0GFJ0G3I0G1GFGCI0G3G8I0GEK0G7GFH0G3GCGFGCN0HF,gO0G1GEG7GEI0GFJ0GFG8I0GFGBG8H0G1GEG1G8H0HFJ0G3I0G3GFGEI0G3G8I0G7G8J0G7GFG8G0GFGDGFGEH0GEG1GFH0G1HFG8,gO0G1GEG7GEI0GEJ0G6G3G8G0G1HFI0G5GEG1G8G0G3HFJ0G3H0G1GFGCGFI0G3G8I0G3G8J0HFG8G0GFGDGFGEG0G1GEG1GFH0G1GEG7G8,gO0G1GEG7GEI0GFJ0HFGCG0G1IFH0G7GFG9G8G0G3GCGFJ0GFH0G1GCHEI0G3G8I0G3G8I0IFH0G7G8G3GCG0G1GEG3GFG8I0G7G8,gO0G1GEG3GFG8H0HFH0G7GBGCGEG0G1IFG8G0G7G8GDG8G0G3GCGEJ0GEH0G1HFGCI0G3G8I0G3GCH0G7HEI0G3GBGFGCG0G7GEG6G3H0G1GCG7,P0G1KFGCR0G3GFG3GFG8H0HFH0G7G9GFGEG0HFG3G1G8G0G7HDG8G0G3GDGEJ0GEI0HFGCI0G3G8I0G1GCH0GFGCG7G8H0G7GBGFG8G0GFGCG6H0G1GFGCG7,O0G1NFQ0G7G9GFGCI0HFH0G7GBGFGCG1GFGEGBI0G7GFGDG8G0G3GFGCJ0GEI0GFG3G8I0G3G8G6H0G1GCH0GFG0GFGCG0G1GFGBGFG8G1GFG9G8H0G1GFGCG7,N0QFGCO0G7G9GFGCH0G1GFGCH0GFGBGFG8G1GFG6G3G8H0G7GFG9G8G0G3GFGCJ0GEI0HFG8I0G3G8GEH0G1GCH0GCG0GFGCG0G1GFGBGFG8G1GFG1G8H0G1GFG0G7,M0G3IFGCI0G1JFG8N0GFG3GBGEH0G7GFH0G1GDGBGCI0G7GFGCH0G7GCG5G8G0G3GFK0GEI0HFH0G1GEG3G8GFI0GCH0G8G3GDGEG0G1GFGBGFG8G0GCG1GCI0G6G0G7,K0G3HFGCG0G7LFG8G1HFGEL0G1GFGCGFGCG0G1GFGCH0G1GCGFG8I0G7GEH0G7G9GFGDG8G0G6G0G3GCI0GEI0G3GCGFG0G1GEG3G8G7I0GCI0HFGEG0G1GFGBG1GCH0G3GCH0G1G9GCG7,K0G7IFGEG0G1IFGEH0JFG8K0G1GFGCG7GCH0GFGCI0G8HFG8H0G7GFH0GFG9GFGDG8G0H8GFGEI0GEI0G7GFGEH0GEG3G8G7I0GCH0G7HFGEG0G1GEG3G1G8H0G3GCH0G1GFGEG7,J0G3HFG1HFM0G3GFGEG3HFL0G9GDG3GEH0G3G8J0HFG8H0G3GFGCG0GFG7G3G9G8G1GBHFGEI0GEH0G1GFG3GCH0GEG3G8GEI0GCH0G7GEG7GEG0G1GCG3GFG8H0G7G3G8G0G1GFGEG7,J0G7HFGCR0IFG8K0G1GDHFH0G1G8I0G1GBGFG8H0G7GFGEG0GEG7G3G9G8G1IFGEI0GEH0G1GFG3G8H0G6G3GFGEH0G1GCH0G7GCG7G6G0G1GCG3GFG8H0GEGBG8G0G1GEGCG7,I0G1GFGCG3GCR0GFG1GFGCK0G1GDHFH0G1GBGCH0G1HFG8H0G7GFGEG0GCH7G9G8G1GFGEHCI0GEH0G1GEG7G8H0G7HFGEH0G1GCH0G1G8G7GEG0G1GCG3HFH0HFGCG0G1GFGCG7,I0GFGEG7G0G1G8HFGCG3H0GCIFG0G4G7G3GFGCJ0G1HFI0G7G3GFG8G0G1HFH0G1GFGEH0G1HFG1G8G0GFGCGFG8I0GEH0G3G8GEG0GCG0HFG0GEH0G3G8J0GFGEG0G1GEG2G3GFG8G1HFGCH0GFG8G7,H0G1GFG7GFG0G3G9HFGEG7G0G1GDIFG0G6G0G7GBGCJ0G1HFI0G7G0GFGCG0G1GFGEH0G1G8HCG0G1GBGFG1G8G0GFGCGFG8I0GEH0G3G9GFG1GEG1GFG8G0GEH0G3G8I0G1GFGEG0G1GEG3G6G7GCG0GFG9GCH0GEG0G7,H0G1GFG8G7G0G7G9HFGEG7G0G1GDIFG0GEG0G2G7GFJ0G3IFG8G3GFG0G7GCG0G1GFGCH0G1HCGEH0GBGDG9G8G0G7GCGFG8I0G7H0G1GFG7GFGEG0GFH0G6H0G3G8I0G1GEG6G0G1GEG3GCG3G8G0GEG1GEH0G6G3GF,H0G3GFGCG7G0G7G1HFGEG7G8G1GCIFG1GFH0G6GFJ0G3IFGCG3GFG0G3GCH0GFG8I0HCGEH0G3G8GDG8G0G7G8GCG8I0G3H0G1GEG3GFGEG0G6K0G3G8I0G1GEG6G0G1GEG3GCI0GEG0GCI0G7GE,H0G7GCG0G7G0GEG1GCH0G7GCG1GCG0GFG0G1GFH0G3GFGCI0G1GEG7GFGEG3GEG0G1GCH0HFG8G0G1GFGCG6H0G3G8G7G8G0G6L0G3H0G1GEG3GFGCM0GEK0GFGEH0G6G3GCO0G3GE,H0GFGCG0G7G1GEG1GCH0G7GCG1GCG0G7G0G1GFH0G3GFGCI0G1G8G0G7GCG3G8H0GCH0G7GFG8G0G1GFGCG2J0G7G8N0G3H0G1GEG0GEN0GEK0GFGEI0G3G8O0G1GE,G0G1GFH0G6G3GCG1GCH0G7GEG1GCG0GFG0G1GBG8H0G3GEU0G1GFG8H0G9GCK0G1G8O0G8S0G8K0G1GCU0G6,G0G1GDH0G6G7G8G1GCH0G7GFG1GCG0GFG0G3GBG8H0G3G6,G0G1GCH0G7GFG0G1HFGCH7G1GCG0GFG0G7GBGCH0G2G6,G0G1GEH0G7GFG0G1HFGCG7G3G1GCG0GFG0G7G9GCI0GE,G0G3GEH0G7GFG8G1HFGCG7G3G8GCG0GFG0G7G1GCI0GE,G0G1GEH0G7G9GCG1GCG1G8G7G1HCG0GFG0G7GFGEI0G6,G0G1GCH0G7G1GCG1GCH0G7G1HCG0GFG0G7GFGEH0G3G6,G0G1GDH0G7G1GEG1GCH0G7G0GFGCG0GFG0HFGEH0G3GE,G0G1GFH0G7G0GEG1GCH0G7G0GFGCG0GFG1IFH0G7GE,H0GEGCG0G7G0G6G1GCH0G7G0G7GCG0GFG1GEG0G7H0GDGC,H0G7GEG0G7G0G7G1GCH0G7G0G7GCG0GFG1GEG0G7G0G3GFGC,H0G3GFGCG7G0G3G9HFGEG7G0G3GCG0GFG3GCG0G7G8HFY0G1G8R0GCK0G6X0GEN0G6J0G1G8,H0G1GFGCG7G0G3G9HFGEG7G0G1GCG0GFG3GCG0G7G8GFGEJ0G7GEGFG8N0G3GFGEG3GCQ0G1GEK0GEG1GCG3G8L0G1GCL0GEI0GEH0G6G0G7J0G7GCQ0GC,H0G1GFGCGEG0G1G8HFGEG7G0G1GCG0GFG3GCG0G3GEG7GCJ0G7GCGFG8N0G3HFG3GCQ0G1GEK0GEG1GEG3GCL0G3GCL0GFI0GFG0G1GFG1GFGCI0HFG8J0G3GCI0G1GC,I0G7GFGCU0G1HFK0G3GCGFO0G1GEG7G3GCR0GCK0G8G1GCG3GCL0G3GCL0G3G8H0GFG0G1GEG3GBGCI0GEG7G8J0G3GCI0G1GC,I0G3GFG1GES0G3GEG7GFK0G3GCGEK0G3I0G1GEH3GCJ0G2R0G1G8G0GCG7G8L0G3GCL0G3G8H0G7G8G1GEG3G9G8H0G3GCG3G8J0G3G8G0G3G0G1GC,J0G7GFG0GFG8P0GFGCG7GFG8K0G3G9G8G0G3I0G7G0G4G0G1GEG0G3G8G3G0G1G0GEH0G1K0G1I0G3H0GCGEM0G1G8L0G3GCH0G7G8G3GCG3G8I0G3G8G1G8J0G3H0G6H0GC,J0G1HFGEG1HFK0G7GFGCG3HFGEL0G3GDH0G7G8GFGCG7GBGFG0G1GCG0G3G8G7G8G3GCGFG7GEG3GCG7GFG3GCG7GEH0G3H0HCG0GEG7G3GFG8GFG9GFGCG7GCHFG0G1GCH0G3G8G3GCG3G8G7GFG0G3G8H0GFG8H0G3H0GFG1GFGC,K0G7GFGCG3HFGEI0G3HFGEG0HFM0G3GEG0G1GFGDGFGCG7GBGFG0G1GEG6G3G8GFGCGFGCGFG7GEGFGEG7GFG3GCGFGEH0G3H0GDGCG0GEG7G3GFG8GFG9GFGCGFGCHFG0G1GCH0G3GCG3GCG3GCHFG0G7G8G0G1GFG8H0G3H0GFG9GFGC,K0G1IFGEH0G7HFH0G1IFGCM0G3GEG0G1G9GCHEG7G3GBG8G1GFGEG3H9GCGFHEG7GFHEG7GFG9HCGEH0G3H0GFH0GEG7GBGFG8H9GFGCGEGCHFH0GCH0G7GEG3GCG3G9HEG0G7G8G0G1GFGCH0G3H0GFG1GFGC,L0G1HFGEG0G1IFGCH0HFGCN0G3GEG0G1G8HCGEG7G3GBG8G1GFGEG3G9G8JCG7G1HEG7GBG9HCGEH0G3H0GFH0G6H3G1I9GDGCGEGCGFG3H0GCH0G7GEG5GCG3G9GCGEG0G7G8G0G3G1GCH0G3H0GEG3G9GC,N0G7PFP0G3GFG8G1GFG8GCGEG3G0G7G8G1GCG0G3G9GFG8GCG0GEG7G1GCGFH3G9HCI0G3H0GDGCG0G6H3G1G8GEG1G9GCG1GCG7G3G0G1GCH0H6G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,P0MFG8Q0G3G9G8G1G8G0GCGEH3GBG8G1GCG0G3G9G8G1GCG0GCG7G1GCGFG3GBG9GDGCI0G3H0GDGEG0G6H3G1G8GFG1G9GCG6GCG7G3G0G3GCH0G6G7G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,Q0G1IFGES0G3G9GCG1G8G0GCGEH3GBG8G1GEG0G3G9G8G1GCG0GCG7G1GCGEG7G3G9HCI0G3H0GCGFG0G6H3G1G8G7H9GCGEGCG7G3G0G3G8H0G6G7GDGCG3G8HEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,gO0G3G9GEG1G8HCGEI3G8G1GEH3G9H8GCG4GCG7G1HEG7GBG9HCG2H0G3G8G0GCGFG0G6H3G1G8G3H9GDHCG7G3G0G3G8H0G6G7G9GCG3G8G7H0G3G8G1G3G0GEH0G3H0GEG7G1GC,gO0G3GCGFG1ICGEG7H3G8G1GCH3G9HCGEGCGEG7G1HEG7GBG9GCHEH0G1G8G0GCG7G8G6G7G3G1G9G1H9GDHCG7G3G0G7G8H0G6G3G9GCG3G8GFG0G6G3G8G1GBG1GCG4G0G3G0G6GEG7G9GCG8,gO0G7GCGFG9GFGDGCGEG7GBGFGCG3GEH3G9GFGCGFGCGFG7G1HEG7GBG9GCGFGEI0GCG0GCG3GCH7GBG1J9GDGEGCGFG3G0GFI0G6G3G9GCG3G9GFGCG7G3GCG7G3G9G8GCGFG3G8GEG6G7H9GC,gO0G7GCGFGCG7G1GEGFG3GBG9G8G3GFGEG3GCG7G0G3G8H7G8G3G8GFG7GBGCG7G8I0G6G1GEG3GFG7GFGBG9GCGFG3GFGCG7HFG7G1GCI0GFG0G3GEG3G8GFGEG7G0G7GEG1GFG8GCGFG3GFGEG3G1GFG9GC,gO0G1G8G1GCG7G0G4G2G0G1G8G0G1G3GCG1G8G7G0G3G0G2G3G0G3G0G6G2G1G8G3J0G6G1GCG0GEG3G8G1G9GCGEG1HCG6G0GCG3G0G8I0GEG0G1GEG3G8HFG6G0G7GCG0GFG0GCGFG3GFGCG3G0GFG9GC,jR0G1G8G3N0G7,jR0G3GCG3N0G6,jR0G3GFGEN0GE,jS0GFGC,,:::^FS^FO542,42//rohs^FO542,42^GFA,750,750,15,P0G3KFGC,:N0G3OFG8,:L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,:J0G7GEU0G7G8,I0G1GFW0GF,:I0G7G8W0G3GE,H0G1GCY0G3G8,:H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,:G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,:G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,:G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,:G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,:G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,:G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,:I0G7G8W0G3GE,J0GFV0G1GF,:J0G3GEU0G7G8,K0G1GFG8Q0G3GFG8,:L0G3GFGEO0G7GFG8,N0G3OFG8,:P0G3KF,^FS^FO682,32^FO62,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户编号:^FS^FO170,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户代号+'^FS^FO112,172^AD,N,,^FB696,1,0,L,0^FDC/N:____________________^FS^FO62,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户料号:^FS^FO170,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品名称+'^FS^FO62,232^AD,N,,^FB696,1,0,L,0^FDCustomerP/N:________________^FS^FO62,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料生产商:^FS^FO170,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料供应商+'^FS^FO62,292^AD,N,,^FB696,1,0,L,0^FDMaterialSupplier:___________^FS^FO62,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料品名:^FS^FO170,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料名称+'^FS^FO62,352^AD,N,,^FB696,1,0,L,0^FDMaterialName:_______________^FS^FO62,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料规格:^FS^FO170,382^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料规格+'^FS^FO62,412^AD,N,,^FB696,1,0,L,0^FDMaterialSpec:_______________^FS^FO62,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装员:^FS^FO170,442^FB290,1,0,C,0^A1N,24,20^FD'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO62,472^AD,N,,^FB696,1,0,L,0^FDPackager:___________________^FS^FO62,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD贸易方式:^FS^FO170,502^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.贸易方式+'^FS^FO62,532^AD,N,,^FB696,1,0,L,0^FDModeofTrade:________________^FS^FO562,112^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD_______月份Month^FS^FO450,105^FB290,1,0,C,0^A1N,24,20^FD'+(moment().get("month")+1)+'^FS^FO420,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户订单号:^FS^FO496,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户单号+'^FS^FO420,172^AD,N,,^FB696,1,0,L,0^FDPartNo.:____________________^FS^FO420,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD健大品号:^FS^FO496,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品编码+'^FS^FO420,232^AD,N,,^FB696,1,0,L,0^FDKentaP/N:___________________^FS^FO420,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FDUL号码:^FS^FO496,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.UL号+'^FS^FO420,292^AD,N,,^FB696,1,0,L,0^FDULFileNo.:__________________^FS^FO420,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD防火等级:^FS^FO496,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.防火等级+'^FS^FO420,352^AD,N,,^FB696,1,0,L,0^FDFlameClass:_________________^FS^FO420,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD数量:^FS^FO496,382^FB290,1,0,C,0^A1N,24,20^FD'+sum+'^FS^FO420,412^AD,N,,^FB696,1,0,L,0^FDQuantity:___________________^FS^FO420,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装日期:^FS^FO496,442^FB290,1,0,C,0^A1N,24,20^FD'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO420,472^AD,N,,^FB696,1,0,L,0^FDPackingDate:________________^FS^FO420,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD已验收:^FS^FO496,502^FB290,1,0,C,0^A1N,24,20^FD合格^FS^FO420,532^AD,N,,^FB696,1,0,L,0^FDQCPass:_____________________^FS^FO92,590^BCN,160,Y,N,N,A^FD'+outertag+'^FS^FO60,535^AE,N,,^FB730,1,0,L,0^FD_________________________________________________________^FS^FO100,790^AD,N,,^FB696,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO550,700^AD,N,,^FB696,1,0,L,0^A1N,34,32^FDMADE IN CHINA^FS^XZ';
            obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户编号:</th><td>'+mopageinfo.客户代号+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>原料生产商:</th><td>'+mopageinfo.原料供应商+'</td><th>UL号码:</th><td>'+mopageinfo.UL号+'</td></tr><tr><th>原料品名:</th><td>'+mopageinfo.原料名称+'</td><th>防火等级:</th><td>'+mopageinfo.防火等级+'</td></tr><tr><th>原料规格:</th><td>'+mopageinfo.原料规格+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format('YYYY-MM-DD HH:mm')+'</td></tr><tr><th>贸易方式:</th><td>'+mopageinfo.贸易方式+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>'; 
        }
        if(bztype == '客制小标签') {
            obj.printerName = 'small';                
            if(mopageinfo.客户代号 == 'E-030') {                    
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO95,5^FO95,5^FO150,10^FO285,2^AD,N,,^FB620,1,0,L,0^A1N,38,36^FD物料标识纸^FS//rohsicon^FO550,0^FO550,10^GFA,600,600,15,P0G3KFGC,:N0G3OFG8,L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,J0G7GEU0G7G8,:I0G1GFW0GF,I0G7G8W0G3GE,H0G1GCY0G3G8,H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,:G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,:G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,I0G7G8W0G3GE,J0GFV0G1GF,J0G3GEU0G7G8,:K0G1GFG8Q0G3GFG8,L0G3GFGEO0G7GFG8,N0G3OFG8,P0G3KF,^FS^FO105,50^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD生产单号:'+mopageinfo.制令单号+'^FS^FO665,10^FO105,75^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD客户料号:'+mopageinfo.产品名称+'^FS^FO105,100^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD品号:'+mopageinfo.产品编码+'^FS^FO410,50^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD生产日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO105,125^BCN,60,Y,N,N,N^FD'+outertag+'^FS^FO105,209^AD,N,,^FB620,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO510,75^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD客户代号:'+mopageinfo.客户代号+'^FS^FO510,100^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD数量:'+sum+'^FS^FO510,125^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD已验收:合格^FS^FO510,165^AF,N,,^FB620,1,0,L,0^FDMADE IN CHINA^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>生产单号:</th><td>'+mopageinfo.制令单号+'</td><th>生产日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }        
            if(mopageinfo.客户代号 == 'K-036') {    
                obj.printerCommands = '^XA^FO95,5^FO95,5^FO215,2^AF,N,,^FB620,1,0,L,0^A1N,34,30^FD健大电业制品（昆山）有限公司^FS^FO100,30^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO100,55^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户订单号:'+mopageinfo.客户单号+'^FS^FO100,80^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装员:'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO350,80^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装日期:'+moment().format('YYYY-MM-DD HH:mm')+'^FS^FO550,105^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装数量:'+sum+'^FS^FO550,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO470,30^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO440,55^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大料号:'+mopageinfo.产品编码+'^FS^FO105,209^AD,N,,^FB620,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO105,105^BCN,80,Y,N,N,N^FD'+outertag+'^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>包装数量:</th><td>'+sum+'</td><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td></tr><tr><th>FD健大料号:</th><td>'+mopageinfo.产品编码+'</td></tr></tbody></table>';
            }        
            if(mopageinfo.客户代号 == 'W-030') {
                console.log(1243)               
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO95,5^FO95,5^FO150,10//kentaicon^FO150,2^GFA,520,520,13,,:O0LFGC,M0IFGCI0IFGE,L0GFGEN0G1GFGE,K0GFGCQ0G7GF,J0G7GFR0G1GFG8,I0G3GFU0GF,I0GFG8U0G1GC,H0G3GCW0G3G8,H0G6X0G1GC,G0G3G9GCG0G7G1HFG8G3G8G0GEG3HFGEG0GFH0G7,G0G3G9GCG0GFG1HFG8G7GCG0GEG3HFGEG1GFH0G3G8,G0G6G1GCG0GFG1HFG8GFGCG0GEG3HFGEG1GFG8H0GC,G1GCG1GCG3GEG1GCH0GFGCG0GEG0G3GEG0G3GFG8H0G7,G1G8G1GCG7GCG1GCH0HFG0GEG0G3GEG0G3GBG8H0G3,G3G0G1GCG7G8G1GCH0GFG7G0GEG0G3GEG0G3G9GEH0G1G8,G2G0G1GCGFG0G1GCH0GFG7G8GEG0G3GEG0G3G9GEI0GC,G6G0G1GDGFG0G1HFG0GFG7G8GEG0G3GEG0G7G8GEI0GC,G6G0G1GFGEG0G1HFG0GFG3G8GEG0G3GEG0G7G0GEI0GC,GCG0G1GDGFG0G1HFG0GFG3GCGEG0G3GEG0GFG0GEI0GE,GCG0G1GCG7G8G1GCH0GFG0HEG0G3GEG1GEG0GFI0GE,G6G0G1GCG7G8G1GCH0GFG0GFGEG0G3GEG1IFI0GC,G6G0G1GCG7GCG1GCH0GFG0GFGEG0G3GEG1IFI0GC,G2G0G1GCG3GEG1GCH0GFG0G7GEG0G3GEG1GCG0G7GCH0GC,G3G0G1GCG1GEG1HFG8GFG0G7GEG0G3GEG1GCG0G7GCG0G1G8,G1G8G1GCG0GFG1HFG8GFG0G3GEG0G3GEG3GCG0G7GCG0G3,G1GCG1GCG0G7G1HFG8GFG0G1GEG0G3GEG3G8G0G1GCG0G7,G0G6gG0GC,G0G7G8Y0G1G8,G0G3GCY0G7,H0G6X0G1GC,H0G1GCW0GFG8,I0GFG8U0G3GC,I0G1GFT0G1GE,J0G7GCS0G7GE,K0GFGCQ0G7GE,L0HFG8M0G1GFGE,M0G7IFG8G0G3IFGC,O0G3KFG8,^FS^FO285,2^AD,N,,^FB620,1,0,L,0^A1N,38,36^FD物料标识纸^FS//rohsicon^FO550,2^FO550,10^GFA,600,600,15,P0G3KFGC,:N0G3OFG8,L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,J0G7GEU0G7G8,:I0G1GFW0GF,I0G7G8W0G3GE,H0G1GCY0G3G8,H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,:G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,:G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,I0G7G8W0G3GE,J0GFV0G1GF,J0G3GEU0G7G8,:K0G1GFG8Q0G3GFG8,L0G3GFGEO0G7GFG8,N0G3OFG8,P0G3KF,^FS//环保icon^FO665,2^GFA,350,350,7,K0IFG8,J0G3GFGCG0G6,:J0G7GFGEG0G1G8,:I0G1IF,I0G1HFGDG8G0G4,I0G3HFG8GCG0G2G4,I0G7HFG8G6G0G1GC,I0G7HFG0G6G0G1G4,I0HFGEG0G2H0G4,H0G1HFGCJ0GC,:H0G1HFG8G0G1G8G0G8,I0HFH0G2H0G8,:I0G1GFH0G1GE,:H0G1G8G6I0G3GF,GFH0G4L0GFGE,:G3G8G0G4K0G3GFGE,G0G8G0G4K0G7HF,O0G7HF,G1H0G2K0G3HF,G3H0G2K0G1HFG8,:G2H0GEK0G1HFGC,H0G1GFG8K0HFGC,GCG0H1G8K0HFGC,GCG0G2M0HFGC,:GCG0GCK0G4G0G3GFGC,H0G8K0G4G0G3GFGC,:H3K0G1GCH0GFG8,:G1G7JFH0G7IFG8,G0KFG0GCI0G1,:G0KFG1G8I0G1,G0G7JFG3,G0G3JFG3J0G6,G0G3JFG1GCI0GE,H0G7IFG0G2H0G3,M0G1G7GFGC,M0G1GE,N0G6,::^FS^FO105,50^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD生产单号:'+mopageinfo.制令单号+'^FS^FO665,10^FO105,75^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD客户料号:'+mopageinfo.产品名称+'^FS^FO105,100^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD健大品号:'+mopageinfo.产品编码+'^FS^FO410,50^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD生产日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO105,125^BCN,60,Y,N,N,N^FD'+outertag+'^FS^FO105,209^AD,N,,^FB620,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO510,75^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD客户代号:'+mopageinfo.客户代号+'^FS^FO510,100^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD数量:'+sum+'^FS^FO510,125^AD,N,,^FB620,1,0,L,0^A1N,18,15^FD已验收:合格^FS^FO510,165^AF,N,,^FB620,1,0,L,0^FDMADE IN CHINA^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>生产单号:</th><td>'+mopageinfo.制令单号+'</td><th>生产日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }
        }
        if(bztype == '客制大标签') {
            obj.printerName = 'large';        
            if(mopageinfo.客户代号 == 'E-030') {               
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO45,15^GB730,810,1,,0^FS^FO46,16^GB728,808,1,,0^FS^FO62,32//rohs^FO542,42^GFA,750,750,15,P0G3KFGC,:N0G3OFG8,:L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,:J0G7GEU0G7G8,I0G1GFW0GF,:I0G7G8W0G3GE,H0G1GCY0G3G8,:H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,:G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,:G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,:G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,:G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,:G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,:G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,:I0G7G8W0G3GE,J0GFV0G1GF,:J0G3GEU0G7G8,K0G1GFG8Q0G3GFG8,:L0G3GFGEO0G7GFG8,N0G3OFG8,:P0G3KF,^FS^FO682,32^FO62,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户编号:^FS^FO170,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户代号+'^FS^FO112,172^AD,N,,^FB696,1,0,L,0^FDC/N:____________________^FS^FO62,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户料号:^FS^FO170,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品名称+'^FS^FO62,232^AD,N,,^FB696,1,0,L,0^FDCustomerP/N:________________^FS^FO62,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料生产商:^FS^FO170,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料供应商+'^FS^FO62,292^AD,N,,^FB696,1,0,L,0^FDMaterialSupplier:___________^FS^FO62,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料品名:^FS^FO170,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料名称+'^FS^FO62,352^AD,N,,^FB696,1,0,L,0^FDMaterialName:_______________^FS^FO62,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料规格:^FS^FO170,382^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料规格+'^FS^FO62,412^AD,N,,^FB696,1,0,L,0^FDMaterialSpec:_______________^FS^FO62,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装员:^FS^FO170,442^FB290,1,0,C,0^A1N,24,20^FD'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO62,472^AD,N,,^FB696,1,0,L,0^FDPackager:___________________^FS^FO62,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD贸易方式:^FS^FO170,502^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.贸易方式+'^FS^FO62,532^AD,N,,^FB696,1,0,L,0^FDModeofTrade:________________^FS^FO562,112^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD_______月份Month^FS^FO450,105^FB290,1,0,C,0^A1N,24,20^FD'+(moment().get("month")+1)+'^FS^FO420,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户订单号:^FS^FO496,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户单号+'^FS^FO420,172^AD,N,,^FB696,1,0,L,0^FDPartNo.:____________________^FS^FO420,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD品号:^FS^FO496,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品编码+'^FS^FO420,232^AD,N,,^FB696,1,0,L,0^FDP/N:________________________^FS^FO420,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FDUL号码:^FS^FO496,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.UL号+'^FS^FO420,292^AD,N,,^FB696,1,0,L,0^FDULFileNo.:__________________^FS^FO420,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD防火等级:^FS^FO496,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.防火等级+'^FS^FO420,352^AD,N,,^FB696,1,0,L,0^FDFlameClass:_________________^FS^FO420,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD数量:^FS^FO496,382^FB290,1,0,C,0^A1N,24,20^FD'+sum+'^FS^FO420,412^AD,N,,^FB696,1,0,L,0^FDQuantity:___________________^FS^FO420,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装日期:^FS^FO496,442^FB290,1,0,C,0^A1N,24,20^FD'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO420,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD已验收:^FS^FO496,502^FB290,1,0,C,0^A1N,24,20^FD合格^FS^FO420,532^AD,N,,^FB696,1,0,L,0^FDQCPass:_____________________^FS^FO420,472^AD,N,,^FB696,1,0,L,0^FDPackingDate:________________^FS^FO92,590^BCN,160,Y,N,N,A^FD'+outertag+'^FS^FO60,535^AE,N,,^FB730,1,0,L,0^FD_________________________________________________________^FS^FO100,790^AD,N,,^FB696,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO550,700^AD,N,,^FB696,1,0,L,0^A1N,34,32^FDMADE IN CHINA^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户编号:</th><td>'+mopageinfo.客户代号+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>原料生产商:</th><td>'+mopageinfo.原料供应商+'</td><th>UL号码:</th><td>'+mopageinfo.UL号+'</td></tr><tr><th>原料品名:</th><td>'+mopageinfo.原料名称+'</td><th>防火等级:</th><td>'+mopageinfo.防火等级+'</td></tr><tr><th>原料规格:</th><td>'+mopageinfo.原料规格+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format('YYYY-MM-DD HH:mm')+'</td></tr><tr><th>贸易方式:</th><td>'+mopageinfo.贸易方式+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }            
            if(mopageinfo.客户代号 == 'K-036') {                                
                obj.printerCommands = '^XA^FO95,5^FO95,5^FO215,2^AF,N,,^FB620,1,0,L,0^A1N,34,30^FD健大电业制品（昆山）有限公司^FS^FO100,30^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+mopageinfo.产品名称+'^FS^FO100,55^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户订单号:'+mopageinfo.客户单号+'^FS^FO100,80^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装员:'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO350,80^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装日期:'+moment().format('YYYY-MM-DD HH:mm')+'^FS^FO550,105^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD包装数量:'+sum+'^FS^FO550,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD已验收:合格^FS^FO470,30^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+mopageinfo.客户代号+'^FS^FO440,55^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大料号:'+mopageinfo.产品编码+'^FS^FO105,209^AD,N,,^FB620,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO105,105^BCN,80,Y,N,N,N^FD'+outertag+'^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>包装数量:</th><td>'+sum+'</td><th>客户代号:</th><td>'+mopageinfo.客户代号+'</td></tr><tr><th>FD健大料号:</th><td>'+mopageinfo.产品编码+'</td></tr></tbody></table>';
            }
            if(mopageinfo.客户代号 == 'W-030') {              
                obj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO45,15^GB730,810,1,,0^FS^FO46,16^GB728,808,1,,0^FS^FO62,32//kenta^FO62,32^GFA,3990,3990,57,,:::::::::hM0GC,gQ0G7G8H0G1GCJ0G7GEI0G1GFGCH0G1G8G1G8O0G8S0GCK0GE,gQ0G3G8I0GFJ0GFGEI0G3GFGCH0G3GCG1G8I0GFJ0G3G8H0G1GFG8I0G3G8I0GEK0GFG6H0G1GCGFG8N0GFGE,gP0G8G3GCI0GFJ0GFGCI0G3GBGCH0G3GEG1G8I0GFJ0G3I0G1GFGCI0G3G8I0GEK0G7GFH0G3GCGFGCN0HF,gO0G1GEG7GEI0GFJ0GFG8I0GFGBG8H0G1GEG1G8H0HFJ0G3I0G3GFGEI0G3G8I0G7G8J0G7GFG8G0GFGDGFGEH0GEG1GFH0G1HFG8,gO0G1GEG7GEI0GEJ0G6G3G8G0G1HFI0G5GEG1G8G0G3HFJ0G3H0G1GFGCGFI0G3G8I0G3G8J0HFG8G0GFGDGFGEG0G1GEG1GFH0G1GEG7G8,gO0G1GEG7GEI0GFJ0HFGCG0G1IFH0G7GFG9G8G0G3GCGFJ0GFH0G1GCHEI0G3G8I0G3G8I0IFH0G7G8G3GCG0G1GEG3GFG8I0G7G8,gO0G1GEG3GFG8H0HFH0G7GBGCGEG0G1IFG8G0G7G8GDG8G0G3GCGEJ0GEH0G1HFGCI0G3G8I0G3GCH0G7HEI0G3GBGFGCG0G7GEG6G3H0G1GCG7,P0G1KFGCR0G3GFG3GFG8H0HFH0G7G9GFGEG0HFG3G1G8G0G7HDG8G0G3GDGEJ0GEI0HFGCI0G3G8I0G1GCH0GFGCG7G8H0G7GBGFG8G0GFGCG6H0G1GFGCG7,O0G1NFQ0G7G9GFGCI0HFH0G7GBGFGCG1GFGEGBI0G7GFGDG8G0G3GFGCJ0GEI0GFG3G8I0G3G8G6H0G1GCH0GFG0GFGCG0G1GFGBGFG8G1GFG9G8H0G1GFGCG7,N0QFGCO0G7G9GFGCH0G1GFGCH0GFGBGFG8G1GFG6G3G8H0G7GFG9G8G0G3GFGCJ0GEI0HFG8I0G3G8GEH0G1GCH0GCG0GFGCG0G1GFGBGFG8G1GFG1G8H0G1GFG0G7,M0G3IFGCI0G1JFG8N0GFG3GBGEH0G7GFH0G1GDGBGCI0G7GFGCH0G7GCG5G8G0G3GFK0GEI0HFH0G1GEG3G8GFI0GCH0G8G3GDGEG0G1GFGBGFG8G0GCG1GCI0G6G0G7,K0G3HFGCG0G7LFG8G1HFGEL0G1GFGCGFGCG0G1GFGCH0G1GCGFG8I0G7GEH0G7G9GFGDG8G0G6G0G3GCI0GEI0G3GCGFG0G1GEG3G8G7I0GCI0HFGEG0G1GFGBG1GCH0G3GCH0G1G9GCG7,K0G7IFGEG0G1IFGEH0JFG8K0G1GFGCG7GCH0GFGCI0G8HFG8H0G7GFH0GFG9GFGDG8G0H8GFGEI0GEI0G7GFGEH0GEG3G8G7I0GCH0G7HFGEG0G1GEG3G1G8H0G3GCH0G1GFGEG7,J0G3HFG1HFM0G3GFGEG3HFL0G9GDG3GEH0G3G8J0HFG8H0G3GFGCG0GFG7G3G9G8G1GBHFGEI0GEH0G1GFG3GCH0GEG3G8GEI0GCH0G7GEG7GEG0G1GCG3GFG8H0G7G3G8G0G1GFGEG7,J0G7HFGCR0IFG8K0G1GDHFH0G1G8I0G1GBGFG8H0G7GFGEG0GEG7G3G9G8G1IFGEI0GEH0G1GFG3G8H0G6G3GFGEH0G1GCH0G7GCG7G6G0G1GCG3GFG8H0GEGBG8G0G1GEGCG7,I0G1GFGCG3GCR0GFG1GFGCK0G1GDHFH0G1GBGCH0G1HFG8H0G7GFGEG0GCH7G9G8G1GFGEHCI0GEH0G1GEG7G8H0G7HFGEH0G1GCH0G1G8G7GEG0G1GCG3HFH0HFGCG0G1GFGCG7,I0GFGEG7G0G1G8HFGCG3H0GCIFG0G4G7G3GFGCJ0G1HFI0G7G3GFG8G0G1HFH0G1GFGEH0G1HFG1G8G0GFGCGFG8I0GEH0G3G8GEG0GCG0HFG0GEH0G3G8J0GFGEG0G1GEG2G3GFG8G1HFGCH0GFG8G7,H0G1GFG7GFG0G3G9HFGEG7G0G1GDIFG0G6G0G7GBGCJ0G1HFI0G7G0GFGCG0G1GFGEH0G1G8HCG0G1GBGFG1G8G0GFGCGFG8I0GEH0G3G9GFG1GEG1GFG8G0GEH0G3G8I0G1GFGEG0G1GEG3G6G7GCG0GFG9GCH0GEG0G7,H0G1GFG8G7G0G7G9HFGEG7G0G1GDIFG0GEG0G2G7GFJ0G3IFG8G3GFG0G7GCG0G1GFGCH0G1HCGEH0GBGDG9G8G0G7GCGFG8I0G7H0G1GFG7GFGEG0GFH0G6H0G3G8I0G1GEG6G0G1GEG3GCG3G8G0GEG1GEH0G6G3GF,H0G3GFGCG7G0G7G1HFGEG7G8G1GCIFG1GFH0G6GFJ0G3IFGCG3GFG0G3GCH0GFG8I0HCGEH0G3G8GDG8G0G7G8GCG8I0G3H0G1GEG3GFGEG0G6K0G3G8I0G1GEG6G0G1GEG3GCI0GEG0GCI0G7GE,H0G7GCG0G7G0GEG1GCH0G7GCG1GCG0GFG0G1GFH0G3GFGCI0G1GEG7GFGEG3GEG0G1GCH0HFG8G0G1GFGCG6H0G3G8G7G8G0G6L0G3H0G1GEG3GFGCM0GEK0GFGEH0G6G3GCO0G3GE,H0GFGCG0G7G1GEG1GCH0G7GCG1GCG0G7G0G1GFH0G3GFGCI0G1G8G0G7GCG3G8H0GCH0G7GFG8G0G1GFGCG2J0G7G8N0G3H0G1GEG0GEN0GEK0GFGEI0G3G8O0G1GE,G0G1GFH0G6G3GCG1GCH0G7GEG1GCG0GFG0G1GBG8H0G3GEU0G1GFG8H0G9GCK0G1G8O0G8S0G8K0G1GCU0G6,G0G1GDH0G6G7G8G1GCH0G7GFG1GCG0GFG0G3GBG8H0G3G6,G0G1GCH0G7GFG0G1HFGCH7G1GCG0GFG0G7GBGCH0G2G6,G0G1GEH0G7GFG0G1HFGCG7G3G1GCG0GFG0G7G9GCI0GE,G0G3GEH0G7GFG8G1HFGCG7G3G8GCG0GFG0G7G1GCI0GE,G0G1GEH0G7G9GCG1GCG1G8G7G1HCG0GFG0G7GFGEI0G6,G0G1GCH0G7G1GCG1GCH0G7G1HCG0GFG0G7GFGEH0G3G6,G0G1GDH0G7G1GEG1GCH0G7G0GFGCG0GFG0HFGEH0G3GE,G0G1GFH0G7G0GEG1GCH0G7G0GFGCG0GFG1IFH0G7GE,H0GEGCG0G7G0G6G1GCH0G7G0G7GCG0GFG1GEG0G7H0GDGC,H0G7GEG0G7G0G7G1GCH0G7G0G7GCG0GFG1GEG0G7G0G3GFGC,H0G3GFGCG7G0G3G9HFGEG7G0G3GCG0GFG3GCG0G7G8HFY0G1G8R0GCK0G6X0GEN0G6J0G1G8,H0G1GFGCG7G0G3G9HFGEG7G0G1GCG0GFG3GCG0G7G8GFGEJ0G7GEGFG8N0G3GFGEG3GCQ0G1GEK0GEG1GCG3G8L0G1GCL0GEI0GEH0G6G0G7J0G7GCQ0GC,H0G1GFGCGEG0G1G8HFGEG7G0G1GCG0GFG3GCG0G3GEG7GCJ0G7GCGFG8N0G3HFG3GCQ0G1GEK0GEG1GEG3GCL0G3GCL0GFI0GFG0G1GFG1GFGCI0HFG8J0G3GCI0G1GC,I0G7GFGCU0G1HFK0G3GCGFO0G1GEG7G3GCR0GCK0G8G1GCG3GCL0G3GCL0G3G8H0GFG0G1GEG3GBGCI0GEG7G8J0G3GCI0G1GC,I0G3GFG1GES0G3GEG7GFK0G3GCGEK0G3I0G1GEH3GCJ0G2R0G1G8G0GCG7G8L0G3GCL0G3G8H0G7G8G1GEG3G9G8H0G3GCG3G8J0G3G8G0G3G0G1GC,J0G7GFG0GFG8P0GFGCG7GFG8K0G3G9G8G0G3I0G7G0G4G0G1GEG0G3G8G3G0G1G0GEH0G1K0G1I0G3H0GCGEM0G1G8L0G3GCH0G7G8G3GCG3G8I0G3G8G1G8J0G3H0G6H0GC,J0G1HFGEG1HFK0G7GFGCG3HFGEL0G3GDH0G7G8GFGCG7GBGFG0G1GCG0G3G8G7G8G3GCGFG7GEG3GCG7GFG3GCG7GEH0G3H0HCG0GEG7G3GFG8GFG9GFGCG7GCHFG0G1GCH0G3G8G3GCG3G8G7GFG0G3G8H0GFG8H0G3H0GFG1GFGC,K0G7GFGCG3HFGEI0G3HFGEG0HFM0G3GEG0G1GFGDGFGCG7GBGFG0G1GEG6G3G8GFGCGFGCGFG7GEGFGEG7GFG3GCGFGEH0G3H0GDGCG0GEG7G3GFG8GFG9GFGCGFGCHFG0G1GCH0G3GCG3GCG3GCHFG0G7G8G0G1GFG8H0G3H0GFG9GFGC,K0G1IFGEH0G7HFH0G1IFGCM0G3GEG0G1G9GCHEG7G3GBG8G1GFGEG3H9GCGFHEG7GFHEG7GFG9HCGEH0G3H0GFH0GEG7GBGFG8H9GFGCGEGCHFH0GCH0G7GEG3GCG3G9HEG0G7G8G0G1GFGCH0G3H0GFG1GFGC,L0G1HFGEG0G1IFGCH0HFGCN0G3GEG0G1G8HCGEG7G3GBG8G1GFGEG3G9G8JCG7G1HEG7GBG9HCGEH0G3H0GFH0G6H3G1I9GDGCGEGCGFG3H0GCH0G7GEG5GCG3G9GCGEG0G7G8G0G3G1GCH0G3H0GEG3G9GC,N0G7PFP0G3GFG8G1GFG8GCGEG3G0G7G8G1GCG0G3G9GFG8GCG0GEG7G1GCGFH3G9HCI0G3H0GDGCG0G6H3G1G8GEG1G9GCG1GCG7G3G0G1GCH0H6G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,P0MFG8Q0G3G9G8G1G8G0GCGEH3GBG8G1GCG0G3G9G8G1GCG0GCG7G1GCGFG3GBG9GDGCI0G3H0GDGEG0G6H3G1G8GFG1G9GCG6GCG7G3G0G3GCH0G6G7G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,Q0G1IFGES0G3G9GCG1G8G0GCGEH3GBG8G1GEG0G3G9G8G1GCG0GCG7G1GCGEG7G3G9HCI0G3H0GCGFG0G6H3G1G8G7H9GCGEGCG7G3G0G3G8H0G6G7GDGCG3G8HEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,gO0G3G9GEG1G8HCGEI3G8G1GEH3G9H8GCG4GCG7G1HEG7GBG9HCG2H0G3G8G0GCGFG0G6H3G1G8G3H9GDHCG7G3G0G3G8H0G6G7G9GCG3G8G7H0G3G8G1G3G0GEH0G3H0GEG7G1GC,gO0G3GCGFG1ICGEG7H3G8G1GCH3G9HCGEGCGEG7G1HEG7GBG9GCHEH0G1G8G0GCG7G8G6G7G3G1G9G1H9GDHCG7G3G0G7G8H0G6G3G9GCG3G8GFG0G6G3G8G1GBG1GCG4G0G3G0G6GEG7G9GCG8,gO0G7GCGFG9GFGDGCGEG7GBGFGCG3GEH3G9GFGCGFGCGFG7G1HEG7GBG9GCGFGEI0GCG0GCG3GCH7GBG1J9GDGEGCGFG3G0GFI0G6G3G9GCG3G9GFGCG7G3GCG7G3G9G8GCGFG3G8GEG6G7H9GC,gO0G7GCGFGCG7G1GEGFG3GBG9G8G3GFGEG3GCG7G0G3G8H7G8G3G8GFG7GBGCG7G8I0G6G1GEG3GFG7GFGBG9GCGFG3GFGCG7HFG7G1GCI0GFG0G3GEG3G8GFGEG7G0G7GEG1GFG8GCGFG3GFGEG3G1GFG9GC,gO0G1G8G1GCG7G0G4G2G0G1G8G0G1G3GCG1G8G7G0G3G0G2G3G0G3G0G6G2G1G8G3J0G6G1GCG0GEG3G8G1G9GCGEG1HCG6G0GCG3G0G8I0GEG0G1GEG3G8HFG6G0G7GCG0GFG0GCGFG3GFGCG3G0GFG9GC,jR0G1G8G3N0G7,jR0G3GCG3N0G6,jR0G3GFGEN0GE,jS0GFGC,,:::^FS^FO542,42//rohs^FO542,42^GFA,750,750,15,P0G3KFGC,:N0G3OFG8,:L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,:J0G7GEU0G7G8,I0G1GFW0GF,:I0G7G8W0G3GE,H0G1GCY0G3G8,:H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,:G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,:G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,:G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,:G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,:G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,:G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,:I0G7G8W0G3GE,J0GFV0G1GF,:J0G3GEU0G7G8,K0G1GFG8Q0G3GFG8,:L0G3GFGEO0G7GFG8,N0G3OFG8,:P0G3KF,^FS//环保icon^FO665,42^GFA,350,350,7,K0IFG8,J0G3GFGCG0G6,:J0G7GFGEG0G1G8,:I0G1IF,I0G1HFGDG8G0G4,I0G3HFG8GCG0G2G4,I0G7HFG8G6G0G1GC,I0G7HFG0G6G0G1G4,I0HFGEG0G2H0G4,H0G1HFGCJ0GC,:H0G1HFG8G0G1G8G0G8,I0HFH0G2H0G8,:I0G1GFH0G1GE,:H0G1G8G6I0G3GF,GFH0G4L0GFGE,:G3G8G0G4K0G3GFGE,G0G8G0G4K0G7HF,O0G7HF,G1H0G2K0G3HF,G3H0G2K0G1HFG8,:G2H0GEK0G1HFGC,H0G1GFG8K0HFGC,GCG0H1G8K0HFGC,GCG0G2M0HFGC,:GCG0GCK0G4G0G3GFGC,H0G8K0G4G0G3GFGC,:H3K0G1GCH0GFG8,:G1G7JFH0G7IFG8,G0KFG0GCI0G1,:G0KFG1G8I0G1,G0G7JFG3,G0G3JFG3J0G6,G0G3JFG1GCI0GE,H0G7IFG0G2H0G3,M0G1G7GFGC,M0G1GE,N0G6,::^FS^FO682,32^FO62,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户编号:^FS^FO170,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户代号+'^FS^FO112,172^AD,N,,^FB696,1,0,L,0^FDC/N:____________________^FS^FO62,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户料号:^FS^FO170,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品名称+'^FS^FO62,232^AD,N,,^FB696,1,0,L,0^FDCustomerP/N:________________^FS^FO62,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料生产商:^FS^FO170,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料供应商+'^FS^FO62,292^AD,N,,^FB696,1,0,L,0^FDMaterialSupplier:___________^FS^FO62,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料品名:^FS^FO170,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料名称+'^FS^FO62,352^AD,N,,^FB696,1,0,L,0^FDMaterialName:_______________^FS^FO62,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料规格:^FS^FO170,382^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.原料规格+'^FS^FO62,412^AD,N,,^FB696,1,0,L,0^FDMaterialSpec:_______________^FS^FO62,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装员:^FS^FO170,442^FB290,1,0,C,0^A1N,24,20^FD'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO62,472^AD,N,,^FB696,1,0,L,0^FDPackager:___________________^FS^FO62,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD贸易方式:^FS^FO170,502^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.贸易方式+'^FS^FO62,532^AD,N,,^FB696,1,0,L,0^FDModeofTrade:________________^FS^FO562,112^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD_______月份Month^FS^FO450,105^FB290,1,0,C,0^A1N,24,20^FD'+(moment().get("month")+1)+'^FS^FO420,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户订单号:^FS^FO496,142^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.客户单号+'^FS^FO420,172^AD,N,,^FB696,1,0,L,0^FDPartNo.:____________________^FS^FO420,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD健大品号:^FS^FO496,202^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.产品编码+'^FS^FO420,232^AD,N,,^FB696,1,0,L,0^FDKentaP/N:___________________^FS^FO420,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FDUL号码:^FS^FO496,262^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.UL号+'^FS^FO420,292^AD,N,,^FB696,1,0,L,0^FDULFileNo.:__________________^FS^FO420,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD防火等级:^FS^FO496,322^FB290,1,0,C,0^A1N,24,20^FD'+mopageinfo.防火等级+'^FS^FO420,352^AD,N,,^FB696,1,0,L,0^FDFlameClass:_________________^FS^FO420,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD数量:^FS^FO496,382^FB290,1,0,C,0^A1N,24,20^FD'+sum+'^FS^FO420,412^AD,N,,^FB696,1,0,L,0^FDQuantity:___________________^FS^FO420,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装日期:^FS^FO496,442^FB290,1,0,C,0^A1N,24,20^FD'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO420,472^AD,N,,^FB696,1,0,L,0^FDPackingDate:________________^FS^FO420,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD已验收:^FS^FO496,502^FB290,1,0,C,0^A1N,24,20^FD合格^FS^FO420,532^AD,N,,^FB750,1,0,L,0^FDQCPass:_____________________^FS^FO92,590^BCN,160,Y,N,N,A^FD'+outertag+'^FS^FO60,535^AE,N,,^FB730,1,0,L,0^FD_________________________________________________________^FS^FO100,790^AD,N,,^FB696,1,0,L,0^A1N,10,10^FD'+xuehao+'^FS^FO550,700^AD,N,,^FB696,1,0,L,0^A1N,34,32^FDMADE IN CHINA^FS^XZ';
                obj.tableHtml = '<table class="ui celled table"><tbody><tr><th>客户编号:</th><td>'+mopageinfo.客户代号+'</td><th>客户订单号:</th><td>'+mopageinfo.客户单号+'</td></tr><tr><th>客户料号:</th><td>'+mopageinfo.产品名称+'</td><th>健大品号:</th><td>'+mopageinfo.产品编码+'</td></tr><tr><th>原料生产商:</th><td>'+mopageinfo.原料供应商+'</td><th>UL号码:</th><td>'+mopageinfo.UL号+'</td></tr><tr><th>原料品名:</th><td>'+mopageinfo.原料名称+'</td><th>防火等级:</th><td>'+mopageinfo.防火等级+'</td></tr><tr><th>原料规格:</th><td>'+mopageinfo.原料规格+'</td><th>数量:</th><td>'+sum+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format('YYYY-MM-DD HH:mm')+'</td></tr><tr><th>贸易方式:</th><td>'+mopageinfo.贸易方式+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
            }
        }
    }
    return obj;
}

function RePrint() {
    console.log('重新打印',cpj)
    if(cpj.printerCommands!='') {
        cpj.sendToClient();        
    }
    $('input[name="被包装标签_input"]').val('');
    $('input[name="成品标签"]').val('');
    $('#被包装标签').dropdown({values:[]});
    $('input[name="被包装标签_input"]').focus(); 
}

