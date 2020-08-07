//220084
var global_tagArray = [];

var maxWS = 0;
//$("title").html("后工序包装");
function RenderForm(id) {
    $.get('https://static.kenta.cn/app3/wp-json/form/v2/item/'+id,function(response){
        global_json = response;
        var html = response.formhtml.slice(0,-6)+'<div classname="field"><p>'+response.other+'</p></div><div class="fluid ui submit button" onclick="FormSubmit()">提交</div><div class="ui error message"></div></div>';
        //console.log(html);       
        $('#formtitle').html(response.title);
        $('#formdescription').html(response.description);
        $('#display').html(html);
        $('.ui.dropdown').dropdown();
        $('.ui.form.first').form({            
            fields:global_json.fields
        });   
        
        $('input[name="最小包装标签_input"]').keydown(function (e) {
            if (e.keyCode == 13) {  
                var allFields = $('.ui.form.first').form('get values');                
                var inputvalue = $('input[name="最小包装标签_input"]').val();  console.log(11,allFields.最小包装标签);  
                if(allFields.最小包装标签.indexOf(inputvalue)>-1) {
                    alert('此标签已存在');                
                }else {                                        
                    var tmp = allFields.最小包装标签==""?[]:allFields.最小包装标签.split(',');
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
                    $('.menu.最小包装标签').append(op);
                    $('#最小包装标签').dropdown({values:currentvalue});                                         
                }      
                $('input[name="最小包装标签_input"]').val('');
                $('input[name="最小包装标签_input"]').focus()              
            }
        });                                                          
    },'json');
} 

function FormSubmit() {
    var allrequired = $('.ui.form.first').form('is valid'); 
    console.log('1层表单',allrequired)
    if(allrequired==false) {                  
      return false;
    }  
    $('#myloader').addClass('ui active inverted dimmer');
   
    setTimeout(function(){
      var $form = $('.ui.form.first'),
      allFields = $form.form('get values'),postobj = {};      
      global_tagArray = allFields.最小包装标签.split(',');  
      console.log(222,allFields,global_tagArray);                  
      postobj.提交时间 = moment().format('YYYY-MM-DD HH:mm:ss');
      postobj.user = window.currentUser;   
      postobj.最小包装标签 = global_tagArray;
      postobj.成品标签 = allFields.成品标签;
      postobj.数量 = allFields.数量;
      
      if($('.file_input')[0]!=undefined) {  
        var file = $('.file_input')[0].files[0];                         
        var message = {
        "method": "POSTwithDATA",
        "actionURL": "https://www.kenta.cn/app3/wp-json/wp/v2/media",
        "headerAttach": "\"Content-Disposition\": \"attachment;filename=\\\""+file.name+"\\\"\"",
        "action": "attachmentsend",
        "data":{
            "file":file
        },
        "submitJSON" : {
            "processData": false,
            "postAttachment": file
        }
        };
        OAuthSubmit(message);  
        allFields.file = global_fileurl;
      }
      
      var postjson = {
        "title": global_json.title,
        "description": global_json.description,
        "type": "collecteddata",
        "formtag": global_json.formtag,
        "templateid":global_json.id,
        "username": "jiaming.liu",
        "collectedData":postobj,
        "relation":global_json.relation?global_json.relation:{},
        "myid":'未分配'
      };  
      console.log('postjson',postjson);       
      //return false;
      $.ajax({
        url:'https://www.kenta.cn/app3/wp-json/form/v2/create',
        dataType : 'json',
        type     : 'post',
        data	 : postjson,
        success	 : function(result) {
          $('input[name="最小包装标签_input"]').val('');
          $('input[name="成品标签"]').val('');
          $('#最小包装标签').dropdown({values:[]});
          $('input[name="最小包装标签_input"]').focus();  

          $('#myloader').removeClass('active');
            alert('提交成功！');  
          $.get("https://www.kenta.cn:8891/type=callfunction?funcname=callHGXList",function(response){
            
          },'json');                         
        },
        error	: function(xhr, errorType, error) {
          $('#myloader').removeClass('active');
          return false;
        }
    });
      
    },1000);        
}

