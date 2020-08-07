var {
	HashRouter,
	Router,
	Route,
	Link,
	Redirect,
	browserHistory
  } = ReactRouterDOM;
  /** 取得手機UUID */
  
  var mobileUUID = "Non Mobile Device"; //moment.js中文
  
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
  
  window.globalDB = localforage.createInstance({
	name: "kenta_db"
  });
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
	推送通知: "none" // window.permissionObj = {
	// 	桌子制程匹配: "",
	// 	桌子员工匹配: "",
	// 	MO生产管理: "",
	// 	重工桌设置: "",
	// 	手工包装: "",
	// 	小标签状态查询: "",
	// 	领料界面: "",
	// 	线长界面: "",
	// 	跳工序界面: "",
	// 	 包装界面: "",
	// 	 QC界面: "",
	// 	 推送通知: "",
	// 	  }
  
  };
  window.currentUser = {
	user_name: "",
	password: "",
	real_name: "客人",
	role_name: "客人",
	access_token: "",
	department: "",
	author: "",
	login: false
  };
  var globalid = '';
  var global_json = {};
  window.deskToGX = {};
  window.后工序总MO列表 = {};
  window.桌子状态 = {};
  window.fortest = false;
  window.printStatus = 'offline';
  window.globalData = {
	menu_page: {
	  '5d280d3771e7a243849213ae': 'special.js',
	  '5d25a4ba0e6cc83fa41c9519': 'MaterialScreen.js',
	  '5d270ceebaf2732984fb8549': 'newbzscript.js',
	  '5d27f9d171e7a243849213a9': 'qcscript.js',
	  '5d284ffdbe727d23b4ec6666': 'skipstep.js',
	  '5d27178478a9d03e1c5a8af1': 'reworkSetting.js',
	  '5d28254871e7a243849213b0': 'TableScreen.js',
	  '5d3184f5e55fa25dac5760b9': 'moManage.js',
	  '5d2547d24b98b53198177e8d': 'manualWithIP.js',
	  '5d281b9471e7a243849213af': 'TablePunch.js'
	} //连接数据库的ws
  
  };
  var socket = io.connect('https://www.kenta.cn:8892');
  socket.on('connect', function () {
	$('body').toast({
	  message: '8892已连接 !'
	});
  });
  socket.on('disconnect', function () {
	$('body').toast({
	  message: '8892已断开 !'
	});
  });
  var socket_8893 = io.connect('https://www.kenta.cn:8893');
  socket_8893.on('connect', function () {
	$('body').toast({
	  message: '8893已连接 !'
	});
  });
  socket_8893.on('disconnect', function () {
	$('body').toast({
	  message: '8893已断开 !'
	});
  });
  socket_8893.emit('storeClientInfo', ['后工序总MO列表', '桌子状态']);
  socket_8893.on('getnewjson', function (msg) {
	后工序总MO列表 = msg.后工序总MO列表;
	桌子状态 = msg.桌子状态;
  }); //JSPM连接打印机
  
  JSPM.JSPrintManager.auto_reconnect = true;
  ;
  JSPM.JSPrintManager.start(true, '128.0.3.39', 22443);
  
  JSPM.JSPrintManager.WS.onOpen = function () {
	console.log('connect');
	$('body').toast({
	  message: '打印机已连接 !'
	});
	printStatus = 'online';
  };
  
  JSPM.JSPrintManager.WS.onStatusChanged = function () {
	console.log('臣妾连不上啊');
  };
  
  JSPM.JSPrintManager.WS.onClose = function () {
	if (printStatus != 'offline') {
	  $('body').toast({
		message: '打印机已断开 !'
	  });
	  printStatus = 'offline';
	}
  };
  
  globalDB.getItem('currentUser').then(function (value) {
	if (value != null) {
	  currentUser = value;
	}
  }).catch(function (err) {
	// This code runs if there were any errors
	console.log(err);
  });
  /**
   * +-----------------------------------------------------------
   * | 外部内容
   * +-----------------------------------------------------------
   */
  
  var OAuthParameters = {
	oauth_consumer_key: '5kSCAmSPhvrh',
	oauth_token: 'sZCEkwazUQ5DU8NjQvXj81dW',
	oauth_signature_method: 'HMAC-SHA1',
	oauth_version: '1.0',
	consumerSecret: 'JAF7LatRXaMnOLVqYFMlLd0uQ1maT4HgP2l3VaymLTLinTfM',
	tokenSecret: 'Dk6ads9PIYNhqIvE9Jir2Q3TjGQcOnW4WzUHqiwKkOXYGR8e'
  };
  
  function reloadData(tablename, dataList) {
	var currentPage = tablename.page();
	tablename.clear();
	tablename.rows.add(dataList);
	tablename.page(currentPage).draw(false);
  }
  
  function showformtemplate(id) {
	RenderForm(id);
  }
  
  function filterFormdata(data, filterkey) {
	var result = _.chain(data).map(function (n) {
	  n.collectedData.createTime = n.createTime;
	  return n.collectedData;
	}).sortBy(function (n) {
	  return n.createTime;
	}).value();
  
	if (filterkey) {
	  var tmp = _.chain(result).groupBy(function (n) {
		return n[filterkey];
	  }).value();
  
	  result = [];
  
	  _.forEach(tmp, function (n) {
		result.push(_.maxBy(n, 'createTime'));
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
  
  
  class initializeElement extends React.Component {
	componentDidMount() {
	  globalDB.getItem('currentUser').then(function (value) {
		if (value != null) {
		  currentUser = value;
		}
	  }).catch(function (err) {
		// This code runs if there were any errors
		console.log(err);
	  });
	}
  
	render() {
	  return React.createElement("div", {
		name: "i am init div"
	  }, React.createElement(Redirect, {
		to: "/landing"
	  }));
	}
  
  } // 页面
  
  
  class LandingPage extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		topage: '',
		initCompleted: false
	  };
	}
  
	componentDidMount() {
	  var _this = this;
  
	  setTimeout(function () {
		if (currentUser.login == false) {
		  _this.setState({
			topage: '/login',
			initCompleted: true
		  });
		} else {
		  _this.setState({
			topage: '/project',
			initCompleted: true
		  });
  
		  var stararr = [];
		  $.get("https://www.kenta.cn:8892/type=getcollecteddata?id=5d3130a212244b7aa402cd68", function (result) {
			_.map(result, function (x) {
			  stararr.push(x.collectedData);
			}); //console.log("权限数据3",stararr)			
  
  
			console.log("当前用户", currentUser);
			console.log("权限数据1", stararr);
  
			_.map(stararr, function (n) {
			  n.权限 = false;
			  var tmp_workno = n.Workno.split('——')[0];
  
			  if (currentUser.workno == tmp_workno) {
				n.权限 = true;
			  }
  
			  if (n.userde == "" || n.userde == "——请选择部门——" || n.userde == null) {
				if (n.userpo == currentUser.role_name) {
				  n.权限 = true;
				}
			  }
  
			  if (n.userde == currentUser.department) {
				if (n.userpo == "" || n.userpo == "——请选择职位——" || n.userpo == null) {
				  n.权限 = true;
				}
			  }
			});
  
			_.map(stararr, function (y) {
			  // var b = y.userpage.slice(7,y.userpage.length)
			  if (y.userpage) {
				if (y.权限 == true) {
				  var b = y.userpage.split("——")[1];
				  permissionObj[b] = "block";
				}
			  }
			});
  
			console.log("permissionObj", permissionObj);
			$('body').toast({
			  message: '用户权限已下载 !'
			});
		  }, 'json').fail(function () {
			$('body').toast({
			  message: '用户权限下载失败,联系管理员 !'
			});
		  });
		}
	  }, 2000);
	  $('.ui.image.centered').transition({
		animation: 'fade in',
		duration: '1s'
	  });
	}
  
	render() {
	  var _this = this;
  
	  if (this.state.initCompleted == false) {
		return React.createElement("div", {
		  id: "Index",
		  className: "ui one column centered  padded grid"
		}, React.createElement("div", {
		  className: "middle aligned row"
		}, React.createElement("div", {
		  className: "column"
		}, React.createElement("img", {
		  className: "ui image centered",
		  src: "images/logo_FIX2.png",
		  width: "250"
		}))), React.createElement("div", {
		  className: "middle aligned row"
		}, React.createElement("div", {
		  className: "column"
		}, React.createElement("div", {
		  className: "ui active centered inline indeterminate text inverted loader"
		}, "\u521D\u59CB\u5316\u4E2D..."))), React.createElement("div", {
		  className: "bottom aligned row"
		}, React.createElement("div", {
		  className: "column"
		}, React.createElement("h6", {
		  className: "ui center aligned header inverted"
		}, " 2016 KENTA Electronic Mfg.Co.,Ltd"))));
	  } else {
		return React.createElement(Redirect, {
		  to: this.state.topage
		});
	  }
	}
  
  }
  
  class Login extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		loginSuccess: false,
		initCompleted: false
	  };
	}
  
	componentDidMount() {
	  var _this = this;
  
	  $('.ui.form.indexLogin').form({
		fields: {
		  username: 'empty',
		  password: 'empty'
		},
		onSuccess: function (event, fields) {
		  var specialurl = 'https://www.kenta.cn/app3/wp-admin/admin-ajax.php?action=login&username=' + fields.username + '&password=' + fields.password;
		  $.get(specialurl, function (logindata) {
			console.log(121, logindata);
  
			if (logindata == 'FALSE') {
			  $('.ui.basic.modal.indexLogin').modal('show');
			  $('#loginloading').removeClass();
			} else {
			  if (logindata.status == 'error') {
				$('.ui.basic.modal.indexLogin').modal('show');
				$('#loginloading').removeClass();
				return false;
			  }
  
			  var jsondetail = logindata.userDetail;
			  var jsonmeta = logindata.userMeta.hr_info; // if(contactDB == null) {
			  // 	contactDB = localforage.createInstance({name: "contact_"+ jsondetail.data.user_login +"_db"});
			  // }
  
			  var department = jsonmeta == undefined ? '无工号人员' : jsonmeta.branna == undefined || jsonmeta.branna == '' ? '未分配职位人员' : jsonmeta.branna;
			  var role_name = jsonmeta == undefined ? '人事系统未同步' : jsonmeta.jobna == undefined || jsonmeta.jobna == '' ? '未分配职位' : jsonmeta.jobna;
			  var groupno = jsonmeta == undefined ? '人事系统未同步' : jsonmeta.groupno;
			  var workno = jsonmeta == undefined ? '工号异常' : jsonmeta.workno;
  
			  if (role_name == '人事系统未同步') {
				role_name = '未分配职位';
			  } //人事系统未同步统一记录为未分配职位 方便评分时用到的职位
  
  
			  currentUser = {
				user_name: jsondetail.data.user_login,
				password: jsondetail.data.user_pass,
				real_name: logindata.userMeta.real_name,
				author: jsondetail.ID,
				workno: workno,
				role_name: role_name,
				department: department,
				group: groupno,
				login: true
			  };
			  console.log('currentUser', currentUser);
			  /*jpush注册*/
  
			  console.log("jpush_init:");
			  var userNameAlias = {
				sequence: 1,
				alias: currentUser.user_name.replace(/\./, '_')
			  }; // 用下划线替换 . ，当在PHP发送时也做相应的处理
  
			  var userTagsArray = {
				sequence: 1,
				tags: [currentUser.department, currentUser.role_name]
			  };
  
			  if (window.plugins && window.plugins.jPushPlugin) {
				window.plugins.jPushPlugin.setAlias(userNameAlias, result => {
				  var sequence = result.sequence;
				  var alias = result.alias;
				  console.log('result:');
				  console.log(result);
				}, error => {
				  var sequence = error.sequence;
				  var errorCode = error.code;
				  console.log('error:');
				  console.log(error);
				});
				window.plugins.jPushPlugin.setTags(userTagsArray, result => {
				  var sequence = result.sequence;
				  var alias = result.tags;
				  console.log('result:');
				  console.log(result);
				}, error => {
				  var sequence = error.sequence;
				  var errorCode = error.code;
				  console.log('error:');
				  console.log(error);
				}); //window.plugins.jPushPlugin.setTagsWithAlias(userTagsArray, userNameAlias, function(e){alert('setTags' + JSON.stringify(e));});
				// console.log('setTags / Alias success, userTagsArray : ' + userTagsArray + ', userNameAlias : ' + userNameAlias);
			  } else {
				console.log('setTags / Alias fail, userTagsArray : ' + userTagsArray + ', userNameAlias : ' + userNameAlias);
			  }
  
			  ;
			  /*jpush注册*/
  
			  globalDB.setItem("currentUser", currentUser).then(function () {
				$.get('https://www.kenta.cn/app3/wp-admin/admin-ajax.php?action=logout', function (logoutdata) {
				  _this.setState({
					initCompleted: true
				  });
  
				  $('#loginloading').removeClass();
				}, 'json');
			  });
			}
		  }, 'json');
		  return false;
		}
	  });
	  $('.ui.image.centered').transition({
		animation: 'fade in',
		duration: '1s'
	  });
	  $.getJSON('https://www.kenta.cn/app3/hub/version.php', function (data) {
		console.log('ajax-version:', data['version']);
		$('.version_yj').html(data['version']);
	  });
	}
  
	componentWillUnmount() {//销毁
	}
  
	_onClick() {
	  $('#loginloading').addClass('ui active inverted dimmer');
	}
  
	render() {
	  var _this = this;
  
	  if (this.state.initCompleted == false) {
		return React.createElement("div", {
		  style: {
			'height': '100%',
			'width': '100%',
			'position': 'fixed',
			'background': 'url("images/loginbg.png") no-repeat center center'
		  }
		}, React.createElement("div", {
		  className: "ui one column centered padded grid equal height",
		  style: {
			'height': '100%',
			'width': '100%'
		  }
		}, React.createElement("div", {
		  className: "middle aligned row"
		}, React.createElement("div", {
		  className: "column"
		}, React.createElement("img", {
		  className: "ui image centered medium ",
		  src: "images/logo.png"
		}))), React.createElement("div", {
		  className: "bottom aligned row"
		}, React.createElement("div", {
		  className: "column"
		})), React.createElement("div", {
		  className: "bottom aligned row"
		}, React.createElement("div", {
		  className: "column"
		}, React.createElement("form", {
		  className: "ui form container indexLogin",
		  style: {
			'border': '5px solid rgba(109, 114, 117, 0.41)'
		  }
		}, React.createElement("div", {
		  className: "ui fluid field icon input login",
		  style: {
			'margin': '0px'
		  }
		}, React.createElement("input", {
		  type: "text",
		  name: "username",
		  placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D\u6216\u5DE5\u53F7",
		  ref: "user_name",
		  style: {
			'height': '40px',
			'borderRadius': '0px'
		  }
		}), React.createElement("i", {
		  className: "user outline icon"
		})), React.createElement("div", {
		  className: "ui fluid field icon input",
		  style: {
			'margin': '0px'
		  }
		}, React.createElement("input", {
		  type: "password",
		  name: "password",
		  placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
		  ref: "password",
		  style: {
			'height': '40px',
			'borderRadius': '0px'
		  }
		}), React.createElement("i", {
		  className: "lock icon"
		})), React.createElement("div", {
		  className: "ui negative fluid primary submit button",
		  style: {
			'borderRadius': '0px'
		  },
		  onClick: this._onClick
		}, "\u767B\u5F55")), React.createElement("h6", {
		  className: "ui center aligned header inverted"
		}, " 2019 KENTA Electronic Mfg.Co.,Ltd V-", React.createElement("span", {
		  className: "version_yj"
		}))))), React.createElement("div", {
		  className: "ui basic modal indexLogin"
		}, React.createElement("div", {
		  className: "ui icon header"
		}, React.createElement("i", {
		  className: "archive icon"
		}), "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF"), React.createElement("div", {
		  className: "content"
		}), React.createElement("div", {
		  className: "actions"
		}, React.createElement("div", {
		  className: "ui red basic cancel inverted button"
		}, "\u8FD4\u56DE"))), React.createElement("div", {
		  id: "loginloading"
		}, React.createElement("div", {
		  className: "ui text loader"
		}, "\u8BF7\u7A0D\u5019...")));
	  } else {
		return React.createElement(Redirect, {
		  to: "/Project"
		});
	  }
	}
  
  }
  
  ;
  
  class Dashboard extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {};
	}
  
	componentWillMount() {}
  
	componentDidMount() {
	  var _this = this;
  
	  $('.MainMenu').removeClass('active');
	  $('#MainMunu_Dashboard').addClass('active');
	  $('.ui.sticky.mainHeader').sticky({});
	}
  
	componentDidUpdate() {
	  $('.ui.sticky.mainHeader').sticky({
		context: '#kenta-app'
	  });
	}
  
	componentWillUnmount() {//销毁
	}
  
	render() {
	  return React.createElement("div", null, React.createElement("div", {
		className: "ui sticky mainHeader inverted red segment",
		style: {
		  'borderRadius': '0px'
		}
	  }, React.createElement("div", {
		className: "ui container"
	  }, React.createElement("div", {
		className: "ui small header centered inverted"
	  }, "\u5173\u6CE8(\u9875\u9762\u7EF4\u62A4\u4E2D)"))), React.createElement("div", {
		className: "ui container"
	  }, React.createElement("div", {
		className: "ui search fluid fordash"
	  }, React.createElement("div", {
		className: "ui icon input fluid"
	  }, React.createElement("input", {
		className: "prompt",
		type: "text",
		placeholder: "\u8F93\u5165\u9879\u76EE\u5173\u952E\u5B57\u6216\u9879\u76EEid\u67E5\u8BE2..."
	  }), React.createElement("i", {
		className: "search icon"
	  })), React.createElement("div", {
		className: "results"
	  }))), React.createElement("div", {
		className: "ui basic segment container",
		style: {
		  'margin': '0'
		}
	  }, React.createElement("img", {
		className: "ui fluid image",
		src: "images/banner_dashboard.png"
	  }), React.createElement("div", {
		className: "ui bottom attached tab active",
		"data-tab": "dashs"
	  }, React.createElement("div", {
		className: "ui bottom attached vertical pushable"
	  }, React.createElement("div", {
		className: "pusher",
		style: {
		  'padding': '2em 0.5em 10em'
		}
	  }, React.createElement("div", {
		className: "ui two stackable cards"
	  }, React.createElement("div", {
		className: "ui link card",
		style: {
		  'border': '0px',
		  'padding-top': '0px',
		  'word-break': 'break-all'
		}
	  }, React.createElement("div", {
		className: "content"
	  }, React.createElement("a", {
		className: "ui ribbon label"
	  }, React.createElement("i", {
		className: "alarm outline icon"
	  })), "xxxx", React.createElement("div", null, React.createElement("div", {
		className: "ui text loader"
	  }, "Loading")), React.createElement("div", {
		className: "meta"
	  }, "xxx")), React.createElement("div", {
		className: "content",
		style: {
		  'border': '0px',
		  'padding-top': '0px'
		}
	  }, React.createElement("div", {
		className: "ui labels"
	  })))))))));
	}
  
  }
  
  ;
  
  class Project extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {};
	}
  
	componentWillMount() {}
  
	componentDidMount() {
	  var _this = this;
  
	  $('.MainMenu').removeClass('active');
	  $('#MainMunu_Project').addClass('active');
	  $('.ui.sticky.mainHeader').sticky({
		context: '#kenta-app'
	  });
	  $('.menu .item').tab({
		onLoad: function () {
		  $('.ui.sticky.mainHeader').sticky({
			context: '#kenta-app'
		  });
		}
	  });
	}
  
	componentDidUpdate() {
	  $('.ui.sticky.mainHeader').sticky({
		context: '#kenta-app'
	  });
	}
  
	componentWillUnmount() {//销毁
	}
  
	render() {
	  var _this = this;
  
	  return React.createElement("div", null, React.createElement("div", {
		className: "ui sticky mainHeader inverted red segment",
		style: {
		  'borderRadius': '0px',
		  'padding': '1em 0 0.1em 0'
		}
	  }, React.createElement("div", {
		className: "ui container"
	  }, React.createElement("div", {
		className: "ui small header centered inverted"
	  }, "\u9879\u76EE(\u9875\u9762\u7EF4\u62A4)"), React.createElement("div", {
		className: "ui top attached tabular inverted secondary pointing menu fluid four item"
	  }, React.createElement("a", {
		className: "item active",
		"data-tab": "allProject"
	  }, "\u6240\u6709\u9879\u76EE"), React.createElement("a", {
		className: "item",
		"data-tab": "pm"
	  }, "\u6211\u662FPM"), React.createElement("a", {
		className: "item",
		"data-tab": "organizer"
	  }, "\u6211\u662F\u53D1\u8D77\u4EBA"), React.createElement("a", {
		className: "item",
		"data-tab": "mgntGroup"
	  }, "\u65E5\u5E38\u7BA1\u7406")))), React.createElement("div", {
		className: "ui container"
	  }, React.createElement("div", {
		className: "ui search fluid forproject"
	  }, React.createElement("div", {
		className: "ui icon input fluid"
	  }, React.createElement("input", {
		className: "prompt",
		type: "text",
		placeholder: "\u8F93\u5165\u9879\u76EE\u5173\u952E\u5B57\u6216\u9879\u76EEid\u67E5\u8BE2..."
	  }), React.createElement("i", {
		className: "search icon"
	  })), React.createElement("div", {
		className: "results"
	  })), React.createElement("div", {
		className: "ui bottom attached tab active",
		"data-tab": "allProject"
	  }, React.createElement("div", {
		className: "ui bottom attached vertical pushable"
	  }, React.createElement("div", {
		className: "pusher",
		style: {
		  'padding': '2em 0.5em 10em'
		}
	  }, React.createElement("div", {
		className: "ui two stackable cards"
	  })))), React.createElement("div", {
		className: "ui bottom attached tab",
		"data-tab": "pm"
	  }, React.createElement("div", {
		className: "ui bottom attached vertical pushable"
	  }, React.createElement("div", {
		className: "pusher",
		style: {
		  'padding': '2em 0.5em 10em'
		}
	  }, React.createElement("div", {
		className: "ui two stackable cards"
	  })))), React.createElement("div", {
		className: "ui bottom attached tab",
		"data-tab": "organizer"
	  }, React.createElement("div", {
		className: "ui bottom attached vertical pushable"
	  }, React.createElement("div", {
		className: "pusher",
		style: {
		  'padding': '2em 0.5em 10em'
		}
	  }, React.createElement("div", {
		className: "ui two stackable cards"
	  })))), React.createElement("div", {
		className: "ui bottom attached tab",
		"data-tab": "mgntGroup"
	  }, React.createElement("div", {
		className: "ui bottom attached vertical pushable"
	  }, React.createElement("div", {
		className: "pusher",
		style: {
		  'padding': '2em 0.5em 10em'
		}
	  }, React.createElement("div", {
		className: "ui two stackable cards"
	  }))))));
	}
  
  }
  
  ;
  
  class Profile extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		KPIScoreHtml: [],
		ManageScoreHtml: [],
		AdditionalScoreHtml: [],
		kpiscore: 0,
		managescore: 0,
		additionalscore: 0,
		monthData: '',
		KPINoData: false,
		PKPINoData: false,
		initComplete: false,
		logout: false
	  };
	  this.Logout = this.Logout.bind(this);
	}
  
	componentWillMount() {
	  this.setState({
		KPIList: globalData.KPI,
		AdditionalScore: globalData.AdditionalScore,
		initComplete: true
	  });
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
	  globalDB.setItem("currentUser", currentUser).then(function () {
		_this.setState({
		  monthData: '',
		  logout: true
		});
	  }).catch(function (err) {
		console.log(err);
	  });
	}
  
	render() {
	  var Headset = 'https://www.kenta.cn/app3/data/avatar/';
	  var headsrc = 'https://www.kenta.cn/app3/data/avatar/' + currentUser.user_name + '.jpg';
  
	  if (headsrc == '' || headsrc == undefined) {
		headsrc = 'https://www.kenta.cn/app3/data/avatar/nopic.jpg';
	  }
  
	  console.log("headsrc", Headset);
  
	  if (this.state.logout == false) {
		return React.createElement("div", {
		  id: "examplepull"
		}, React.createElement("div", {
		  className: "ui sticky mainHeader inverted red segment",
		  style: {
			'borderRadius': '0px'
		  }
		}, React.createElement("div", {
		  className: "ui container"
		}, React.createElement("div", {
		  className: "ui small header centered inverted"
		}, "\u4E2A\u4EBA\u4E2D\u5FC3"))), React.createElement("div", {
		  className: ""
		}, React.createElement("div", {
		  className: ""
		}, React.createElement("div", {
		  style: {
			'background': 'url("images/profile_bg.png") no-repeat center top',
			'background-size': 'cover'
		  }
		}, React.createElement("div", {
		  className: "ui basic segment",
		  style: {
			'background': 'linear-gradient(to bottom, rgba(124,124,124,0) 0%,rgba(124,124,124,0.03) 4%,rgba(0,0,0,0.43) 66%,rgba(0,0,0,0.65) 99%)'
		  }
		}, React.createElement("div", null, React.createElement("div", {
		  style: {
			'width': '100%'
		  }
		}, React.createElement("div", {
		  id: "radiusdiv"
		}, React.createElement("img", {
		  className: "ui small centered circular image",
		  src: headsrc
		})), React.createElement("h2", {
		  className: "ui centered header inverted"
		}, React.createElement("div", {
		  className: "content"
		}, currentUser.real_name, React.createElement("div", {
		  className: "sub header"
		}, currentUser.role_name, " | ", currentUser.workno))))), React.createElement("div", {
		  className: "ui hidden divider"
		}))), React.createElement("div", {
		  className: "ui bottom attached vertical pushable"
		}, React.createElement("div", {
		  className: "ui pusher column stackable grid container",
		  style: {
			'padding': '1em 0em 10em'
		  }
		}, React.createElement("div", {
		  className: "sixteen wide column"
		}, React.createElement("button", {
		  className: "ui red fluid button",
		  onClick: this.Logout
		}, React.createElement("i", {
		  className: "arrow right icon"
		}), "\u9000\u51FA\u767B\u9646")))))));
	  } else {
		return React.createElement(Redirect, {
		  to: "/login"
		});
	  }
	}
  
  }
  
  ;
  
  class More extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		topage: '',
		logout: false,
		initCompleted: false
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
	  this.setState({
		initCompleted: true,
		topage: 'tagsearchscreen'
	  });
	}
  
	Logout() {
	  console.log('logoutClicked');
  
	  var _this = this;
  
	  var lastuser = currentUser.user_name;
	  currentUser = {};
	  currentUser.user_name = lastuser;
	  currentUser.login = false;
	  globalDB.setItem("currentUser", currentUser).then(function () {
		clearInterval(projectInit);
		window.projectsDB.clear();
		window.messagesDB.clear();
		window.contactDB.clear();
		window.affichesDB.clear();
  
		_this.setState({
		  logout: true
		});
	  }).catch(function (err) {
		console.log(err);
	  });
	}
  
	YjPage() {
	  this.setState({
		initCompleted: true,
		topage: 'yjpage'
	  });
	}
  
	goHGXSystem() {
	  this.setState({
		initCompleted: true,
		topage: 'hgxsystem'
	  });
	}
  
	goSecondPage() {
	  this.setState({
		initCompleted: true,
		topage: 'secondpage'
	  });
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
  
	render() {
	  if (this.state.logout == false) {
		if (this.state.initCompleted == false) {
		  return React.createElement("div", null, React.createElement("div", {
			className: "ui sticky mainHeader inverted red segment",
			style: {
			  'borderRadius': '0px'
			}
		  }, React.createElement("div", {
			className: "ui container"
		  }, React.createElement("div", {
			className: "ui small header centered inverted"
		  }, "\u66F4\u591A"))), React.createElement("div", {
			className: "ui container"
		  }, React.createElement("div", {
			className: "ui search fluid"
		  }, React.createElement("div", {
			className: "ui icon input fluid"
		  }, React.createElement("input", {
			className: "prompt",
			type: "text",
			placeholder: ""
		  }), React.createElement("i", {
			className: "search icon"
		  })), React.createElement("div", {
			className: "results"
		  }))), React.createElement("div", {
			className: "ui bottom attached vertical pushable"
		  }, React.createElement("div", {
			className: "ui pusher column stackable grid container",
			style: {
			  'padding': '1em 0em 10em'
			}
		  }, React.createElement("div", {
			className: "eight wide column"
		  }, React.createElement("div", {
			className: "sub header"
		  }, "\u516C\u53F8\u8D44\u8BAF"), React.createElement("div", {
			className: "ui red raised segments"
		  }, React.createElement("a", {
			href: "javascript:void(0);"
		  }, React.createElement("div", {
			className: "ui segment"
		  }, React.createElement("div", {
			className: "ui grid"
		  }, React.createElement("div", {
			className: "thirteen wide column"
		  }, React.createElement("div", {
			className: "ui small header grey"
		  }, React.createElement("i", {
			className: "announcement icon"
		  }), React.createElement("div", {
			className: "content"
		  }, "\u516C\u544A"))), React.createElement("div", {
			className: "three wide column right aligned"
		  }, React.createElement("i", {
			className: "chevron right icon grey"
		  }))))), React.createElement("a", {
			href: "javascript:void(0);"
		  }, React.createElement("div", {
			className: "ui segment"
		  }, React.createElement("div", {
			className: "ui grid"
		  }, React.createElement("div", {
			className: "thirteen wide column"
		  }, React.createElement("div", {
			className: "ui small header grey"
		  }, React.createElement("i", {
			className: "grid layout icon"
		  }), React.createElement("div", {
			className: "content"
		  }, "MES \u673A\u53F0\u5B9E\u65F6\u6570\u636E"))), React.createElement("div", {
			className: "three wide column"
		  })))))), React.createElement("div", {
			className: "eight wide column"
		  }, React.createElement("div", {
			className: "sub header"
		  }, "\u8BBE\u5B9A"), React.createElement("div", {
			className: "ui red raised loading segments"
		  }, React.createElement("a", {
			href: "javascript:void(0);"
		  }, React.createElement("div", {
			className: "ui segment",
			onClick: this.goSecondPage.bind(this)
		  }, React.createElement("div", {
			className: "ui grid"
		  }, React.createElement("div", {
			className: "thirteen wide column"
		  }, React.createElement("div", {
			className: "ui small header grey"
		  }, React.createElement("i", {
			className: "cloud download icon"
		  }), React.createElement("div", {
			className: "content"
		  }, "\u6253\u5370\u673A\u72B6\u6001"))), React.createElement("div", {
			className: "three wide column right aligned"
		  }, React.createElement("i", {
			className: "chevron right icon grey"
		  }))))))), React.createElement("div", {
			className: "eight wide column"
		  }, React.createElement("div", {
			className: "sub header"
		  }, "\u7CFB\u7EDF"), React.createElement("div", {
			className: "ui red raised loading segments"
		  }, React.createElement("a", {
			href: "javascript:void(0);"
		  }, React.createElement("div", {
			className: "ui segment",
			onClick: e => this.goHGXSystem(e)
		  }, React.createElement("div", {
			className: "ui grid"
		  }, React.createElement("div", {
			className: "thirteen wide column"
		  }, React.createElement("div", {
			className: "ui small header grey"
		  }, React.createElement("i", {
			className: "star icon"
		  }), React.createElement("div", {
			className: "content"
		  }, "\u540E\u5DE5\u5E8F\u7CFB\u7EDF"))), React.createElement("div", {
			className: "three wide column"
		  })))))), React.createElement("div", {
			className: "eight wide column"
		  }, React.createElement("div", {
			className: "sub header"
		  }, "\u4E2A\u4EBA"), React.createElement("div", {
			className: "ui red raised loading segments"
		  }, React.createElement("a", {
			href: "javascript:void(0);"
		  }, React.createElement("div", {
			className: "ui segment",
			onClick: this.YjPage.bind(this)
		  }, React.createElement("div", {
			className: "ui grid"
		  }, React.createElement("div", {
			className: "thirteen wide column"
		  }, React.createElement("div", {
			className: "ui small header grey"
		  }, React.createElement("i", {
			className: "align justify icon"
		  }), React.createElement("div", {
			className: "content"
		  }, "\u63A8\u9001\u901A\u77E5"))), React.createElement("div", {
			className: "three wide column"
		  })))), React.createElement("a", {
			href: "javascript:void(0);"
		  }, React.createElement("div", {
			className: "ui segment"
		  }, React.createElement("div", {
			className: "ui grid"
		  }, React.createElement("div", {
			className: "thirteen wide column"
		  }, React.createElement("div", {
			className: "ui small header grey",
			onClick: this.Logout
		  }, React.createElement("i", {
			className: "sign-in alternate icon"
		  }), React.createElement("div", {
			className: "content"
		  }, "\u9000\u51FA\u767B\u9646"))), React.createElement("div", {
			className: "three wide column right aligned"
		  })))))))));
		} else {
		  return React.createElement(Redirect, {
			to: '/' + this.state.topage
		  });
		}
	  } else {
		console.log(321, this.state.topage);
		return React.createElement(Redirect, {
		  to: "/login"
		});
	  }
	}
  
  }
  
  ; //yj页面
  
  class YjPage extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		initCompleted: false
	  };
	  this._onBack = this._onBack.bind(this);
	}
  
	componentWillMount() {}
  
	componentDidMount() {
	  if (window.currentUser.workno != 180955) {
		this.submit();
	  }
	}
  
	componentWillUnmount() {}
  
	componentDidUpdate() {}
  
	_onBack() {
	  this.setState({
		initCompleted: true
	  });
	}
  
	submit() {
	  if (window.currentUser.workno == 180955) {
		var start_time = moment($('.开始时间_input').val()).format('YYYY-MM-DD hh:mm:ss');
		var end_time = moment($('.结束时间_input').val()).format('YYYY-MM-DD hh:mm:ss');
	  } else {
		var end_time = moment().format('YYYY-MM-DD hh:mm:ss');
		var start_time = moment((moment().unix() - 604800) * 1000).format('YYYY-MM-DD hh:mm:ss');
	  }
  
	  var post_data = {
		"start_time": start_time,
		"end_time": end_time
	  };
	  var html = '';
	  $.post('https://www.kenta.cn/yangjun/jpush_laravel/public/api/Jpush/get_all_jpush', post_data, function (data) {
		for (let i in data) {
		  html += '<div class="item" style="margin:8px auto;border-bottom:1px solid #d4d4d5;"><i class="comment alternate icon" style="width:15%;text-align:center;display:inline-block;"></i><div class="content" style="width: 80%;display: inline-block;"><a class="header" style="font-size:13px;">' + data[i]['title'] + '</a><div class="description" style="font-size:8px;">' + data[i]['content'] + '<span style="font-size:8px;float:right;color:#f33f3d;">' + data[i]['push_time'] + '</span></div></div></div>';
		}
  
		$('.result').html(html);
	  }); // fetch('https://www.kenta.cn/yangjun/jpush_laravel/public/api/Jpush/get_all_jpush', {
	  // 	method: 'POST',
	  // 	mode: 'no-cors',
	  // 	headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
	  // 	body: JSON.stringify(post_data),
	  // }).then(function(response) {
	  // 	console.log(response);
	  // });
	}
  
	render() {
	  if (!this.state.initCompleted) {
		return React.createElement("div", null, React.createElement("div", {
		  id: "toptest",
		  className: "ui sticky mainHeader inverted red segment",
		  style: {
			'border-radius': '0px',
			'padding': '1em 0px 1.1em'
		  }
		}, React.createElement("div", {
		  className: "ui container grid"
		}, React.createElement("div", {
		  className: "one wide column",
		  style: {
			"padding-left": "0px"
		  }
		}, React.createElement("a", {
		  href: "javascript:void(0);",
		  onClick: this._onBack
		}, React.createElement("i", {
		  className: "chevron left icon inverted"
		}))), React.createElement("div", {
		  className: "fourteen wide column"
		}, React.createElement("div", {
		  className: "ui small header centered inverted"
		}, "\u540E\u5DE5\u5E8F\u754C\u9762")), React.createElement("div", {
		  className: "one wide column",
		  style: {
			"padding-right": "0px"
		  }
		}))), React.createElement("div", {
		  className: "ui container"
		}, React.createElement("div", {
		  className: "ui segment",
		  id: "formwindow"
		}, React.createElement("div", {
		  id: "myloader",
		  className: "ui inverted dimmer"
		}, React.createElement("div", {
		  className: "ui text loader"
		}, "Loading")), React.createElement("div", {
		  className: "logo"
		}, React.createElement("a", {
		  href: "https://www.kenta.cn/app3",
		  title: "https://www.kenta.cn/app3"
		}, "https://www.kenta.cn/app3")), React.createElement("h3", {
		  className: "ui dividing header",
		  id: "formtitle",
		  style: {
			'display': 'inline-block'
		  }
		}, "\u63A8\u9001\u67E5\u8BE2", window.currentUser.workno != 180955 ? React.createElement("p", {
		  style: {
			'color': '#bababc',
			'display': 'inline-block',
			'font-size': '14px',
			'font-weight': 'normal'
		  }
		}, "(\u8FD1\u4E03\u5929)") : React.createElement("p", {
		  style: {
			'color': '#bababc',
			'display': 'inline-block',
			'font-size': '14px',
			'font-weight': 'normal'
		  }
		}, "(\u65F6\u95F4\u9009\u62E9)")), React.createElement("div", {
		  className: "contain_yj"
		}, React.createElement("div", {
		  id: "display"
		}, window.currentUser.workno == 180955 ? React.createElement("div", {
		  className: "ui form first segment"
		}, React.createElement("div", {
		  className: "field"
		}, React.createElement("label", null, "\u5F00\u59CB\u65F6\u95F4*"), React.createElement("input", {
		  type: "date",
		  className: "\u5F00\u59CB\u65F6\u95F4_input"
		}), React.createElement("label", null, "\u7ED3\u675F\u65F6\u95F4*"), React.createElement("input", {
		  type: "date",
		  className: "\u7ED3\u675F\u65F6\u95F4_input"
		})), React.createElement("div", {
		  className: "fluid ui submit button",
		  onClick: this.submit
		}, "\u63D0\u4EA4"), React.createElement("div", {
		  className: "result"
		})) : React.createElement("div", {
		  className: "result"
		}, React.createElement("div", {
		  className: "ui segment",
		  style: {
			'height': '100px'
		  }
		}, React.createElement("div", {
		  className: "ui active inverted dimmer"
		}, React.createElement("div", {
		  className: "ui mini text loader"
		}, "\u52A0\u8F7D\u4E2D...")))))))));
	  } else {
		return React.createElement(Redirect, {
		  to: "/more"
		});
	  }
	}
  
  }
  
  ; // 次页
  
  class HgxPage extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		initCompleted: false
	  };
	  this._onBack = this._onBack.bind(this);
	}
  
	componentWillMount() {}
  
	componentDidMount() {
	  var mysrc = window.cordova ? window.cordova.file.cacheDirectory : '';
	  console.log(55, window.cordova, mysrc);
	  $.getScript(mysrc + "script/" + globalData.menu_page[globalid], function () {
		//加载test.js,成功后，并执行回调函数
		console.log("加载js文件", globalid);
		showformtemplate(globalid);
	  });
	  console.log(globalData.menu_pageid);
	}
  
	componentWillUnmount() {
	  //销毁
	  console.log('销毁');
	}
  
	componentDidUpdate() {}
  
	_onBack() {
	  $("script[src='script/" + globalData.menu_page[globalid] + "']").remove();
	  this.setState({
		initCompleted: true
	  });
	}
  
	getCamera() {// window.plugins.GMVBarcodeScanner.scan({}, function(err, result) { 
	  // 	//Handle Errors
	  // 	if(err) return;
	  // 	//Do something with the data.
	  // 	alert(result);
	  //  });
	}
  
	render() {
	  var _this = this;
  
	  if (this.state.initCompleted == false) {
		return React.createElement("div", null, React.createElement("div", {
		  id: "toptest",
		  className: "ui sticky mainHeader inverted red segment",
		  style: {
			'borderRadius': '0px',
			'padding': '1em 0 1.1em 0'
		  }
		}, React.createElement("div", {
		  className: "ui container grid"
		}, React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-left': '0px'
		  }
		}, React.createElement("a", {
		  href: "javascript:void(0);",
		  onClick: this._onBack
		}, React.createElement("i", {
		  className: "chevron left icon inverted"
		}))), React.createElement("div", {
		  className: "fourteen wide column"
		}, React.createElement("div", {
		  className: "ui small header centered inverted",
		  dangerouslySetInnerHTML: {
			__html: '后工序界面'
		  }
		})), React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-right': '0px'
		  },
		  onClick: this.getCamera
		}))), React.createElement("div", {
		  className: "ui container"
		}, React.createElement("div", {
		  className: "ui segment",
		  id: "formwindow"
		}, React.createElement("div", {
		  id: "myloader",
		  className: "ui inverted dimmer"
		}, React.createElement("div", {
		  className: "ui text loader"
		}, "Loading")), React.createElement("div", {
		  className: "logo"
		}, React.createElement("a", {
		  href: "https://www.kenta.cn/app3",
		  title: "https://www.kenta.cn/app3",
		  tabindex: "-1"
		}, "https://www.kenta.cn/app3")), React.createElement("h3", {
		  className: "ui dividing header",
		  id: "formtitle"
		}), React.createElement("h5", {
		  className: "ui dividing header",
		  id: "formdescription"
		}), React.createElement("div", {
		  id: "display"
		}))));
	  } else {
		return React.createElement(Redirect, {
		  to: "/hgxsystem"
		});
	  }
	}
  
  }
  
  ;
  
  class TagsearchScreen extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		initCompleted: false,
		zc: [],
		output: '',
		msg: {},
		taginfo: ''
	  };
	  this._onBack = this._onBack.bind(this);
	  this._search = this._search.bind(this);
	  this._onkeydown = this._onkeydown.bind(this);
	  this._empty = this._empty.bind(this);
	}
  
	componentWillMount() {
	  var _this = this;
  
	  $.get('https://www.kenta.cn:8893/type=getdata?dataname=后工序总MO列表', function (response) {
		_this.setState({
		  msg: {
			后工序总MO列表: response
		  }
		});
	  }, 'json');
	}
  
	componentDidMount() {}
  
	componentWillUnmount() {
	  //销毁
	  console.log('销毁');
	}
  
	_search() {
	  var tag = $('#tag').val();
	  var zc = [],
		  displayData = [];
  
	  var selected = _.filter(this.state.msg.后工序总MO列表, {
		领料单号: {
		  最小包装标签: [{
			物料标签号: tag
		  }]
		}
	  })[0];
  
	  if (selected == undefined) {
		alert('标签未在生产!');
	  } else {
		zc = selected.制程;
		displayData = selected.小标签流信息[tag] ? selected.小标签流信息[tag] : [];
	  }
  
	  var output = _.orderBy(displayData, ['detailTime'], ['desc']); //console.log(displayData[0],output[0]);
  
  
	  this.setState({
		zc: zc,
		output: output,
		taginfo: selected.领料单号.标签状态[tag]
	  });
	}
  
	findNext(item, arr, zc) {
	  var html = '';
  
	  if (item.detailType == '重工报工') {
		//往前找 第一个非'重工'开头的item作为判断
		var anotherItem = '';
  
		_.forEach(arr, function (value) {
		  if (value.detailType.indexOf('重工') == -1) {
			anotherItem = value;
			return false;
		  }
		});
  
		if (anotherItem != '') {
		  return findNext(anotherItem, arr, zc);
		} else {
		  html = React.createElement("p", null, "\u4E0B\u4E00\u6B65:\u5DE5\u5E8F1\u2014\u2014", zc[0].制程代号, "\u2014\u2014", zc[0].制程名称, " \u5F85\u6295\u6599");
		}
	  } else if (['投料', '恢复', '重工投料', '重工恢复'].indexOf(item.detailType) != -1) {
		var myzc = _.filter(zc, {
		  制程代号: item.工序代号
		})[0];
  
		html = React.createElement("p", null, "\u4E0B\u4E00\u6B65:\u5DE5\u5E8F", myzc.工序顺序, "\u2014\u2014", myzc.制程代号, "\u2014\u2014", myzc.制程名称, " \u5C06\u5728", item.桌号, "\u62A5\u5DE5");
	  } else if (['暂停', '重工暂停'].indexOf(item.detailType) != -1) {
		var myzc = _.filter(zc, {
		  制程代号: item.工序代号
		})[0];
  
		html = React.createElement("p", null, "\u4E0B\u4E00\u6B65:\u5DE5\u5E8F", myzc.工序顺序, "\u2014\u2014", myzc.制程代号, "\u2014\u2014", myzc.制程名称, " \u5C06\u5728", item.桌号, "\u6062\u590D\u4E0A\u673A");
	  } else if (item.detailType == 'QC') {
		if (item.检测结果 == 'NG') {
		  var myzc = _.filter(zc, {
			制程代号: item.返工工序代号
		  })[0];
  
		  html = React.createElement("p", null, "\u4E0B\u4E00\u6B65:\u5DE5\u5E8F", myzc.工序顺序, "\u2014\u2014", myzc.制程代号, "\u2014\u2014", myzc.制程名称, " \u5373\u5C06\u8FD4\u5DE5");
		} else {
		  html = React.createElement("p", null, "\u4E0B\u4E00\u6B65:\u5F85\u5305\u88C5");
		}
	  } else if (['报工', '跳工序'].indexOf(item.detailType) != -1) {
		//如果报工/跳工序的是最后一道工序 即待QC
		if (item.工序代号 == zc[zc.length - 1].制程代号) {
		  html = React.createElement("p", null, "\u4E0B\u4E00\u6B65:\u5F85QC");
		} else {
		  //否则 即将下道工序投料
		  var nextzc = zc[_.findIndex(zc, ['制程代号', 工序代号]) + 1];
		  html = React.createElement("p", null, "\u4E0B\u4E00\u6B65:\u5DE5\u5E8F", nextzc.工序顺序, "\u2014\u2014", nextzc.制程代号, "\u2014\u2014", nextzc.制程名称, " \u5F85\u6295\u6599");
		}
	  } else if (item.detailType == '包装') {//结束
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
	  this.setState({
		output: ''
	  });
	}
  
	_onBack() {
	  $("script[src='script/" + globalData.menu_page[globalid] + "']").remove();
	  this.setState({
		initCompleted: true
	  });
	}
  
	render() {
	  if (this.state.initCompleted == false) {
		var html_process = [],
			html_taginfo = [],
			html_zc = [];
		var zc = this.state.zc;
		var taginfo = this.state.taginfo;
		var output = this.state.output;
  
		if (output == '') {
		  html_taginfo.push(React.createElement("div", {
			className: "ui red segment"
		  }, React.createElement("p", null, "\u65E0\u8BE5\u6807\u7B7E\u57FA\u672C\u4FE1\u606F!")));
		  html_process.push(React.createElement("p", null, "\u65E0\u8BE5\u6807\u7B7E\u6D41\u4FE1\u606F!"));
		} else {
		  html_taginfo.push(React.createElement("div", {
			className: "ui horizontal segments"
		  }, React.createElement("div", {
			className: "ui red segment"
		  }, React.createElement("p", {
			style: {
			  'font-size': 'x-large'
			}
		  }, "\u6807\u7B7E\u53F7:", taginfo.物料标签号), React.createElement("p", null, "QC NG\u6B21\u6578:0")), React.createElement("div", {
			className: "ui red right aligned segment"
		  }, React.createElement("p", {
			style: {
			  'font-size': 'x-large'
			}
		  }, "\u5B9E\u9645\u6570\u91CF: ", taginfo.剩余数量), React.createElement("p", null, "\u5305\u89C4\u6570: ", taginfo.包规数), React.createElement("p", null, "\u4E0D\u826F\u54C1\u6570: ", taginfo.不良品数), React.createElement("p", null, "\u5DF2\u5305\u88C5\u6570: ", taginfo.被包装数))));
  
		  if (output.length == 0) {//html_process.push(<p>下一步:工序1——{zc[0].制程代号}——{zc[0].制程名称} 待投料</p>);
		  } else {
			if (taginfo.生产计数[0].总计数 == 0) {
			  _.forEach(zc, function (value) {
				value.class = 'active step';
			  });
			} else if (taginfo.生产计数[0].总计数 == taginfo.生产计数[taginfo.生产计数.length - 1].总计数) {
			  _.forEach(zc, function (value) {
				value.class = 'completed step';
			  });
			} else {
			  zc[0].class = 'completed step';
  
			  _.forEach(zc, function (value, index) {
				if (taginfo.生产计数[index].总计数 < taginfo.生产计数[0].总计数) {
				  value.class = 'active step';
				} else {
				  value.class = 'completed step';
				}
			  });
			}
  
			html_zc.push(React.createElement("div", {
			  className: "ui segment"
			}, React.createElement("p", null, "\u6807\u51C6\u6D41\u7A0B:"), React.createElement("div", {
			  className: "ui ordered top attached mini steps"
			}, _.map(zc, function (value) {
			  var tempTime = moment.duration(_.round(1 / (value.标准产能 / 11 / 60 / 60 / 1000), 2) * taginfo.剩余数量);
			  var needtime = tempTime.hours() + '小时' + tempTime.minutes() + '分钟';
			  return React.createElement("div", {
				className: value.class
			  }, React.createElement("div", {
				className: "content"
			  }, React.createElement("div", {
				className: "title"
			  }, value.制程名称, "(", value.制程代号, ")"), React.createElement("div", {
				className: "description"
			  }, "\u6807\u51C6\u4EA7\u80FD: ", _.round(value.标准产能, 2), " | \u9884\u8BA1\u9700\u65F6: ", needtime)));
			})))); //html_process.push(this.findNext(output[0],output,zc));          
  
			_.map(output, function (value, index) {
			  var no = output.length - index;
  
			  if (['投料', '报工', '暂停', '恢复', '重工投料', '重工报工', '重工暂停', '重工恢复'].indexOf(value.detailType) != -1) {
				var myzc = _.filter(zc, {
				  制程代号: value.工序代号
				})[0];
  
				var user = value.user ? '线长' + value.user.real_name + '(' + value.user.workno + ')' : '';
				html_process.push(React.createElement("span", null, React.createElement("h6", {
				  className: "ui header"
				}, React.createElement("i", {
				  className: "calendar check outline icon"
				}), React.createElement("div", {
				  className: "content"
				}, no, ":", user, "\u5728", value.桌号, ", \u8FDB\u884C", myzc.制程名称, "(", myzc.制程代号, ")\u5DE5\u5E8F")), React.createElement("p", {
				  style: {
					'text-align': 'right'
				  }
				}, value.detailTime)));
			  }
  
			  if (value.detailType == '跳工序') {
				var myzc = _.filter(zc, {
				  制程代号: value.工序代号
				})[0];
  
				var user = value.user ? '线长' + value.user.real_name + '(' + value.user.workno + ')' : '';
				html_process.push(React.createElement("span", null, React.createElement("h6", {
				  className: "ui header"
				}, React.createElement("i", {
				  className: "calendar check outline icon"
				}), React.createElement("div", {
				  className: "content"
				}, no, ":", user, " \u8DF3\u8FC7\u4E86 ", myzc.制程名称, "(", myzc.制程代号, ")\u5DE5\u5E8F")), React.createElement("p", {
				  style: {
					'text-align': 'right'
				  }
				}, value.detailTime)));
			  }
  
			  if (value.detailType == 'QC') {
				if (value.检测结果 == 'NG') {
				  var myzc = _.filter(zc, {
					制程代号: value.返工工序代号
				  })[0];
  
				  var user = value.user ? '线长' + value.user.real_name + '(' + value.user.workno + ')' : '';
				  html_process.push(React.createElement("span", null, React.createElement("h6", {
					className: "ui header"
				  }, React.createElement("i", {
					className: "calendar check outline icon"
				  }), React.createElement("div", {
					className: "content"
				  }, no, ":", user, " QC\u2014\u2014NG\u81F3\u5DE5\u5E8F", myzc.工序顺序, "\u2014\u2014", myzc.制程代号, "\u2014\u2014", myzc.制程名称)), React.createElement("p", {
					style: {
					  'text-align': 'right'
					}
				  }, value.detailTime)));
				} else {
				  var user = value.user ? '线长' + value.user.real_name + '(' + value.user.workno + ')' : '';
				  html_process.push(React.createElement("span", null, React.createElement("h6", {
					className: "ui header"
				  }, React.createElement("i", {
					className: "calendar check outline icon"
				  }), React.createElement("div", {
					className: "content"
				  }, no, ":", user, " QC\u2014\u2014", value.检测结果)), React.createElement("p", {
					style: {
					  'text-align': 'right'
					}
				  }, value.detailTime)));
				}
			  }
  
			  if (value.detailType == '包装') {
				var user = value.user ? value.user.real_name + '(' + value.user.workno + ')' : '';
				html_process.push(React.createElement("span", null, React.createElement("h6", {
				  className: "ui header"
				}, React.createElement("i", {
				  className: "calendar check outline icon"
				}), React.createElement("div", {
				  className: "content"
				}, no, ":", user, "\u8FDB\u884C\u4E86\u5305\u88C5")), React.createElement("p", {
				  style: {
					'text-align': 'right'
				  }
				}, value.detailTime)));
			  }
			});
		  }
		}
  
		return React.createElement("div", null, React.createElement("div", {
		  id: "toptest",
		  className: "ui sticky mainHeader inverted red segment",
		  style: {
			'borderRadius': '0px',
			'padding': '1em 0 1.1em 0'
		  }
		}, React.createElement("div", {
		  className: "ui container grid"
		}, React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-left': '0px'
		  }
		}, React.createElement("a", {
		  href: "javascript:void(0);",
		  onClick: this._onBack
		}, React.createElement("i", {
		  className: "chevron left icon inverted"
		}))), React.createElement("div", {
		  className: "fourteen wide column"
		}, React.createElement("div", {
		  className: "ui small header centered inverted",
		  dangerouslySetInnerHTML: {
			__html: '后工序界面'
		  }
		})), React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-right': '0px'
		  },
		  onClick: this.getCamera
		}))), React.createElement("div", {
		  className: "ui container"
		}, React.createElement("div", {
		  className: "ui form segment"
		}, React.createElement("div", {
		  className: "field"
		}, React.createElement("label", null, "\u5F85\u67E5\u8BE2\u5C0F\u6807\u7B7E"), React.createElement("div", {
		  className: "ui action input"
		}, React.createElement("input", {
		  type: "text",
		  placeholder: "Search...",
		  id: "tag",
		  onKeyDown: this._onkeydown
		}), React.createElement("button", {
		  className: "ui button",
		  onClick: this._empty
		}, "\u6E05\u7A7A"))), React.createElement("div", {
		  className: "field"
		}, React.createElement("div", {
		  className: "ui raised segments"
		}, React.createElement("div", {
		  className: "ui segment"
		}, React.createElement("p", null, "\u6807\u7B7E\u57FA\u672C\u4FE1\u606F")), html_taginfo, html_zc), React.createElement("div", {
		  className: "ui raised segments"
		}, React.createElement("div", {
		  className: "ui segment"
		}, React.createElement("p", null, "\u6807\u7B7E\u6D41\u4FE1\u606F")), React.createElement("div", {
		  className: "ui red segment"
		}, html_process))))));
	  } else {
		return React.createElement(Redirect, {
		  to: "/more"
		});
	  }
	}
  
  }
  
  ;
  
  class SecondPage extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		initCompleted: false
	  };
	  this._onBack = this._onBack.bind(this);
	}
  
	componentWillMount() {}
  
	componentDidMount() {}
  
	componentWillUnmount() {
	  //销毁
	  console.log('销毁');
	}
  
	_onBack() {
	  this.setState({
		initCompleted: true,
		topage: 'more'
	  });
	}
  
	render() {
	  var _this = this;
  
	  if (this.state.initCompleted == false) {
		return React.createElement("div", null, React.createElement("div", {
		  id: "toptest",
		  className: "ui sticky mainHeader inverted red segment",
		  style: {
			'borderRadius': '0px',
			'padding': '1em 0 1.1em 0'
		  }
		}, React.createElement("div", {
		  className: "ui container grid"
		}, React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-left': '0px'
		  }
		}, React.createElement("a", {
		  href: "javascript:void(0);",
		  onClick: this._onBack
		}, React.createElement("i", {
		  className: "chevron left icon inverted"
		}))), React.createElement("div", {
		  className: "fourteen wide column"
		}, React.createElement("div", {
		  className: "ui small header centered inverted",
		  dangerouslySetInnerHTML: {
			__html: '打印机状态'
		  }
		})), React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-right': '0px'
		  }
		}))), React.createElement("div", {
		  className: "ui bottom attached vertical pushable"
		}, "\u6253\u5370\u673A\u72B6\u6001:", printStatus));
	  } else {
		return React.createElement(Redirect, {
		  to: '/' + this.state.topage
		});
	  }
	}
  
  }
  
  ;
  
  class HGXSystem extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		initCompleted: false
	  };
	  this.tagSearch = this.tagSearch.bind(this);
	  this._onBack = this._onBack.bind(this);
	}
  
	componentWillMount() {
	  globalDB.getItem('currentUser').then(function (value) {
		if (value != null) {
		  currentUser = value;
		  console.log(currentUser);
		}
	  }).catch(function (err) {
		// This code runs if there were any errors
		console.log(err);
	  });
	}
  
	componentDidMount() {}
  
	componentWillUnmount() {
	  //销毁
	  console.log('销毁');
	}
  
	YjPage() {
	  this.setState({
		initCompleted: true,
		topage: 'yjpage'
	  });
	}
  
	tagSearch() {
	  this.setState({
		initCompleted: true,
		topage: 'tagsearchscreen'
	  });
	}
  
	HgxPage(pageid) {
	  globalid = pageid;
	  console.log('globalid', globalid);
	  this.setState({
		initCompleted: true,
		topage: 'hgxscreen'
	  });
	}
  
	_onBack() {
	  $("script[src='script/" + globalData.menu_page[globalid] + "']").remove();
	  this.setState({
		initCompleted: true,
		topage: 'more'
	  });
	}
  
	render() {
	  var _this = this;
  
	  if (this.state.initCompleted == false) {
		return React.createElement("div", null, React.createElement("div", {
		  id: "toptest",
		  className: "ui sticky mainHeader inverted red segment",
		  style: {
			'borderRadius': '0px',
			'padding': '1em 0 1.1em 0'
		  }
		}, React.createElement("div", {
		  className: "ui container grid"
		}, React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-left': '0px'
		  }
		}, React.createElement("a", {
		  href: "javascript:void(0);",
		  onClick: this._onBack
		}, React.createElement("i", {
		  className: "chevron left icon inverted"
		}))), React.createElement("div", {
		  className: "fourteen wide column"
		}, React.createElement("div", {
		  className: "ui small header centered inverted",
		  dangerouslySetInnerHTML: {
			__html: '后工序系统'
		  }
		})), React.createElement("div", {
		  className: "one wide column",
		  style: {
			'padding-right': '0px'
		  }
		}))), React.createElement("div", {
		  className: "ui bottom attached vertical pushable"
		}, React.createElement("div", {
		  className: "ui pusher column stackable grid container",
		  style: {
			'padding': '1em 0em 10em'
		  }
		}, React.createElement("div", {
		  className: "eight wide column"
		}, React.createElement("div", {
		  className: "sub header"
		}, "\u7CFB\u7EDF\u5217\u8868"), React.createElement("div", {
		  className: "ui red raised segments"
		}, React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.小标签状态查询
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.tagSearch
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u5C0F\u6807\u7B7E\u72B6\u6001\u67E5\u8BE2"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.桌子制程匹配
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d28254871e7a243849213b0')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u684C\u5B50\u5236\u7A0B\u5339\u914D"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.桌子员工匹配
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d281b9471e7a243849213af')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u684C\u5B50\u5458\u5DE5\u5339\u914D"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.MO管理界面
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d3184f5e55fa25dac5760b9')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "MO\u751F\u4EA7\u7BA1\u7406"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.重工桌设置
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d27178478a9d03e1c5a8af1')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u91CD\u5DE5\u684C\u8BBE\u7F6E"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.手工包装
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d2547d24b98b53198177e8d')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u624B\u5DE5\u5305\u88C5"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.领料界面
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d25a4ba0e6cc83fa41c9519')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u9886\u6599\u754C\u9762"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.上机报工界面
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d280d3771e7a243849213ae')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u4E0A\u673A\u62A5\u5DE5\u754C\u9762"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.跳工序界面
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d284ffdbe727d23b4ec6666')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u8DF3\u5DE5\u5E8F\u754C\u9762"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.QC界面
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d27f9d171e7a243849213a9')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "QC\u754C\u9762"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.包装界面
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.HgxPage.bind(this, '5d270ceebaf2732984fb8549')
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u5305\u88C5\u754C\u9762"))), React.createElement("div", {
		  className: "three wide column"
		})))), React.createElement("a", {
		  href: "javascript:void(0);",
		  style: {
			"display": permissionObj.推送通知
		  }
		}, React.createElement("div", {
		  className: "ui segment",
		  onClick: this.YjPage.bind(this)
		}, React.createElement("div", {
		  className: "ui grid"
		}, React.createElement("div", {
		  className: "thirteen wide column"
		}, React.createElement("div", {
		  className: "ui small header grey"
		}, React.createElement("i", {
		  className: "align justify icon"
		}), React.createElement("div", {
		  className: "content"
		}, "\u63A8\u9001\u901A\u77E5"))), React.createElement("div", {
		  className: "three wide column"
		})))))))));
	  } else {
		return React.createElement(Redirect, {
		  to: '/' + this.state.topage
		});
	  }
	}
  
  }
  
  ; // 页内元件
  
  class MainMenu extends React.Component {
	render() {
	  return React.createElement("div", {
		className: "ui labeled icon red four item bottom fixed secondary pointing menu",
		style: {
		  'background': 'white'
		}
	  }, React.createElement(Link, {
		id: "MainMunu_Dashboard",
		className: "MainMenu item",
		to: "/dashboard"
	  }, React.createElement("i", {
		className: "home icon"
	  }), "\u5173\u6CE8"), React.createElement(Link, {
		id: "MainMunu_Project",
		className: "MainMenu item active",
		to: "/project"
	  }, React.createElement("i", {
		className: "unordered list icon"
	  }), "\u9879\u76EE\u5217\u8868"), React.createElement(Link, {
		id: "MainMenu_Profile",
		className: "MainMenu item",
		to: "/profile"
	  }, React.createElement("i", {
		className: "user icon"
	  }), "\u4E2A\u4EBA\u4E2D\u5FC3"), React.createElement(Link, {
		id: "MainMunu_More",
		className: "MainMenu item",
		to: "/more"
	  }, React.createElement("i", {
		className: "ellipsis horizontal icon"
	  }), "\u66F4\u591A"));
	}
  
  }
  
  ; // App 运行入口
  
  class KentaApp extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {};
	}
  
	componentDidMount() {}
  
	render() {
	  return React.createElement(HashRouter, {
		basename: KentaConstants.RELATIVE_PATH
	  }, React.createElement("div", null, React.createElement(Route, {
		exact: true,
		path: "/",
		component: initializeElement
	  }), React.createElement(Route, {
		path: "/landing",
		component: LandingPage
	  }), React.createElement(Route, {
		path: "/login",
		component: Login
	  }), React.createElement(Route, {
		path: "/dashboard",
		component: Dashboard
	  }), React.createElement(Route, {
		path: "/dashboard",
		component: MainMenu
	  }), React.createElement(Route, {
		path: "/project",
		component: Project
	  }), React.createElement(Route, {
		path: "/project",
		component: MainMenu
	  }), React.createElement(Route, {
		path: "/profile",
		component: Profile
	  }), React.createElement(Route, {
		path: "/profile",
		component: MainMenu
	  }), React.createElement(Route, {
		path: "/more",
		component: More
	  }), React.createElement(Route, {
		path: "/more",
		component: MainMenu
	  }), React.createElement(Route, {
		path: "/hgxscreen",
		component: HgxPage
	  }), React.createElement(Route, {
		path: "/tagsearchscreen",
		component: TagsearchScreen
	  }), React.createElement(Route, {
		path: "/hgxsystem",
		component: HGXSystem
	  }), React.createElement(Route, {
		path: "/secondpage",
		component: SecondPage
	  }), React.createElement(Route, {
		path: "/yjpage",
		component: YjPage
	  })));
	}
  
  }
  
  ReactDOM.render(React.createElement(KentaApp, null), document.getElementById("kenta-app"));