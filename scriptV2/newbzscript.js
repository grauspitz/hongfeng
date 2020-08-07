//221906
var global_tagArray = [];
var printStatus = 'offline',canPrint = false;

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


JSPM.JSPrintManager.auto_reconnect = true;;

JSPM.JSPrintManager.start(true,'128.0.0.218',22443);
JSPM.JSPrintManager.WS.onOpen = function() {console.log('connect')
    printStatus = 'online';
};

JSPM.JSPrintManager.WS.onStatusChanged = function() {};

JSPM.JSPrintManager.WS.onClose = function() {};

printerName = 'smalllabel';
cpj = new JSPM.ClientPrintJob();
clientPrinter = new JSPM.InstalledPrinter(printerName);
cpj.clientPrinter = clientPrinter;  
cpj.printerCommands = ''; 

var isSubmit = false;

var socket2 = io.connect('https://www.kenta.cn:8893');
socket2.emit('storeClientInfo', ['后工序总MO列表']);
socket.on('postidReturn', function (response) {          
    global_json = response;
    var html = response.formhtml.slice(0,-6)+'<div class="field" id="bigtagpreview"></div><div class="fluid ui submit button" data-type="preview" onclick="FormSubmit(this)">预览</div><br/><div class="fluid ui submit button" data-type="print" onclick="FormSubmit(this)">打印</div><br/><div class="fluid ui button" onclick="RePrint()">重新打印</div><div class="ui error message"></div></div>';         
    $('#formtitle').html(response.title);
    $('#formdescription').html(response.description);
    $('#display').html(html);
    $('.ui.dropdown').dropdown();
    $('.ui.form.first').form({            
        fields:global_json.fields
    });   
    
    $('input[name="被包装标签_input"]').keydown(function (e) {
        if (e.keyCode == 13) {
            var allFields = $('.ui.form.first').form('get values');                
            var inputvalue = $('input[name="被包装标签_input"]').val();  console.log(11,allFields.被包装标签.split(','));  
            if(allFields.包装类型=='中箱') {                
                var selected = _.filter(后工序总MO列表,{领料单号:{最小包装标签:[{物料标签号:inputvalue}]}})[0];
                if(selected==undefined) {
                    alert('标签错误!');
                    return false;
                }else {
                    var mytmp = selected.领料单号.标签状态[inputvalue];
                    if(mytmp.包规数 - mytmp.不良品数 - mytmp.被包装数 == 0) {
                        alert('此标签已被包装完,请检查!');
                        return false;
                    }
                }
            }
            if(allFields.被包装标签.split(',').indexOf(inputvalue)>-1) {
                alert('此标签已存在');                
            }else {                
                var tmp = allFields.被包装标签==""?[]:allFields.被包装标签.split(',');
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
        }
    });  
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
        $.get("https://www.kenta.cn:8893/type=callfunction?dataname=QueryBigCards", function(response) {},'json');           
    }
}) 

socket2.on('getnewjson', function (msg) {  
    console.log('msg',msg);      
    if(msg.后工序总MO列表 != undefined) {                
        if(isSubmit) {
            alert('提交成功！');
            $('#myloader').removeClass('active');
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
    var allowed = ['jiaming.liu','ricky.ngai','xiaoyu.ye','lucy.lee'];
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

function FormSubmit(e) {
    var type = e.getAttribute("data-type");console.log(printStatus)
    if(printStatus == 'offline') {
        alert('打印机离线,请检查!');
        return false;
    }
    if(type == 'print') {
        if(canPrint == false) {
            alert('未准备打印信息');
            return false;
        }
    }    
    var allrequired = $('.ui.form.first').form('is valid'); 
    console.log('type',type)
    if(allrequired==false) {                  
      return false;
    }          
    var allFields = $('.ui.form.first').form('get values'),postobj = {};         
    if(allFields.包装类型 == '') {
        alert('未选择包装类型!');
        return false;
    }
    global_tagArray = allFields.被包装标签.split(','); 
    var errortags = []; 
    var selected;
    var outertag = '';
    var level = 1;    
    if(allFields.包装类型=='中箱') {
        var isDifferentMO = false;
        var 将被包装数 = 0,最后一包之前包装数 = 0;
        var bzobj = {};
        _.map(global_tagArray,function(n,n_index){
            var selectTag = _.filter(后工序总MO列表,{领料单号:{最小包装标签:[{物料标签号:n}]}});
            if(selectTag.length==0) {
                errortags.push(n);
            }else {   
                if(selectTag[0].MO != isDifferentMO && isDifferentMO != false) {
                    isDifferentMO = true;
                }else {
                    isDifferentMO = selectTag[0].MO;
                }          
                var tmp = _.chain(selectTag[0].QC记录).sortBy(function(n){                
                    return n.提交时间
                }).groupBy(function(o){return o.标签号}).value()[n];
                if(tmp[tmp.length-1].检测结果 == 'NG') {
                    errortags.push(n);
                }                   
                var mytag = selectTag[0].领料单号.标签状态[n];          
                bzobj[n] = (mytag.包规数 - mytag.不良品数 - mytag.被包装数);
                将被包装数 += bzobj[n];
                if(n_index<global_tagArray.length-1) {
                    最后一包之前包装数 = 将被包装数;
                }
            }                
        });        
        if(errortags.length>0) {
            alert(errortags+'未生产或未QC通过');                
            return false;
        }  
        if(isDifferentMO == true) {
            alert('最小标签非同一MO');
            return false;
        }            
        selected = _.filter(后工序总MO列表, {领料单号:{最小包装标签:[{物料标签号: global_tagArray[0]}]}})[0];            
        postobj.数量 = parseInt(selected.mopageinfo.第2层数量);
        postobj.包规 = parseInt(selected.mopageinfo.第2层数量);
        postobj.下层包规 = parseInt(selected.mopageinfo.第3层数量);
        if(将被包装数<postobj.包规) {
            var r = confirm('理论包装数:'+postobj.包规+'\n实际包装数:'+将被包装数);
            if(r==true) {
                if(parseInt(selected.需生产数量)-selected.已完成数量>postobj.包规) {
                    alert('MO未完成数量大于包装包规,本次包装需补全包规数');
                    return false;
                }else {
                    postobj.数量 = 将被包装数;
                    postobj.小包被包装情况 = bzobj;
                }                
            }else {
                return false;
            }                      
        }else {           
            bzobj[global_tagArray[global_tagArray.length-1]] = postobj.数量 - 最后一包之前包装数;
            postobj.小包被包装情况 = bzobj;
        }
    }else {
        //1.假设为中箱包大箱
        var isDifferentMO = false;
        var 将被包装数 = 0;
        var bzobj = {};
        _.map(global_tagArray,function(n){
            var selectTag = _.filter(后工序总MO列表,{成品标签:[{成品标签:n}]});            
            if(selectTag.length==0) {
                errortags.push(n);
            }else {
                if(selectTag[0].MO != isDifferentMO && isDifferentMO != false) {
                    isDifferentMO = true;
                }else {
                    isDifferentMO = selectTag[0].MO;
                }   
                bzobj[n] = _.filter(selectTag[0].成品标签,{成品标签:n})[0].数量;
                将被包装数 += bzobj[n];            
            }                
        });
        console.log('errortags',errortags);
        if(errortags.length>0) {
            //2.如果假设1中存在错误标签 就走假设2——小标签包大箱
            var errortags2 = [];
            var isDifferentMO = false;
            var 将被包装数 = 0,最后一包之前包装数 = 0;
            var bzobj = {};
            _.map(global_tagArray,function(n,n_index){
                var selectTag = _.filter(后工序总MO列表,function(value){
                    if(value.小标签流信息[n]!=undefined) {
                        return value;
                    }
                });            
                if(selectTag.length==0) {
                    errortags2.push(n);
                }else {   
                    if(selectTag[0].MO != isDifferentMO && isDifferentMO != false) {
                        isDifferentMO = true;
                    }else {
                        isDifferentMO = selectTag[0].MO;
                    }          
                    var tmp = _.chain(selectTag[0].QC记录).sortBy(function(n){                
                        return n.提交时间
                    }).groupBy(function(o){return o.标签号}).value()[n];
                    if(tmp[tmp.length-1].检测结果 == 'NG') {
                        errortags2.push(n);
                    }     
                    var mytag = selectTag[0].领料单号.标签状态[n];          
                    bzobj[n] = (mytag.包规数 - mytag.不良品数 - mytag.被包装数);
                    将被包装数 += bzobj[n];
                    if(n_index<global_tagArray.length-1) {
                        最后一包之前包装数 = 将被包装数;
                    }       
                }                
            });
            console.log('errortags2',errortags2);
            if(errortags2.length>0) {
                alert(errortags+'非中箱标签\n'+errortags2+'未生产或未QC通过');                
                return false;
            }else {
                if(isDifferentMO == true) {
                    alert('最小标签非同一MO');
                    return false;
                } 
                selected = _.filter(后工序总MO列表, {领料单号:{被包装标签:[{物料标签号: global_tagArray[0]}]}})[0];
                postobj.数量 = parseInt(selected.mopageinfo.第2层数量);
                postobj.包规 = parseInt(selected.mopageinfo.第2层数量);
                postobj.下层包规 = parseInt(selected.mopageinfo.第3层数量);
                if(将被包装数<postobj.包规) {
                    var r = confirm('理论包装数:'+postobj.包规+'\ns实际包装数:'+将被包装数);
                    if(r==true) {
                        if(parseInt(selected.需生产数量)-selected.已完成数量>postobj.包规) {
                            alert('MO未完成数量大于包装包规,本次包装需补全包规数');
                            return false;
                        }else {
                            postobj.数量 = 将被包装数;
                            postobj.小包被包装情况 = bzobj;
                        }                
                    }else {
                        return false;
                    }                      
                }else {           
                    bzobj[global_tagArray[global_tagArray.length-1]] = postobj.数量 - 最后一包之前包装数;
                    postobj.小包被包装情况 = bzobj;
                }
            }                          
        }else {
            if(isDifferentMO == true) {
                alert('中箱标签非同一MO');
                return false;
            }             
            selected = _.filter(后工序总MO列表,{成品标签:[{成品标签:global_tagArray[0]}]})[0];
            level = _.filter(selected.成品标签,{成品标签:global_tagArray[0]})[0].level+1;    
            if(parseInt(selected.mopageinfo['第'+(level+1)+'层数量'])==0) {
                alert('当前被包装标签已经是最大包装!');
                return false;
            }        
            
            postobj.数量 = 将被包装数;
            postobj.包规 = _.filter(selected.成品标签,{成品标签:global_tagArray[0]})[0].下层包规;
            postobj.下层包规 = parseInt(selected.mopageinfo['第'+(level+2)+'层数量']);
            if(将被包装数<6000) {//postobj.包规
                var r = confirm('理论包装数:'+postobj.包规+'\ns实际包装数:'+将被包装数);
                if(r==true) {
                    var 已包装数量 = 0;
                    _.chain(selected.成品标签).filter({level:level-1}).map(function(value){
                        已包装数量+=value.数量
                    });
                    if(parseInt(selected.需生产数量)-已包装数量>postobj.包规) {
                        alert('剩余未包装数量大于包装包规,本次包装需补全包规数');
                        return false;
                    }else {
                        postobj.数量 = 将被包装数;
                        postobj.小包被包装情况 = bzobj;
                    }                        
                }else {
                    return false;
                }                      
            }
        }                       
    }
    outertag = moment().format("x");
    var tableHtml = '';
    $('#bigtagpreview').html('');
    if(allFields.包装类型 == '中箱') {        
        clientPrinter = new JSPM.InstalledPrinter('smalllabel');                 
        cpj.clientPrinter = clientPrinter;  
        cpj.printerCommands = '^XA^FO95,5^FO95,5^FO150,10//kentaicon^FO150,10^GFA,520,520,13,,:O0LFGC,M0IFGCI0IFGE,L0GFGEN0G1GFGE,K0GFGCQ0G7GF,J0G7GFR0G1GFG8,I0G3GFU0GF,I0GFG8U0G1GC,H0G3GCW0G3G8,H0G6X0G1GC,G0G3G9GCG0G7G1HFG8G3G8G0GEG3HFGEG0GFH0G7,G0G3G9GCG0GFG1HFG8G7GCG0GEG3HFGEG1GFH0G3G8,G0G6G1GCG0GFG1HFG8GFGCG0GEG3HFGEG1GFG8H0GC,G1GCG1GCG3GEG1GCH0GFGCG0GEG0G3GEG0G3GFG8H0G7,G1G8G1GCG7GCG1GCH0HFG0GEG0G3GEG0G3GBG8H0G3,G3G0G1GCG7G8G1GCH0GFG7G0GEG0G3GEG0G3G9GEH0G1G8,G2G0G1GCGFG0G1GCH0GFG7G8GEG0G3GEG0G3G9GEI0GC,G6G0G1GDGFG0G1HFG0GFG7G8GEG0G3GEG0G7G8GEI0GC,G6G0G1GFGEG0G1HFG0GFG3G8GEG0G3GEG0G7G0GEI0GC,GCG0G1GDGFG0G1HFG0GFG3GCGEG0G3GEG0GFG0GEI0GE,GCG0G1GCG7G8G1GCH0GFG0HEG0G3GEG1GEG0GFI0GE,G6G0G1GCG7G8G1GCH0GFG0GFGEG0G3GEG1IFI0GC,G6G0G1GCG7GCG1GCH0GFG0GFGEG0G3GEG1IFI0GC,G2G0G1GCG3GEG1GCH0GFG0G7GEG0G3GEG1GCG0G7GCH0GC,G3G0G1GCG1GEG1HFG8GFG0G7GEG0G3GEG1GCG0G7GCG0G1G8,G1G8G1GCG0GFG1HFG8GFG0G3GEG0G3GEG3GCG0G7GCG0G3,G1GCG1GCG0G7G1HFG8GFG0G1GEG0G3GEG3G8G0G1GCG0G7,G0G6gG0GC,G0G7G8Y0G1G8,G0G3GCY0G7,H0G6X0G1GC,H0G1GCW0GFG8,I0GFG8U0G3GC,I0G1GFT0G1GE,J0G7GCS0G7GE,K0GFGCQ0G7GE,L0HFG8M0G1GFGE,M0G7IFG8G0G3IFGC,O0G3KFG8,^FS^FO285,15^AD,N,,^FB620,1,0,L,0^A1N,38,36^FD物料标识纸^FS//rohsicon^FO550,10^FO550,10^GFA,600,600,15,P0G3KFGC,:N0G3OFG8,L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,J0G7GEU0G7G8,:I0G1GFW0GF,I0G7G8W0G3GE,H0G1GCY0G3G8,H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,:G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,:G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,I0G7G8W0G3GE,J0GFV0G1GF,J0G3GEU0G7G8,:K0G1GFG8Q0G3GFG8,L0G3GFGEO0G7GFG8,N0G3OFG8,P0G3KF,^FS^FO665,10^FO105,90^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户料号:'+selected.客户料号+'^FS^FO105,120^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD健大品号:'+selected.成品代号+'^FS^FO410,65^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD生产日期:'+moment().format("YYYY-MM-DD HH:mm")+'^FS^FO105,148^BCN,60,Y,N,N,N^FD'+outertag+'^FS^FO510,100^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD客户代号:'+selected.客户代号+'^FS^FO510,130^AD,N,,^FB620,1,0,L,0^A1N,24,20^FD数量:'+postobj.数量+'^FS^FO510,210^AF,N,,^FB620,1,0,L,0^FDMADE IN CHINA^FS^XZ';
        tableHtml = '<table class="ui celled table"><tbody><tr><th>生产单号:</th><td>'+selected.MO+'</td><th>生产日期:</th><td>'+moment().format("YYYY-MM-DD HH:mm")+'</td></tr><tr><th>客户料号:</th><td>'+selected.客户料号+'</td><th>健大品号:</th><td>'+selected.成品代号+'</td></tr><tr><th>客户代号:</th><td>'+selected.客户代号+'</td><th>数量:</th><td>'+postobj.数量+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
    }else {
        clientPrinter = new JSPM.InstalledPrinter('largelabel');                 
        cpj.clientPrinter = clientPrinter;  
        cpj.printerCommands = '^XA^CI28^CW1,E:SIMSUN.FNT^FO45,15^GB730,810,1,,0^FS^FO46,16^GB728,808,1,,0^FS^FO62,32^FO62,32^GFA,3990,3990,57,,:::::::::hM0GC,gQ0G7G8H0G1GCJ0G7GEI0G1GFGCH0G1G8G1G8O0G8S0GCK0GE,gQ0G3G8I0GFJ0GFGEI0G3GFGCH0G3GCG1G8I0GFJ0G3G8H0G1GFG8I0G3G8I0GEK0GFG6H0G1GCGFG8N0GFGE,gP0G8G3GCI0GFJ0GFGCI0G3GBGCH0G3GEG1G8I0GFJ0G3I0G1GFGCI0G3G8I0GEK0G7GFH0G3GCGFGCN0HF,gO0G1GEG7GEI0GFJ0GFG8I0GFGBG8H0G1GEG1G8H0HFJ0G3I0G3GFGEI0G3G8I0G7G8J0G7GFG8G0GFGDGFGEH0GEG1GFH0G1HFG8,gO0G1GEG7GEI0GEJ0G6G3G8G0G1HFI0G5GEG1G8G0G3HFJ0G3H0G1GFGCGFI0G3G8I0G3G8J0HFG8G0GFGDGFGEG0G1GEG1GFH0G1GEG7G8,gO0G1GEG7GEI0GFJ0HFGCG0G1IFH0G7GFG9G8G0G3GCGFJ0GFH0G1GCHEI0G3G8I0G3G8I0IFH0G7G8G3GCG0G1GEG3GFG8I0G7G8,gO0G1GEG3GFG8H0HFH0G7GBGCGEG0G1IFG8G0G7G8GDG8G0G3GCGEJ0GEH0G1HFGCI0G3G8I0G3GCH0G7HEI0G3GBGFGCG0G7GEG6G3H0G1GCG7,P0G1KFGCR0G3GFG3GFG8H0HFH0G7G9GFGEG0HFG3G1G8G0G7HDG8G0G3GDGEJ0GEI0HFGCI0G3G8I0G1GCH0GFGCG7G8H0G7GBGFG8G0GFGCG6H0G1GFGCG7,O0G1NFQ0G7G9GFGCI0HFH0G7GBGFGCG1GFGEGBI0G7GFGDG8G0G3GFGCJ0GEI0GFG3G8I0G3G8G6H0G1GCH0GFG0GFGCG0G1GFGBGFG8G1GFG9G8H0G1GFGCG7,N0QFGCO0G7G9GFGCH0G1GFGCH0GFGBGFG8G1GFG6G3G8H0G7GFG9G8G0G3GFGCJ0GEI0HFG8I0G3G8GEH0G1GCH0GCG0GFGCG0G1GFGBGFG8G1GFG1G8H0G1GFG0G7,M0G3IFGCI0G1JFG8N0GFG3GBGEH0G7GFH0G1GDGBGCI0G7GFGCH0G7GCG5G8G0G3GFK0GEI0HFH0G1GEG3G8GFI0GCH0G8G3GDGEG0G1GFGBGFG8G0GCG1GCI0G6G0G7,K0G3HFGCG0G7LFG8G1HFGEL0G1GFGCGFGCG0G1GFGCH0G1GCGFG8I0G7GEH0G7G9GFGDG8G0G6G0G3GCI0GEI0G3GCGFG0G1GEG3G8G7I0GCI0HFGEG0G1GFGBG1GCH0G3GCH0G1G9GCG7,K0G7IFGEG0G1IFGEH0JFG8K0G1GFGCG7GCH0GFGCI0G8HFG8H0G7GFH0GFG9GFGDG8G0H8GFGEI0GEI0G7GFGEH0GEG3G8G7I0GCH0G7HFGEG0G1GEG3G1G8H0G3GCH0G1GFGEG7,J0G3HFG1HFM0G3GFGEG3HFL0G9GDG3GEH0G3G8J0HFG8H0G3GFGCG0GFG7G3G9G8G1GBHFGEI0GEH0G1GFG3GCH0GEG3G8GEI0GCH0G7GEG7GEG0G1GCG3GFG8H0G7G3G8G0G1GFGEG7,J0G7HFGCR0IFG8K0G1GDHFH0G1G8I0G1GBGFG8H0G7GFGEG0GEG7G3G9G8G1IFGEI0GEH0G1GFG3G8H0G6G3GFGEH0G1GCH0G7GCG7G6G0G1GCG3GFG8H0GEGBG8G0G1GEGCG7,I0G1GFGCG3GCR0GFG1GFGCK0G1GDHFH0G1GBGCH0G1HFG8H0G7GFGEG0GCH7G9G8G1GFGEHCI0GEH0G1GEG7G8H0G7HFGEH0G1GCH0G1G8G7GEG0G1GCG3HFH0HFGCG0G1GFGCG7,I0GFGEG7G0G1G8HFGCG3H0GCIFG0G4G7G3GFGCJ0G1HFI0G7G3GFG8G0G1HFH0G1GFGEH0G1HFG1G8G0GFGCGFG8I0GEH0G3G8GEG0GCG0HFG0GEH0G3G8J0GFGEG0G1GEG2G3GFG8G1HFGCH0GFG8G7,H0G1GFG7GFG0G3G9HFGEG7G0G1GDIFG0G6G0G7GBGCJ0G1HFI0G7G0GFGCG0G1GFGEH0G1G8HCG0G1GBGFG1G8G0GFGCGFG8I0GEH0G3G9GFG1GEG1GFG8G0GEH0G3G8I0G1GFGEG0G1GEG3G6G7GCG0GFG9GCH0GEG0G7,H0G1GFG8G7G0G7G9HFGEG7G0G1GDIFG0GEG0G2G7GFJ0G3IFG8G3GFG0G7GCG0G1GFGCH0G1HCGEH0GBGDG9G8G0G7GCGFG8I0G7H0G1GFG7GFGEG0GFH0G6H0G3G8I0G1GEG6G0G1GEG3GCG3G8G0GEG1GEH0G6G3GF,H0G3GFGCG7G0G7G1HFGEG7G8G1GCIFG1GFH0G6GFJ0G3IFGCG3GFG0G3GCH0GFG8I0HCGEH0G3G8GDG8G0G7G8GCG8I0G3H0G1GEG3GFGEG0G6K0G3G8I0G1GEG6G0G1GEG3GCI0GEG0GCI0G7GE,H0G7GCG0G7G0GEG1GCH0G7GCG1GCG0GFG0G1GFH0G3GFGCI0G1GEG7GFGEG3GEG0G1GCH0HFG8G0G1GFGCG6H0G3G8G7G8G0G6L0G3H0G1GEG3GFGCM0GEK0GFGEH0G6G3GCO0G3GE,H0GFGCG0G7G1GEG1GCH0G7GCG1GCG0G7G0G1GFH0G3GFGCI0G1G8G0G7GCG3G8H0GCH0G7GFG8G0G1GFGCG2J0G7G8N0G3H0G1GEG0GEN0GEK0GFGEI0G3G8O0G1GE,G0G1GFH0G6G3GCG1GCH0G7GEG1GCG0GFG0G1GBG8H0G3GEU0G1GFG8H0G9GCK0G1G8O0G8S0G8K0G1GCU0G6,G0G1GDH0G6G7G8G1GCH0G7GFG1GCG0GFG0G3GBG8H0G3G6,G0G1GCH0G7GFG0G1HFGCH7G1GCG0GFG0G7GBGCH0G2G6,G0G1GEH0G7GFG0G1HFGCG7G3G1GCG0GFG0G7G9GCI0GE,G0G3GEH0G7GFG8G1HFGCG7G3G8GCG0GFG0G7G1GCI0GE,G0G1GEH0G7G9GCG1GCG1G8G7G1HCG0GFG0G7GFGEI0G6,G0G1GCH0G7G1GCG1GCH0G7G1HCG0GFG0G7GFGEH0G3G6,G0G1GDH0G7G1GEG1GCH0G7G0GFGCG0GFG0HFGEH0G3GE,G0G1GFH0G7G0GEG1GCH0G7G0GFGCG0GFG1IFH0G7GE,H0GEGCG0G7G0G6G1GCH0G7G0G7GCG0GFG1GEG0G7H0GDGC,H0G7GEG0G7G0G7G1GCH0G7G0G7GCG0GFG1GEG0G7G0G3GFGC,H0G3GFGCG7G0G3G9HFGEG7G0G3GCG0GFG3GCG0G7G8HFY0G1G8R0GCK0G6X0GEN0G6J0G1G8,H0G1GFGCG7G0G3G9HFGEG7G0G1GCG0GFG3GCG0G7G8GFGEJ0G7GEGFG8N0G3GFGEG3GCQ0G1GEK0GEG1GCG3G8L0G1GCL0GEI0GEH0G6G0G7J0G7GCQ0GC,H0G1GFGCGEG0G1G8HFGEG7G0G1GCG0GFG3GCG0G3GEG7GCJ0G7GCGFG8N0G3HFG3GCQ0G1GEK0GEG1GEG3GCL0G3GCL0GFI0GFG0G1GFG1GFGCI0HFG8J0G3GCI0G1GC,I0G7GFGCU0G1HFK0G3GCGFO0G1GEG7G3GCR0GCK0G8G1GCG3GCL0G3GCL0G3G8H0GFG0G1GEG3GBGCI0GEG7G8J0G3GCI0G1GC,I0G3GFG1GES0G3GEG7GFK0G3GCGEK0G3I0G1GEH3GCJ0G2R0G1G8G0GCG7G8L0G3GCL0G3G8H0G7G8G1GEG3G9G8H0G3GCG3G8J0G3G8G0G3G0G1GC,J0G7GFG0GFG8P0GFGCG7GFG8K0G3G9G8G0G3I0G7G0G4G0G1GEG0G3G8G3G0G1G0GEH0G1K0G1I0G3H0GCGEM0G1G8L0G3GCH0G7G8G3GCG3G8I0G3G8G1G8J0G3H0G6H0GC,J0G1HFGEG1HFK0G7GFGCG3HFGEL0G3GDH0G7G8GFGCG7GBGFG0G1GCG0G3G8G7G8G3GCGFG7GEG3GCG7GFG3GCG7GEH0G3H0HCG0GEG7G3GFG8GFG9GFGCG7GCHFG0G1GCH0G3G8G3GCG3G8G7GFG0G3G8H0GFG8H0G3H0GFG1GFGC,K0G7GFGCG3HFGEI0G3HFGEG0HFM0G3GEG0G1GFGDGFGCG7GBGFG0G1GEG6G3G8GFGCGFGCGFG7GEGFGEG7GFG3GCGFGEH0G3H0GDGCG0GEG7G3GFG8GFG9GFGCGFGCHFG0G1GCH0G3GCG3GCG3GCHFG0G7G8G0G1GFG8H0G3H0GFG9GFGC,K0G1IFGEH0G7HFH0G1IFGCM0G3GEG0G1G9GCHEG7G3GBG8G1GFGEG3H9GCGFHEG7GFHEG7GFG9HCGEH0G3H0GFH0GEG7GBGFG8H9GFGCGEGCHFH0GCH0G7GEG3GCG3G9HEG0G7G8G0G1GFGCH0G3H0GFG1GFGC,L0G1HFGEG0G1IFGCH0HFGCN0G3GEG0G1G8HCGEG7G3GBG8G1GFGEG3G9G8JCG7G1HEG7GBG9HCGEH0G3H0GFH0G6H3G1I9GDGCGEGCGFG3H0GCH0G7GEG5GCG3G9GCGEG0G7G8G0G3G1GCH0G3H0GEG3G9GC,N0G7PFP0G3GFG8G1GFG8GCGEG3G0G7G8G1GCG0G3G9GFG8GCG0GEG7G1GCGFH3G9HCI0G3H0GDGCG0G6H3G1G8GEG1G9GCG1GCG7G3G0G1GCH0H6G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,P0MFG8Q0G3G9G8G1G8G0GCGEH3GBG8G1GCG0G3G9G8G1GCG0GCG7G1GCGFG3GBG9GDGCI0G3H0GDGEG0G6H3G1G8GFG1G9GCG6GCG7G3G0G3GCH0G6G7G5GCG3G9GCGEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,Q0G1IFGES0G3G9GCG1G8G0GCGEH3GBG8G1GEG0G3G9G8G1GCG0GCG7G1GCGEG7G3G9HCI0G3H0GCGFG0G6H3G1G8G7H9GCGEGCG7G3G0G3G8H0G6G7GDGCG3G8HEG0G7G8G0G3G0GEH0G3H0GEG7G1GC,gO0G3G9GEG1G8HCGEI3G8G1GEH3G9H8GCG4GCG7G1HEG7GBG9HCG2H0G3G8G0GCGFG0G6H3G1G8G3H9GDHCG7G3G0G3G8H0G6G7G9GCG3G8G7H0G3G8G1G3G0GEH0G3H0GEG7G1GC,gO0G3GCGFG1ICGEG7H3G8G1GCH3G9HCGEGCGEG7G1HEG7GBG9GCHEH0G1G8G0GCG7G8G6G7G3G1G9G1H9GDHCG7G3G0G7G8H0G6G3G9GCG3G8GFG0G6G3G8G1GBG1GCG4G0G3G0G6GEG7G9GCG8,gO0G7GCGFG9GFGDGCGEG7GBGFGCG3GEH3G9GFGCGFGCGFG7G1HEG7GBG9GCGFGEI0GCG0GCG3GCH7GBG1J9GDGEGCGFG3G0GFI0G6G3G9GCG3G9GFGCG7G3GCG7G3G9G8GCGFG3G8GEG6G7H9GC,gO0G7GCGFGCG7G1GEGFG3GBG9G8G3GFGEG3GCG7G0G3G8H7G8G3G8GFG7GBGCG7G8I0G6G1GEG3GFG7GFGBG9GCGFG3GFGCG7HFG7G1GCI0GFG0G3GEG3G8GFGEG7G0G7GEG1GFG8GCGFG3GFGEG3G1GFG9GC,gO0G1G8G1GCG7G0G4G2G0G1G8G0G1G3GCG1G8G7G0G3G0G2G3G0G3G0G6G2G1G8G3J0G6G1GCG0GEG3G8G1G9GCGEG1HCG6G0GCG3G0G8I0GEG0G1GEG3G8HFG6G0G7GCG0GFG0GCGFG3GFGCG3G0GFG9GC,jR0G1G8G3N0G7,jR0G3GCG3N0G6,jR0G3GFGEN0GE,jS0GFGC,,:::^FS^FO542,42^FO542,42^GFA,750,750,15,P0G3KFGC,:N0G3OFG8,:L0G3GFGCO0G7GFG8,K0G1GFG8Q0G1GFG8,:J0G7GEU0G7G8,I0G1GFW0GF,:I0G7G8W0G3GE,H0G1GCY0G3G8,:H0G7G3GFJ0G1G8G3GCG3GEH0G3GEI0G7G0GC,G0G1G8G7GFGEI0G1GCG3GCHFH0HFG8G0G1GFGEG3,:G0G3G0G7GFGEI0G1GCG3GCGFGBH0HFG8G0G3GDGEG1G8,G0GEG0G7G0GFG0G7G8G1GCG3GCGEJ0G7GCG0G3G8GFG0G6,:G0GCG0G7G0GFG3GFGCG1GCG3GCGEJ0G7G8G0G3G8GFG0G7,G1G8G0G7G3GEG3GCGEG1HFGCGFGEI0G7G8G0G3G8GFG0G1G8,:G1H0G7GFGEG7G8GEG1HFGCG7GFI0GFG8G0G3G8GFH0G8,G1H0G7GFGCG7G8G6G1GCG3GCG1GFG8G0G1GFH0G3G8GFH0G8,:G3H0G7G0GEG7G8G6G1GCG3GCG0G3G8G0G3GEH0G3G8GFH0G8,G1H0G7G0GEG7G8GEG1GCG3GCG0G3G8G0G3G8H0G3G8GFH0G8,:G1H0G7G0GEG7G8GEG1GCG3GDGCG3G8G0GFH0GEG3G9GEH0G8,G1G8G0G7G0G7G3GFGEG1GCG3GDHFH0HFGCGEG3GFGEG0G1G8,:G0GCG0G7G0G7G1GFG8G1GCG3GCG7GEH0HFGCGEG0GFGCG0G7,G0GEgI0G6,:G0G3gH0G1G8,G0G1G8gG0G3,:H0G7g0G1GC,H0G1GCY0G3G8,:I0G7G8W0G3GE,J0GFV0G1GF,:J0G3GEU0G7G8,K0G1GFG8Q0G3GFG8,:L0G3GFGEO0G7GFG8,N0G3OFG8,:P0G3KF,^FS^FO682,32^FO682,32^GFA,585,585,9,L0G3IFGE,L0HFG8G0G1G8,:K0G3HFGEH0G6,K0G7HFGEH0G7,:J0G1JFH0G1,J0G1IFG9GCH0G8,J0G3IFG0GCH0G4G6,:J0G7IFG0G3H0G3GE,J0G7HFGEG0G3H0G3G6,:I0G1IFG8G0G3I0G4,I0G3IFL0GC,:I0G3IFI0G8H0GC,I0G3HFGEI0GCH0G8,I0G1HFGCH0G3I0G8,:J0G3GFGCH0GFG8,J0G1GFGCI0GFG8,:I0G3G8G3K0G7GF,H0G3GFGCM0G7G1GE,GFG8H0G4N0HFG8,:G1GCH0G4M0G7HFG8,G0G4H0G4L0G1IFGC,:R0IFGC,G0G8H0G2M0G7HFGE,G1G8H0G2M0G3IF,::G1H0G1GEM0G3IFG8,G2H0G3GFG8M0IFG8,:GEH0G2G1G8M0IFG8,GCH0GCO0IFG8,:GCH0GCO0G3HFG8,GEG0G3M0G1G8G0G1HFG8,G2G0G3M0G3G8G0G1HFG8,:G1G0G3M0G7G8H0HFG8,G1G8GCM0GDG8H0G7GF,:G0GBKFGEH0G1KF,G0G3KFGEG0G3K0G6,G0G7KFGEG0GCK0G4,:G0G7KFGEG1GCK0G4,G0G3KFGEG7,:H0KFGEG7K0G1G8,H0KFGEG1GCJ0G7G8,:I0JFGEG0G3I0G3G8,P0G9HFGC,P0GDG8,:P0G3G8,P0G1G8,:^FS^FO62,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户编号:'+selected.客户代号+'^FS^FO112,172^AD,N,,^FB696,1,0,L,0^FDC/N:______________________^FS^FO62,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户料号:'+selected.客户料号+'^FS^FO62,232^AD,N,,^FB696,1,0,L,0^FDCustomerP/N:__________________^FS^FO62,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料生产商:'+selected.mopageinfo.原料供应商+'^FS^FO62,292^AD,N,,^FB696,1,0,L,0^FDMaterialSupplier:_____________^FS^FO62,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料品名:'+selected.mopageinfo.原料名称+'^FS^FO62,352^AD,N,,^FB696,1,0,L,0^FDMaterialName:_________________^FS^FO62,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD原料规格:'+selected.mopageinfo.原料规格+'^FS^FO62,412^AD,N,,^FB696,1,0,L,0^FDMaterialSpec:_________________^FS^FO62,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装员:'+currentUser.real_name+'('+currentUser.workno+')'+'^FS^FO62,472^AD,N,,^FB696,1,0,L,0^FDPackager:______________________^FS^FO62,502^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD贸易方式:'+selected.mopageinfo.贸易方式+'^FS^FO62,532^AD,N,,^FB696,1,0,L,0^FDModeofTrade:_________________^FS^FO562,112^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD'+(moment().get('month')+1)+'_______月份Month^FS^FO452,142^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD客户订单号:'+selected.mopageinfo.客户单号+'^FS^FO452,172^AD,N,,^FB696,1,0,L,0^FDPartNo.:__________________^FS^FO452,202^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD健大品号:'+selected.成品代号+'^FS^FO452,232^AD,N,,^FB696,1,0,L,0^FDKentaP/N:_________________^FS^FO452,262^AD,N,,^FB696,1,0,L,0^A1N,24,20^FDUL号码:'+selected.mopageinfo.UL号+'^FS^FO452,292^AD,N,,^FB696,1,0,L,0^FDULFileNo.:_______________^FS^FO452,322^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD防火等级:'+selected.mopageinfo.防火等级+'^FS^FO452,352^AD,N,,^FB696,1,0,L,0^FDFlameClass:_______________^FS^FO452,382^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD数量:'+selected.客户代号+'^FS^FO452,412^AD,N,,^FB696,1,0,L,0^FDQuantity:__________________^FS^FO452,442^AD,N,,^FB696,1,0,L,0^A1N,24,20^FD包装日期:'+moment().format('YYYY-MM-DD HH:mm')+'^FS^FO452,472^AD,N,,^FB696,1,0,L,0^FDPackingDate:______________^FS^FO92,612^BCN,60,Y,N,N,A^FD'+outertag+'^FS^FO60,535^AE,N,,^FB730,1,0,L,0^FD_________________________________________________________^FS^FO430,780^AD,N,,^FB696,1,0,L,0^A1N,26,22^FDMADEINCHINA^FS^XZ';
        tableHtml = '<table class="ui celled table"><tbody><tr><th>客户编号:</th><td>'+selected.客户代号+'</td><th>客户订单号:</th><td>'+selected.mopageinfo.客户单号+'</td></tr><tr><th>客户料号:</th><td>'+selected.成品代号+'</td><th>健大品号:</th><td>'+selected.成品代号+'</td></tr><tr><th>原料生产商:</th><td>'+selected.mopageinfo.原料供应商+'</td><th>UL号码:</th><td>'+selected.mopageinfo.UL号+'</td></tr><tr><th>原料品名:</th><td>'+selected.mopageinfo.原料名称+'</td><th>防火等级:</th><td>'+selected.mopageinfo.防火等级+'</td></tr><tr><th>原料规格:</th><td>'+selected.mopageinfo.原料规格+'</td><th>数量:</th><td>'+postobj.数量+'</td></tr><tr><th>包装员:</th><td>'+currentUser.real_name+'('+currentUser.workno+')'+'</td><th>包装日期:</th><td>'+moment().format('YYYY-MM-DDHH:mm:ss')+'</td></tr><tr><th>贸易方式:</th><td>'+selected.mopageinfo.贸易方式+'</td><th>包装标签号:</th><td>'+outertag+'</td></tr></tbody></table>';
    }    

    //显示预览信息        
    $('#bigtagpreview').append(tableHtml);
    console.log('cpj',cpj);
    postobj.提交时间 = moment().format('YYYY-MM-DD HH:mm:ss');
    postobj.user = window.currentUser;
    postobj.MO = selected.MO; 
    postobj.被包装标签 = global_tagArray;
    postobj.成品标签代码 = cpj.printerCommands;
    postobj.成品标签 = outertag;
    postobj.level = level;      
    //return;
    if(type == 'preview') {
        canPrint = true;
    }else {        
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
            lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };    
        console.log('post2',post)           
        socket.emit('collecteddata', post);
    }                                                                    
}

function _print() {console.log('postobj2',postobj)  
    
}

function RePrint() {
    console.log(cpj)
    if(cpj.printerCommands!='') {
        cpj.sendToClient();
    }
}

