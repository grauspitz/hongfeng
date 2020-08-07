// var {  HashRouter, Router, Route, Link, Redirect, browserHistory } = ReactRouterDOM;
var {  HashRouter,Route, Link, Redirect, browserHistory } = ReactRouterDOM;
/** 取得手機UUID */
var mobileUUID = "Non Mobile Device";
//moment.js中文
moment.locale('zh-cn');

/** 全局常量 */
var KentaConstants = {
	API_URL_PREFIX: 'https://www.kenta.cn/app3/',
	RELATIVE_PATH: '/',
	VERSION: '3.5.037',
	CUID: window.clientId,
	MOBILECUID: mobileUUID
};


/** 全局变量 */
var gonggaoglobal = '';
window.globalDB    = localforage.createInstance({name: "kenta_db"});
window.permissionObj = {
	桌子制程匹配: "none",
	桌子员工匹配: "none",
	MO管理界面: "none",
	重工桌设置: "none",
	手工包装: "none",
	小标签状态查询: "block",
	领料界面: "none",
	上机报工界面: "none",
	跳工序界面: "none",
	 包装界面: "none",
	 QC界面: "none",
	 推送通知: "none",
	  }

window.currentUser = {
	user_name    : "",
	password     : "",
	real_name    : "客人",
	role_name    : "客人",
	access_token : "",
	department	 : "",
	author	     : "",
	login		 : false
};
window.myversion = 'web版';
var globalid = '';
var global_json = {};
window.deskToGX = {};
window.listdetail = [];
window.后工序总MO列表 = {};
window.桌子状态 = {};
window.fortest = false;
window.printStatus = 'offline';
window.globalData = {
	menu_page:{
		'5d280d3771e7a243849213ae':'special.js',
		'5d25a4ba0e6cc83fa41c9519':'MaterialScreen.js',
		'5d270ceebaf2732984fb8549':'newbzscript.js',
		'5d27f9d171e7a243849213a9':'qcscript.js',
		'5d284ffdbe727d23b4ec6666':'skipstep.js',
		'5d27178478a9d03e1c5a8af1':'reworkSetting.js',
		'5d28254871e7a243849213b0':'TableScreen.js',
		'5d3184f5e55fa25dac5760b9':'moManage.js',
		'5d2547d24b98b53198177e8d':'manualWithIP.js',
		'5d281b9471e7a243849213af':'TablePunch.js'	
	}
}

//连接数据库的ws
var socket = io.connect('https://www.kenta.cn:8892');
socket.on('connect',function(){
	$('body').toast({message: '8892已连接 !'});
});
socket.on('disconnect',function(){	
	$('body').toast({class: 'warning',showIcon: true,message: '8892已断开 !'});
});
var socket_8911 = io.connect('https://www.kenta.cn:8911');
socket_8911.on('connect',function(){
	$('.ui.top.right.toast-container').html('')
	$('body').toast({message: '8911已连接 !'});
});
socket_8911.on('disconnect',function(){
	$('.ui.top.right.toast-container').html('')
	$('body').toast({class: 'warning',showIcon: true,displayTime:0,message: '8911已断开 !'});
});
socket_8911.emit('storeClientInfo', ['后工序总MO列表','桌子状态']);
socket_8911.on('getnewjson',function(msg){
	后工序总MO列表 = msg.后工序总MO列表;
	桌子状态 = msg.桌子状态;	
});
//JSPM连接打印机
JSPM.JSPrintManager.auto_reconnect = true;;

JSPM.JSPrintManager.start(true,'128.0.3.39',22443);
JSPM.JSPrintManager.WS.onOpen = function() {
	console.log('connect')
	$('body').toast({message: '打印机已连接 !'});
	printStatus = 'online';
};

JSPM.JSPrintManager.WS.onStatusChanged = function() {console.log('臣妾连不上啊')};

JSPM.JSPrintManager.WS.onClose = function() {
	if(printStatus!='offline') {
		$('body').toast({message: '打印机已断开 !'});
		printStatus = 'offline';
	}	
};

globalDB.getItem('currentUser').then(function(value){
	if(value!=null) {
		currentUser = value;
	}
}).catch(function(err) {
		// This code runs if there were any errors
		console.log(err);
});

/**
 * +-----------------------------------------------------------
 * | 外部内容
 * +-----------------------------------------------------------
 */
var OAuthParameters = {
		oauth_consumer_key : '5kSCAmSPhvrh',
		oauth_token : 'sZCEkwazUQ5DU8NjQvXj81dW',
		oauth_signature_method : 'HMAC-SHA1',
		oauth_version : '1.0',
		consumerSecret : 'JAF7LatRXaMnOLVqYFMlLd0uQ1maT4HgP2l3VaymLTLinTfM',
		tokenSecret : 'Dk6ads9PIYNhqIvE9Jir2Q3TjGQcOnW4WzUHqiwKkOXYGR8e'
	};

function reloadData(tablename,dataList) {
	var currentPage = tablename.page();
	tablename.clear();
	tablename.rows.add(dataList);
	tablename.page(currentPage).draw(false);
}

function showformtemplate(id) {  			
	RenderForm(id);
}

function filterFormdata(data,filterkey) {    
	var result = _.chain(data).map(function(n){
		n.collectedData.createTime = n.createTime;
		return n.collectedData
	}).sortBy(function (n) {
		return n.createTime;
	}).value();        
	if(filterkey) {    
		var tmp = _.chain(result).groupBy(function(n){      
		return n[filterkey]
		}).value();
		result = [];
		_.forEach(tmp,function(n){
		result.push(_.maxBy(n,'createTime'))
		});
	}        
	return result;
}

/**
 * +-----------------------------------------------------------
 * | Hub Component（程序入口）
 * +-----------------------------------------------------------
 */

//数据处理元件
class initializeElement extends React.Component{	
	componentDidMount() {    
		globalDB.getItem('currentUser').then(function(value){
			if(value!=null) {
				currentUser = value;
			}
		}).catch(function(err) {
				// This code runs if there were any errors
				console.log(err);
		});
  }


	render(){
		return (
			<div name="i am init div">
				<Redirect to='/landing'/>
			</div>
			)
	}
}

// 页面
class LandingPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {topage:'',initCompleted:false};
	}
	componentDidMount() {
		var _this = this;
		setTimeout(function(){
            if(currentUser.login == false) {
                _this.setState({topage:'/login',initCompleted:true});
            }else {                				
				var stararr = [];
				$.get("https://www.kenta.cn:8892/type=getcollecteddata?id=5d3130a212244b7aa402cd68", function(result){
					_.map(result,function(x){
							stararr.push(x.collectedData)
					})
					//console.log("权限数据3",stararr)			
					console.log("当前用户",currentUser)
					console.log("权限数据1",stararr)
					_.map(stararr,function(n){						
						n.权限 =false
						var tmp_workno = n.Workno.split('——')[0];
						if(currentUser.workno==tmp_workno){
							n.权限 =true
						}

						if(n.userde==""||n.userde=="——请选择部门——"||n.userde==null){
								if(n.userpo==currentUser.role_name){
									n.权限 =true
								}
						}
						if(n.userde==currentUser.department){
								if(n.userpo==""||n.userpo=="——请选择职位——"||n.userpo==null){
									n.权限 =true
								}
						}
					})					
				
					_.map(stararr,function(y){
						// var b = y.userpage.slice(7,y.userpage.length)
						if(y.userpage) {
							if(y.权限==true){
								var b = y.userpage.split("——")[1]
								permissionObj[b]="block"
							}
						}				
					})
					console.log("permissionObj",permissionObj)
					$('body').toast({message: '用户权限已下载 !'});
				},'json').fail(function () {
					$('body').toast({message: '用户权限下载失败,联系管理员 !'});
				});				
				_this.setState({topage:'/project',initCompleted:true});
            }
        },2000);
		$('.ui.image.centered').transition({animation: 'fade in', duration   : '1s'});
	}
	render() {
		var _this = this;
		if(this.state.initCompleted == false){
			return (
				<div id="Index" className="ui one column centered  padded grid">
					<div className="middle aligned row">
					<div className="column">
					    <img className="ui image centered" src="images/logo_FIX2.png" width="250" />
					</div>
					</div>
					<div className="middle aligned row">
					<div className="column">
					    <div className="ui active centered inline indeterminate text inverted loader">初始化中...</div>
					</div>
					</div>
					<div className="bottom aligned row">
					<div className="column">
					    <h6 className="ui center aligned header inverted"> 2019 KENTA Electronic Mfg.Co.,Ltd V-<span className="version_yj">{myversion}</span></h6>
					  </div>
					</div>
				</div>
			)
		} else {
			return (
				<Redirect to={this.state.topage}/>
				)
		}
	}
}
class Login extends React.Component{	
	constructor(props) {
		super(props);
		this.state = {
			loginSuccess:false,
			initCompleted:false
		};
	}
	componentDidMount() {
		var _this = this;
		$('.ui.form.indexLogin').form({
	    fields: {
			username : 'empty',
  			password : 'empty'
	    },
	    onSuccess: function(event, fields) {
				var specialurl = 'https://www.kenta.cn/app3/wp-admin/admin-ajax.php?action=login&username='+fields.username+'&password='+fields.password;
				$.get(specialurl,function(logindata){console.log(121,logindata)
					if(logindata == 'FALSE') {
						$('.ui.basic.modal.indexLogin').modal('show');
						$('#loginloading').removeClass();
					}else {

						if(logindata.status == 'error') {
							$('.ui.basic.modal.indexLogin').modal('show');
							$('#loginloading').removeClass();
							return false;
						}
						
						var jsondetail = logindata.userDetail;
						var jsonmeta = logindata.userMeta.hr_info;
						// if(contactDB == null) {
						// 	contactDB = localforage.createInstance({name: "contact_"+ jsondetail.data.user_login +"_db"});
						// }

						var department = jsonmeta==undefined?'无工号人员':(jsonmeta.branna==undefined||jsonmeta.branna==''?'未分配职位人员':jsonmeta.branna);
						var role_name = jsonmeta==undefined?'人事系统未同步':(jsonmeta.jobna==undefined||jsonmeta.jobna==''?'未分配职位':jsonmeta.jobna);
						var groupno = jsonmeta==undefined?'人事系统未同步':jsonmeta.groupno;
						var workno = jsonmeta==undefined?'工号异常':jsonmeta.workno;
						if(role_name == '人事系统未同步'){
							role_name = '未分配职位';
						}
						//人事系统未同步统一记录为未分配职位 方便评分时用到的职位
						currentUser = {
							user_name   	 : jsondetail.data.user_login,
							password    	 : jsondetail.data.user_pass,
							real_name   	 : logindata.userMeta.real_name,
							author			 : jsondetail.ID,
							workno				:	workno,
							role_name   	 : role_name,
							department		 : department,
							group				 : groupno,
							login			 : true
						};
						console.log('currentUser',currentUser);

						/*jpush注册*/
						console.log("jpush_init:");
						var userNameAlias = { sequence: 1, alias: currentUser.user_name.replace(/\./, '_') }; // 用下划线替换 . ，当在PHP发送时也做相应的处理
						var userTagsArray = { sequence: 1, tags: [currentUser.department,currentUser.role_name]};
						if(window.plugins && window.plugins.jPushPlugin) {
						  window.plugins.jPushPlugin.setAlias(userNameAlias,
						  (result) => {
							var sequence = result.sequence
							var alias = result.alias
							console.log('result:');
							console.log(result);
						  }, 
						  (error) => {
							var sequence = error.sequence
							var errorCode = error.code
							console.log('error:');
							console.log(error);
						  });
						  window.plugins.jPushPlugin.setTags(userTagsArray,
						  (result) => {
							var sequence = result.sequence
							var alias = result.tags
							console.log('result:');
							console.log(result);
						  }, 
						  (error) => {
							var sequence = error.sequence
							var errorCode = error.code
							console.log('error:');
							console.log(error);
						  });
						  //window.plugins.jPushPlugin.setTagsWithAlias(userTagsArray, userNameAlias, function(e){alert('setTags' + JSON.stringify(e));});
						  // console.log('setTags / Alias success, userTagsArray : ' + userTagsArray + ', userNameAlias : ' + userNameAlias);
						}else{
						  console.log('setTags / Alias fail, userTagsArray : ' + userTagsArray + ', userNameAlias : ' + userNameAlias);
						};
						/*jpush注册*/
						globalDB.setItem("currentUser", currentUser).then(function() {
							$.get('https://www.kenta.cn/app3/wp-admin/admin-ajax.php?action=logout',function(logoutdata){
								_this.setState({initCompleted:true});
								$('#loginloading').removeClass();								
							},'json');
						});
					}
				},'json');
				return false;
			}
		});
		$('.ui.image.centered').transition({animation: 'fade in', duration   : '1s'});				
	}
	componentWillUnmount() {//销毁
		
	}

	_onClick() {
		$('#loginloading').addClass('ui active inverted dimmer');
	}

	render () {
		var _this = this;
		if(this.state.initCompleted == false) {
			return (
				<div style={{'height':'100%','width':'100%','position':'fixed','background': 'url("images/loginbg.png") no-repeat center center'}}>
					<div className="ui one column centered padded grid equal height" style={{'height':'100%','width':'100%'}} >
					<div className="middle aligned row">
					<div className="column">
					    <img className="ui image centered medium " src="images/logo.png"/>
					</div>
					</div>
					<div className="bottom aligned row">
					<div className="column">

					</div>
					</div>
					<div className="bottom aligned row">
					<div className="column">
						<form className="ui form container indexLogin" style={{'border': '5px solid rgba(109, 114, 117, 0.41)'}}>
						  <div className="ui fluid field icon input login" style={{'margin': '0px'}}>
						    <input type="text" name="username" placeholder="请输入用户名或工号" ref="user_name" style={{'height':'40px', 'borderRadius':'0px'}}/>
							<i className="user outline icon"></i>
						  </div>
						  <div className="ui fluid field icon input" style={{'margin': '0px'}}>
						    <input type="password" name="password" placeholder="请输入密码" ref="password" style={{'height':'40px', 'borderRadius':'0px'}}/>
							<i className="lock icon"></i>
						  </div>
						  <div className="ui negative fluid primary submit button" style={{'borderRadius':'0px'}} onClick={this._onClick}>登录</div>

						</form>

						<h6 className="ui center aligned header inverted"> 2019 KENTA Electronic Mfg.Co.,Ltd V-<span className="version_yj">{myversion}</span></h6>
					</div>
					</div>
					</div>

					<div className="ui basic modal indexLogin">
					  <div className="ui icon header">
					    <i className="archive icon"></i>
					    账号或密码错误
					  </div>
					  <div className="content">

					  </div>
					  <div className="actions">
					    <div className="ui red basic cancel inverted button">
					      返回
					    </div>
					  </div>
					</div>
					<div id="loginloading">
						<div className="ui text loader">请稍候...</div>
					</div>
				</div>
				)
		}else {
			return (
				<Redirect to='/landing'/>
				)
		}
	}
};

class Dashboard extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			initCompleted:false,
			topage:'',
			data:[]
		};
		this.Dashboard = this.Dashboard.bind(this);
	}
	componentWillMount() {
		window.scrollTo(0,0)
	}
	componentDidMount() {
		var _this = this;
		$('.MainMenu').removeClass('active');
		$('#MainMunu_Dashboard').addClass('active');
		$('.ui.sticky.mainHeader').sticky({});	
		$.get('https://www.kenta.cn/app3/wp-json/wp/v2/posts?categories=2',function(n){
		gonggaoglobal = n;
			_this.setState({data:n});
		},'json')
	}
	componentDidUpdate(){
     
		$('.ui.sticky.mainHeader').sticky({context: '#kenta-app'});
	}
	componentWillUnmount() {//销毁
	
	}
	Dashboard(data){
		console.log(77,data)
		gonggaoglobal = data;
		this.setState({initCompleted:true,topage:'GoDashboard'});
	}	
	// clickarticle(){
	// 	$.get('https://www.kenta.cn/app3/wp-json/wp/v2/posts?categories=2',function(n){
	// 		_.map(n,function(t){
	// 			$('.item').append(t.content.rendered)
	// 		})
	// 	},'json')

	// }

	render () {console.log(55,this.state.initCompleted)
		var _this = this;
		var html = [];
		html = this.state.data.map(function(n){
			
			return (
				<div className="ui link card" style={{'border':'0px','padding-top':'0px','word-break':'break-all','width':'100%'}} onClick={_this.Dashboard.bind(this,n)}>									
					<div className="content ui segments" style={{'margin':'0'}}>
						
						<a className="ui" ></a><font style={{"vertical-align": "inherit"}}>{n.title.rendered}</font>
						
						<div className="meta" >
							<div style={{'text-align':'left','padding-top':'10px'}}>发布人：覃介亿 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{moment(n.date).format('YYYY-MM-DD')}</div>
						</div>
					</div>										
				</div>
			)
		})	
		if(this.state.initCompleted == false) {
			return (
				<div>
					<div className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px'}}>
					<div className="ui container">
						<div className="ui small header centered inverted">关注(页面维护中)</div>
					</div>
					</div>
					{/*Search*/}
					<div className="ui container">
							<div className="ui search fluid fordash">
							<div className="ui icon input fluid">
								<input className="prompt" type="text" placeholder="输入项目关键字或项目id查询..."/>
								<i className="search icon"></i>
							</div>
							<div className="results"></div>
						</div>
					</div>
					{/*Banner Section*/}
					<div className="ui basic segment container" style={{'margin':'0'}}>
						<img className="ui fluid image" src="images/banner_dashboard.png" />
						<div className="ui bottom attached tab active"  data-tab="dashs">
							<div className="ui bottom attached vertical pushable">
								<div className="pusher" style={{'padding': '2em 0.5em 10em'}}>
									<div className="ui two stackable cards">
										{html}
										
									</div>
								</div>
							</div>
						</div>

					</div>
					
					</div>
				)
			}else {
				return (
					<Redirect to='/GoDashboard'/>
					)
			}
	}
};
class GoDashboard extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			initCompleted:true,
			topage:'',
		};
		this._onBack = this._onBack.bind(this);
	// this.GoDashboard = this.GoDashboard.bind(this);

	}

	_onBack() {		
		$("script[src='script/"+globalData.menu_page[globalid]+"']").remove();
		this.setState({initCompleted:false,topage:'GoDashboard'});
	}

	GoDashboard(){
		this.setState({initCompleted:true,topage:'Dashboard'});
	}	
	componentWillMount() {

	}
	componentDidMount() {
		var _this = this;
		console.log(66,gonggaoglobal)
		$('.gonggao').append(gonggaoglobal.content.rendered)
		document.getElementsByTagName('body')[0].style.height = "600px"
		console.log("outDiv高度",$('.gonggao').width());


		$('.ui.sticky').sticky({context: '.gonggao'});
	}
	componentDidUpdate(){
     
	}
	componentWillUnmount() {//销毁
	
	}

	render () {
		// var gonggaoglobal2 = gonggaoglobal.title.rendered = undefined?'无':gonggaoglobal.title.rendered
		if(this.state.initCompleted == true) {
		return (
				
			<div >
			 	<div id="toptest" className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px','padding': '1em 0 1.1em 0'}}>
						<div className="ui container grid">
						<div className="one wide column" style={{'padding-left':'0px'}}>
							<a href="javascript:void(0);" onClick={this._onBack}><i className="chevron left icon inverted"></i></a>
						</div>
						<div className="fourteen wide column">
							<div className="ui small header centered inverted">{gonggaoglobal.title.rendered}</div>
						</div>
					</div>
				</div>
			 		<div className="ui basic segment container" style={{'margin':'0'}}>
			 			<div className="ui segment">
			 				<div className="gonggao"></div>
						</div>
				</div>
			 	</div>
			)
		}else{
			return (
				<Redirect to='/Dashboard'/>
				)
		}
	}
};
class Project extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {
		window.scrollTo(0,0)
	}
	componentDidMount() {
		var _this = this;
		$('.MainMenu').removeClass('active');
		$('#MainMunu_Project').addClass('active');

		$('.ui.sticky.mainHeader').sticky({
		    context: '#kenta-app'
		  });

		$('.menu .item').tab({
			onLoad: function(){
				$('.ui.sticky.mainHeader').sticky({
				    context: '#kenta-app'
				  });
				}

			});		
	}
	componentDidUpdate(){
		$('.ui.sticky.mainHeader').sticky({
		    context: '#kenta-app'
		  });
	}
	componentWillUnmount() {//销毁
		
	}

	render(){
		var _this = this;
	
		return (
			<div>
				{/*header Segment*/}
				<div className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px','padding': '1em 0 0.1em 0'}}>
					<div className="ui container">
						<div className="ui small header centered inverted">项目(页面维护)</div>
						<div className="ui top attached tabular inverted secondary pointing menu fluid four item">
							<a className="item active" data-tab="allProject">所有项目</a>
							<a className="item" data-tab="pm">我是PM</a>
							<a className="item" data-tab="organizer">我是发起人</a>
							<a className="item" data-tab="mgntGroup">日常管理</a>
						</div>
					</div>
				</div>
				<div className="ui container">
					<div className="ui search fluid forproject">
						<div className="ui icon input fluid">
							<input className="prompt" type="text" placeholder="输入项目关键字或项目id查询..."/>
							<i className="search icon"></i>
						</div>
						<div className="results"></div>
					</div>
					<div className="ui bottom attached tab active" data-tab="allProject">
						<div className="ui bottom attached vertical pushable">
							<div className="pusher" style={{'padding': '2em 0.5em 10em'}}>
								<div className="ui two stackable cards">
									{}
								</div>
							</div>
						</div>
					</div>
					<div className="ui bottom attached tab" data-tab="pm">
						{/*Card Segment*/}
						<div className="ui bottom attached vertical pushable">
							<div className="pusher" style={{'padding': '2em 0.5em 10em'}}>
								<div className="ui two stackable cards">
									{}
								</div>
							</div>
						</div>
					</div>
					<div className="ui bottom attached tab"  data-tab="organizer">
						<div className="ui bottom attached vertical pushable">
							<div className="pusher" style={{'padding': '2em 0.5em 10em'}}>
								<div className="ui two stackable cards">
									{}
								</div>
							</div>
						</div>
					</div>
					<div className="ui bottom attached tab" data-tab="mgntGroup">
						<div className="ui bottom attached vertical pushable">
							<div className="pusher" style={{'padding': '2em 0.5em 10em'}}>
								<div className="ui two stackable cards">
									{}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
};
class Profile extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			KPIScoreHtml:[],
			ManageScoreHtml:[],
			AdditionalScoreHtml:[],
			kpiscore:0,
			managescore:0,
			additionalscore:0,
			monthData:'',
			KPINoData:false,
			PKPINoData:false,
			initComplete:false,
			logout:false
		};
		this.Logout = this.Logout.bind(this);
	}	
	componentWillMount() {
		window.scrollTo(0,0)
		this.setState({KPIList:globalData.KPI,AdditionalScore:globalData.AdditionalScore,initComplete:true});
	}
	componentDidMount() {
		var _this = this;
		$('.MainMenu').removeClass('active');
		$('#MainMenu_Profile').addClass('active');	
		$('.ui.sticky').sticky({context: '#examplepull'});

	}

	Logout() {
		var _this = this;
		var lastuser = currentUser.user_name;
		currentUser = {};
		currentUser.user_name = lastuser;
		currentUser.login = false;
		globalDB.setItem("currentUser", currentUser).then(function() {
			
			_this.setState({
				monthData:'',
				logout : true,
			});
		}).catch(function(err) {
			console.log(err);
		});
	}

	render () {	
		var Headset = 'https://www.kenta.cn/app3/data/avatar/'	;
		var headsrc = 'https://www.kenta.cn/app3/data/avatar/'+currentUser.user_name+'.jpg';
		if(headsrc == '' || headsrc == undefined){
			headsrc = 'https://www.kenta.cn/app3/data/avatar/nopic.jpg';
		}
		console.log("headsrc",Headset)

		if(this.state.logout == false) {
			return (
				<div id="examplepull">
					{/*header Segment*/}
					<div className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px'}}>
						<div className="ui container">
							<div className="ui small header centered inverted">个人中心(版本—v<span className="version_yj">{myversion}</span>)</div>
						</div>
					</div>
					<div className="">
						<div className="">
							<div style={{'background': 'url("images/profile_bg.png") no-repeat center top','background-size':'cover'}}>
								<div className="ui basic segment" style={{'background': 'linear-gradient(to bottom, rgba(124,124,124,0) 0%,rgba(124,124,124,0.03) 4%,rgba(0,0,0,0.43) 66%,rgba(0,0,0,0.65) 99%)'}}>
									<div>
										<div style={{'width':'100%'}}>
											<div id="radiusdiv">
												<img className="ui small centered circular image" src={headsrc} />
											</div>
											<h2 className="ui centered header inverted">
												<div className="content">
													{currentUser.real_name}
													<div className="sub header">{currentUser.role_name} | {currentUser.workno}</div>
												</div>
											</h2>
										</div>
										{/* <select className="ui dropdown profileYear">
											<option value="15">2015 年</option>
											<option value="16">2016 年</option>
											<option value="17">2017 年</option>
											<option value="18">2018 年</option>
											<option value="19" selected='true'>2019 年</option>
											<option value="20">2020 年</option>
											<option value="21">2021 年</option>
										</select>
										<select className="ui dropdown profileMonth">
										</select> */}
									</div>
									<div className="ui hidden divider"></div>
								</div>
							</div>
							{/*Card Segment*/}
							<div className="ui bottom attached vertical pushable">
								<div className="ui pusher column stackable grid container" style={{'padding': '1em 0em 10em'}}>
									<div className="sixteen wide column">
										<button className="ui red fluid button" onClick={this.Logout}><i className="arrow right icon"></i>退出登陆</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				)
		}else {
			return (
				<Redirect to='/login'/>
				)
		}
	}
};
class More extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			topage:'',
			logout : false,
			initCompleted:false			
		};
		this.tagSearch = this.tagSearch.bind(this);
	}	
	componentDidMount() {
		$('.MainMenu').removeClass('active');
		$('#MainMunu_More').addClass('active');

		$('.ui.sticky.mainHeader').sticky({
		    context: '#kenta-app'
		  });		
    }
    
    tagSearch() {
		this.setState({initCompleted:true,topage:'tagsearchscreen'});        
    }

	Logout() {
		console.log('logoutClicked');
		var _this = this;
		var lastuser = currentUser.user_name;
		currentUser = {};
		currentUser.user_name = lastuser;
		currentUser.login = false;
		globalDB.setItem("currentUser", currentUser).then(function() {
			clearInterval(projectInit);
			window.projectsDB.clear();
			window.messagesDB.clear();
			window.contactDB.clear();
			window.affichesDB.clear();
			_this.setState({
				logout : true,
			});
		}).catch(function(err) {
			console.log(err);
		});
	}	
	
	YjPage(){
		this.setState({initCompleted:true,topage:'yjpage'});
	}	

	goHGXSystem() {		
		this.setState({initCompleted:true,topage:'hgxsystem'});
	}

	goSecondPage() {		
		this.setState({initCompleted:true,topage:'secondpage'});
	}	

	cerDownload() {
		// var source_url='https://www.kenta.cn/public/printerca/production.cer';
		// let uri=encodeURI(source_url);
		// let fileURL = cordova.file.cacheDirectory + 'production.cer';
		// window.fileTransfer_yj.download(uri,fileURL,function(entry) {
		// 	console.log(entry)
		// },function(error) {
		// 	console.log(error)
		// });
		var ref = cordova.InAppBrowser.open('https://www.kenta.cn/public/printerca/production.cer', '_blank', 'location=no');
	}

	render () {		
		if(this.state.logout == false) {
			if(this.state.initCompleted == false) {
				return (
					<div>
						<div className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px'}}>
							<div className="ui container">
								<div className="ui small header centered inverted">更多</div>
							</div>
						</div>
						{/*Search*/}
						<div className="ui container">
							  <div className="ui search fluid">
							  <div className="ui icon input fluid">
							    <input className="prompt" type="text" placeholder=""/>
							    <i className="search icon"></i>
							  </div>
							  <div className="results"></div>
							</div>
						</div>
						{/*Card Segment*/}
						<div className="ui bottom attached vertical pushable">
							<div className="ui pusher column stackable grid container" style={{'padding': '1em 0em 10em'}}>
								{/*公司资讯*/}
								<div className="eight wide column">
									<div className="sub header">公司资讯</div>
									<div className="ui red raised segments">
										<a href='javascript:void(0);'>
											<div className="ui segment">
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="announcement icon"></i>
															<div className="content">
																公告
															</div>
														</div>
													</div>
													<div className="three wide column right aligned">
													<i className="chevron right icon grey"></i>
													</div>
												</div>
											</div>
										</a>
										<a href='javascript:void(0);'>
											<div className="ui segment">
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="grid layout icon"></i>
															<div className="content">
																MES 机台实时数据
															</div>
														</div>
													</div>
													<div className="three wide column">
													</div>
												</div>
											</div>
										</a>										
									</div>
								</div>
								{/*设定*/}
								<div className="eight wide column">
									<div className="sub header">设定</div>
									<div className="ui red raised loading segments">
										{/* <a href='javascript:void(0);'>										
											<div className="ui segment" onClick={this.cerDownload}>
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="cloud download icon"></i>
															<div className="content">
																下载打印机证书
															</div>
														</div>
													</div>
													<div className="three wide column right aligned">
													<i className="chevron right icon grey"></i>
													</div>
												</div>
											</div>
										</a> */}
										<a href='javascript:void(0);'>										
											<div className="ui segment" onClick={this.goSecondPage.bind(this)}>
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="cloud download icon"></i>
															<div className="content">
																打印机状态
															</div>
														</div>
													</div>
													<div className="three wide column right aligned">
													<i className="chevron right icon grey"></i>
													</div>
												</div>
											</div>
										</a>
									</div>
								</div>
								
								<div className="eight wide column">
									<div className="sub header">系统</div>
									<div className="ui red raised loading segments">
										<a href='javascript:void(0);'>
											<div className="ui segment" onClick={(e) => this.goHGXSystem(e)}>
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="star icon"></i>
															<div className="content">
																后工序系统
															</div>
														</div>
													</div>
													<div className="three wide column">
													</div>
												</div>
											</div>
										</a>
									</div>
								</div>
								{/*个人*/}
								<div className="eight wide column">
									<div className="sub header">个人</div>
									<div className="ui red raised loading segments">																			
										<a href='javascript:void(0);'>
											<div className="ui segment" onClick={this.YjPage.bind(this)}>
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="align justify icon"></i>
															<div className="content">
																推送通知
															</div>
														</div>
													</div>
													<div className="three wide column">
													</div>
												</div>
											</div>
										</a>						
										<a href='javascript:void(0);'>
											<div className="ui segment">
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey" onClick={this.Logout}>
															<i className="sign-in alternate icon"></i>
															<div className="content">
																退出登陆
															</div>
														</div>
													</div>
													<div className="three wide column right aligned">
													</div>
												</div>
											</div>
										</a>                                     
									</div>									
								</div>

							</div>
						</div>
					</div>
					)
			}else {
				return (
					<Redirect to={'/'+this.state.topage} />
					)
			}
		}else {
			console.log(321,this.state.topage)
			return (
				<Redirect to='/login'/>
				)
		}
	}
};

//yj页面
class YjPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			initCompleted:false
		};
		this._onBack = this._onBack.bind(this);
	}
	componentWillMount() {
		window.scrollTo(0,0)
	}
	componentDidMount() {
		if(window.currentUser.workno!=180955){
			this.submit();
		}
		$('.ui.sticky').sticky({context: '#examplepull'});

	}
	componentWillUnmount() {

	}
	
	componentDidUpdate() {
		
	}

	_onBack() {
		this.setState({initCompleted:true});
	}

	submit(){
		if(window.currentUser.workno==180955){
			var start_time=moment($('.开始时间_input').val()).format('YYYY-MM-DD hh:mm:ss');
			var end_time=moment($('.结束时间_input').val()).format('YYYY-MM-DD hh:mm:ss');
		}else{
			var end_time=moment().format('YYYY-MM-DD hh:mm:ss');
			var start_time=moment((moment().unix()-604800)*1000).format('YYYY-MM-DD hh:mm:ss');
		}
		var post_data={"start_time":start_time,"end_time":end_time};
		var html='';
		$.post('https://www.kenta.cn/yangjun/jpush_laravel/public/api/Jpush/get_all_jpush',post_data,function(data){
			for(let i in data){
				html+='<div class="item" style="margin:8px auto;border-bottom:1px solid #d4d4d5;"><i class="comment alternate icon" style="width:15%;text-align:center;display:inline-block;"></i><div class="content" style="width: 80%;display: inline-block;"><a class="header" style="font-size:13px;">'+data[i]['title']+'</a><div class="description" style="font-size:8px;">'+data[i]['content']+'<span style="font-size:8px;float:right;color:#f33f3d;">'+data[i]['push_time']+'</span></div></div></div>';
			}
			$('.result').html(html);
		});	
		// fetch('https://www.kenta.cn/yangjun/jpush_laravel/public/api/Jpush/get_all_jpush', {
		// 	method: 'POST',
		// 	mode: 'no-cors',
		// 	headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
		// 	body: JSON.stringify(post_data),
		// }).then(function(response) {
		// 	console.log(response);
		// });
	}

	render() {
		if(!this.state.initCompleted){
			return (
				<div id="examplepull">
					<div id="toptest" className="ui sticky mainHeader inverted red segment"
						style={{'border-radius': '0px', 'padding': '1em 0px 1.1em',}}>
						<div className="ui container grid">
							<div className="one wide column" style={{"padding-left": "0px"}}><a href="javascript:void(0);" onClick={this._onBack}><i
										className="chevron left icon inverted"></i></a></div>
							<div className="fourteen wide column">
								<div className="ui small header centered inverted">后工序界面</div>
							</div>
							<div className="one wide column" style={{"padding-right": "0px"}}></div>
						</div>
					</div>
					<div className="ui container">
						<div className="ui segment" id="formwindow">
							<div id="myloader" className="ui inverted dimmer">
								<div className="ui text loader">Loading</div>
							</div>
							<div className="logo"><a href="https://www.kenta.cn/app3"
									title="https://www.kenta.cn/app3">https://www.kenta.cn/app3</a></div>
							<h3 className="ui dividing header" id="formtitle" style={{'display':'inline-block'}}>推送查询{
								window.currentUser.workno!=180955?(
									<p style={{'color':'#bababc','display':'inline-block','font-size':'14px','font-weight':'normal'}}>(近七天)</p>
								):(
									<p style={{'color':'#bababc','display':'inline-block','font-size':'14px','font-weight':'normal'}}>(时间选择)</p>
								)
							}</h3>
							<div className="contain_yj">
								<div id="display">
									{
										window.currentUser.workno==180955?(
											<div className="ui form first segment">
												<div className="field">
													<label>开始时间*</label>
														<input type="date" className="开始时间_input"/>
													<label>结束时间*</label>
														<input type="date" className="结束时间_input"/>
												</div>
												<div className="fluid ui submit button" onClick={this.submit}>提交</div>
												<div className="result"></div>
											</div>
										):(
											<div className="result">
												<div className="ui segment" style={{'height':'100px'}}>
												  <div className="ui active inverted dimmer">
												    <div className="ui mini text loader">加载中...</div>
												  </div>
												</div>
											</div>
										)
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}else{
			return (
				<Redirect to='/more'/>
				)
		}
			
	}
};

// 次页
class HgxPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			initCompleted:false
		};
		this._onBack = this._onBack.bind(this);
	}
	componentWillMount() {
		window.scrollTo(0,0)
	}
	componentDidMount() {
		var mysrc = window.cordova?window.cordova.file.cacheDirectory:'';console.log(55,window.cordova,mysrc);
		$.getScript(mysrc+"script/"+globalData.menu_page[globalid],function(){   //加载test.js,成功后，并执行回调函数
			console.log("加载js文件",globalid);
			showformtemplate(globalid);                 
		});
		console.log(globalData.menu_pageid);
		$('.ui.sticky').sticky({context: '#examplepull'});
	}
	componentWillUnmount() {//销毁
		console.log('销毁');
	}
	
	componentDidUpdate() {
		
	}

	_onBack() {
		$("script[src='script/"+globalData.menu_page[globalid]+"']").remove();
		this.setState({initCompleted:true});
	}

	getCamera() {
		// window.plugins.GMVBarcodeScanner.scan({}, function(err, result) { 
    
		// 	//Handle Errors
		// 	if(err) return;
			
		// 	//Do something with the data.
		// 	alert(result);
			
		//  });
	}

	render() {
		var _this = this;			
		if(this.state.initCompleted == false) {
			return (
				<div id="examplepull">
					{/*header Segment*/}
					<div id="toptest" className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px','padding': '1em 0 1.1em 0'}}>
						<div className="ui container grid">
							<div className="one wide column" style={{'padding-left':'0px'}}>
								<a href="javascript:void(0);" onClick={this._onBack}><i className="chevron left icon inverted"></i></a>
							</div>
							<div className="fourteen wide column">
								<div className="ui small header centered inverted" dangerouslySetInnerHTML={{__html:'后工序界面'}}></div>
							</div>
							<div className="one wide column" style={{'padding-right':'0px'}} onClick={this.getCamera}>														
							</div>							
						</div>
					</div>
					<div className="ui container">
						<div className="ui segment" id="formwindow">
							<div id="myloader" className="ui inverted dimmer">
								<div className="ui text loader">Loading</div>
							</div>
							<div className="logo"><a href="https://www.kenta.cn/app3" title="https://www.kenta.cn/app3" tabindex="-1">https://www.kenta.cn/app3</a></div>
							<h3 className="ui dividing header" id="formtitle"></h3>
							<h5 className="ui dividing header" id="formdescription"></h5>
							<div id='display'>      
								
							</div>                
						</div>      
					</div> 
				</div>
				)
		}else {
			return (
				<Redirect to='/hgxsystem'/>
				)
		}
	}
};
class TagsearchScreen extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			initCompleted:false,
			zc:[],
			output:'',
			msg:{},			
        	taginfo:''
		};
		this._onBack = this._onBack.bind(this);
		this._search = this._search.bind(this);
		this._onkeydown = this._onkeydown.bind(this);
		this._empty = this._empty.bind(this);
	}
	componentWillMount() {
		window.scrollTo(0,0)
			
	}
	componentDidMount() {
		$('.ui.sticky').sticky({context: '#examplepull'});
		var _this = this;
		var zc = [],displayData = [];
		socket_8911.on('tagsearchReturn',function(tag,selected){
			console.log('selected',selected)
			if(selected==undefined) {        
				alert('标签未在生产!');
			}else {        
				zc = selected.制程;
				displayData = selected.小标签流信息[tag]?selected.小标签流信息[tag]:[];
			}	
			var output = _.orderBy(displayData, ['detailTime'], ['desc']);						
			_this.setState({
				zc:zc,
				output: output,
				taginfo:selected.领料单号.标签状态[tag]
			});
		})				
	}

	componentWillUnmount() {//销毁
		console.log('销毁');		
	}
	
	_search() {							
		socket_8911.emit('tagsearch',$('#tag').val());		
	} 

	findNext(item,arr,zc) {
		var html = '';
		if(item.detailType == '重工报工') {//往前找 第一个非'重工'开头的item作为判断
			var anotherItem = '';
			_.forEach(arr,function(value){
			if(value.detailType.indexOf('重工')==-1) {
				anotherItem = value;
				return false;
			}
			});
			if(anotherItem != '') {
			return findNext(anotherItem,arr,zc);
			}else {
			html = (<p>下一步:工序1——{zc[0].制程代号}——{zc[0].制程名称} 待投料</p>);
			}        
		}else if(['投料','恢复','重工投料','重工恢复'].indexOf(item.detailType)!=-1) {
			var myzc = _.filter(zc,{制程代号:item.工序代号})[0];
			html = (<p>下一步:工序{myzc.工序顺序}——{myzc.制程代号}——{myzc.制程名称} 将在{item.桌号}报工</p>);
		}else if(['暂停','重工暂停'].indexOf(item.detailType)!=-1) {
			var myzc = _.filter(zc,{制程代号:item.工序代号})[0];
			html = (<p>下一步:工序{myzc.工序顺序}——{myzc.制程代号}——{myzc.制程名称} 将在{item.桌号}恢复上机</p>);
		}else if(item.detailType == 'QC') {
			if(item.检测结果 == 'NG') {
			var myzc = _.filter(zc,{制程代号:item.返工工序代号})[0];
			html = (<p>下一步:工序{myzc.工序顺序}——{myzc.制程代号}——{myzc.制程名称} 即将返工</p>);
			}else {
			html = (<p>下一步:待包装</p>);
			}
		}else if(['报工','跳工序'].indexOf(item.detailType)!=-1) {
			//如果报工/跳工序的是最后一道工序 即待QC
			if(item.工序代号 == zc[zc.length-1].制程代号) {
			html = (<p>下一步:待QC</p>);
			}else {//否则 即将下道工序投料
			var nextzc = zc[_.findIndex(zc, ['制程代号', 工序代号])+1];
			html = (<p>下一步:工序{nextzc.工序顺序}——{nextzc.制程代号}——{nextzc.制程名称} 待投料</p>);
			}
		}else if(item.detailType == '包装') {
			//结束
		}
		return html;
	}

	_onkeydown(e) {			
		if (e.keyCode == 13) {
			this._search();
		}
	}

	_empty() {
		$('#tag').val('');
		$('#tag').focus();
		this.setState({output:''})
	}

	_onBack() {		
		$("script[src='script/"+globalData.menu_page[globalid]+"']").remove();
		this.setState({initCompleted:true});
	}

	render() {
		if(this.state.initCompleted == false) {
			var html_process = [],html_taginfo = [],html_zc = [];
			var zc = this.state.zc;    
			var taginfo = this.state.taginfo;  
			var output = this.state.output;   
			if(taginfo!='') {
				html_taginfo.push(
				<div className="ui horizontal segments">
					<div className="ui red segment">
					<p style={{'font-size':'x-large'}}>标签号:{taginfo.物料标签号}</p>
					<p>后工序MO:{taginfo.制令单号}</p >  
					<p>QC NG次數:0</p >  
					</div>
					<div className="ui red right aligned segment">
					<p style={{'font-size':'x-large'}}>实际数量: {taginfo.剩余数量}</p>                  
					<p>包规数: {taginfo.包规数}</p>
					<p>不良品数: {taginfo.不良品数}</p>
					<p>已包装数: {taginfo.被包装数}</p>                             
					</div>                
				</div>
				); 
			}   
			if(output=='') {
				html_taginfo.push(<div className="ui red segment"><p>无该标签基本信息!</p></div>)
				html_process.push(<p>无该标签流信息!</p>)
			}else {				       
				if(output.length==0){
				//html_process.push(<p>下一步:工序1——{zc[0].制程代号}——{zc[0].制程名称} 待投料</p>);
				}else {
				if(taginfo.生产计数[0].总计数 == 0) {
					_.forEach(zc,function(value){
					value.class = 'active step';
					})
				}else if(taginfo.生产计数[0].总计数 == taginfo.生产计数[taginfo.生产计数.length-1].总计数) {
					_.forEach(zc,function(value){
					value.class = 'completed step';
					})
				}else {
					zc[0].class = 'completed step';
					_.forEach(zc,function(value,index){
					if(taginfo.生产计数[index].总计数<taginfo.生产计数[0].总计数) {
						value.class = 'active step';
					}else {
						value.class = 'completed step';
					}            
					})
				}
				html_zc.push(
					<div className="ui segment">
					<p>标准流程:</p >                
					<div className="ui ordered top attached mini steps">
						{_.map(zc,function(value){
						var tempTime = moment.duration(_.round(1 / (value.标准产能 / 11 / 60 / 60 / 1000), 2) * taginfo.剩余数量);
						var needtime = tempTime.hours()+'小时' + tempTime.minutes()+'分钟';
						return (
							<div className={value.class}>
							<div className="content">
								<div className="title">{value.制程名称}({value.制程代号})</div>
								<div className="description">标准产能: {_.round(value.标准产能,2)} | 预计需时: {needtime}</div>
							</div>
							</div>
						)
						})}
					</div>                
					</div> 
				)
				//html_process.push(this.findNext(output[0],output,zc));          
				_.map(output,function(value,index){ 
					var no = output.length - index;
					if(['投料','报工','暂停','恢复','重工投料','重工报工','重工暂停','重工恢复'].indexOf(value.detailType)!=-1) {
					var myzc = _.filter(zc,{制程代号:value.工序代号})[0];  
					var user = value.user?'线长'+value.user.real_name+'('+value.user.workno+')':'';
					html_process.push(
						<span>
						<h6 className="ui header">
							<i className="calendar check outline icon"></i>
							<div className="content">                    
							{no}:{user}在{value.桌号}, 进行{myzc.制程名称}({myzc.制程代号})工序的 {value.detailType} 操作
							<p style={{'text-align':'right'}}>{value.detailTime}</p>
							</div>
						</h6>                  
						
						</span>
					);              
					}  
					if(value.detailType == '跳工序') {
					var myzc = _.filter(zc,{制程代号:value.工序代号})[0];                        
					var user = value.user?'线长'+value.user.real_name+'('+value.user.workno+')':'';
					html_process.push(
						<span>
						<h6 className="ui header">
							<i className="calendar check outline icon"></i>
							<div className="content">                    
							{no}:{user} 跳过了 {myzc.制程名称}({myzc.制程代号})工序
							<p style={{'text-align':'right'}}>{value.detailTime}</p>
							</div>
						</h6>                  
						
						</span>
					);
					}          
					if(value.detailType == 'QC') {
					if(value.检测结果=='NG') {
						var myzc = _.filter(zc,{制程代号:value.返工工序代号})[0];                 
						var user = value.user?'线长'+value.user.real_name+'('+value.user.workno+')':'';
						html_process.push(
						<span>
							<h6 className="ui header">
							<i className="calendar check outline icon"></i>
							<div className="content">                    
								{no}:{user} QC——NG至工序{myzc.工序顺序}——{myzc.制程代号}——{myzc.制程名称}
								<p style={{'text-align':'right'}}>{value.detailTime}</p>
							</div>
							</h6>                    
							
						</span>
						);
					}else {                
						var user = value.user?'线长'+value.user.real_name+'('+value.user.workno+')':'';
						html_process.push(
						<span>
							<h6 className="ui header">
							<i className="calendar check outline icon"></i>
							<div className="content">                    
								{no}:{user} QC——{value.检测结果}
								<p style={{'text-align':'right'}}>{value.detailTime}</p>
							</div>
							</h6>                    
							
						</span>
						);
					}                           
					}
					if(value.detailType == '包装') {              
					var user = value.user?value.user.real_name+'('+value.user.workno+')':'';
					html_process.push(
						<span>
						<h6 className="ui header">
							<i className="calendar check outline icon"></i>
							<div className="content">                    
							{no}:{user}进行了包装
							<p style={{'text-align':'right'}}>{value.detailTime}</p>
							</div>
						</h6>                  
						
						</span>
					);
					}
				})
				}
			}
			return (
				<div id="examplepull">
					{/*header Segment*/}
					<div id="toptest" className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px','padding': '1em 0 1.1em 0'}}>
						<div className="ui container grid">
							<div className="one wide column" style={{'padding-left':'0px'}}>
								<a href="javascript:void(0);" onClick={this._onBack}><i className="chevron left icon inverted"></i></a>
							</div>
							<div className="fourteen wide column">
								<div className="ui small header centered inverted" dangerouslySetInnerHTML={{__html:'后工序界面'}}></div>
							</div>
							<div className="one wide column" style={{'padding-right':'0px'}} onClick={this.getCamera}>														
							</div>							
						</div>
					</div>
					<div className="ui container">
						<div className="ui form segment">        
							<div className="field">
								<label>待查询小标签</label> 
								<div className="ui action input">
								<input type="text" placeholder="Search..." id="tag" onKeyDown={this._onkeydown}/>
								<button className="ui button" onClick={this._empty}>清空</button>
								</div>           	                                             
							</div> 
							<div className="field">
								<div className="ui raised segments">
								<div className="ui segment">
									<p>标签基本信息</p >
								</div>
								{html_taginfo}
								{html_zc}             
								</div>                                               
								<div className="ui raised segments">
								<div className="ui segment">
									<p>标签流信息</p >
								</div>
								<div className="ui red segment">
								{html_process}
								</div>              
								</div>
							</div>                                                   
						</div>
					</div> 
				</div>
				)
		}else {
			return (
				<Redirect to='/more'/>
				)
		}
	}
};
class QueryBansearchScreen extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			initCompleted:false,
			zc:[],
			output:'',
			msg:{},			
        	taginfo:'',
        	// displayData:''
		};
		this._onBack = this._onBack.bind(this);
		this._search = this._search.bind(this);
		this._onkeydown = this._onkeydown.bind(this);
		this._empty = this._empty.bind(this);
	}
	componentWillMount() {
		window.scrollTo(0,0)			
	}
	componentDidMount() {
		console.log(5555)
		$('.ui.sticky').sticky({context: '#examplepull'});
		var _this = this;		
		$.get('https://www.kenta.cn:8911/type=getdata?dataname=后工序总MO列表',function(response){
			_this.setState({
				msg: {
					后工序总MO列表:response					
				}
			});			
		},'json');
		
	}

	componentWillUnmount() {//销毁
		console.log('销毁');		
	}
	
	_search() {
		var fieldtext = $('#fieldtext').val();
		var displayData = [];		
		console.log(88,this.state.msg.后工序总MO列表)
		if(this.state.msg.后工序总MO列表==undefined) {
			alert('后工序列表还未加载完毕');
			return false;
		}
		if(fieldtext.substr(0,2)=='MO') {
			var selected = _.find(this.state.msg.后工序总MO列表,{MO:fieldtext});
			if(selected) {
				displayData = displayData.concat(_.filter(selected.领料单号.标签状态));
			}
		}else {
			var selected = _.find(this.state.msg.后工序总MO列表,{领料记录:[{领料单号:fieldtext}]});		
			if(selected) {
				displayData = displayData.concat(_.filter(selected.领料单号.标签状态,{生产领料单号:fieldtext}));
			}
		}
		if(fieldtext.substr(0,2)=='BO') {
			var selected = _.find(this.state.msg.后工序总MO列表,{MO:fieldtext});
			if(selected) {
				displayData = displayData.concat(_.filter(selected.领料单号.标签状态));
			}
		}else {
			var selected = _.find(this.state.msg.后工序总MO列表,{领料记录:[{领料单号:fieldtext}]});		
			if(selected) {
				displayData = displayData.concat(_.filter(selected.领料单号.标签状态,{生产领料单号:fieldtext}));
			}
		}
		console.log(123,displayData);
			this.setState({displayData:displayData})
	} 

	_onkeydown(e) {			
		if (e.keyCode == 13) {
			this._search();
		}
	}

	_empty() {
		$('#tag').val('');
		$('#tag').focus();
		this.setState({output:''})
	}

	_onBack() {		
		$("script[src='script/"+globalData.menu_page[globalid]+"']").remove();
		this.setState({initCompleted:true});
	}

	render() {
		console.log(555,this.state.displayData)
		var _this = this;
		var html = [];
		html = _.map(this.state.displayData,function(n){
			
			return (
				<tr>
					<th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>{n.生产领料单号}</font></font></th>
				    <th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>{n.制令单号}</font></font></th>
				    <th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>{n.物料标签号}</font></font></th>
				    <th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>{n.包规数}</font></font></th>
				    <th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>{n.数量}</font></font></th>
				</tr>
				
			)
		})	
		if(this.state.initCompleted == false) {			
			return (
				<div id="examplepull">
					{/*header Segment*/}
					<div id="toptest" className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px','padding': '1em 0 1.1em 0'}}>
						<div className="ui container grid">
							<div className="one wide column" style={{'padding-left':'0px'}}>
								<a href="javascript:void(0);" onClick={this._onBack}><i className="chevron left icon inverted"></i></a>
							</div>
							<div className="fourteen wide column">
								<div className="ui small header centered inverted" dangerouslySetInnerHTML={{__html:'后工序界面'}}></div>
							</div>
							<div className="one wide column" style={{'padding-right':'0px'}} onClick={this.getCamera}>														
							</div>							
						</div>
					</div>
					<div className="ui container">
						<div className="ui form segment">        
							<div className="field">
								<label>后工序MO</label> 
								<div className="ui action input">
								<input type="text" placeholder="Search..." id="fieldtext" onKeyDown={this._onkeydown}/>
								<button className="ui button" onClick={this._empty}>清空</button>
								</div>           	                                             
							</div> 
							<div className="field">
								<div className="ui raised segments">
								<div className="ui segment">
									<p>标签基本信息</p >
									<table className="ui celled table">
										<thead>
										    <tr>
										    
										    	<th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>生产领料单号</font></font></th>
										    	<th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>制令单号</font></font></th>
											    <th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>物料标签号</font></font></th>
											    <th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>包规数</font></font></th>
											    <th><font style={{"vertical-align": "inherit;"}}><font style={{"vertical-align": "inherit;"}}>领出数量</font></font></th>
											</tr>
											 
										 </thead>
										 <tbody>
											{html}
										 </tbody>
									</table>
									
								</div>
								
								{}             
								</div>                                               
								
							</div>                                                   
						</div>
					</div> 
				</div>
				)
		}else {
			return (
				<Redirect to='/more'/>
				)
		}
	}
};
class SecondPage extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			initCompleted:false
		};		
		this._onBack = this._onBack.bind(this);
	}
	
	componentWillMount() {
		window.scrollTo(0,0)
	}			
	
	componentDidMount() {
		$('.ui.sticky').sticky({context: '#examplepull'});
		
	
	}
	componentWillUnmount() {//销毁
		console.log('销毁');
	}		
	
	_onBack() {				
		this.setState({initCompleted:true,topage:'more'});
	}

	render() {
		var _this = this;			
		if(this.state.initCompleted == false) {
			return (
				<div id="examplepull">
					{/*header Segment*/}
					<div id="toptest" className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px','padding': '1em 0 1.1em 0'}}>
						<div className="ui container grid">
							<div className="one wide column" style={{'padding-left':'0px'}}>
								<a href="javascript:void(0);" onClick={this._onBack}><i className="chevron left icon inverted"></i></a>
							</div>
							<div className="fourteen wide column">
								<div className="ui small header centered inverted" dangerouslySetInnerHTML={{__html:'打印机状态'}}></div>
							</div>
							<div className="one wide column" style={{'padding-right':'0px'}}>														
							</div>							
						</div>
					</div>
					<div className="ui bottom attached vertical pushable">
						打印机状态:{printStatus}
					</div>
				</div>
				)
		}else {
			return (
				<Redirect to={'/'+this.state.topage}/>
				)
		}
	}
};
class HGXSystem extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			initCompleted:false
		};
		this.tagSearch = this.tagSearch.bind(this);	
		this.banSearch = this.banSearch.bind(this);
		this._onBack = this._onBack.bind(this);
	}
	
	componentWillMount() {
		window.scrollTo(0,0)
	
		globalDB.getItem('currentUser').then(function(value){
			if(value!=null) {
				currentUser = value;
				console.log(currentUser)
			}
		}).catch(function(err) {
				// This code runs if there were any errors
				console.log(err);
		});	
	}			
	
	componentDidMount() {
		document.getElementsByTagName('body')[0].style.height = $('#outDiv').height()+"px"
		console.log("outDiv高度",$('#outDiv').width());


		$('.ui.sticky').sticky({context: '#outDiv'});
	}
	componentWillUnmount() {//销毁
		console.log('销毁');
	}	
	YjPage(){
		this.setState({initCompleted:true,topage:'yjpage'});
	}
	tagSearch() {
		this.setState({initCompleted:true,topage:'tagsearchscreen'});        
	}
	banSearch() {
		this.setState({initCompleted:true,topage:'querybansearchscreen'});        
    }
	HgxPage(pageid) {
		globalid = pageid;	console.log('globalid',globalid);							
		this.setState({initCompleted:true,topage:'hgxscreen'});
	}
	
	_onBack() {		
		$("script[src='script/"+globalData.menu_page[globalid]+"']").remove();
		this.setState({initCompleted:true,topage:'more'});
	}

	render() {
		var _this = this;			
		if(this.state.initCompleted == false) {
			return (
				<div className="ui"  id="outDiv" >
					{/*header Segment*/}
					<div id="toptest" className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px','padding': '1em 0 1.1em 0'}}>
						<div className="ui container grid">
							<div className="one wide column" style={{'padding-left':'0px'}}>
								<a href="javascript:void(0);" onClick={this._onBack}><i className="chevron left icon inverted"></i></a>
							</div>
							<div className="fourteen wide column">
								<div  className="ui small header centered inverted" dangerouslySetInnerHTML={{__html:'后工序系统'}}></div>
							</div>
							<div className="one wide column" style={{'padding-right':'0px'}}>														
							</div>							
						</div>
					</div>
					<div className="ui bottom attached vertical pushable">
						<div className="ui pusher column stackable grid container" style={{'padding': '1em 0em 10em'}}>
							{/*公司资讯*/}
							<div className="eight wide column">
								<div className="sub header">系统列表</div>
								<div className="ui red raised segments">
									<a href='javascript:void(0);'  style={{"display":permissionObj.小标签状态查询}}>
										<div className="ui segment" onClick={this.tagSearch}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															小标签状态查询
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);'  style={{"display":"block"}}>
										<div className="ui segment" onClick={this.banSearch}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															领料明细
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);'  style={{"display":permissionObj.桌子制程匹配}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d28254871e7a243849213b0')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															桌子制程匹配
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);' style={{"display":permissionObj.桌子员工匹配}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d281b9471e7a243849213af')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															桌子员工匹配
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);' style={{"display":permissionObj.MO管理界面}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d3184f5e55fa25dac5760b9')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															MO生产管理
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);' style={{"display":permissionObj.重工桌设置}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d27178478a9d03e1c5a8af1')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															重工桌设置
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);' style={{"display":permissionObj.手工包装}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d2547d24b98b53198177e8d')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															手工包装
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>									
									<a href='javascript:void(0);' style={{"display":permissionObj.领料界面}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d25a4ba0e6cc83fa41c9519')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															领料界面
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>	
									<a href='javascript:void(0);' style={{"display":permissionObj.上机报工界面}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d280d3771e7a243849213ae')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
														上机报工界面
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);' style={{"display":permissionObj.跳工序界面}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d284ffdbe727d23b4ec6666')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															跳工序界面
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);' style={{"display":permissionObj.QC界面}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d27f9d171e7a243849213a9')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															QC界面
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>
									<a href='javascript:void(0);' style={{"display":permissionObj.包装界面}}>
										<div className="ui segment" onClick={this.HgxPage.bind(this,'5d270ceebaf2732984fb8549')}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															包装界面
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>										
									<a href='javascript:void(0);' style={{"display":permissionObj.推送通知}}>
										<div className="ui segment" onClick={this.YjPage.bind(this)}>
											<div className="ui grid">
												<div className="thirteen wide column">
													<div className="ui small header grey">
														<i className="align justify icon"></i>
														<div className="content">
															推送通知
														</div>
													</div>
												</div>
												<div className="three wide column">
												</div>
											</div>
										</div>
									</a>																		
								</div>
							</div>
						</div>
					</div>
				</div>
				)
		}else {
			return (
				<Redirect to={'/'+this.state.topage}/>
				)
		}
	}
};

// 页内元件
class MainMenu extends React.Component{	
	render () {		
		return (
			<div className="ui labeled icon red four item bottom fixed secondary pointing menu" style={{'background':'white'}}>
			  <Link id='MainMunu_Dashboard' className="MainMenu item" to='/dashboard'>
				    <i className="home icon"></i>
				    关注
			  </Link>
			  <Link id='MainMunu_Project' className="MainMenu item active" to='/project'>
				    <i className="unordered list icon"></i>
				    {}
				    项目列表
			  </Link>
			  <Link id='MainMenu_Profile' className="MainMenu item" to='/profile'>
					<i className="user icon"></i>
				    个人中心
			  </Link>
			  <Link id='MainMunu_More' className="MainMenu item" to='/more'>
				    <i className="ellipsis horizontal icon"></i>
				    更多
			  </Link>
			</div>
			)
	}
};

// App 运行入口
class KentaApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}; 
	}
	componentDidMount() {
		$.getJSON('https://www.kenta.cn/app3/hub/version.php',function(data){
            console.log('ajax-version:',data['version']);
			myversion = data['version'];            
        });			
	}
	render() {
		return (
			<HashRouter basename={KentaConstants.RELATIVE_PATH}>
				<div>
					<Route exact path='/' component={initializeElement}/>
					<Route path='/landing' component={LandingPage}/>

					<Route path='/login' component={Login}/>

					<Route path='/dashboard' component={Dashboard}/>
					<Route path='/dashboard' component={MainMenu}/>

					<Route path='/project' component={Project}/>
					<Route path='/project' component={MainMenu}/>

					<Route path='/profile' component={Profile}/>
					<Route path='/profile' component={MainMenu}/>

					<Route path='/more' component={More}/>
					<Route path='/more' component={MainMenu}/>

					<Route path='/hgxscreen' component={HgxPage}/>
					<Route path='/querybansearchscreen' component={QueryBansearchScreen}/>
					<Route path='/tagsearchscreen' component={TagsearchScreen}/>
					<Route path='/hgxsystem' component={HGXSystem}/>
					<Route path='/secondpage' component={SecondPage}/>
					<Route path='/yjpage' component={YjPage}/>
					<Route path='/goDashboard' component={GoDashboard}/>
				</div>
			</HashRouter>
		);
  	}
}

ReactDOM.render(
	<KentaApp />,
	document.getElementById("kenta-app")
);
