var {  HashRouter, Router, Route, Link, Redirect, browserHistory } = ReactRouterDOM;
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
window.globalDB    = localforage.createInstance({name: "kenta_db"});

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
var globalid = '';
var global_json = {};
window.deskToGX = {};
window.globalData = {
	menu_page:{
		219999:'special.js',
		220084:'MaterialScreen.js',
		221092:'bzscript.js',
		221091:'qcscript.js'
	}
}


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
		setTimeout(function(){console.log(11,currentUser.login);
            if(currentUser.login == false) {
                _this.setState({topage:'/login',initCompleted:true});
            }else {                
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
					    <h6 className="ui center aligned header inverted"> 2016 KENTA Electronic Mfg.Co.,Ltd</h6>
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
				$.get(specialurl,function(logindata){
					if(logindata == 'FALSE') {
						$('.ui.basic.modal.indexLogin').modal('show');
						$('#loginloading').removeClass();
					}else {

						if(logindata.status == 'error') {
							$('.ui.basic.modal.indexLogin').modal('show');
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

						<h6 className="ui center aligned header inverted"> 2019 KENTA Electronic Mfg.Co.,Ltd</h6>
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
				<Redirect to='/Project'/>
				)
		}
	}
};

class Dashboard extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {

	}
	componentDidMount() {
		var _this = this;
		$('.MainMenu').removeClass('active');
		$('#MainMunu_Dashboard').addClass('active');
		$('.ui.sticky.mainHeader').sticky({});	
	}
	componentDidUpdate(){
		$('.ui.sticky.mainHeader').sticky({context: '#kenta-app'});
	}
	componentWillUnmount() {//销毁
	
	}

	render () {
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
class Project extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {
		
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
		this.setState({KPIList:globalData.KPI,AdditionalScore:globalData.AdditionalScore,initComplete:true});
	}
	componentDidMount() {
		var _this = this;
		$('.MainMenu').removeClass('active');
		$('#MainMenu_Profile').addClass('active');		
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
		var headsrc = 'https://www.kenta.cn/app3/data/avatar/'+currentUser.user_name+'.jpg';
		if(this.state.logout == false) {
			return (
				<div id="examplepull">
					{/*header Segment*/}
					<div className="ui sticky mainHeader inverted red segment" style={{'borderRadius':'0px'}}>
						<div className="ui container">
							<div className="ui small header centered inverted">个人中心</div>
						</div>
					</div>
					<div className="">
						<div className="">
							<div style={{'background': 'url("images/profile_bg.png") no-repeat center top','background-size':'cover'}}>
								<div className="ui basic segment" style={{'background': 'linear-gradient(to bottom, rgba(124,124,124,0) 0%,rgba(124,124,124,0.03) 4%,rgba(0,0,0,0.43) 66%,rgba(0,0,0,0.65) 99%)'}}>
									<div>
										<div style={{'width':'50%'}}>
											<div id="radiusdiv">
												<img className="ui small centered circular image" src={headsrc} />
											</div>
											<h2 className="ui centered header inverted">
												<div className="content">
													{currentUser.real_name}|总分{}
													<div className="sub header">{currentUser.role_name} | {currentUser.department}</div>
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
			logout : false,
			initCompleted:false			
		};
	}	
	componentDidMount() {
		$('.MainMenu').removeClass('active');
		$('#MainMunu_More').addClass('active');

		$('.ui.sticky.mainHeader').sticky({
		    context: '#kenta-app'
		  });
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
	goMES() {
		globalData.iframeurl = 'https://www.kenta.cn/jm/newform/formdiyscript.html?id=220084&script=MaterialScreen';
		this.setState({
			initCompleted:true,
			screen:'iframewindow'
			});
	}
	
	HgxPage(pageid) {
		globalid = pageid;
		$.get('https://www.kenta.cn:8895/type=getdata?dataname=桌子对应关系',function(result){
			deskToGX = result;console.log('deskToGX',deskToGX);
		},'json');		
		this.setState({initCompleted:true,topage:'hgxscreen'});
	}

	_print() {
		console.log('run print')
		var newWindow=window.open("打印窗口","_blank");
		var docStr = '<div>Hello World!</div>';
		newWindow.document.write(docStr);
		newWindow.document.close();
		newWindow.print();
		newWindow.close();		
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
											<div className="ui segment" onClick={this.goMES}>
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
										<a href='javascript:void(0);' onClick={this._print}>
											<div className="ui segment">
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="tasks icon"></i>
															<div className="content">
																项目设置
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
															<i className="settings icon"></i>
															<div className="content">
																系统设置
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
								{/*个人*/}
								<div className="eight wide column">
									<div className="sub header">个人</div>
									<div className="ui red raised loading segments">
										<a href='javascript:void(0);'>
											<div className="ui segment" onClick={this.HgxPage.bind(this,220084)}>
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
										<a href='javascript:void(0);'>
											<div className="ui segment" onClick={this.HgxPage.bind(this,219999)}>
												<div className="ui grid">
													<div className="thirteen wide column">
														<div className="ui small header grey">
															<i className="align justify icon"></i>
															<div className="content">
																线长界面
															</div>
														</div>
													</div>
													<div className="three wide column">
													</div>
												</div>
											</div>
										</a>	
										<a href='javascript:void(0);'>
											<div className="ui segment" onClick={this.HgxPage.bind(this,221092)}>
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
										<a href='javascript:void(0);'>
											<div className="ui segment" onClick={this.HgxPage.bind(this,221091)}>
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
			return (
				<Redirect to='/login'/>
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
	
	}
	componentDidMount() {console.log(55,globalData.menu_page[globalid]);
		$.getScript("script/"+globalData.menu_page[globalid],function(){   //加载test.js,成功后，并执行回调函数
			console.log("加载js文件",globalid);
			showformtemplate(globalid);                 
		});
		//console.log(globalData.menu_pageid);
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
				<div>
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
				<Redirect to='/more'/>
				)
		}
	}
};


// 页内元件
class MainMenu extends React.Component{
	componentDidMount() {
				
	}
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
				</div>
			</HashRouter>
    );
  }
}

ReactDOM.render(
	<KentaApp />,
	document.getElementById("kenta-app")
);
