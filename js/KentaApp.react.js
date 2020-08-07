var {
  BrowserRouter,
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
window.contactDB = localforage.createInstance({
  name: "contact_db"
});
window.projectsDB = localforage.createInstance({
  name: "projects_db"
});
window.messagesDB = localforage.createInstance({
  name: "messages_db"
});
window.affichesDB = localforage.createInstance({
  name: "affiches_db"
});
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
window.personal_id = [];
window.globalData = {
  KPI: [],
  AdditionalScore: [],
  ManageScore: [],
  Project: '',
  ChatToBottom: false,
  type: '',
  editData: {},
  editorcreate: '',
  cangopromore: true,
  pid_obj: {},
  iframeurl: '',
  Children: [],
  childrenrequired: true //用来表示是否需要getChildren 默认true需要 获取完后改为false 以下3种情况重置——1.从projectmore back 23.projectcreateoredit

};
window.FormDisplay = {}; //用来保存emit时候存储的数据(解决removeListener不能绑定参数的问题)

window.emitterChannel = {
  AJAX_MSG: '',
  To_KPIDetail: '',
  sendmsg: {
    url: '',
    filename: '',
    size: ''
  }
};
window.tmpSelectedMembers = [];
window.tmpConditions = [];
window.auditContacts = [];
window.passauditer = [];
var EvaluateStandard = {};
var singlemsg_poll_timer;

function ProjectApply(project, typeid, currentUser) {
  if (typeid == 1) {}
}

var KPICardItem_timer; //内外网变量 true=内网 false=外网

var greateck_network = false;
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

function idSearch(id) {
  window.dataDB = localforage.createInstance({
    name: 'data_DB'
  });
  var submitData = new oauthSubmitData('idsearch', dataDB, OAuthParameters);
  var message = {
    "method": "GET",
    "actionURL": "https://www.kenta.cn/app3/wp-json/form/v2/item/" + id,
    "submitJSON": {}
  };
  submitData.OAuthSubmit(message);
}

function dataPost(data) {
  var submitData2 = new oauthSubmitData('datapost', '', OAuthParameters);
  var message = {
    "method": "POST",
    "actionURL": "https://www.kenta.cn/app3/wp-json/form/v2/create",
    'action': 'datapost',
    "submitJSON": data
  };
  submitData2.OAuthSubmit(message);
}

function WriteHtml(json) {
  var _this = this;

  console.log('json', json);
  var html = json.map(function (result, indexrk) {
    var key = 'key_' + indexrk;

    if (result.type == 'input') {
      var name = 'input_' + key;
      return React.createElement("span", null, React.createElement("div", {
        className: "ui pointing below label"
      }, React.createElement("label", {
        for: "formtype"
      }, result.thead)), React.createElement("div", {
        className: "field"
      }, React.createElement("input", {
        type: "text",
        id: key,
        name: name
      })), React.createElement("br", null));
    }

    if (result.type == 'textarea') {
      var name = 'textarea_' + key;
      return React.createElement("span", null, React.createElement("div", {
        className: "ui pointing below label"
      }, React.createElement("label", {
        for: "formtype"
      }, result.thead)), React.createElement("div", {
        className: "field"
      }, React.createElement("textarea", {
        id: key,
        name: name
      })), React.createElement("br", null));
    }

    if (result.type == 'date') {
      var name = 'bday_' + key;
      return React.createElement("span", null, React.createElement("div", {
        className: "ui pointing below label"
      }, React.createElement("label", {
        for: "formtype"
      }, result.thead)), React.createElement("div", {
        className: "field"
      }, React.createElement("input", {
        type: "date",
        id: key,
        name: name
      })), React.createElement("br", null));
    }

    if (result.type == 'multiselect') {
      var staffclass = 'field';
      var staffname = 'staffs_' + key;
      var deptname = 'depts_' + key;

      if (result.category == '部门') {
        staffclass = 'field none';
        staffname = '';
      }

      if (result.category == '部门' || result.category == '人员') {
        var deptuiindex = 'ui fluid search selection dropdown deptLevel multiple ' + key;
        var staffuiindex = 'ui fluid search selection dropdown staffLevel multiple ' + key;
        return React.createElement("div", null, React.createElement("div", {
          className: "ui pointing below label"
        }, React.createElement("label", {
          for: "formtype"
        }, result.thead)), React.createElement("br", null), React.createElement("form", {
          className: "ui form segment"
        }, React.createElement("h4", {
          className: "ui dividing header"
        }, result.thead), React.createElement("div", {
          className: "field"
        }, React.createElement("div", {
          className: "two fields"
        }, React.createElement("div", {
          className: "field"
        }, React.createElement("label", null, "1. \u9009\u62E9\u90E8\u95E8"), React.createElement("div", {
          className: deptuiindex
        }, React.createElement("input", {
          type: "hidden",
          name: deptname
        }), React.createElement("i", {
          className: "dropdown icon"
        }), React.createElement("div", {
          className: "default text"
        }, "\u90E8\u95E8"), React.createElement("div", {
          className: "menu"
        }))), React.createElement("div", {
          className: staffclass
        }, React.createElement("label", null, "2. \u9009\u62E9\u4EBA\u5458"), React.createElement("div", {
          className: staffuiindex
        }, React.createElement("input", {
          type: "hidden",
          name: staffname
        }), React.createElement("i", {
          className: "dropdown icon"
        }), React.createElement("div", {
          className: "default text"
        }, "\u4EBA\u5458"), React.createElement("div", {
          className: "menu"
        })))))), React.createElement("br", null));
      } else if (result.category == '职位') {
        var name = 'position_' + key;
        var positionuiindex = 'ui fluid search selection dropdown position multiple ' + key;
        return React.createElement("div", null, React.createElement("div", {
          className: "ui pointing below label"
        }, React.createElement("label", {
          for: "formtype"
        }, result.thead)), React.createElement("br", null), React.createElement("form", {
          className: "ui form segment"
        }, React.createElement("h4", {
          className: "ui dividing header"
        }, result.thead), React.createElement("div", {
          className: "field"
        }, React.createElement("div", {
          className: "two fields"
        }, React.createElement("div", {
          className: "field"
        }, React.createElement("label", null, " \u8BF7\u9009\u62E9\u804C\u4F4D "), React.createElement("div", {
          className: positionuiindex
        }, React.createElement("input", {
          type: "hidden",
          name: name
        }), React.createElement("i", {
          className: "dropdown icon"
        }), React.createElement("div", {
          className: "default text"
        }, "\u804C\u4F4D"), React.createElement("div", {
          className: "menu"
        })))))), React.createElement("br", null));
      } else {
        var diyuiindex = 'ui fluid dropdown multiselect ' + key;
        var name = 'diy_' + key;

        if (result.specialID == 10788) {
          return React.createElement("span", null, React.createElement("div", {
            className: "ui pointing below label"
          }, React.createElement("label", {
            for: "formtype"
          }, "\u672A\u8BC4\u6E05\u5355")), React.createElement("div", {
            className: "ui fluid multiple search selection dropdown multiselect " + key
          }, React.createElement("input", {
            type: "hidden",
            name: name,
            className: name
          }), React.createElement("i", {
            className: "dropdown icon"
          }), React.createElement("div", {
            className: "default text"
          }, "\u9009\u62E9"), React.createElement("div", {
            className: "menu"
          })), React.createElement("br", null), React.createElement("div", {
            className: "ui pointing below label"
          }, React.createElement("label", {
            for: "formtype"
          }, "\u5DF2\u8BC4\u6E05\u5355")), React.createElement("div", {
            className: "ui fluid multiple search selection dropdown multiselect key_managed"
          }, React.createElement("input", {
            type: "hidden",
            name: "diy_key_managed",
            className: "diy_key_managed"
          }), React.createElement("i", {
            className: "dropdown icon"
          }), React.createElement("div", {
            className: "default text"
          }, "\u9009\u62E9"), React.createElement("div", {
            className: "menu"
          })), React.createElement("br", null));
        } else {
          return React.createElement("span", null, React.createElement("div", {
            className: "ui pointing below label"
          }, React.createElement("label", {
            for: "formtype"
          }, result.thead)), React.createElement("div", {
            className: "ui fluid multiple search selection dropdown multiselect " + key
          }, React.createElement("input", {
            type: "hidden",
            name: name,
            className: name
          }), React.createElement("i", {
            className: "dropdown icon"
          }), React.createElement("div", {
            className: "default text"
          }, "\u9009\u62E9"), React.createElement("div", {
            className: "menu"
          })), React.createElement("br", null));
        }

        return React.createElement("span", null, React.createElement("div", {
          className: "ui pointing below label"
        }, React.createElement("label", {
          for: "formtype"
        }, result.thead)), React.createElement("div", {
          className: "ui fluid multiple search selection dropdown multiselect " + key
        }, React.createElement("input", {
          type: "hidden",
          name: name,
          className: name
        }), React.createElement("i", {
          className: "dropdown icon"
        }), React.createElement("div", {
          className: "default text"
        }, "\u9009\u62E9"), React.createElement("div", {
          className: "menu"
        })), React.createElement("br", null));
      }
    }
  });
  return html;
}

function getAuditToUser(EvaluateStandard, username) {
  //console.log(1122,EvaluateStandard,username);
  var newobj = {};
  var AuditToUser = {};

  var tmp = _.groupBy(alluser_hrinfo, function (n) {
    return n.rolename;
  });

  var html = '';
  alluser_hrinfo.map(function (value) {
    var auditArr = [];

    if (EvaluateStandard[value.rolename] != undefined) {
      for (var key in EvaluateStandard[value.rolename]) {
        if (typeof EvaluateStandard[value.rolename][key] != "object") {
          if (tmp[key] == undefined) {} else {
            if (tmp[key].length > 1) {
              tmp[key].map(function (result) {
                auditArr.push(result.username);
              });
            } else {
              auditArr.push(tmp[key][0].username);
            }
          }
        } else {
          if (key == value.group) {
            for (var rkey in EvaluateStandard[value.rolename][key]) {
              if (tmp[rkey] == undefined) {} else {
                if (tmp[rkey].length > 1) {
                  tmp[rkey].map(function (result) {
                    auditArr.push(result.username);
                  });
                } else {
                  auditArr.push(tmp[rkey][0].username);
                }
              }
            }
          }
        }
      }
    }

    newobj[value.username] = auditArr;
  });

  for (var key in newobj) {
    if (newobj[key].length > 0) {
      newobj[key].map(function (result) {
        AuditToUser[result] = AuditToUser[result] == undefined ? [] : AuditToUser[result];
        AuditToUser[result].push(key);
      });
    }
  }

  return AuditToUser[username];
}
/**
 * +-----------------------------------------------------------
 * | Hub Component（程序入口）
 * +-----------------------------------------------------------
 */
//数据处理元件


var initializeElement = React.createClass({
  displayName: "initializeElement",

  componentDidMount() {
    var _this = this;

    setTimeout(function () {
      emitter.emit('page_to_project');
    }, 3000);
    this.initialData();
    emitter.addListener('new_user', function (data) {
      _this.initialData();
    });
  },

  initialData() {
    var _this = this;

    _downloadContact();

    globalDB.getItem('currentUser').then(function (result) {
      if (result != null) {
        currentUser = result;
      }

      if (currentUser.user_name != '') {
        var url = 'https://www.kenta.cn/app3/wp-json/addon/v2/latestUpdateTime/category_name=project&' + currentUser.user_name;
        projectTimestamp(url);
        emitter.addListener('AJAX_SUCCESS', function (data) {
          _this.getProjects();
        });
        emitter.addListener('AJAX_Affiche', function (data) {
          _this.getAffiches();
        });
        getWihteList();
        requireKPI();
        AdditionalScore();
        ManageScore();
        emitterkpi.addListener('RequireKPI', function (data) {
          globalData.KPI = data;
          emitterkpi.emit('updateKPI');
        });
        emitterkpi.addListener('AdditionalScore', function (data) {
          globalData.AdditionalScore = data;
          emitterkpi.emit('updateAdditionalScore');
        });
        emitterkpi.addListener('ManageScore', function (classifiedArray) {
          globalData.ManageScore = classifiedArray;
        });
        emitter.emit('logintoproject');
      }
    });
  },

  getProjects() {
    var _this = this;

    var url_pm = 'https://www.kenta.cn/app3/wp-json/addon/v2/metaQuery?pm=' + currentUser.user_name;
    var url_member = 'https://www.kenta.cn/app3/wp-json/addon/v2/metaQuery?member=' + currentUser.user_name;
    var url_organizer = 'https://www.kenta.cn/app3/wp-json/addon/v2/metaQuery?organizer=' + currentUser.user_name;
    $.get(url_pm, function (data) {
      data = data == null ? [] : data;
      var arr = [];
      data.map(function (result) {
        if (result.project_meta.AD_group_name == undefined) {
          arr.push(result);
        }
      });
      projectsDB.setItem('pm_projects', arr).then(function (value) {
        emitter.emit('pm_SUCCESS');
      });
    }, 'json');
    $.get(url_member, function (data) {
      data = data == null ? [] : data;
      var arr1 = [];
      var arr2 = [];
      data.map(function (result) {
        if (result.project_category[0].cat_ID == 8) {
          arr1.push(result);
        }

        if (result.project_category[0].cat_ID == 9) {
          arr2.push(result);
        }
      });
      projectsDB.setItem('member_projects', arr1).then(function () {
        emitter.emit('member_SUCCESS');
      });
      projectsDB.setItem('manage_groups', arr2).then(function () {
        emitter.emit('manage_SUCCESS');
      });
    }, 'json');
    $.get(url_organizer, function (data) {
      data = data == null ? [] : data;
      var arr = [];
      data.map(function (result) {
        if (result.project_meta.AD_group_name == undefined) {
          arr.push(result);
        }
      });
      projectsDB.setItem('og_projects', arr).then(function () {
        emitter.emit('og_SUCCESS');
      });
    }, 'json');
  },

  getAffiches() {
    var affiche_url = 'https://www.kenta.cn/app3/wp-json/wp/v2/posts?categories=2';
    $.get(affiche_url, function (data) {
      data = data == null ? [] : data;
      affichesDB.setItem('affiches', data).then(function () {
        setInterval(function () {
          emitter.emit('affiches_save');
        }, 5000);
      });
    }, 'json');
  },

  render() {
    return React.createElement("div", {
      name: "i am init div"
    }, React.createElement(Redirect, {
      to: "/landing"
    }));
  }

}); // 页面

var LandingPage = React.createClass({
  displayName: "LandingPage",

  getInitialState() {
    return {
      topage: '',
      initCompleted: false
    };
  },

  componentWillMount() {
    var _this = this;
  },

  componentDidMount() {
    var _this = this;

    emitter.addListener('page_to_project', function () {
      if (currentUser.login == false) {
        _this.setState({
          topage: '/login'
        });
      } else {
        _this.setState({
          topage: '/project'
        });
      }

      _this.setState({
        initCompleted: true
      });
    });
    $('.ui.image.centered').transition({
      animation: 'fade in',
      duration: '1s'
    });
  },

  render: function () {
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
});
var Login = React.createClass({
  displayName: "Login",

  getInitialState() {
    return {
      loginSuccess: false,
      initCompleted: false
    };
  },

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
          if (logindata == 'FALSE') {
            $('.ui.basic.modal.indexLogin').modal('show');
            $('#loginloading').removeClass();
          } else {
            if (logindata.status == 'error') {
              $('.ui.basic.modal.indexLogin').modal('show');
              return false;
            }

            console.log('logindata', logindata);
            var jsondetail = logindata.userDetail;
            var jsonmeta = logindata.userMeta.hr_info;

            if (contactDB == null) {
              contactDB = localforage.createInstance({
                name: "contact_" + jsondetail.data.user_login + "_db"
              });
            }

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
            
            /*	可能是Jpush的写法*/
            console.log("jpush_init:");
						var userNameAlias = { sequence: 1, alias: currentUser.user_name.replace(/\./, '_') }; // 用下划线替换 . ，当在PHP发送时也做相应的处理
						var userTagsArray = { sequence: 2, alias: currentUser.department};
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
							//window.plugins.jPushPlugin.setTagsWithAlias(userTagsArray, userNameAlias, function(e){alert('setTags' + JSON.stringify(e));});
							// console.log('setTags / Alias success, userTagsArray : ' + userTagsArray + ', userNameAlias : ' + userNameAlias);
						}else{
							console.log('setTags / Alias fail, userTagsArray : ' + userTagsArray + ', userNameAlias : ' + userNameAlias);
						};
            
            globalDB.setItem("currentUser", currentUser).then(function () {
              $.get('https://www.kenta.cn/app3/wp-admin/admin-ajax.php?action=logout', function (logoutdata) {
                _this.setState({
                  initCompleted: true
                });

                $('#loginloading').removeClass();
                emitter.emit('new_user', currentUser);
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
    emitter.addListener('logintoproject', this.Login_logintoproject);
  },

  componentWillUnmount() {
    //销毁
    emitter.removeListener('logintoproject', this.Login_logintoproject);
  },

  _onClick() {
    $('#loginloading').addClass('ui active inverted dimmer');
  },

  Login_logintoproject() {
    this.setState({
      initCompleted: true
    });
  },

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
      }, " 2016 KENTA Electronic Mfg.Co.,Ltd")))), React.createElement("div", {
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

});
var Dashboard = React.createClass({
  displayName: "Dashboard",

  getInitialState() {
    return {
      member_projects: [],
      msgs: [],
      affiches: [],
      clicked: false
    };
  },

  componentWillMount() {
    var _this = this;

    this.Dashboard_member_SUCCESS();
    this.Dashboard_affiches_save();
    messagesDB.getItem('msgs').then(function (result) {
      _this.setState({
        msgs: result
      });
    });
  },

  componentDidMount() {
    var _this = this;

    $('.MainMenu').removeClass('active');
    $('#MainMunu_Dashboard').addClass('active');
    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    });
    emitter.addListener('member_SUCCESS', this.Dashboard_member_SUCCESS);
    emitter.addListener('affiches_save', this.Dashboard_affiches_save);
    emitter.addListener('AJAX_MSG', this.Dashboard_AJAX_MSG_callback);
  },

  componentDidUpdate() {
    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    });
  },

  componentWillUnmount() {
    //销毁
    emitter.removeListener('member_SUCCESS', this.Dashboard_member_SUCCESS);
    emitter.removeListener('affiches_save', this.Dashboard_affiches_save);
    emitter.removeListener('AJAX_MSG', this.Dashboard_AJAX_MSG_callback);
  },

  Dashboard_AJAX_MSG_callback() {
    this.setState({
      msgs: emitterChannel.AJAX_MSG
    });
  },

  Dashboard_member_SUCCESS() {
    var _this = this;

    projectsDB.getItem('member_projects').then(function (result) {
      result = result == null ? [] : result;

      _this.setState({
        member_projects: result
      });

      var content = [];
      result.map(function (singlepj) {
        singlepj.description = singlepj.post_title + '(ID:' + singlepj.ID + ')';
        content.push(singlepj);
      });
      $('.ui.search.fordash').search({
        source: content,
        onSelect: function (data) {
          _this.goProjectMore(data);
        }
      });
    });
  },

  Dashboard_affiches_save() {
    var _this = this;

    affichesDB.getItem('affiches').then(function (result) {
      _this.setState({
        affiches: result
      });
    });
  },

  goProjectMore(data) {
    var _this = this;

    globalData.Project = data;
    globalData.ChatToBottom = true;

    if (globalData.cangopromore == true) {
      globalData.cangopromore = false;
      var url = "https://www.kenta.cn/app3/wp-json/form/v2/item/" + data.ID;
      var readusers = data.project_meta.readusers == undefined ? {} : data.project_meta.readusers;
      readusers[currentUser.user_name] = moment(moment().format("YYYY-MM-DDTHH:mm:ss"), moment.ISO_8601).add(8, 'hours').toISOString();
      var message = {
        "method": "PUT",
        "actionURL": url,
        "action": "projectread",
        "headerAttach": "\"Content-Type\":\"application/json\"",
        "submitJSON": {
          "username": currentUser.user_name,
          "readusers": readusers
        }
      };
      OAuthSubmit(message);
      this.setState({
        clicked: true
      });
    }
  },

  render() {
    var _this = this;

    var dash_projects = React.createElement(InitMsgElement, null);
    var dashs = [];

    if (this.state.member_projects.length > 0) {
      this.state.member_projects.map(function (result) {
        if (_this.state.msgs.hasOwnProperty(result.ID) == true) {
          result.lastmsgtime = new Date(_this.state.msgs[result.ID][_this.state.msgs[result.ID].length - 1].date).getTime();
        } else {
          result.lastmsgtime = 0;
        }

        dashs.push(result);
      });
      dashs.sort(function (a, b) {
        return b.lastmsgtime - a.lastmsgtime;
      });
    }

    dash_projects = dashs.map(function (result) {
      return React.createElement(NewCardItem, {
        cardinfo: result,
        msgs: _this.state.msgs
      });
    });

    if (this.state.clicked == false) {
      return React.createElement("div", null, React.createElement("div", {
        className: "ui sticky mainHeader inverted red segment",
        style: {
          'borderRadius': '0px'
        }
      }, React.createElement("div", {
        className: "ui container"
      }, React.createElement("div", {
        className: "ui small header centered inverted"
      }, "\u5173\u6CE8"))), React.createElement("div", {
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
      }, dash_projects))))));
    } else {
      return React.createElement(Redirect, {
        to: "/projectmore"
      });
    }
  }

});
var Project = React.createClass({
  displayName: "Project",

  getInitialState() {
    return {
      pm_projects: [],
      og_projects: [],
      member_projects: [],
      manage_groups: [],
      msgs: [],
      clicked: false
    };
  },

  componentWillMount() {
    var _this = this;

    var unreadcount = 0;
    this.Project_pm_SUCCESS();
    this.Project_member_SUCCESS();
    this.Project_manage_SUCCESS();
    this.Project_og_SUCCESS();
    messagesDB.getItem('msgs').then(function (result) {
      _this.setState({
        msgs: result
      });
    });
  },

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
    }); //转页效果

    /*$('.menu .item').tab({
    	onLoad: function(){
    		console.log('tab onLoad');
    		$('.card')
    		  .transition({
    		    animation : 'fade up in',
    		    duration : 800,
        		//interval  : 100,
        		allowRepeats : false,
    		    queue: false
    		  });
    		}
    	});
    */

    emitter.addListener('pm_SUCCESS', this.Project_pm_SUCCESS);
    emitter.addListener('member_SUCCESS', this.Project_member_SUCCESS);
    emitter.addListener('manage_SUCCESS', this.Project_manage_SUCCESS);
    emitter.addListener('og_SUCCESS', this.Project_og_SUCCESS);
    emitter.addListener('AJAX_MSG', this.Project_AJAX_MSG_callback);
  },

  componentDidUpdate() {
    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    });
  },

  componentWillUnmount() {
    //销毁
    emitter.removeListener('pm_SUCCESS', this.Project_pm_SUCCESS);
    emitter.removeListener('member_SUCCESS', this.Project_member_SUCCESS);
    emitter.removeListener('manage_SUCCESS', this.Project_manage_SUCCESS);
    emitter.removeListener('og_SUCCESS', this.Project_og_SUCCESS);
    emitter.removeListener('AJAX_MSG', this.Project_AJAX_MSG_callback);
  },

  Project_AJAX_MSG_callback() {
    this.setState({
      msgs: emitterChannel.AJAX_MSG
    });
  },

  Project_pm_SUCCESS() {
    var _this = this;

    projectsDB.getItem('pm_projects').then(function (result) {
      result = result == null ? [] : result;

      _this.setState({
        pm_projects: result
      });
    });
  },

  Project_member_SUCCESS() {
    var _this = this;

    projectsDB.getItem('member_projects').then(function (result) {
      result = result == null ? [] : result;

      _this.setState({
        member_projects: result
      });

      var content = [];
      result.map(function (singlepj) {
        singlepj.description = singlepj.post_title + '(ID:' + singlepj.ID + ')';
        content.push(singlepj);
      });
      $('.ui.search.forproject').search({
        source: content,
        onSelect: function (data) {
          _this.goProjectMore(data);
        }
      });
    });
  },

  Project_manage_SUCCESS() {
    var _this = this;

    projectsDB.getItem('manage_groups').then(function (result) {
      result = result == null ? [] : result;

      _this.setState({
        manage_groups: result
      });
    });
  },

  Project_og_SUCCESS() {
    var _this = this;

    projectsDB.getItem('og_projects').then(function (result) {
      result = result == null ? [] : result;

      _this.setState({
        og_projects: result
      });
    });
  },

  goProjectMore(data) {
    var _this = this;

    globalData.Project = data;
    globalData.ChatToBottom = true;

    if (globalData.cangopromore == true) {
      globalData.cangopromore = false;
      var url = "https://www.kenta.cn/app3/wp-json/form/v2/item/" + data.ID;
      var readusers = data.project_meta.readusers == undefined ? {} : data.project_meta.readusers;
      readusers[currentUser.user_name] = moment(moment().format("YYYY-MM-DDTHH:mm:ss"), moment.ISO_8601).add(8, 'hours').toISOString();
      var message = {
        "method": "PUT",
        "actionURL": url,
        "action": "projectread",
        "headerAttach": "\"Content-Type\":\"application/json\"",
        "submitJSON": {
          "username": currentUser.user_name,
          "readusers": readusers
        }
      };
      OAuthSubmit(message);
      this.setState({
        clicked: true
      });
    }
  },

  render() {
    var _this = this;

    var pm_projects = React.createElement(InitMsgElement, null);
    var og_projects = React.createElement(InitMsgElement, null);
    var member_projects = React.createElement(InitMsgElement, null);
    var manage_groups = React.createElement(InitMsgElement, null);

    if (this.state.pm_projects.length > 0) {
      pm_projects = this.state.pm_projects.map(function (result) {
        var project_status = result.project_meta.project_status_v3 != undefined ? parseInt(result.project_meta.project_status_v3[0]) : 1;

        if (project_status != 0 && project_status != 2) {
          return React.createElement(NewCardItem, {
            cardinfo: result,
            msgs: _this.state.msgs
          });
        }
      });
    }

    if (this.state.og_projects.length > 0) {
      og_projects = this.state.og_projects.map(function (result) {
        var project_status = result.project_meta.project_status_v3 != undefined ? parseInt(result.project_meta.project_status_v3[0]) : 1;

        if (project_status != 0 && project_status != 2) {
          return React.createElement(NewCardItem, {
            cardinfo: result,
            msgs: _this.state.msgs
          });
        }
      });
    }

    if (this.state.member_projects.length > 0) {
      member_projects = this.state.member_projects.map(function (result) {
        var project_status = result.project_meta.project_status_v3 != undefined ? parseInt(result.project_meta.project_status_v3[0]) : 1;

        if (project_status != 0 && project_status != 2) {
          return React.createElement(NewCardItem, {
            cardinfo: result,
            msgs: _this.state.msgs
          });
        }
      });
    }

    if (this.state.manage_groups.length > 0) {
      manage_groups = this.state.manage_groups.map(function (result) {
        return React.createElement(NewCardItem, {
          cardinfo: result,
          msgs: _this.state.msgs
        });
      });
    }

    if (this.state.clicked == false) {
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
      }, "\u9879\u76EE"), React.createElement("div", {
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
      }, member_projects)))), React.createElement("div", {
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
      }, pm_projects)))), React.createElement("div", {
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
      }, og_projects)))), React.createElement("div", {
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
      }, manage_groups))))));
    } else {
      return React.createElement(Redirect, {
        to: "/projectmore"
      });
    }
  }

});
var Profile = React.createClass({
  displayName: "Profile",

  getInitialState() {
    return {
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
  },

  componentWillMount() {
    this.setState({
      KPIList: globalData.KPI,
      AdditionalScore: globalData.AdditionalScore,
      initComplete: true
    });
  },

  componentDidMount() {
    var _this = this;

    $('.MainMenu').removeClass('active');
    $('#MainMenu_Profile').addClass('active'); //每次进入profile默认显示当月上司评价

    $('.ui.dropdown.profileYear').dropdown();
    var montharr = [{
      name: '1月',
      value: '01'
    }, {
      name: '2月',
      value: '02'
    }, {
      name: '3月',
      value: '03'
    }, {
      name: '4月',
      value: '04'
    }, {
      name: '5月',
      value: '05'
    }, {
      name: '06月',
      value: '06'
    }, {
      name: '7月',
      value: '07'
    }, {
      name: '8月',
      value: '08'
    }, {
      name: '9月',
      value: '09'
    }, {
      name: '10月',
      value: '10'
    }, {
      name: '11月',
      value: '11'
    }, {
      name: '12月',
      value: '12'
    }];
    montharr[new Date().getMonth()].selected = true;
    $('.ui.dropdown.profileMonth').dropdown({
      values: montharr,
      onChange: function (value, text, $selectedItem) {
        var selecedYear = $('.ui.dropdown.profileYear').dropdown('get value');
        var date = selecedYear + '-' + value; //18-01  17-12需调整为真实date

        EvaluateStandard = MonthLastEvaluateStandard[date]; //KPI显示部分

        var position = currentUser.role_name;
        var workno = currentUser.workno;
        var arr = [];

        for (var key in globalData.KPI) {
          if (globalData.KPI[key][date] != undefined) {
            var yourkpi = globalData.KPI[key][date];
            var generalKPI = yourkpi.generalKPI;
            var obj = generalKPI;

            var personalKPI = _.groupBy(yourkpi.personalKPI, function (n) {
              return n['职位'];
              ``;
            });

            var relatedPerson = _.groupBy(yourkpi.relatedPerson, function (n) {
              return n['工号'];
            });

            if (workno in relatedPerson == true) {
              obj['权重'] = relatedPerson[workno][0]['权重'];
              obj['实际值'] = relatedPerson[workno][0]['实际值'];
              obj['目标'] = relatedPerson[workno][0]['目标'];
              obj['底线水平'] = relatedPerson[workno][0]['底线水平'];
              obj['挑战水平'] = relatedPerson[workno][0]['挑战水平'];
            } else if (position in personalKPI == true) {
              obj['权重'] = personalKPI[position][0]['权重'];
            } else {
              obj = '';
            }

            if (obj != '') {
              yourkpi.displayKPI = obj;
              yourkpi.title = key;
              arr.push(yourkpi);
            }
          }
        }

        var confirmedUserActualValue = null;
        var calarray = [];
        arr.map(function (result) {
          var output = 0;
          var obj = {};
          var confirmedUserActualValue = parseFloat(result.displayKPI['实际值']); //console.log('confirmedUserActualValue',result.displayKPI['实际值'],confirmedUserActualValue,result.displayKPI['目标'],parseFloat(result.displayKPI['目标']));

          if (result.displayKPI.type == "≧" || result.displayKPI.type == "≥" || result.displayKPI.type == "＞") {
            if (parseFloat(result.displayKPI['挑战水平']) - parseFloat(result.displayKPI['目标']) > 0 && parseFloat(result.displayKPI['目标']) - parseFloat(result.displayKPI['底线水平']) > 0) {
              //大於等於
              //console.log("大於等於計算方式");
              //限制ActualValue只能是0-10之間的值，高於或低於都會被換掉
              if (confirmedUserActualValue > parseFloat(result.displayKPI['挑战水平'])) {
                confirmedUserActualValue = parseFloat(result.displayKPI['挑战水平']);
              } else if (confirmedUserActualValue < parseFloat(result.displayKPI['底线水平'])) {
                confirmedUserActualValue = parseFloat(result.displayKPI['底线水平']);
              } //console.log("試調用個人實際值: ", confirmedUserActualValue);
              //判定使用1段(10-8分)還是2段(8-0分)的公式, X 是分數，Y是實際值
              //好像有percentage 問題


              if (confirmedUserActualValue >= parseFloat(result.displayKPI['目标'])) {
                //1段(10-8分)
                //console.log("1段(10-8分) 計算");
                var x1 = 10;
                var y1 = parseFloat(result.displayKPI['挑战水平']);
                var x2 = 8;
                var y2 = parseFloat(result.displayKPI['目标']); //console.log("方程定點： ", "x1=",x1," ,y1=",y1," ,x2=",x2," ,y2=",y2);

                output = (confirmedUserActualValue - (x2 * y1 - x1 * y2) / (x2 - x1)) / ((y2 - y1) / (x2 - x1)); //console.log("計算結果： ", output);
              } else {
                //2段(8-0分)
                //console.log("2段(8-0分) 計算");
                var x1 = 8;
                var y1 = parseFloat(result.displayKPI['目标']);
                var x2 = 0;
                var y2 = parseFloat(result.displayKPI['底线水平']); //console.log("方程定點： ", "x1=",x1," ,y1=",y1," ,x2=",x2," ,y2=",y2);

                output = (confirmedUserActualValue - (x2 * y1 - x1 * y2) / (x2 - x1)) / ((y2 - y1) / (x2 - x1)); //console.log("計算結果： ", output);
              }
            } else {
              output = "逻辑错误无法计算";
            }
          } else if (result.displayKPI.type == "≦" || result.displayKPI.type == "≤" || result.displayKPI.type == "＜") {
            if (parseFloat(result.displayKPI['挑战水平']) - parseFloat(result.displayKPI['目标']) < 0 && parseFloat(result.displayKPI['目标']) - parseFloat(result.displayKPI['底线水平']) < 0) {
              //少於等於
              //console.log("少於等於計算方式");
              //限制ActualValue只能是0-10之間的值，高於或低於都會被換掉
              if (confirmedUserActualValue < parseFloat(result.displayKPI['挑战水平'])) {
                confirmedUserActualValue = parseFloat(result.displayKPI['挑战水平']);
              } else if (confirmedUserActualValue > parseFloat(result.displayKPI['底线水平'])) {
                confirmedUserActualValue = parseFloat(result.displayKPI['底线水平']);
              } //console.log("試調用個人實際值: ", confirmedUserActualValue);
              //判定使用1段(10-8分)還是2段(8-0分)的公式, X 是分數，Y是實際值


              if (confirmedUserActualValue <= parseFloat(result.displayKPI['目标'])) {
                //1段(10-8分)
                //console.log("1段(10-8分) 計算");
                var x1 = 10;
                var y1 = parseFloat(result.displayKPI['挑战水平']);
                var x2 = 8;
                var y2 = parseFloat(result.displayKPI['目标']); //console.log("方程定點： ", "x1=",x1," ,y1=",y1," ,x2=",x2," ,y2=",y2);

                output = (confirmedUserActualValue - (x2 * y1 - x1 * y2) / (x2 - x1)) / ((y2 - y1) / (x2 - x1)); //console.log("計算結果： ", output);
              } else {
                //2段(8-0分)
                //console.log("2段(8-0分) 計算");
                var x1 = 8;
                var y1 = parseFloat(result.displayKPI['目标']);
                var x2 = 0;
                var y2 = parseFloat(result.displayKPI['底线水平']); //console.log("方程定點： ", "x1=",x1," ,y1=",y1," ,x2=",x2," ,y2=",y2);

                output = (confirmedUserActualValue - (x2 * y1 - x1 * y2) / (x2 - x1)) / ((y2 - y1) / (x2 - x1)); //console.log("計算結果： ", output);
              }
            } else {
              output = "逻辑错误无法计算";
            }
          } else {
            output = null; //console.log(" 無法判定公式為大於或者少於 ");
          }

          obj['得分'] = output;
          obj['权重'] = result.displayKPI['权重'];
          obj['date'] = result.KPIregtime;
          obj['title'] = result.title;
          obj['type'] = result.displayKPI['type'];
          obj['目标'] = result.displayKPI['目标'];
          obj['挑战水平'] = result.displayKPI['挑战水平'];
          obj['底线水平'] = result.displayKPI['底线水平'];
          obj['实际值'] = result.displayKPI['实际值'];
          calarray.push(obj);
        });
        var fenzi = 0;
        var fenmu = 0;
        var kpiscore = 0;
        var KPIScoreHtml = calarray.map(function (result) {
          fenzi += parseFloat(result['得分']) * parseFloat(result['权重']);
          fenmu += parseFloat(result['权重']);
          return React.createElement(KPICardItem, {
            KPIInfo: result
          });
        });

        if (calarray.length > 0) {
          kpiscore = (fenzi / fenmu).toFixed(2);
        } //交叉评分部分


        var qzfenzi = 0;
        var qzfenmu = 0;
        var ManageScoreHtml = [];
        var monthData = globalData.ManageScore[date] != undefined ? globalData.ManageScore[date] : [];

        var tmp = _.groupBy(monthData, function (n) {
          return n.collectedData.key_0.staffValue.split('-')[2];
        });

        var manageobj = {};

        for (var key in tmp) {
          var yourmanage = []; //用来存储属于对我的评分

          if (toFullInfo(key).real_name != undefined) {
            tmp[key].map(function (result) {
              if (result.collectedData.key_1.indexOf(currentUser.user_name) != -1) {
                yourmanage.push(result);
              }
            });
          }

          if (yourmanage.length > 0) {
            var newestManage = _.max(yourmanage, function (chr) {
              return new Date(chr.createTime).getTime();
            });

            var allowdisplay = true;

            if (currentUser.group === null) {
              if (EvaluateStandard[currentUser.role_name][toFullInfo(key).role_name] != undefined) {
                qzfenzi += EvaluateStandard[currentUser.role_name][toFullInfo(key).role_name] * parseFloat(newestManage.collectedData.key_4[0]);
                qzfenmu += EvaluateStandard[currentUser.role_name][toFullInfo(key).role_name];
              } else {
                allowdisplay = false;
              }
            } else {
              if (EvaluateStandard[currentUser.role_name][currentUser.group] == undefined) {
                if (EvaluateStandard[currentUser.role_name][toFullInfo(key).role_name] != undefined) {
                  qzfenzi += EvaluateStandard[currentUser.role_name][toFullInfo(key).role_name] * parseFloat(newestManage.collectedData.key_4[0]);
                  qzfenmu += EvaluateStandard[currentUser.role_name][toFullInfo(key).role_name];
                } else {
                  allowdisplay = false;
                }
              } else {
                if (EvaluateStandard[currentUser.role_name][currentUser.group][toFullInfo(key).role_name] != undefined) {
                  qzfenzi += EvaluateStandard[currentUser.role_name][currentUser.group][toFullInfo(key).role_name] * parseFloat(newestManage.collectedData.key_4[0]);
                  qzfenmu += EvaluateStandard[currentUser.role_name][currentUser.group][toFullInfo(key).role_name];
                } else {
                  allowdisplay = false;
                }
              }
            }

            var manager = newestManage.collectedData.key_0.staffValue.split('-')[1];
            var manager_username = newestManage.collectedData.key_0.staffValue.split('-')[2];
            var manager_position = toFullInfo(manager_username).role_name;
            var man_score = parseInt(newestManage.collectedData.key_4[0]).toFixed(2);
            var des = newestManage.collectedData.key_3 == '' ? '未填写说明' : newestManage.collectedData.key_3;
            var src = "https://www.kenta.cn/app3/data/avatar/" + manager_username + ".jpg";

            if (allowdisplay == true) {
              ManageScoreHtml.push(React.createElement("div", {
                className: "ui segment grid"
              }, React.createElement("div", {
                className: "five wide column"
              }, React.createElement("a", {
                className: "ui image label"
              }, React.createElement("img", {
                src: src
              }), manager, React.createElement("div", {
                className: "detail"
              }, manager_position))), React.createElement("div", {
                className: "eight wide column",
                style: {
                  "word-wrap": "break-word",
                  "overflow": "hidden"
                }
              }, React.createElement("span", {
                style: {
                  'color': 'red',
                  'font-size': '18px'
                }
              }, React.createElement("b", null, React.createElement("i", null, man_score, "\u5206"))), React.createElement("br", null), "(", des, ")"), React.createElement("div", {
                className: "three wide column"
              }, newestManage.createTime.substr(5, 5))));
            }
          }
        }

        if (qzfenmu == 0 || isNaN(qzfenmu)) {
          var managescore = 0;
        } else {
          var managescore = (parseFloat(qzfenzi) / parseFloat(qzfenmu)).toFixed(2);
        } //额外加减分部分


        var additionData = globalData.AdditionalScore[date] != undefined ? globalData.AdditionalScore[date] : [];
        var additionalscore = 0;
        var AdditionalScoreHtml = additionData.map(function (result) {
          if (result.collectedData.key_0.staffValue.indexOf(currentUser.user_name) != -1) {
            additionalscore += parseFloat(result.collectedData.key_1[0].split('——')[1]);
            return React.createElement("div", {
              className: "ui segment grid"
            }, React.createElement("div", {
              className: "five wide column"
            }, result.collectedData.key_1[0]), React.createElement("div", {
              className: "eight wide column",
              style: {
                "word-wrap": "break-word",
                "overflow": "hidden"
              }
            }, "\u8BF4\u660E\uFF1A", result.collectedData.key_2), React.createElement("div", {
              className: "three wide column"
            }, result.collectedData.key_3.substr(5, 5)));
          }
        });
        AdditionalScoreHtml = _.compact(AdditionalScoreHtml);

        _this.setState({
          KPIScoreHtml: KPIScoreHtml,
          ManageScoreHtml: ManageScoreHtml,
          AdditionalScoreHtml: AdditionalScoreHtml,
          kpiscore: kpiscore,
          managescore: managescore,
          additionalscore: additionalscore
        });
      }
    });
    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    });
    PullToRefresh.init({
      mainElement: '#examplepull',
      onRefresh: function () {
        requireKPI();

        _this.setState({});
      }
    });
    emitterkpi.addListener('updateKPI', function () {
      _this.setState({
        KPIList: globalData.KPI,
        initComplete: true
      });
    });
  },

  Logout() {
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
        monthData: '',
        logout: true
      });
    }).catch(function (err) {
      console.log(err);
    });
  },

  getscore(percent) {
    var a = parseFloat(percent) / 100;

    if (a >= 1.5) {
      return 10;
    } else {
      if (a >= 1.41) {
        return 9;
      } else {
        if (a >= 1.31) {
          return 8;
        } else {
          if (a >= 1.21) {
            return 7;
          } else {
            if (a >= 1.11) {
              return 6;
            } else {
              if (a >= 1.01) {
                return 5;
              } else {
                if (a >= 0.91) {
                  return 4;
                } else {
                  if (a >= 0.81) {
                    return 3;
                  } else {
                    if (a >= 0.71) {
                      return 2;
                    } else {
                      if (a >= 0.61) {
                        return 1;
                      } else {
                        return 0;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  calAdditionalScore(array) {
    var score = 0;
    array.map(function (result) {
      switch (result) {
        case 'ERP基础信息维护(超过一天-0.5)':
          score += -0.5;
          break;

        case '输入模具维修单,工模工时报表(超过一天-0.5)':
          score += -0.5;
          break;

        case '绩效数据统计(超过一天—0.5)':
          score += -0.5;
          break;

        case '员工每日加班单(超过一天—0.5)':
          score += -0.5;
          break;

        case '报板的整齐维护,相关物品领用(超过一天-0.5)':
          score += -0.5;
          break;
      }
    });
    return score;
    console.log('score', score);
  },

  render() {
    var _this = this;

    var kpiscore = this.state.kpiscore; //kpi总分

    var managescore = this.state.managescore; //交叉评分

    var additionalscore = this.state.additionalscore; //额外加减分

    var kpilist = this.state.KPIScoreHtml.length > 0 ? this.state.KPIScoreHtml : React.createElement(InitMsgElement, null);
    var managelist = this.state.ManageScoreHtml.length > 0 ? this.state.ManageScoreHtml : React.createElement(InitMsgElement, null);
    var additionallist = this.state.AdditionalScoreHtml.length > 0 ? this.state.AdditionalScoreHtml : React.createElement(InitMsgElement, null);
    var headsrc = 'https://www.kenta.cn/app3/data/avatar/' + currentUser.user_name + '.jpg';

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
          'width': '50%'
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
      }, currentUser.real_name, "|\u603B\u5206", parseFloat(kpiscore) * 0.7 + parseFloat(managescore) * 0.3 + parseFloat(additionalscore), React.createElement("div", {
        className: "sub header"
      }, currentUser.role_name, " | ", currentUser.department)))), React.createElement("select", {
        className: "ui dropdown profileYear"
      }, React.createElement("option", {
        value: "15"
      }, "2015 \u5E74"), React.createElement("option", {
        value: "16"
      }, "2016 \u5E74"), React.createElement("option", {
        value: "17"
      }, "2017 \u5E74"), React.createElement("option", {
        value: "18",
        selected: "true"
      }, "2018 \u5E74"), React.createElement("option", {
        value: "19"
      }, "2019 \u5E74"), React.createElement("option", {
        value: "20"
      }, "2020 \u5E74"), React.createElement("option", {
        value: "21"
      }, "2021 \u5E74")), React.createElement("select", {
        className: "ui dropdown profileMonth"
      })), React.createElement("div", {
        className: "ui hidden divider"
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
      }, "KPI\u5217\u8868 ", React.createElement("span", {
        style: {
          'color': 'red',
          'font-size': '23px'
        }
      }, kpiscore, "\u5206")), React.createElement("div", {
        className: "ui divider"
      }), React.createElement("div", {
        className: "ui red raised segments KPI"
      }, kpilist)), React.createElement("div", {
        className: "eight wide column"
      }, React.createElement("div", {
        className: "sub header"
      }, "\u4EA4\u53C9\u8BC4\u5206(\u6743\u91CD\u5F97\u5206) ", React.createElement("span", {
        style: {
          'color': 'red',
          'font-size': '23px'
        }
      }, managescore, "\u5206")), React.createElement("div", {
        className: "ui red raised segments Manage"
      }, React.createElement(InitMsgElement, null))), React.createElement("div", {
        className: "eight wide column"
      }, React.createElement("div", {
        className: "sub header"
      }, "\u989D\u5916\u52A0\u51CF\u5206:", React.createElement("span", {
        style: {
          'color': 'red',
          'font-size': '23px'
        }
      }, React.createElement("b", null, React.createElement("i", null, additionalscore, "\u5206")))), React.createElement("div", {
        className: "ui red raised segments Additional"
      }, React.createElement("div", {
        className: "ui segment"
      }, additionallist))), React.createElement("div", {
        className: "ui hidden divider"
      }), React.createElement("div", {
        className: "sixteen wide column"
      }, React.createElement("button", {
        className: "ui red fluid button",
        onClick: this.Logout
      }, React.createElement("i", {
        className: "sign out icon"
      }), "\u9000\u51FA\u767B\u9646")))))));
    } else {
      return React.createElement(Redirect, {
        to: "/login"
      });
    }
  }

});
var More = React.createClass({
  displayName: "More",

  getInitialState() {
    return {
      logout: false,
      initCompleted: false,
      screen: ''
    };
  },

  componentDidMount() {
    $('.MainMenu').removeClass('active');
    $('#MainMunu_More').addClass('active');
    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    });
  },

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
  },

  goMES: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/mes/index.php';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },
  //重复修模看板
  goRepairsumlist: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/Product_Development_Department/repairsumlist.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },
  //紧急模具看板
  goRepairtimeleftlist: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/Product_Development_Department/repairtimeleftlist.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },
  //未安排修模单看板
  goWaitingAssignRepairMould: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/Product_Development_Department/waitingAssignRepairMould.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },
  //延误模具看板
  goMoldProcessingStatus: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/Product_Development_Department/moldProcessingStatus.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },
  //未转采购单看板
  goPOwaitingConversion: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/purchase_department/POwaitingConversion.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },
  //进货进度看板
  goPurchasementprogress: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/purchase_department/purchasementprogress.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },
  //修模单进度看板
  goRepairmouldprogress: function () {
    globalData.iframeurl = 'https://www.kenta.cn/screens/Product_Development_Department/repairmouldprogress.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },

  goManageScore() {
    FormDisplay.ID = 10788; //var usergroup=currentUser.group,userrole=currentUser.role_name,userdept=currentUser.department;
    //FormDisplay.rolename保存当前用户可评分的职位数组
    //var usergroup = '';var userrole = '总经理助理';var userdept = '经理室';

    FormDisplay.rolename = [];
    /*if(FormDisplay.rolename.length==0) {
    	alert('未有可评分人员!');
    	return false;
    }*/

    idSearch(10788);
    this.setState({
      initCompleted: true,
      screen: 'formdisplay'
    });
  },

  goAdditionalScore() {
    FormDisplay.ID = 9670;
    idSearch(9670);
    this.setState({
      initCompleted: true,
      screen: 'formdisplay'
    });
  },

  goProjectTree() {
    globalData.iframeurl = 'https://www.kenta.cn/app3/tree/treeindex.html?user=' + currentUser.user_name;
    /*this.setState({
    	initCompleted:true,
    	screen:'iframewindow'
    });*/

    window.open(globalData.iframeurl);
  },

  outputExcel(array) {
    var option = {};
    option.fileName = '系统缺失职位字段';
    option.datas = [{
      sheetData: array,
      sheetName: 'sheet',
      sheetHeader: ['Position']
    }];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  },

  goKPIDisplay() {
    globalData.iframeurl = 'https://www.kenta.cn/screens/KPIDisplay/KPIDisplay.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },

  goManagelist() {
    globalData.iframeurl = 'https://www.kenta.cn/screens/managelist/managelist.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },

  viewManageDetail() {
    globalData.iframeurl = 'https://www.kenta.cn/app3/achievementstable/manageDetail.html';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },

  tablePrint(dept) {
    dept = dept == '管理部' || dept == '工程部' ? '' : dept;
    globalData.iframeurl = 'https://www.kenta.cn/app3/achievementstable/achievementsprintform.html?dept=' + dept;
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },

  tablePrintSingle(dept) {
    dept = dept == '管理部' ? '' : dept;
    globalData.iframeurl = 'https://www.kenta.cn/app3/achievementstable/singlecard.html?dept=' + dept;
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  },

  render() {
    var promiarray = ['ian.tsoi', 'jiaming.liu', 'xiaodong.zhang', 'ricky.ngai', 'jing.xu'];
    var JMpromi = promiarray.indexOf(currentUser.user_name) != -1 ? '' : 'b-pagebox';
    var managedetailpromiarray = ['jiaming.liu', 'ian.tsoi', 'yongke.li', 'yun.zhou'];
    var managedetailpromi = managedetailpromiarray.indexOf(currentUser.user_name) != -1 ? '' : 'b-pagebox';
    var tableprintpromiarray = ['经理助理', '程序员', '注塑文员', '品管文员', '自动化文员', '文控文员', '插针文员', '仓储文员', '项目部文员', '开发文员', '人事专员', '生管', '行政助理'];
    var tableprintpromi = tableprintpromiarray.indexOf(currentUser.role_name) != -1 ? '' : 'b-pagebox';
    var classScreen = {
      Repairsumlist: ' b-pagebox',
      Repairtimeleftlist: ' b-pagebox',
      WaitingassignrepairMould: ' b-pagebox',
      Moldprocessingstatus: ' b-pagebox',
      Powaitingconversion: ' b-pagebox',
      Purchasementprogress: ' b-pagebox',
      Repairmouldprogress: ' b-pagebox',
      Messcreen: ' b-pagebox'
    };
    var whiteList = currentUser.whiteList;

    if (whiteList != undefined) {
      for (var key in whiteList) {
        if (whiteList[key].Dept.indexOf(currentUser.department) != -1) {
          classScreen[key] = '';
        } else if (whiteList[key].Staff.indexOf(currentUser.user_name) != -1) {
          classScreen[key] = '';
        } else if (whiteList[key].Position.indexOf(currentUser.role_name) != -1) {
          classScreen[key] = '';
        }
      }
    }

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
          className: "ui segment" + classScreen.Messcreen,
          onClick: this.goMES
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
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment" + classScreen.Repairsumlist,
          onClick: this.goRepairsumlist
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
        }, "\u91CD\u590D\u4FEE\u6A21\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment" + classScreen.Repairtimeleftlist,
          onClick: this.goRepairtimeleftlist
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
        }, "\u7D27\u6025\u6A21\u5177\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment" + classScreen.WaitingassignrepairMould,
          onClick: this.goWaitingAssignRepairMould
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
        }, "\u672A\u5B89\u6392\u4FEE\u6A21\u5355\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment" + classScreen.Moldprocessingstatus,
          onClick: this.goMoldProcessingStatus
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
        }, "\u5EF6\u8BEF\u6A21\u5177\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment" + classScreen.Powaitingconversion,
          onClick: this.goPOwaitingConversion
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
        }, "\u672A\u8F6C\u91C7\u8D2D\u5355\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment" + classScreen.Purchasementprogress,
          onClick: this.goPurchasementprogress
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
        }, "\u8FDB\u8D27\u8FDB\u5EA6\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment" + classScreen.Repairmouldprogress,
          onClick: this.goRepairmouldprogress
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
        }, "\u4FEE\u6A21\u5355\u8FDB\u5EA6\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment",
          onClick: this.goKPIDisplay
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
        }, "\u7EE9\u6548\u663E\u793A\u770B\u677F"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment",
          onClick: this.goManagelist
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
        }, "\u4EA4\u53C9\u8BC4\u5206\u6E05\u5355\u770B\u677F"))), React.createElement("div", {
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
          className: "ui segment"
        }, React.createElement("div", {
          className: "ui grid"
        }, React.createElement("div", {
          className: "thirteen wide column"
        }, React.createElement("div", {
          className: "ui small header grey"
        }, React.createElement("i", {
          className: "tasks icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u9879\u76EE\u8BBE\u7F6E"))), React.createElement("div", {
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
          className: "settings icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u7CFB\u7EDF\u8BBE\u7F6E"))), React.createElement("div", {
          className: "three wide column right aligned"
        }, React.createElement("i", {
          className: "chevron right icon grey"
        }))))))), React.createElement("div", {
          className: "eight wide column"
        }, React.createElement("div", {
          className: "sub header"
        }, "\u4E2A\u4EBA"), React.createElement("div", {
          className: "ui red raised loading segments"
        }, React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment"
        }, React.createElement("div", {
          className: "ui grid"
        }, React.createElement("div", {
          className: "thirteen wide column"
        }, React.createElement("div", {
          className: "ui small header grey",
          onClick: this.goProjectTree
        }, React.createElement("i", {
          className: "sign out icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u9879\u76EE\u6811"))), React.createElement("div", {
          className: "three wide column right aligned"
        }, React.createElement("i", {
          className: "chevron right icon grey"
        }))))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment",
          onClick: this.goManageScore
        }, React.createElement("div", {
          className: "ui grid"
        }, React.createElement("div", {
          className: "thirteen wide column"
        }, React.createElement("div", {
          className: "ui small header grey"
        }, React.createElement("i", {
          className: "sign out icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u4EA4\u53C9\u8BC4\u5206"))), React.createElement("div", {
          className: "three wide column right aligned"
        }, React.createElement("i", {
          className: "chevron right icon grey"
        }))))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment " + JMpromi,
          onClick: this.goAdditionalScore
        }, React.createElement("div", {
          className: "ui grid"
        }, React.createElement("div", {
          className: "thirteen wide column"
        }, React.createElement("div", {
          className: "ui small header grey"
        }, React.createElement("i", {
          className: "sign out icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u989D\u5916\u52A0\u51CF\u8BC4\u5206"))), React.createElement("div", {
          className: "three wide column right aligned"
        }, React.createElement("i", {
          className: "chevron right icon grey"
        }))))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment " + managedetailpromi,
          onClick: this.viewManageDetail
        }, React.createElement("div", {
          className: "ui grid"
        }, React.createElement("div", {
          className: "thirteen wide column"
        }, React.createElement("div", {
          className: "ui small header grey"
        }, React.createElement("i", {
          className: "sign out icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u67E5\u770B\u8BC4\u5206\u8BE6\u60C5"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment " + tableprintpromi,
          onClick: this.tablePrint.bind(this, currentUser.department)
        }, React.createElement("div", {
          className: "ui grid"
        }, React.createElement("div", {
          className: "thirteen wide column"
        }, React.createElement("div", {
          className: "ui small header grey"
        }, React.createElement("i", {
          className: "sign out icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u7EE9\u6548\u5957\u8868\u6253\u5370"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment " + tableprintpromi,
          onClick: this.tablePrintSingle.bind(this, currentUser.department)
        }, React.createElement("div", {
          className: "ui grid"
        }, React.createElement("div", {
          className: "thirteen wide column"
        }, React.createElement("div", {
          className: "ui small header grey"
        }, React.createElement("i", {
          className: "sign out icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u7EE9\u6548\u5957\u8868\u6253\u5370(\u5355\u6B63\u9762)"))), React.createElement("div", {
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
          className: "sign out icon"
        }), React.createElement("div", {
          className: "content"
        }, "\u9000\u51FA\u767B\u9646"))), React.createElement("div", {
          className: "three wide column right aligned"
        })))))))));
      } else {
        return React.createElement(Redirect, {
          to: '/' + this.state.screen
        });
      }
    } else {
      return React.createElement(Redirect, {
        to: "/login"
      });
    }
  }

}); // 次页

var ProjectMore = React.createClass({
  displayName: "ProjectMore",

  getInitialState() {
    return {
      msgs: [],
      initCompleted: false
    };
  },

  componentWillMount() {
    var _this = this;

    this.ProjectMore_member_SUCCESS();
    messagesDB.getItem('msgs').then(function (result) {
      result = result == null ? {} : result;

      _this.setState({
        msgs: result
      });

      _this.ChatToBottom();
    }); //这段原先是做在carditem点击的时候的操作 已读消息写入和获取子项目

    var url = "https://www.kenta.cn/app3/wp-json/form/v2/item/" + globalData.Project.ID;
    var readusers = globalData.Project.project_meta.readusers == undefined ? {} : globalData.Project.project_meta.readusers;
    readusers[currentUser.user_name] = moment(moment().format("YYYY-MM-DDTHH:mm:ss"), moment.ISO_8601).add(8, 'hours').toISOString();
    var message = {
      "method": "PUT",
      "actionURL": url,
      "action": "projectread",
      "headerAttach": "\"Content-Type\":\"application/json\"",
      "submitJSON": {
        "username": currentUser.user_name,
        "readusers": readusers
      }
    };
    OAuthSubmit(message);
  },

  componentDidMount() {
    var _this = this;

    $('#pjmoreoutdiv').visibility({
      onUpdate: function (calculations) {
        $('.ui.sticky.mainHeader').sticky({
          context: '#kenta-app'
        });
      }
    });
    $('.menu .item').tab({
      alwaysRefresh: true,
      onLoad: function (tabname) {
        if (tabname == 'chat') {
          _this.ChatToBottom();
        } else {
          if (tabname == 'detail') {
            $('.ui.sticky.mainHeader').sticky({
              context: '#kenta-app'
            }); //使div移动到可见id的位置

            document.getElementById('detailBottomAnchor').scrollIntoView(true); //$("#toptest").attr("class","ui sticky mainHeader inverted red segment");
          }

          if (tabname == 'children') {
            //使div移动到可见id的位置
            document.getElementById('childrenBottomAnchor').scrollIntoView(true);

            if (globalData.childrenrequired == true) {
              var url = 'https://www.kenta.cn/app3/wp-json/addon/v2/metaQuery?parent_id=' + globalData.Project.ID;
              var message = {
                "method": "GET",
                "actionURL": url,
                "action": "getChildren",
                "submitJSON": {}
              };
              OAuthSubmit(message);
              globalData.childrenrequired = false;
            }
          }
        }

        $('.pusher').scrollTop(0);
      }
    });
    emitter.addListener('member_SUCCESS', this.ProjectMore_member_SUCCESS);
    emitter.addListener('AJAX_MSG', this.ProjectMore_AJAX_MSG_callback);
    emitter.addListener('childrengetted', this.ProjectMore_childrengetted_callback);
    emitter.addListener('pjdelete', this.ProjectMore_pjdelete_callback);
  },

  componentWillUnmount() {
    //销毁
    emitter.removeListener('member_SUCCESS', this.ProjectMore_member_SUCCESS);
    emitter.removeListener('AJAX_MSG', this.ProjectMore_AJAX_MSG_callback);
    emitter.removeListener('childrengetted', this.ProjectMore_childrengetted_callback);
    emitter.removeListener('pjdelete', this.ProjectMore_pjdelete_callback);
  },

  //有pusher 並且有機會很多數據時，需要更新一次sticky header 位置
  componentDidUpdate() {
    if (globalData.ChatToBottom == true) {
      this.ChatToBottom();
    }
  },

  ProjectMore_member_SUCCESS() {
    var _this = this;

    projectsDB.getItem('member_projects').then(function (result) {
      result = result == null ? [] : result;
      result.map(function (data) {
        if (data.ID == globalData.Project.ID) {
          globalData.Project = data;

          _this.setState();
        }
      });
    });
  },

  ProjectMore_AJAX_MSG_callback() {
    this.setState({
      msgs: emitterChannel.AJAX_MSG
    });
    globalData.chatcanback = true;
  },

  ProjectMore_childrengetted_callback() {
    this.setState({});
  },

  ProjectMore_pjdelete_callback() {
    globalData.cangopromore = true;
    alert('项目已删除！');
    this.setState({
      initCompleted: true
    });
  },

  _onBack: function () {
    globalData.cangopromore = true;
    globalData.childrenrequired = true;
    globalData.Children = [];

    if (globalData.chatcanback == false) {
      alert('消息发送中 请稍候...');
    } else {
      this.setState({
        initCompleted: true
      });
    }
  },

  ChatToBottom() {
    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    }); //移到指定id的Jquery方法

    document.getElementById('msgBottomAnchor').scrollIntoView(true);
    globalData.ChatToBottom = false;
  },

  _pjDelete() {
    if (confirm("确认删除项目:" + globalData.Project.project_meta.title[0] + "(id:" + globalData.Project.project_meta.ID + ")?") == true) {
      var message = {
        "method": "DELETE",
        "action": "cancelSingleData",
        "actionURL": 'https://www.kenta.cn/app3/wp-json/form/v2/item/' + globalData.Project.project_meta.ID,
        "submitJSON": {}
      };
      OAuthSubmit(message);
    }
  },

  render: function () {
    var _this = this;

    var content_chat = '';
    var content_detail = '';
    var content_children = '';
    var post_title = '';
    var post_content = '';
    var sub_line = '';
    var statussign = '';
    var cardinfo = '';
    var projectmsg = [];

    if (globalData.Children.length > 0) {
      content_children = globalData.Children.map(function (result) {
        return React.createElement(NewCardItem, {
          cardinfo: result,
          msgs: _this.state.msgs
        });
      });
    } else {
      if (globalData.childrenrequired == false) {
        content_children = React.createElement(InitMsgElement, null);
      } else {
        content_children = React.createElement("div", {
          className: "ui segment grid"
        }, React.createElement("div", {
          className: "sixteen wide column"
        }, React.createElement("h2", {
          className: "ui icon center aligned header disabled grey"
        }, React.createElement("i", {
          className: "comment outline disabled grey icon"
        }), React.createElement("div", {
          className: "ui active inverted dimmer"
        }, React.createElement("div", {
          className: "ui text loader"
        }, "\u83B7\u53D6\u6570\u636E\u4E2D...")))));
      }
    }

    if (globalData.Project != '') {
      cardinfo = globalData.Project;
      post_title = cardinfo.project_meta.title[0];
      post_content = cardinfo.project_meta.content[0];
      var meta = cardinfo.project_meta; //历史记录

      var audit_history_v3 = meta.audit_history_v3 != undefined ? meta.audit_history_v3 : [];
      var auditHistoryHtml = "";
      auditHistoryHtml = audit_history_v3.map(function (result, rkey) {
        var applyuer = result.applyuser == undefined ? 'applyuser' : result.applyuser;
        var audituser = result.audituser == undefined ? 'audituser' : result.audituser;
        var AHKey = "a_h_key_" + rkey;
        var audit_pass_html = result.pass == "" ? "审核中..." : result.pass;

        if (result.pass == "") {
          var audit_html = React.createElement("div", null, React.createElement("span", null, audituser), " \u5BA1\u6838  ", React.createElement("span", null, audit_pass_html));
        } else {
          var audit_html = React.createElement("div", null, React.createElement("span", null, audituser), " \u5BA1\u6838  ", React.createElement("span", null, audit_pass_html), ",\u56DE\u590D\uFF1A", React.createElement("span", null, result.auditcontent), ",\u5BA1\u6838\u65F6\u95F4\uFF1A", React.createElement("span", {
            className: "history_time"
          }, result.auditdate));
        }

        if (result.applytype == '申请延期') {
          return React.createElement("li", {
            key: AHKey
          }, React.createElement("div", null, React.createElement("span", null, applyuer, " \u7533\u8BF7\u5EF6\u671F"), "\u4EFB\u52A1 ,\u8BF4\u660E\uFF1A", React.createElement("span", null, result.applycontent), React.createElement("br", null), "\u4ECE:", React.createElement("span", null, meta.project_deadline[0]), " \u5EF6\u671F\u81F3:", React.createElement("span", null, result.delaydate), ",\u63D0\u4EA4\u65F6\u95F4\uFF1A", React.createElement("span", {
            className: "history_time"
          }, result.applydate)), audit_html, React.createElement("div", {
            className: "clear"
          }));
        } else {
          return React.createElement("li", {
            key: AHKey
          }, React.createElement("div", null, React.createElement("span", null, applyuer, " ", result.applytype), "\u4EFB\u52A1 ,\u8BF4\u660E\uFF1A", React.createElement("span", null, result.applycontent), ",\u63D0\u4EA4\u65F6\u95F4\uFF1A", React.createElement("span", {
            className: "history_time"
          }, result.applydate)), audit_html, React.createElement("div", {
            className: "clear"
          }));
        }
      }); // 完成条件

      var conditionItem = "";
      var conditionclass = 'none';
      var conditions = typeof meta.conditions_v3 != 'undefined' ? meta.conditions_v3 : [];
      conditionItem = conditions.map(function (result, key) {
        var uniqueKey = "p_d_cdt_s_" + key;

        switch (result.type) {
          case 'write_text':
            return React.createElement("span", null, "write_text");
            break;

          case 'upload_file':
            return React.createElement("span", null, "upload_file");
            break;

          case 'answer_question':
            return React.createElement("span", null, "answer_question");
            break;

          case 'design_auditer':
            return React.createElement("span", null, "design_auditer");
            break;
        }
      });
      var useritems = meta.member.map(function (result) {
        var info = {
          'user_name': result,
          'project_role': 'member'
        };
        return React.createElement(HeadImg, {
          detail: info
        });
      });
      var ogbtn = '';

      if (meta.organizer.AD_name == currentUser.user_name) {
        ogbtn = React.createElement("div", {
          className: "ui card " + ogbtn
        }, React.createElement("div", {
          className: "sixteen wide column"
        }, React.createElement("button", {
          className: "fluid ui button red",
          onClick: this._pjDelete
        }, "\u5220\u9664\u5F02\u5E38\u9879\u76EE")));
      }

      content_detail = React.createElement("div", {
        className: "ui two stackable cards"
      }, React.createElement(NewCardItem, {
        cardinfo: cardinfo,
        msgs: this.state.msgs
      }), React.createElement("div", {
        className: "ui card"
      }, React.createElement("div", {
        className: "content"
      }, "\u9879\u76EE\u6210\u5458"), React.createElement("div", {
        className: "content"
      }, React.createElement("div", {
        className: "ui labels"
      }, useritems))), React.createElement("div", {
        className: "ui card"
      }, React.createElement("div", {
        className: "content"
      }, "\u9879\u76EE\u8BE6\u60C5"), React.createElement("div", {
        className: "content",
        dangerouslySetInnerHTML: {
          __html: post_content
        }
      })), React.createElement("div", {
        className: "ui card"
      }, React.createElement("div", {
        className: "content"
      }, "\u5386\u53F2\u7EAA\u5F55"), React.createElement("div", {
        className: "content"
      }, auditHistoryHtml)), React.createElement("div", {
        className: "ui card"
      }, React.createElement("div", {
        className: "content"
      }, "\u5B8C\u6210\u6761\u4EF6"), React.createElement("div", {
        className: "content"
      }, conditionItem)), ogbtn);
    }

    if (this.state.msgs.hasOwnProperty(cardinfo.project_meta.ID) == true) {
      projectmsg = this.state.msgs[cardinfo.project_meta.ID];
      var msgHtml = projectmsg.map(function (result) {
        return React.createElement(MSGelement, {
          msginfo: result
        });
      });
    }

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
          __html: post_title
        }
      })), React.createElement("div", {
        className: "one wide column",
        style: {
          'padding-right': '0px'
        }
      }), React.createElement("div", {
        className: "ui top attached tabular inverted secondary pointing menu fluid three item"
      }, React.createElement("a", {
        className: "item active",
        "data-tab": "chat"
      }, "\u5BF9\u8BDD"), React.createElement("a", {
        className: "item",
        "data-tab": "detail"
      }, "\u9879\u76EE\u5185\u5BB9"), React.createElement("a", {
        className: "item",
        "data-tab": "children"
      }, "\u5B50\u9879\u76EE\u5217\u8868")))), React.createElement("div", {
        className: "",
        id: "pjmoreoutdiv"
      }, React.createElement("div", {
        className: "ui bottom attached tab active",
        "data-tab": "chat"
      }, React.createElement("div", {
        className: "ui bottom attached vertical pushable container"
      }, React.createElement("div", {
        className: "chat_container pusher",
        style: {
          'padding': '0 0 6em'
        }
      }, msgHtml, React.createElement("div", {
        id: "msgBottomAnchor"
      }))), React.createElement(ChatControlMenu, null)), React.createElement("div", {
        className: "ui bottom attached tab",
        "data-tab": "detail"
      }, React.createElement("div", {
        className: "ui bottom attached vertical pushable container"
      }, React.createElement("div", {
        id: "detailBottomAnchor"
      }), React.createElement("div", {
        className: "pusher",
        style: {
          'padding': '2em 1.1em 10em'
        }
      }, content_detail))), React.createElement("div", {
        className: "ui bottom attached tab",
        "data-tab": "children"
      }, React.createElement("div", {
        className: "ui bottom attached vertical pushable container"
      }, React.createElement("div", {
        id: "childrenBottomAnchor"
      }), React.createElement("div", {
        className: "pusher"
      }, React.createElement("div", {
        className: "ui two stackable cards"
      }, content_children))))));
    } else {
      return React.createElement(Redirect, {
        to: "/project"
      });
    }
  }
});
var KPIDetail = React.createClass({
  displayName: "KPIDetail",

  getInitialState() {
    return {
      KPIDetail: [],
      initCompleted: false
    };
  },

  componentDidMount() {
    var _this = this;

    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    });
    emitter.addListener('To_KPIDetail', this.KPIDetail_To_KPIDetail_callback);
  },

  componentWillUnmount() {
    clearInterval(KPICardItem_timer);
    emitter.removeListener('To_KPIDetail', this.KPIDetail_To_KPIDetail_callback);
  },

  KPIDetail_To_KPIDetail_callback() {
    this.setState({
      KPIDetail: emitterChannel.To_KPIDetail
    });
  },

  _onBack: function () {
    this.setState({
      initCompleted: true
    });
  },
  render: function () {
    var title = this.state.KPIDetail.length > 0 ? this.state.KPIDetail[0].title : '';

    if (this.state.KPIDetail.length > 0) {
      var KPIList = this.state.KPIDetail.map(function (result) {
        var icon = '';
        var actual_color = '';

        if (result.collectedData.key_8 == '≥') {
          icon = '≥';

          if (parseFloat(result.collectedData.key_10) < parseFloat(result.collectedData.key_7)) {
            actual_color = 'red';
          } else {
            actual_color = 'green';
          }
        } else {
          icon = '≤';

          if (parseFloat(result.collectedData.key_10) < parseFloat(result.collectedData.key_7)) {
            actual_color = 'green';
          } else {
            actual_color = 'red';
          }
        }

        var span_style = {
          'padding': '3px 15px',
          'color': '#fff',
          'border-radius': '20px',
          'text-decoration': 'none',
          'font-size': '10px'
        };
        return React.createElement("div", {
          className: "ui segment grid"
        }, React.createElement("div", {
          className: "eight wide column"
        }, React.createElement("h5", {
          className: "ui left floated header"
        }, React.createElement("i", {
          className: "bar chart icon"
        }), React.createElement("div", {
          className: "content"
        }, result.collectedData.key_9.substr(0, 7)))), React.createElement("div", {
          className: "eight wide right floated right aligned column"
        }, React.createElement("a", {
          className: actual_color + " ui image label right floated"
        }, "\u76EE\u6807\u503C:", icon, result.collectedData.key_7, React.createElement("div", {
          className: "detail"
        }, "\u5B9E\u9645\u503C:", result.collectedData.key_10))));
      });
    }

    if (this.state.initCompleted == false) {
      return React.createElement("div", null, React.createElement("div", {
        className: "ui sticky mainHeader inverted red segment",
        style: {
          'borderRadius': '0px'
        }
      }, React.createElement("div", {
        className: "ui container grid"
      }, React.createElement("div", {
        className: "three wide column",
        style: {
          'padding-left': '0px'
        }
      }, React.createElement("a", {
        href: "javascript:void(0);",
        onClick: this._onBack
      }, React.createElement("i", {
        className: "chevron left icon inverted"
      }))), React.createElement("div", {
        className: "ten wide column"
      }, React.createElement("div", {
        className: "ui small header centered inverted"
      }, title + " - 历史列表")), React.createElement("div", {
        className: "three wide column"
      }))), React.createElement("div", {
        className: "ui bottom attached vertical pushable container"
      }, React.createElement("div", {
        className: "pusher",
        style: {
          'padding': '1em 0em 10em'
        }
      }, React.createElement("div", {
        className: "ui container"
      }, React.createElement("div", {
        className: "ui red raised segments"
      }, KPIList)))));
    } else {
      return React.createElement(Redirect, {
        to: "/profile"
      });
    }
  }
});
var KPIDetailPersonal = React.createClass({
  displayName: "KPIDetailPersonal",

  getInitialState() {
    return {
      KPIDetailPersonal: [],
      initCompleted: false
    };
  },

  componentDidMount() {
    var _this = this;

    $('.ui.sticky.mainHeader').sticky({
      context: '#kenta-app'
    });
    emitter.addListener('To_KPIDetailPersonal', function (data) {
      //console.log(123,data);
      _this.setState({
        KPIDetailPersonal: data
      });
    });
  },

  _onBack: function () {
    this.setState({
      initCompleted: true
    });
  },
  render: function () {
    var title = this.state.KPIDetailPersonal.length > 0 ? this.state.KPIDetailPersonal[0].title : '';

    if (this.state.KPIDetailPersonal.length > 0) {
      var KPIList = this.state.KPIDetailPersonal.map(function (result) {
        var icon = '';
        var actual_color = '';

        if (result.collectedData.key_3 == '≥') {
          icon = '≥';

          if (parseFloat(result.collectedData.key_5) < parseFloat(result.collectedData.key_2)) {
            actual_color = 'red';
          } else {
            actual_color = 'green';
          }
        } else {
          icon = '≤';

          if (parseFloat(result.collectedData.key_5) < parseFloat(result.collectedData.key_2)) {
            actual_color = 'green';
          } else {
            actual_color = 'red';
          }
        }

        var span_style = {
          'padding': '3px 15px',
          'color': '#fff',
          'border-radius': '20px',
          'text-decoration': 'none',
          'font-size': '10px'
        };
        return React.createElement("div", {
          className: "ui segment grid"
        }, React.createElement("div", {
          className: "eight wide column"
        }, React.createElement("h5", {
          className: "ui left floated header"
        }, React.createElement("i", {
          className: "bar chart icon"
        }), React.createElement("div", {
          className: "content"
        }, result.collectedData.key_4.substr(0, 7)))), React.createElement("div", {
          className: "eight wide right floated right aligned column"
        }, React.createElement("a", {
          className: actual_color + " ui image label right floated"
        }, "\u76EE\u6807\u503C:", icon, result.collectedData.key_2, React.createElement("div", {
          className: "detail"
        }, "\u5B9E\u9645\u503C:", result.collectedData.key_5))));
      });
    }

    if (this.state.initCompleted == false) {
      return React.createElement("div", null, React.createElement("div", {
        className: "ui sticky mainHeader inverted red segment",
        style: {
          'borderRadius': '0px'
        }
      }, React.createElement("div", {
        className: "ui container grid"
      }, React.createElement("div", {
        className: "three wide column",
        style: {
          'padding-left': '0px'
        }
      }, React.createElement("a", {
        href: "javascript:void(0);",
        onClick: this._onBack
      }, React.createElement("i", {
        className: "chevron left icon inverted"
      }))), React.createElement("div", {
        className: "ten wide column"
      }, React.createElement("div", {
        className: "ui small header centered inverted"
      }, title + " - 历史列表")), React.createElement("div", {
        className: "three wide column"
      }))), React.createElement("div", {
        className: "ui bottom attached vertical pushable container"
      }, React.createElement("div", {
        className: "pusher",
        style: {
          'padding': '1em 0em 10em'
        }
      }, React.createElement("div", {
        className: "ui container"
      }, React.createElement("div", {
        className: "ui red raised segments"
      }, KPIList)))));
    } else {
      return React.createElement(Redirect, {
        to: "/profile"
      });
    }
  }
});
var ProjectCreateAndEdit = React.createClass({
  displayName: "ProjectCreateAndEdit",

  getInitialState() {
    return {
      isback: false,
      contacts: '',
      changepage: '',
      complete: false
    };
  },

  componentWillMount() {},

  componentDidMount() {
    var _this = this;

    $('#post_title').val(globalData.editData.title);
    $('#post_content').val(globalData.editData.content);
    $('#project_end_time').val(globalData.editData.deadline.substr(0, 10));
    var remaindays = moment(moment(globalData.editData.deadline.substr(0, 10), moment.ISO_8601).toISOString()).diff(moment().format("YYYY-MM-DD"), 'days');
    $('#project_delaydays').val(remaindays);
    emitter.addListener('usercanceled', function () {
      console.log('usercanceled');

      _this.setState();
    });
    emitter.addListener('projectcreatedoredited', this.projectcreatedoredited_callback);
  },

  componentWillUnmount() {
    emitter.removeListener('projectcreatedoredited', this.projectcreatedoredited_callback);
  },

  projectcreatedoredited_callback() {
    this.setState({
      complete: true
    });
  },

  _onBack() {
    globalData.editData = {};
    this.setState({
      isback: true
    });
  },

  _onSubmit() {
    var _this = this;

    var parent_id = globalData.editData.ID;
    var post_title = $('#post_title').val();
    var post_content = $('#post_content').val();
    var project_deadline = globalData.editData.deadline;
    var project_start_time = project_deadline;
    var project_end_time = globalData.editData.deadline; //var parent_timestamp = new Date(globalData.Project.project_meta.project_deadline[0]).getTime();

    var child_timestamp = new Date(project_deadline).getTime();

    if (post_title == '') {
      alert("项目标题必须");
      return false;
    }

    if (post_content == '') {
      alert("项目内容必须");
      return false;
    }

    if (project_deadline == '') {
      alert("项目截止时间必须");
      return false;
    }

    if (globalData.editData.type == 'create') {
      var parent_timestamp = new Date(globalData.Project.project_meta.project_deadline[0]).getTime();

      if (child_timestamp > parent_timestamp) {
        alert('不得超过主项目限期' + globalData.Project.project_meta.project_deadline);
        return false;
      }
    } else {
      var parent_timestamp = new Date(globalData.Project.project_meta.parent_id.meta.project_deadline[0]).getTime();

      if (child_timestamp > parent_timestamp) {
        alert('不得超过主项目限期' + globalData.Project.project_meta.parent_id.meta.project_deadline);
        return false;
      }
    }

    if (globalData.editData.pm == '') {
      alert("项目执行人必须");
      return false;
    }

    var pm = globalData.editData.pm;
    var members = globalData.editData.member;

    if (globalData.editData.member.indexOf(currentUser.user_name) == -1) {
      members.push(currentUser.user_name);
    }

    $('#projectcreateandeditloading').addClass('ui active inverted dimmer');

    if (globalData.editData.type == 'create') {
      var url = 'https://www.kenta.cn/app3/wp-json/form/v2/create';
      var message = {
        "method": "POST",
        "actionURL": url,
        "action": "projectcreate",
        "headerAttach": "\"Content-Type\":\"application/json\"",
        "submitJSON": {
          "type": "post",
          "status": "publish",
          "project_status_v3": ["1"],
          "username": currentUser.user_name,
          "categories": [8],
          "title": post_title,
          "content": post_content,
          "parent_id": parent_id,
          "pm": pm,
          "member": members,
          "organizer": currentUser.user_name,
          "project_deadline": project_deadline,
          "project_start_time": project_start_time,
          "project_end_time": project_end_time,
          "conditions_v3": []
        }
      };
      OAuthSubmit(message);
    } else {
      var meta = globalData.Project.project_meta;
      var url = 'https://www.kenta.cn/app3/wp-json/form/v2/item/' + meta.ID;
      var message = {
        "method": "PUT",
        "actionURL": url,
        "action": "projectedit",
        "headerAttach": "\"Content-Type\":\"application/json\"",
        "submitJSON": {
          "title": post_title,
          "content": post_content,
          "status": "publish",
          "username": meta.username[0],
          "pm": pm,
          "member": members,
          "organizer": meta.organizer.AD_name,
          "project_deadline": project_deadline,
          "project_start_time": project_start_time,
          "project_end_time": project_end_time,
          "conditions_v3": meta.conditions_v3
        }
      };
      OAuthSubmit(message);
    }

    globalData.childrenrequired = true;
    globalData.Children = [];
  },

  goStaffSelect() {
    this.setState({
      changepage: 'staff'
    });
  },

  formChange() {
    globalData.editData.title = $('#post_title').val();
    globalData.editData.content = $('#post_content').val();
  },

  datetodaysChange() {
    globalData.editData.deadline = moment($('#project_end_time').val(), moment.ISO_8601).toISOString();
    var remaindays = moment(globalData.editData.deadline).diff(moment().format("YYYY-MM-DD"), 'days');
    $('#project_delaydays').val(remaindays);
    globalData.editData.remaindays = remaindays;
  },

  daystodateChange() {
    globalData.editData.remaindays = $('#project_delaydays').val();
    var deadline = moment().add(globalData.editData.remaindays, "days").format("YYYY-MM-DD");
    $('#project_end_time').val(deadline);
    globalData.editData.deadline = deadline;
  },

  render() {
    var usercount = 0;

    if (this.state.isback == false) {
      var top_title = globalData.editData.type == 'create' ? '项目创建' : '项目修改';
      var headitems = '';
      var userarray = [];
      var tmp_og = toFullInfo(globalData.editData.organizer);

      if (globalData.editData.pm != '') {
        if (globalData.editData.pm == globalData.editData.organizer) {
          tmp_og.pj_role = 'og_pm';
          userarray.push(tmp_og);
        } else {
          tmp_og.pj_role = 'og';
          var tmp_pm = toFullInfo(globalData.editData.pm);
          tmp_pm.pj_role = 'pm';
          userarray.push(tmp_og, tmp_pm);
        }
      } else {
        tmp_og.pj_role = 'og';
        userarray.push(tmp_og);
      }

      if (globalData.editData.member.length != 0) {
        globalData.editData.member.map(function (result) {
          if (result != globalData.editData.organizer && result != globalData.editData.pm) {
            var tmp_mb = toFullInfo(result);
            tmp_mb.pj_role = 'member';
            userarray.push(tmp_mb);
          }
        });
      }

      usercount = userarray.length;
      headitems = userarray.map(function (result) {
        return React.createElement(HeadImgII, {
          info: result
        });
      });

      if (this.state.changepage == '') {
        if (this.state.complete == false) {
          return React.createElement("div", {
            id: "",
            className: ""
          }, React.createElement("div", {
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
            className: "ui small header centered inverted"
          }, top_title)), React.createElement("div", {
            className: "one wide column",
            style: {
              'padding-right': '0px'
            }
          }))), React.createElement("div", {
            className: "ui form container"
          }, React.createElement("div", {
            className: "field"
          }, React.createElement("label", null, "\u9879\u76EE\u540D\u79F0"), React.createElement("input", {
            id: "post_title",
            type: "text",
            placeholder: "\u8BF7\u586B\u5199\u9879\u76EE\u540D\u79F0...",
            onChange: this.formChange
          })), React.createElement("div", {
            className: "field"
          }, React.createElement("label", null, "\u9879\u76EE\u9650\u671F(\u6307\u5B9A\u65E5\u5B50)"), React.createElement("input", {
            type: "date",
            id: "project_end_time",
            onChange: this.datetodaysChange
          })), React.createElement("div", {
            className: "field"
          }, React.createElement("label", null, "\u9879\u76EE\u9650\u671F(\u6307\u5B9A\u5929\u6570)"), React.createElement("input", {
            type: "number",
            id: "project_delaydays",
            placeholder: "\u9700\u8BA1\u7B97\u5929\u6570...",
            onChange: this.daystodateChange
          })), React.createElement("div", {
            className: "field"
          }, React.createElement("label", null, "\u9879\u76EE\u8BE6\u60C5"), React.createElement("textarea", {
            id: "post_content",
            rows: "2",
            placeholder: "\u9879\u76EE\u7684\u8BE6\u7EC6\u8BF4\u660E...",
            onChange: this.formChange
          })), React.createElement("div", {
            className: "field"
          }, React.createElement("label", null, "\u9879\u76EE\u6210\u5458(", usercount, "\u4EBA)"), headitems, React.createElement("hr", null), React.createElement("select", {
            multiple: "",
            className: "ui dropdown",
            onClick: this.goStaffSelect
          }, React.createElement("option", {
            value: ""
          }, "\u9009\u62E9\u4EBA\u5458"))), React.createElement("div", {
            className: "field"
          }, React.createElement("label", null, "\u9879\u76EE\u5B8C\u6210\u6761\u4EF6"), React.createElement("input", {
            type: "text",
            placeholder: "\u8BF7\u586B\u9879\u76EE\u5B8C\u6210\u6761\u4EF6..."
          })), React.createElement("div", {
            className: "ui submit button",
            onClick: this._onSubmit
          }, "\u63D0\u4EA4")), React.createElement("div", {
            id: "projectcreateandeditloading"
          }, React.createElement("div", {
            className: "ui text loader"
          }, "\u8BF7\u7A0D\u5019...")));
        } else {
          return React.createElement(Redirect, {
            to: "/project"
          });
        }
      } else {
        return React.createElement(Redirect, {
          to: '/' + this.state.changepage
        });
      }
    } else {
      return React.createElement(Redirect, {
        to: "/projectmore"
      });
    }
  }

});
var IframeWindow = React.createClass({
  displayName: "IframeWindow",

  getInitialState() {
    return {
      initCompleted: false
    };
  },

  _onBack() {
    this.setState({
      initCompleted: true
    });
  },

  render() {
    if (this.state.initCompleted == false) {
      return React.createElement("div", {
        className: "container_page_fullwidth"
      }, React.createElement("div", {
        className: "top_bar"
      }, React.createElement("div", {
        className: "wrap_top"
      }, React.createElement("div", {
        className: "back_ico icohleft"
      }, React.createElement("a", {
        href: "javascript:void(0);",
        title: "Back",
        onClick: this._onBack
      }, React.createElement("i", {
        className: "fa fa-arrow-left",
        "aria-hidden": "true"
      }))), React.createElement("div", {
        className: "text_title"
      }))), React.createElement("div", {
        className: "content_body"
      }, React.createElement("iframe", {
        src: globalData.iframeurl,
        style: {
          'width': '1920px',
          'height': '1080px'
        }
      }, React.createElement("p", null, "\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301  iframe \u6807\u7B7E\u3002"))));
    } else {
      return React.createElement(Redirect, {
        to: "/more"
      });
    }
  }

});
var FormDisplay = React.createClass({
  displayName: "FormDisplay",

  getInitialState() {
    return {
      loading: false,
      data: []
    };
  },

  componentWillMount() {
    var _this = this; //this.initData();


    emitter.addListener('idsearch', function (data) {
      _this.initData();
    });
    emitter.addListener('datapost', function (data) {
      ManageScore();
      alert('评分完成');

      _this.displayAlreadyManaged();

      _this.state.data.htmljson.map(function (result, rk) {
        var key = 'key_' + rk;

        if (rk > 0) {
          $('.' + key).dropdown('clear');
        }

        $('#key_2').val('');
        $('#key_3').val('');
      });

      $('#formdisplayloading').removeClass();
    });
  },

  componentDidMount() {},

  componentDidUpdate() {
    var _this = this;

    if (this.state.data.htmljson != undefined) {
      var deptStaffCache = {};
      this.initializeSemantic(this.state.data.htmljson);

      if (FormDisplay.ID == 10788) {
        $('.ui.dropdown.multiselect.key_1').dropdown();
        var temp = {
          'name': currentUser.real_name,
          'value': currentUser.department + '-' + currentUser.real_name + '-' + currentUser.user_name,
          'selected': true
        };
        var depttemp = {
          'name': currentUser.department,
          'value': currentUser.department,
          'selected': true
        };
        $('.ui.dropdown.staffLevel.key_0').addClass("disabled").dropdown({
          values: [temp]
        });
        $('.ui.dropdown.deptLevel.key_0').addClass("disabled").dropdown({
          values: [depttemp]
        });
      }
    }
  },

  displayAlreadyManaged(date) {
    var date = date;
    var data = this.state.data;
    var currentManage = [];
    var alreadyManagedArr = [];
    var notmanagearr = [];

    if (globalData.ManageScore[date] != undefined) {
      var monthData = globalData.ManageScore[date];

      var tmp = _.groupBy(monthData, function (n) {
        return n.collectedData.key_0.staffValue.split('-')[2];
      });

      currentManage = tmp[currentUser.user_name] == undefined ? [] : tmp[currentUser.user_name];
      currentManage.map(function (result) {
        alreadyManagedArr = alreadyManagedArr.concat(result.collectedData.key_1);
      });
      var str1 = [];

      _.union(alreadyManagedArr).map(function (result) {
        if (toFullInfo(result).real_name != undefined) {
          str1.push(toFullInfo(result).real_name + '-' + toFullInfo(result).dept + '-' + toFullInfo(result).role_name);
        }
      });

      var displayhtml = "<div class='ui pointing below label'><label>已评人员(" + date + ")</label></div><div class='field'><textarea readonly='readonly'>" + str1 + "</textarea></div>";
      $('#special').html(displayhtml);
      notmanagearr = _.difference(data.htmljson[1].options, _.union(alreadyManagedArr));
    }
  },

  initData() {
    var _this = this;

    this.setState({
      loading: true
    });
    setTimeout(function () {
      dataDB.getItem('data').then(function (data) {
        _this.setState({
          loading: false,
          data: data
        });

        if (FormDisplay.ID == 10788) {
          $('.ui.form.renderapp').form({
            fields: {
              diy_key_4: {
                rules: [{
                  type: 'empty',
                  prompt: '还未打分'
                }]
              },
              bday_key_2: {
                rules: [{
                  type: 'empty',
                  prompt: '还未选择日期'
                }]
              }
            }
          });
          $("#key_2").val(moment().subtract(1, 'month').format('YYYY-MM-') + '01');
          $('#key_2').attr('disabled', true);
          EvaluateStandard = MonthLastEvaluateStandard[moment().subtract(1, 'month').format('YY-MM')];
          console.log('EvaluateStandard', EvaluateStandard); //本次特殊处理 因为8月份的评分未做 系统内8月份的eva又不正确 就用最新的eva
          //EvaluateStandard = NewestEvaluateStandard;

          var currentdate = $('#key_2').val().substr(2, 5);

          var tmp = _.groupBy(globalData.ManageScore[currentdate], function (n) {
            return n.collectedData.key_0.staffValue.split('-')[2];
          }); //console.log('tmp',tmp,data);


          var currentManage = tmp[currentUser.user_name] == undefined ? [] : tmp[currentUser.user_name];
          var alreadyManagedArr = [];
          currentManage.map(function (result) {
            alreadyManagedArr = alreadyManagedArr.concat(result.collectedData.key_1);
          });
          var allNeedManaged = getAuditToUser(EvaluateStandard, currentUser.user_name); //var allNeedManaged = getAuditToUser(EvaluateStandard,'wanguang.lee');

          console.log('allNeedManaged', allNeedManaged);

          var notmanagearr = _.difference(allNeedManaged, _.union(alreadyManagedArr));

          var managedarr = notmanagearr.map(function (result) {
            return {
              'name': toFullInfo(result).real_name,
              'value': result
            };
          });

          var list_managed = _.union(alreadyManagedArr).map(function (result) {
            return {
              'name': toFullInfo(result).real_name,
              'value': result
            };
          });

          $('.ui.dropdown.key_1').dropdown({
            values: managedarr
          }); //未评清单

          $('.ui.dropdown.key_managed').dropdown({
            values: list_managed
          }); //已评清单

          _this.displayAlreadyManaged(currentdate);
          /*var data = _this.state.data;
          var managedarr = data.htmljson[1].options.map(function(result){
          	return ({'name':toFullInfo(result).real_name,'value':result});
          });*/


          var socrearr = data.htmljson[4].options.map(function (result) {
            return {
              'name': result,
              'value': result
            };
          });
          $('.ui.dropdown.key_4').dropdown({
            values: socrearr,
            maxSelections: 1
          });
          /*$('#key_2').change(function(){
          	var date = $('#key_2').val().substr(2,5);
          	_this.displayAlreadyManaged(date);
          });
          var currentDate = moment().format('YY-MM');
          _this.displayAlreadyManaged(currentDate);*/
        }

        if (FormDisplay.ID == 9670) {
          $('.ui.dropdown.key_1').dropdown({
            values: form_9670_dropdownarr
          });
        }
      }).catch(function (err) {
        _this.setState({
          loading: false,
          data: 'error'
        });
      });
    }, 1000);
  },

  initializeSemantic: function (htmljson) {
    var _this = this;

    var fieldsobj = {};
    htmljson.map(function (result, rk) {
      var key = 'key_' + rk;

      if (result.type == 'input') {
        var name = 'input_' + key;
      }

      if (result.type == 'textarea') {
        var name = 'textarea_' + key;
      }

      if (result.type == 'date') {
        var name = 'bday_' + key;
      }

      if (result.type == 'multiselect') {
        if (result.category == '部门') {
          var name = 'depts_' + key;
        } else if (result.category == '人员') {
          var name = 'staffs_' + key;
        } else if (result.category == '职位') {
          var name = 'position_' + key;
        } else {
          var name = 'diy_' + key;
        }
      }

      if (result.mustrequire == "true") {
        fieldsobj[name] = 'empty';
      }
    });
    $('.ui.form.renderapp').form({
      fields: fieldsobj,
      onSuccess: function (event) {
        return true;
      },
      onFailure: function (event) {
        return false;
      }
    });
    htmljson.map(function (result, index) {
      var key = 'key_' + index;

      if (result.type == 'multiselect') {
        if (result.category == '自定义') {
          if (result.multivalue.valuenumber == '1') {
            $('.ui.dropdown.multiselect.' + key).dropdown({
              maxSelections: 1
            });
          }

          if (result.multivalue.valuenumber == '2') {
            $('.ui.dropdown.multiselect.' + key).dropdown();
          }

          if (result.multivalue.valuenumber == '3') {
            $('.ui.dropdown.multiselect.' + key).dropdown({
              maxSelections: parseInt(result.multivalue.valuemax)
            });
          }
        } else {
          _this.initializeDeptAndStaff(key, result.category, result.multivalue.valuenumber, result.multivalue.valuemax);
        }
      }
    });
  },
  initializeDeptAndStaff: function (key, str, valuenumber, valuemax) {
    var deptStaffCache = {};
    var maxSelections = 99999;

    if (valuenumber == '1') {
      maxSelections = 1;
    }

    if (valuenumber == '3') {
      maxSelections = parseInt(valuemax);
    }

    if (str == '职位') {
      $('.ui.dropdown.position.' + key).dropdown({
        apiSettings: {
          //cache:true,
          onResponse: function (urlReturn) {
            deptStaffCache = {
              results: {}
            };
            $.each(urlReturn.alluser, function (index, item) {
              if (!item.data.meta.workno) {
                var position = '无工号人员';
              } else if (!item.data.meta.hr_info) {
                var position = '人事系统不能同步人员';
              } else if (!item.data.meta.hr_info.jobna) {
                var position = '无职位';
              } else if (item.data.meta.hr_info.jobna == "") {
                var position = '无职位';
              } else if (item.data.meta.hr_info.jobna) {
                var position = item.data.meta.hr_info.jobna;
              }

              ;

              if (deptStaffCache.results[position] === undefined) {
                deptStaffCache.results[position] = {
                  name: position,
                  value: position,
                  results: []
                };
              }
            });
            return deptStaffCache;
          },
          url: '//www.kenta.cn/app3/wp-admin/admin-ajax.php?action=listAllUser'
        },
        maxSelections: maxSelections,
        filterRemoteData: true
      });
    } else if (str == '部门') {
      $('.ui.dropdown.staffLevel.' + key).dropdown();
      $('.ui.dropdown.deptLevel.' + key).dropdown({
        onChange: function () {
          $('.ui.dropdown.staffLevel.' + key).dropdown({
            values: []
          });
          var filter = $('.ui.dropdown.deptLevel.' + key).dropdown('get value');

          var filteredDepts = _.pick(deptStaffCache.results, filter.split(','));

          var CombinedStaff = _.flatten(_.reduce(filteredDepts, function (result, value, key) {
            result.push(value.results);
            return result;
          }, []));

          $('.ui.dropdown.staffLevel.' + key).dropdown({
            values: CombinedStaff,
            onChange: function () {}
          });
          $('.ui.dropdown.staffLevel.' + key).dropdown('refresh');
        },
        apiSettings: {
          cache: false,
          onResponse: function (urlReturn) {
            deptStaffCache = {
              results: {}
            };
            $.each(urlReturn.alluser, function (index, item) {
              if (!item.data.meta.workno) {
                var dept = '无工号人员';
              } else if (!item.data.meta.hr_info) {
                var dept = '人事系统不能同步人员';
              } else if (!item.data.meta.hr_info.branna) {
                var dept = '空部门';
              } else if (item.data.meta.hr_info.branna == "") {
                var dept = '空部门';
              } else if (item.data.meta.hr_info.branna) {
                var dept = item.data.meta.hr_info.branna;
              }

              ;

              if (deptStaffCache.results[dept] === undefined) {
                deptStaffCache.results[dept] = {
                  name: dept,
                  value: dept,
                  results: []
                };
              }

              var valuestr = dept + '-' + item.data.display_name + '-' + item.data.user_login;
              deptStaffCache.results[dept].results.push({
                "name": item.data.display_name,
                "value": valuestr
              });
            });
            return deptStaffCache;
          },
          url: '//www.kenta.cn/app3/wp-admin/admin-ajax.php?action=listAllUser'
        },
        maxSelections: maxSelections,
        filterRemoteData: true
      });
    } else {
      $('.ui.dropdown.staffLevel.' + key).dropdown({
        maxSelections: maxSelections
      });
      $('.ui.dropdown.deptLevel.' + key).dropdown({
        onChange: function () {
          $('.ui.dropdown.staffLevel.' + key).dropdown({
            values: [],
            maxSelections: maxSelections
          });
          var filter = $('.ui.dropdown.deptLevel.' + key).dropdown('get value');

          var filteredDepts = _.pick(deptStaffCache.results, filter.split(','));

          var CombinedStaff = _.flatten(_.reduce(filteredDepts, function (result, value, key) {
            result.push(value.results);
            return result;
          }, []));

          $('.ui.dropdown.staffLevel.' + key).dropdown({
            values: CombinedStaff,
            onChange: function () {},
            maxSelections: maxSelections
          });
          $('.ui.dropdown.staffLevel.' + key).dropdown('refresh');
        },
        apiSettings: {
          cache: false,
          onResponse: function (urlReturn) {
            console.log(999, urlReturn);
            deptStaffCache = {
              results: {}
            };
            $.each(urlReturn.alluser, function (index, item) {
              if (!item.data.meta.workno) {
                var dept = '无工号人员';
              } else if (!item.data.meta.hr_info) {
                var dept = '人事系统不能同步人员';
              } else if (!item.data.meta.hr_info.branna) {
                var dept = '空部门';
              } else if (item.data.meta.hr_info.branna == "") {
                var dept = '空部门';
              } else if (item.data.meta.hr_info.branna) {
                var dept = item.data.meta.hr_info.branna;
              }

              ;

              if (deptStaffCache.results[dept] === undefined) {
                deptStaffCache.results[dept] = {
                  name: dept,
                  value: dept,
                  results: []
                };
              }

              var valuestr = dept + '-' + item.data.display_name + '-' + item.data.user_login;
              deptStaffCache.results[dept].results.push({
                "name": item.data.display_name,
                "value": valuestr
              });
            });
            return deptStaffCache;
          },
          url: '//www.kenta.cn/app3/wp-admin/admin-ajax.php?action=listAllUser'
        },
        filterRemoteData: true
      });
    }
  },
  checkPost: function () {
    if ($('.ui.form.renderapp').form('validate form') == false) {
      alert('有错误 请检查');
      return false;
    } else {
      if ($('.key_4').dropdown('get value') != '8') {
        if ($('#key_3').val() == '') {
          alert('需填写评语');
        } else {
          this._submit(this.state.data);
        }
      } else {
        this._submit(this.state.data);
      }
    }
  },
  _submit: function (returndata) {
    var _this = this;

    var formdata = {};
    formdata.templateid = returndata.id;
    formdata.type = 'collecteddata';
    formdata.title = returndata.title;
    formdata.discription = returndata.discription;
    formdata.formtag = returndata.formtag;
    formdata.username = 'jiaming.liu';
    var data = {};
    var theadarr = [];
    returndata.htmljson.map(function (result, rk) {
      var key = 'key_' + rk;

      if (result.type == 'multiselect') {
        if (result.category == '自定义') {
          data[key] = $('.' + key).dropdown('get value').split(',');

          if (result.specialID == 10788) {
            data[key] = _.compact(data[key].concat($('.key_managed').dropdown('get value').split(',')));
          }
        } else if (result.category == '职位') {
          data[key] = $('.ui.dropdown.position.' + key).dropdown('get value');
        } else {
          data[key] = {
            'deptValue': $('.ui.dropdown.deptLevel.' + key).dropdown('get value'),
            'staffValue': $('.ui.dropdown.staffLevel.' + key).dropdown('get value')
          };
        }
      } else {
        data[key] = $('#' + key).val();
      }

      theadarr.push(result.thead);
    });
    formdata.collectedData = data;
    formdata.theads = theadarr;
    dataPost(formdata);
  },

  render() {
    var html = '未有数据';
    var manage_tip = '';

    if (this.state.loading == true) {
      html = '获取数据中...';
    }

    var submitBtn = React.createElement("div", {
      className: "ui bottom attached button",
      onClick: this.checkPost
    }, "\u63D0\u4EA4\u6570\u636E");

    if (this.state.data != '') {
      if (this.state.data == 'error') {
        html = '数据有误';
      } else {
        if (FormDisplay.ID == 10788) {
          manage_tip = React.createElement("h5", {
            style: {
              'color': 'red'
            }
          }, React.createElement("i", null, "\u8BF7\u5148\u9009\u62E9\u65E5\u671F\u4EE5\u514D\u51FA\u9519"));
          this.state.data.htmljson[1].options = FormDisplay.rolename;
          this.state.data.htmljson[1].specialID = 10788;
          var formoutput = WriteHtml(this.state.data.htmljson);
          var str = formoutput.splice(2, 1);
          formoutput.unshift(str[0]);
        }

        if (FormDisplay.ID == 9670) {
          this.state.data.htmljson[1].specialID = 9670;
          var formoutput = WriteHtml(this.state.data.htmljson);
        }

        html = React.createElement("form", {
          className: "ui fluid form container renderapp"
        }, React.createElement("div", null, React.createElement("span", {
          style: {
            "text-align": "center"
          }
        }, React.createElement("h3", null, this.state.data.title), manage_tip), React.createElement("span", {
          id: "special"
        }), formoutput, submitBtn, React.createElement("br", null), React.createElement("div", {
          className: "ui error message"
        })));
      }
    }

    return React.createElement("div", null, html, React.createElement("div", {
      id: "formdisplayloading"
    }, React.createElement("div", {
      className: "ui text loader"
    }, "\u8BF7\u7A0D\u5019...")));
  }

}); // 页内元件

var MainMenu = React.createClass({
  displayName: "MainMenu",

  getInitialState() {
    return {
      unreadcount: 0
    };
  },

  componentDidMount() {
    var _this = this;

    emitter.addListener('pid_obj', function (unreadcount) {
      var unreadcount = _.reduce(globalData.pid_obj, function (total, n) {
        total += n;
        return total;
      });

      _this.setState({
        unreadcount: unreadcount
      });
    });
  },

  render() {
    var unreadcount = this.state.unreadcount > 0 ? React.createElement("div", {
      className: "floating ui red label",
      style: {
        'top': '0.3em',
        'left': ' 80%'
      }
    }, this.state.unreadcount) : '';
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
    }), unreadcount, "\u9879\u76EE\u5217\u8868"), React.createElement(Link, {
      id: "MainMenu_Profile",
      className: "MainMenu item",
      to: "/profile"
    }, React.createElement("i", {
      className: "user outline icon"
    }), "\u4E2A\u4EBA\u4E2D\u5FC3"), React.createElement(Link, {
      id: "MainMunu_More",
      className: "MainMenu item",
      to: "/more"
    }, React.createElement("i", {
      className: "ellipsis horizontal icon"
    }), "\u66F4\u591A"));
  }

});
var ChatControlMenu = React.createClass({
  displayName: "ChatControlMenu",

  getInitialState() {
    return {
      status: '',
      target: ''
    };
  },

  componentDidMount() {
    var _this = this;

    $('.msgmoreplus').popup({
      //inline     : true,
      //hoverable  : true,
      position: 'top right',
      lastResort: 'top right',
      popup: $('.msgselectionpopup'),
      on: 'click'
    });
    emitter.addListener('sendmsg', function (str) {
      if (str == 'success') {
        $('#chatMessage').val('');

        _this.setState({
          status: ''
        });
      } else {
        _this.setState({
          status: 'error'
        });

        globalData.chatcanback = true;
      }
    });
    emitter.addListener('uploadfile', this.uploadfile_callback);
  },

  componentWillUnmount() {
    emitter.removeListener('uploadfile', this.uploadfile_callback);
  },

  uploadfile_callback() {
    this._sendData(emitterChannel.sendmsg.url, emitterChannel.sendmsg.filename, emitterChannel.sendmsg.size);
  },

  // 按 Enter 键时，发送对话消息
  _onKeyDown(e) {
    if (e.keyCode == 13) {
      e.preventDefault();

      this._sendData();

      return false;
    }
  },

  // 发送对话消息
  _sendData(url, filename, size) {
    this.setState({
      status: 'loading'
    });
    globalData.chatcanback = false;
    globalData.ChatToBottom = true;

    var _this = this;

    var content = '';
    var sourceobj = {};

    if (url == null || url == undefined) {
      content = this.refs.chatMessage.value;
    } else {
      var arr = url.split('.');

      if (arr[arr.length - 1] == 'jpg' || arr[arr.length - 1] == 'gif' || arr[arr.length - 1] == 'png') {
        content = "<img src='" + url + "'/>";
      } else {
        content = "<a href='" + url + "' download>" + filename + "</a>";
        sourceobj.size = size;
      }
    }

    var sourcestr = JSON.stringify(sourceobj);
    var date = Date.parse(new Date());
    var jsonobj = {};
    jsonobj[currentUser.user_name] = date;
    var jsonstr = JSON.stringify(jsonobj);
    var message = {
      'method': 'POST',
      'actionURL': 'https://www.kenta.cn/app3/wp-json/wp/v2/comments',
      "action": "msgsend",
      "headerAttach": "\"Content-Type\":\"application/json\"",
      'data': {
        'id': globalData.Project.ID,
        'member': globalData.Project.project_meta.member
      },
      //发送人肯定不会收到消息
      'submitJSON': {
        'post': globalData.Project.ID,
        'author': currentUser.author,
        'content': content,
        'status': 'publish',
        'meta': {
          'msg_username': currentUser.user_name,
          'read_user': jsonstr,
          'source_link': sourcestr
        }
      }
    };
    OAuthSubmit(message);
  },

  uploadFile() {
    var _this = this;

    var url = "https://www.kenta.cn/app3/wp-json/wp/v2/media";
    var file = $('#chatInputFile')[0].files[0];
    var message = {
      "method": "POSTwithDATA",
      "actionURL": "https://www.kenta.cn/app3/wp-json/wp/v2/media",
      "headerAttach": "\"Content-Disposition\": \"attachment;filename=\\\"" + encodeURI(file.name) + "\\\"\"",
      "action": "attachmentsend",
      "data": {
        "file": file
      },
      "submitJSON": {
        "processData": false,
        "postAttachment": file
      }
    };
    OAuthSubmit(message);
  },

  modalClick(type) {
    globalData.type = type;
    emitter.emit('accept_apply');
    $('.ui.fullscreen.modal').modal('show');
  },

  projectEdit() {
    var meta = globalData.Project.project_meta;
    globalData.editData = {
      'type': 'edit',
      'ID': meta.ID,
      'title': meta.title[0],
      'content': meta.content[0],
      'deadline': meta.project_deadline[0],
      'organizer': meta.organizer.AD_name,
      'pm': meta.pm.AD_name,
      'member': meta.member
    };
    this.setState({
      target: 'projectcreateandedit'
    });
  },

  projectCreate() {
    var meta = globalData.Project.project_meta;
    globalData.editData = {
      'type': 'create',
      'ID': meta.ID,
      'title': '',
      'content': '',
      'deadline': '',
      'organizer': currentUser.user_name,
      'pm': '',
      'member': []
    };
    this.setState({
      target: 'projectcreateandedit'
    });
  },

  FileClick() {
    $('#chatInputFile').click();
  },

  render() {
    var ogallowed = 'disabled';
    var pmallowed = 'disabled';
    var auditallowed = 'disabled';
    var meta = globalData.Project.project_meta;

    if (currentUser.user_name == meta.pm.AD_name) {
      pmallowed = '';
    }

    if (currentUser.user_name == meta.organizer.AD_name) {
      ogallowed = '';
    }

    var project_status = globalData.Project.project_meta.project_status_v3 != undefined ? parseInt(globalData.Project.project_meta.project_status_v3[0]) : 1;

    if (ogallowed == '' && [3, 4, 5].indexOf(project_status) != -1) {
      auditallowed = '';
    }

    if (this.state.target == '') {
      return React.createElement("div", {
        id: "idmsgcontrol",
        className: "ui sticky msgcontrol secondary segment fixed bottom html segment",
        style: {
          'margin': '0',
          'border-radius': '0',
          'width': '100%',
          'padding': ' 1em 0px 1.1em'
        }
      }, React.createElement("a", {
        className: "ui label hidden"
      }, "\u65B0\u6D88\u606F", React.createElement("i", {
        className: "angle double down icon"
      })), React.createElement("div", {
        className: "ui container grid"
      }, React.createElement("div", {
        className: "one wide column center aligned",
        style: {
          'padding': ' 1.4rem 0 1rem'
        }
      }, React.createElement("i", {
        className: "large link unmute icon"
      })), React.createElement("div", {
        className: "fourteen wide column center aligned",
        style: {
          'padding': ' 0.8rem 0.7rem 1rem'
        }
      }, React.createElement("div", {
        className: "ui icon fluid input " + this.state.status
      }, React.createElement("input", {
        ref: "chatMessage",
        id: "chatMessage",
        name: "chatmessage",
        type: "text",
        placeholder: "\u8F93\u5165\u8A0A\u606F...",
        onKeyDown: this._onKeyDown
      }), React.createElement("i", {
        className: "large send link outline icon",
        onClick: this._sendData.bind(this, null, null, null)
      }))), React.createElement("div", {
        className: "one wide column center aligned",
        style: {
          'padding': ' 1.4rem 0 1rem'
        }
      }, React.createElement("i", {
        className: "large link plus icon msgmoreplus"
      })), React.createElement("div", {
        className: "ui segment popup top left transition hidden msgselectionpopup",
        style: {
          'top': 'auto',
          'left': 'auto',
          'bottom': 'auto',
          'right': 'auto',
          'width': '927px'
        }
      }, React.createElement("div", {
        className: "ui centered grid",
        style: {
          'width': '20rem'
        }
      }, React.createElement("div", {
        className: "sixteen wide column",
        style: {
          'padding': '0.5em'
        }
      }, React.createElement("h4", {
        className: "ui horizontal divider header"
      }, React.createElement("i", {
        className: "plug icon"
      }), "\u53D1\u8D77\u4EBA\u9879\u76EE\u64CD\u4F5C\u7C7B")), React.createElement("div", {
        className: "row",
        style: {
          'padding': '0.4em'
        }
      }, React.createElement("div", {
        className: "ui button five wide column disabled"
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "power icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u5173\u95ED"))), React.createElement("div", {
        className: "ui button five wide column " + ogallowed,
        onClick: this.projectEdit
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "edit icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u4FEE\u6539"))), React.createElement("div", {
        className: "row",
        style: {
          'padding': '0.4em'
        }
      }, React.createElement("div", {
        className: "ui button five wide column " + auditallowed,
        onClick: this.modalClick.bind(this, 'audit_pass')
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "checkmark box icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u901A\u8FC7"))), React.createElement("div", {
        className: "ui button five wide column " + auditallowed,
        onClick: this.modalClick.bind(this, 'audit_refuse')
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "remove icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u5426\u51B3"))))), React.createElement("div", {
        className: "sixteen wide column",
        style: {
          'padding': '0.5em'
        }
      }, React.createElement("h4", {
        className: "ui horizontal divider header"
      }, React.createElement("i", {
        className: "id badge icon"
      }), "\u7BA1\u7406\u5458\u64CD\u4F5C\u7C7B")), React.createElement("div", {
        className: "row",
        style: {
          'padding': '0.4em'
        }
      }, React.createElement("div", {
        className: "ui button five wide column " + pmallowed,
        onClick: this.projectCreate
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "tasks icon"
      }), React.createElement("div", {
        className: "content",
        style: {
          'padding-left': '0.75em'
        }
      }, "\u521B\u5EFA"))), React.createElement("div", {
        className: "ui button five wide column " + pmallowed,
        onClick: this.projectEdit
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "edit icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u4FEE\u6539")))), React.createElement("div", {
        className: "sixteen wide column",
        style: {
          'padding': '0.5em'
        }
      }, React.createElement("h4", {
        className: "ui horizontal divider header"
      }, React.createElement("i", {
        className: "hand paper icon"
      }), "\u7533\u8BF7\u7C7B")), React.createElement("div", {
        className: "row",
        style: {
          'padding': '0.4em'
        }
      }, React.createElement("div", {
        className: "ui button five wide column " + pmallowed,
        onClick: this.modalClick.bind(this, 'applyfinish')
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "checkmark box icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u5B8C\u6210"))), React.createElement("div", {
        className: "ui button five wide column " + pmallowed,
        onClick: this.modalClick.bind(this, 'applydelay')
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "wait icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u5EF6\u671F"))), React.createElement("div", {
        className: "ui button five wide column " + pmallowed,
        onClick: this.modalClick.bind(this, 'applycancel')
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "undo icon"
      }), React.createElement("div", {
        className: "content"
      }, "\u53D6\u6D88")))), React.createElement("div", {
        className: "sixteen wide column",
        style: {
          'padding': '0.5em'
        }
      }, React.createElement("h4", {
        className: "ui horizontal divider header"
      }, React.createElement("i", {
        className: "tag icon"
      }), "\u5E38\u9A7B\u7C7B")), React.createElement("div", {
        className: "row",
        style: {
          'padding': '0.4em'
        }
      }, React.createElement("div", {
        className: "ui button five wide column center aligned",
        style: {
          'padding': '0'
        }
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "icons"
      }, React.createElement("i", {
        className: "photo icon"
      }), React.createElement("i", {
        className: "corner add icon"
      })), React.createElement("div", {
        className: "content",
        style: {
          'padding-left': '0.75em'
        }
      }, "\u62CD\u6444"))), React.createElement("div", {
        className: "ui button five wide column center aligned",
        style: {
          'padding': '0'
        }
      }, React.createElement("h6", {
        className: "ui header grey",
        style: {
          'margin': '0'
        }
      }, React.createElement("i", {
        className: "icons"
      }, React.createElement("i", {
        className: "file outline icon"
      }), React.createElement("i", {
        className: "corner add icon"
      })), React.createElement("div", {
        className: "content",
        style: {
          'padding-left': '0.75em'
        }
      }, React.createElement("input", {
        type: "file",
        id: "chatInputFile",
        className: "b-pagebox",
        onChange: this.uploadFile
      }), React.createElement("span", {
        onClick: this.FileClick
      }, "\u6587\u4EF6")))))))));
    } else {
      return React.createElement(Redirect, {
        to: '/' + this.state.target
      });
    }
  }

});
var NewCardItem = React.createClass({
  displayName: "NewCardItem",

  getInitialState() {
    return {
      clicked: false,
      unreadcount: 0
    };
  },

  /*componentWillMount() {
  	var _this = this;
  	var readuser_timestamp = this.props.cardinfo.project_meta.readusers==undefined?'0000-00-00T00:00:00.000Z':this.props.cardinfo.project_meta.readusers[currentUser.user_name]==undefined?'0000-00-00T00:00:00.000Z':this.props.cardinfo.project_meta.readusers[currentUser.user_name];
  	var url = "https://www.kenta.cn/app3/wp-json/wp/v2/comments?post="+this.props.cardinfo.ID+"&after="+readuser_timestamp;
  	$.get(url,function(data){
  		if(globalData.pid_obj.hasOwnProperty(_this.props.cardinfo.ID) == false) {
  			globalData.pid_obj[_this.props.cardinfo.ID] = data.length;
  		}else {
  			if(globalData.pid_obj[_this.props.cardinfo.ID] != data.length) {
  				globalData.pid_obj[_this.props.cardinfo.ID] = data.length;
  			}
  		}
  		emitter.emit('pid_obj');
  		_this.setState({unreadcount:data.length});
  	},'json');
  },*/

  /*componentDidMount() {
  	emitter.addListener('AJAX_MSG',this.AJAX_MSG_callback);
  	//emitter.addListener('cardToProjectMoreFinished',this.cardToProjectMoreFinished_callback);
  },*/

  /*componentWillUnmount() {//销毁
  	emitter.removeListener('AJAX_MSG',this.AJAX_MSG_callback);
  	//emitter.removeListener('cardToProjectMoreFinished',this.cardToProjectMoreFinished_callback);
  },*/
  AJAX_MSG_callback() {
    var _this = this;

    var readuser_timestamp = this.props.cardinfo.project_meta.readusers == undefined ? '0000-00-00T00:00:00.000Z' : this.props.cardinfo.project_meta.readusers[currentUser.user_name] == undefined ? '0000-00-00T00:00:00.000Z' : _this.props.cardinfo.project_meta.readusers[currentUser.user_name];
    var url = "https://www.kenta.cn/app3/wp-json/wp/v2/comments?post=" + this.props.cardinfo.ID + "&after=" + readuser_timestamp;
    $.get(url, function (data) {
      if (globalData.pid_obj.hasOwnProperty(_this.props.cardinfo.ID) == false) {
        globalData.pid_obj[_this.props.cardinfo.ID] = data.length;
      } else {
        if (globalData.pid_obj[_this.props.cardinfo.ID] != data.length) {
          globalData.pid_obj[_this.props.cardinfo.ID] = data.length;
        }
      }

      emitter.emit('pid_obj');

      _this.setState({
        unreadcount: data.length
      });
    }, 'json');
  },

  /*cardToProjectMoreFinished_callback() {
  	this.setState({clicked:true});
  },*/
  goProjectMore() {
    var _this = this;

    globalData.Project = this.props.cardinfo;
    globalData.ChatToBottom = true;

    if (globalData.cangopromore == true) {
      globalData.cangopromore = false; //加载loading

      $("#cardloading_" + globalData.Project.ID).removeClass();
      $("#cardloading_" + globalData.Project.ID).addClass("ui active inverted dimmer"); //去掉loading

      $("#cardloading_" + globalData.Project.ID).removeClass();

      _this.setState({
        clicked: true
      });
    }
  },

  render() {
    var title = '';
    var sub_line = '';
    var cardinfo = this.props.cardinfo; //上级项目名称显示(上级id)

    var parent_name = cardinfo.project_meta.parent_id.ID == 0 ? '无上级群组' : cardinfo.project_meta.parent_id.title;
    var parent_str = parent_name;

    if (cardinfo.project_meta.parent_id.ID != 0) {
      parent_str += '(' + cardinfo.project_meta.parent_id.ID + ')';
    } //发起人真实姓名


    var organizerRealName = cardinfo.project_meta.organizer.DisplayName; //截止时间显示

    var overed = false;
    var dl_str = cardinfo.project_meta.project_deadline[0].substr(0, 16);

    if (dl_str.indexOf('/') != -1) {
      var tt = dl_str.substr(6, 4) + dl_str.substr(0, 2) + dl_str.substr(3, 2) + dl_str.substr(11, 2) + dl_str.substr(14, 2);
    } else {
      var tt = dl_str.substr(0, 4) + dl_str.substr(5, 2) + dl_str.substr(8, 2) + dl_str.substr(11, 2) + dl_str.substr(14, 2);
    }

    var tmp = moment(tt, "YYYYMMDDhhmm").fromNow();
    var show_str = '';

    if (tmp[tmp.length - 1] == '内') {
      show_str = '剩余' + tmp.substr(0, tmp.length - 1);
    } else {
      show_str = '过期' + tmp.substr(0, tmp.length - 1);
      overed = true;
    }

    var deadlinestr = moment(cardinfo.project_meta.project_deadline[0]).format('LL') + '(' + show_str + ')';
    var pm = cardinfo.project_meta.pm;
    var og = cardinfo.project_meta.organizer;
    var users = [];

    if (pm.AD_name == og.AD_name) {
      var tmp = {
        'user_name': pm.AD_name,
        'project_role': 'og_pm'
      };
      users.push(tmp);
    } else {
      var tmp_og = {
        'user_name': og.AD_name,
        'project_role': '发起人'
      };
      var tmp_pm = {
        'user_name': pm.AD_name,
        'project_role': 'PM'
      };
      users.push(tmp_og, tmp_pm);
    } //头像


    var useritems = users.map(function (result) {
      return React.createElement(HeadImg, {
        detail: result
      });
    });
    var post_title = cardinfo.project_meta.title != undefined ? cardinfo.project_meta.title[0].split('\n').join("<br/>") : cardinfo.title.rendered.split('\n').join("<br/>");
    post_title = post_title.split(' ').join('&nbsp;');
    title = React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: post_title
      }
    });
    sub_line = React.createElement("div", {
      className: "sub_line pj-padding"
    }, "ID: ", React.createElement("span", null, cardinfo.project_meta.ID), " | \u53D1\u8D77\u4EBA: ", React.createElement("span", null, organizerRealName), " |  \u4E0A\u7EA7\u9879\u76EE: ", React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: parent_str
      }
    }), " |  \u622A\u6B62\u65F6\u95F4: ", React.createElement("span", null, deadlinestr));
    var sonstatus = cardinfo.project_meta.hasChildProject == true ? '项目卡' : '任务卡'; //3.项目状态

    var projectStatusHtml = "";
    var project_status = cardinfo.project_meta.project_status_v3 != undefined ? parseInt(cardinfo.project_meta.project_status_v3[0]) : 1;
    var statuscolor = '';
    var overdisplay = 'b-pagebox';

    switch (project_status) {
      case 0:
        projectStatusHtml = '已取消';
        statuscolor = 'grey';
        break;

      case 1:
        projectStatusHtml = '进行中...';
        statuscolor = 'green';
        break;

      case 2:
        projectStatusHtml = '已完成';
        statuscolor = 'grey';
        break;

      case 3:
        projectStatusHtml = '申请完成';
        statuscolor = 'orange';
        break;

      case 4:
        projectStatusHtml = '申请延期';
        statuscolor = 'orange';
        break;

      case 5:
        projectStatusHtml = '申请取消';
        statuscolor = 'orange';
        break;
    } //过期的项目直接给过期状态


    if (overed == true && projectStatusHtml == '进行中...') {
      projectStatusHtml = '已过期';
      statuscolor = 'b-pagebox';
      overdisplay = 'red';
    } //Lastmessage


    var lastMessageHtml = '';
    var lastmsgstr = [];
    var unreadcount = 0;
    var urstatushide = '';
    var projectmsg = [];

    if (this.props.msgs != null && this.props.msgs.hasOwnProperty(cardinfo.ID) == true) {
      projectmsg = this.props.msgs[cardinfo.ID];
    }

    if (projectmsg.length > 0) {
      var lastMsg = projectmsg[projectmsg.length - 1];
      var timeformnow = moment(lastMsg.date, "YYYYMMDD h:mm:ss").fromNow();
      var reg = /<[^<>]+>/g;
      var content = lastMsg.content.rendered.replace(reg, ''); //content = content.splice(0)

      if (content.length == 1) {
        content = '发了一张图片';
      } else {
        if (lastMsg.meta.source_link != '{}') {
          content = '发了一个文件';
        }

        if (lastMsg.meta.types == '1') {
          content = '申请项目完成(点击查看详细)';
        }

        if (lastMsg.meta.types == '2') {
          content = '申请项目延期(点击查看详细)';
        }

        if (lastMsg.meta.types == '3') {
          content = '申请项目取消(点击查看详细)';
        }

        if (lastMsg.meta.types == '4') {
          content = '审核了项目(点击查看详细)';
        }
      }

      lastMessageHtml = React.createElement("div", {
        className: "content",
        style: {
          'padding-bottom': '0px'
        }
      }, React.createElement("h6", {
        className: "ui left floated header grey"
      }, lastMsg.author_name, "\uFF1A", content), React.createElement("h6", {
        className: "ui right floated header grey"
      }, timeformnow));
    } //未读消息


    var urstatushide = '';

    if (this.state.unreadcount == 0) {
      urstatushide = 'b-pagebox';
    }

    if (this.state.clicked == false) {
      return React.createElement("div", {
        className: "ui link card",
        style: {
          'border': '0px',
          'padding-top': '0px',
          'word-break': 'break-all'
        },
        onClick: this.goProjectMore
      }, React.createElement("div", {
        className: "content"
      }, React.createElement("a", {
        className: "ui " + overdisplay + " ribbon label"
      }, React.createElement("i", {
        className: "alarm outline icon"
      }), projectStatusHtml), title, React.createElement("div", {
        id: "cardloading_" + cardinfo.ID
      }, React.createElement("div", {
        className: "ui text loader"
      }, "Loading")), React.createElement("div", {
        className: "meta"
      }, sub_line)), lastMessageHtml, React.createElement("div", {
        className: "content",
        style: {
          'border': '0px',
          'padding-top': '0px'
        }
      }, React.createElement("div", {
        className: "ui labels"
      }, useritems, React.createElement("a", {
        className: "ui blue label"
      }, React.createElement("i", {
        className: "tasks icon"
      }), sonstatus), React.createElement("a", {
        className: "ui " + urstatushide + " red label"
      }, React.createElement("i", {
        className: "comments outline icon"
      }), "\u6709", this.state.unreadcount, "\u6761\u672A\u8BFB\u6D88\u606F"), React.createElement("a", {
        className: "ui " + statuscolor + " label"
      }, React.createElement("i", {
        className: "tasks icon"
      }), projectStatusHtml))));
    } else {
      return React.createElement(Redirect, {
        to: "/projectmore"
      });
    }
  }

});
var KPICardItem = React.createClass({
  displayName: "KPICardItem",

  getInitialState() {
    return {
      initCompleted: false
    };
  },

  render() {
    var KPIInfo = this.props.KPIInfo;
    return React.createElement("div", {
      className: "ui segment",
      onClick: this.KPItoProject
    }, React.createElement("a", {
      href: "javascript:;"
    }, React.createElement("div", {
      className: "ui grid"
    }, React.createElement("div", {
      className: "thirteen wide column"
    }, React.createElement("h5", {
      className: "ui left floated header"
    }, React.createElement("i", {
      className: "bar chart icon"
    }), React.createElement("div", {
      className: "content"
    }, KPIInfo.date, " | ", KPIInfo.title, " \u2014\u2014(", React.createElement("span", {
      style: {
        'color': 'red',
        'font-size': '18px'
      }
    }, KPIInfo['得分'].toFixed(2), "\u5206"), ")"))), React.createElement("div", {
      className: "three wide right floated right aligned column"
    }, React.createElement("i", {
      className: "chevron right icon grey"
    }))), React.createElement("div", {
      className: "ui grid"
    }, React.createElement("div", {
      className: "ten wide column"
    }, React.createElement("div", {
      className: "green ui image label right"
    }, "\u76EE\u6807:", KPIInfo.type, KPIInfo['目标'], React.createElement("div", {
      className: "detail"
    }, "\u5B9E\u9645\u503C:", KPIInfo['实际值']), React.createElement("div", {
      className: "detail"
    }, "\u5E95\u7EBF\u6C34\u5E73:", KPIInfo['底线水平']), React.createElement("div", {
      className: "detail"
    }, "\u6311\u6218\u6C34\u5E73:", KPIInfo['挑战水平']), React.createElement("div", {
      className: "detail"
    }, "\u6743\u91CD:", KPIInfo['权重']))), React.createElement("div", {
      className: "four wide column"
    }))));
  }

});
var HeadImg = React.createClass({
  displayName: "HeadImg",

  render() {
    var firstsign = toFullInfo(this.props.detail.user_name).real_name;
    var secondsign = React.createElement("div", {
      className: "detail"
    }, this.props.detail.project_role);

    if (this.props.detail.project_role == 'member') {
      secondsign = '';
    }

    if (this.props.detail.project_role == 'og_pm') {
      secondsign = React.createElement("div", {
        className: "detail"
      }, "\u53D1\u8D77\u4EBA/PM");
    }

    var src = returnHeadImg(this.props.detail.user_name);
    return React.createElement("a", {
      className: "ui image label"
    }, React.createElement("img", {
      src: src
    }), firstsign, secondsign);
  }

});
var HeadImgII = React.createClass({
  displayName: "HeadImgII",

  cancelClick() {
    var _this = this;

    if (this.props.info.pj_role == 'og_pm' || this.props.info.pj_role == 'og') {
      alert('发起人不能删除！！！');
    } else {
      if (this.props.info.pj_role == 'pm') {
        globalData.editData.pm = '';
      }

      globalData.editData.member = _.reduce(globalData.editData.member, function (result, value, key) {
        if (value != _this.props.info.user_name) {
          result.push(value);
        }

        return result;
      }, []);
    }

    emitter.emit('usercanceled');
  },

  render() {
    var role = '';

    if (this.props.info.pj_role == 'og_pm') {
      role = React.createElement("div", {
        className: "detail"
      }, "\u53D1\u8D77\u4EBA/PM");
    } else if (this.props.info.pj_role == 'og') {
      role = React.createElement("div", {
        className: "detail"
      }, "\u53D1\u8D77\u4EBA");
    } else if (this.props.info.pj_role == 'pm') {
      role = React.createElement("div", {
        className: "detail"
      }, "PM");
    }

    var src = returnHeadImg(this.props.info.user_name);
    var head_id = 'head_' + this.props.info.user_name;
    return React.createElement("div", {
      className: "ui image label"
    }, React.createElement("img", {
      src: src
    }), this.props.info.real_name, role, React.createElement("i", {
      className: "delete icon",
      onClick: this.cancelClick
    }));
  }

});
var MSGelement = React.createClass({
  displayName: "MSGelement",

  componentDidMount() {},

  bytesToSize(bytes) {
    if (bytes === 0) {
      return '0 B';
    }

    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]; //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  },

  render() {
    var _this = this;

    var msginfo = this.props.msginfo;
    var sourceobj = JSON.parse(msginfo.meta.source_link);
    var timeformnow = moment(msginfo.date, "YYYYMMDD h:mm:ss").fromNow();
    var headDirection = msginfo.meta.msg_username == currentUser.user_name ? 'right' : 'left';
    var contenthtml = '';
    var reg = /<[^<>]+>/g;
    var src = returnHeadImg(msginfo.meta.msg_username);

    if (sourceobj.size != undefined) {
      var size = '(' + this.bytesToSize(sourceobj.size) + ')';
      var content = msginfo.content.rendered;
    } else {
      var size = '';
      var content = msginfo.content.rendered;
    }

    var content_chat = '';

    if (currentUser.user_name == msginfo.meta.msg_username) {
      content_chat = 'content-chat-right';
    } else {
      content_chat = 'content-chat-left';
    }

    var SystemMsgClass = 'b-pagebox';
    var history = globalData.Project.project_meta.audit_history_v3 == undefined ? [] : globalData.Project.project_meta.audit_history_v3;
    var msgtype = 0;
    var maincontent = '';

    if (history.length > 0) {
      history.map(function (result) {
        if (result.commentID == msginfo.id) {
          //属于申请类的消息
          msgtype = 1;
          maincontent = result;
        }

        if (result.auditID == msginfo.id) {
          //属于审核类的消息
          msgtype = 2;
          maincontent = result;
        }
      });
      var dealystr = '';
      var str1 = "1-" + msginfo.meta.types;
      var str2 = "2-" + msginfo.meta.types;

      if (maincontent.applytype == '申请延期') {
        dealystr = React.createElement("span", null, React.createElement("br", null), "\u5EF6\u671F\u5230:", maincontent.delaydate);
      }

      if (msgtype == 1) {
        contenthtml = React.createElement("div", {
          className: "ui " + headDirection + " floated raised segment",
          style: {
            'padding': '0.3em 1em',
            'margin': '0',
            'word-break': 'break-all'
          }
        }, React.createElement("span", null, msginfo.author_name), React.createElement("span", null, maincontent.applytype), React.createElement("span", null, dealystr, " \u8BF4\u660E:", maincontent.applycontent));
      } else if (msgtype == 2) {
        contenthtml = React.createElement("div", {
          className: "ui " + headDirection + " floated raised segment",
          style: {
            'padding': '0.3em 1em',
            'margin': '0',
            'word-break': 'break-all'
          }
        }, React.createElement("span", null, msginfo.author_name, "\u5BA1\u6838 \u5BA1\u6838\u7ED3\u679C:", maincontent.pass, " \u8BF4\u660E:", maincontent.auditcontent));
      } else {
        if (msginfo.meta.types == 5) {
          //content+=' '
          contenthtml = React.createElement("div", {
            className: "ui " + headDirection + " floated raised segment",
            style: {
              'padding': '0.3em 1em',
              'margin': '0',
              'word-break': 'break-all'
            }
          }, React.createElement("span", null, content.replace(reg, '')));
        } else {
          contenthtml = React.createElement("div", {
            className: "ui " + headDirection + " floated raised segment",
            style: {
              'padding': '0.3em 1em',
              'margin': '0',
              'word-break': 'break-all'
            }
          }, React.createElement("div", {
            className: "ui image fluid rounded",
            dangerouslySetInnerHTML: {
              __html: msginfo.content.rendered
            }
          }), React.createElement("span", null, size));
        }
      }
    } else {
      //普通消息
      if (msginfo.meta.types == 5) {
        contenthtml = React.createElement("div", {
          className: "ui " + headDirection + " floated raised segment",
          style: {
            'padding': '0.3em 1em',
            'margin': '0',
            'word-break': 'break-all'
          }
        }, React.createElement("span", null, timeformnow), React.createElement("br", null), React.createElement("span", null, content.replace(reg, '')));
      } else {
        contenthtml = React.createElement("div", {
          className: "ui " + headDirection + " floated raised segment",
          style: {
            'padding': '0.3em 1em',
            'margin': '0',
            'word-break': 'break-all'
          }
        }, React.createElement("div", {
          className: "ui image fluid rounded",
          dangerouslySetInnerHTML: {
            __html: msginfo.content.rendered
          }
        }), React.createElement("span", null, size));
      }
    }

    return React.createElement("div", {
      className: "ui padded grid"
    }, React.createElement("div", {
      className: "sixteen wide column"
    }, React.createElement("div", {
      className: "ui basic " + headDirection + " aligned segment",
      style: {
        'padding': '0 0 0.5rem 0',
        'margin': '0'
      }
    }, React.createElement("a", {
      className: "ui blue image label"
    }, React.createElement("img", {
      src: src
    }), msginfo.author_name, React.createElement("div", {
      className: "detail"
    }, timeformnow))), contenthtml));
  }

});
var InitMsgElement = React.createClass({
  displayName: "InitMsgElement",

  render() {
    return React.createElement("div", {
      className: "ui segment grid"
    }, React.createElement("div", {
      className: "sixteen wide column"
    }, React.createElement("h2", {
      className: "ui icon center aligned header disabled grey"
    }, React.createElement("i", {
      className: "comment outline disabled grey icon"
    }), React.createElement("div", {
      className: "content"
    }, "\u672A\u6709\u53EF\u663E\u793A\u6570\u636E"))));
  }

});
var ApplyAuditModal = React.createClass({
  displayName: "ApplyAuditModal",

  getInitialState() {
    return {
      applytype: ''
    };
  },

  componentDidMount() {
    var _this = this;

    emitter.addListener('accept_apply', function () {
      $("#modalarea").val("");

      _this.setState({
        applytype: globalData.type
      });
    });
  },

  cancelModal() {
    $('.ui.fullscreen.modal').modal('hide');
  },

  submit(submittype) {
    if (submittype == 'apply') {
      var date = Date.parse(new Date());
      var jsonobj = {};
      jsonobj[currentUser.user_name] = date;
      var jsonstr = JSON.stringify(jsonobj);
      var sourceobj = {};
      var sourcestr = JSON.stringify(sourceobj);
      var delay_time = moment($('#delaydate').val(), moment.ISO_8601).toISOString();
      var applytype = '';
      var types = '';

      if (globalData.type == 'applyfinish') {
        applytype = '申请完成';
        types = '1';
      }

      if (globalData.type == 'applydelay') {
        applytype = '申请延期';
        types = '2';
      }

      if (globalData.type == 'applycancel') {
        applytype = '申请取消';
        types = '3';
      }

      var apply_desc = $('#modalarea').val();
      apply_desc = apply_desc == '' ? '未添加说明' : $('#modalarea').val();
      var message_post = {
        'method': 'POST',
        'actionURL': 'https://www.kenta.cn/app3/wp-json/wp/v2/comments',
        'action': 'msgsend-apply',
        "headerAttach": "\"Content-Type\":\"application/json\"",
        'data': {
          'applyuser': currentUser.real_name,
          'applycontent': apply_desc,
          'applytype': applytype,
          'delaydate': delay_time,
          'project': globalData.Project
        },
        'submitJSON': {
          'post': globalData.Project.ID,
          'author': currentUser.author,
          'content': apply_desc,
          'status': 'publish',
          'meta': {
            'msg_username': currentUser.user_name,
            'read_user': jsonstr,
            'source_link': sourcestr,
            'types': types
          }
        }
      };
      OAuthSubmit(message_post);
    } else {
      var audit_reply = $('#modalarea').val();

      if (audit_reply == "") {
        if (globalData.type == 'audit_pass') {
          alert('审核说明必须填写！！！');
          return false;
        }
      }

      var changestatusurl = "https://www.kenta.cn/app3/wp-json/form/v2/item/" + globalData.Project.ID;
      var meta = globalData.Project.project_meta;
      var history = meta.audit_history_v3;
      var lasthistory = history[history.length - 1];
      lasthistory.audituser = currentUser.real_name;
      lasthistory.audited = true;
      lasthistory.auditcontent = audit_reply;
      lasthistory.auditdate = moment().format();
      lasthistory.pass = globalData.type == 'audit_pass' ? '通过' : '否决';
      history.pop();
      history.push(lasthistory);
      var status = '';

      if (meta.project_status_v3 == '3') {
        if (globalData.type == 'audit_pass') {
          status = '2';
        } else {
          status = '1';
        }
      }

      if (meta.project_status_v3 == '4') {
        status = '1';
      }

      if (meta.project_status_v3 == '5') {
        if (globalData.type == 'audit_pass') {
          status = '0';
        } else {
          status = '1';
        }
      }

      var submitJSON = {
        "title": meta.title[0],
        "content": meta.content[0],
        "audit_history_v3": history,
        "project_status_v3": [status],
        "status": "publish",
        "username": currentUser.user_name
      };

      if (meta.project_status_v3 == '4') {
        if (globalData.type == 'audit_pass') {
          submitJSON = {
            "title": meta.title[0],
            "content": meta.content[0],
            "audit_history_v3": history,
            "project_status_v3": [status],
            "project_deadline": [lasthistory.delaydate],
            "project_end_time": [lasthistory.delaydate],
            "status": "publish",
            "username": currentUser.user_name
          };
        }
      }

      var message_put = {
        "method": "PUT",
        "actionURL": changestatusurl,
        "action": "changestatus",
        "headerAttach": "\"Content-Type\":\"application/json\"",
        "data": {
          'type': 'audit'
        },
        "submitJSON": submitJSON
      };
      var date = Date.parse(new Date());
      var jsonobj = {};
      jsonobj[currentUser.user_name] = date;
      var jsonstr = JSON.stringify(jsonobj);
      var sourceobj = {};
      var sourcestr = JSON.stringify(sourceobj);
      var message_post = {
        'method': 'POST',
        'actionURL': 'https://www.kenta.cn/app3/wp-json/wp/v2/comments',
        'action': 'msgsend-audit',
        "headerAttach": "\"Content-Type\":\"application/json\"",
        'data': {
          'message_put': message_put,
          'member': meta.member,
          'id': meta.ID
        },
        'submitJSON': {
          'post': meta.ID,
          'author': currentUser.author,
          'content': audit_reply,
          'status': 'publish',
          'meta': {
            'msg_username': currentUser.user_name,
            'read_user': jsonstr,
            'source_link': sourcestr,
            'types': '4'
          }
        }
      };
      OAuthSubmit(message_post);
    }

    this.cancelModal();
  },

  render() {
    var title = '';
    var secondtitle = '';
    var submittype = 'apply';
    var delay = 'b-pagebox';

    switch (this.state.applytype) {
      case 'applyfinish':
        title = '您正在申请完成项目';
        secondtitle = '完成说明';
        break;

      case 'applydelay':
        title = '您正在申请延期项目';
        secondtitle = '延期说明';
        delay = 'b-display';
        break;

      case 'applycancel':
        title = '您正在申请取消项目';
        secondtitle = '取消说明';
        break;

      case 'audit_pass':
        title = '您正在审核通过';
        secondtitle = '说明';
        submittype = 'audit';
        break;

      case 'audit_refuse':
        title = '您正在审核否决';
        secondtitle = '说明';
        submittype = 'audit';
        break;
    }

    return React.createElement("div", {
      id: "tt",
      className: "ui fullscreen modal transition"
    }, React.createElement("i", {
      className: "close icon"
    }), React.createElement("div", {
      className: "header"
    }, title), React.createElement("div", {
      className: "content"
    }, React.createElement("div", {
      className: "ui form"
    }, React.createElement("div", {
      className: "field " + delay
    }, React.createElement("label", null, "\u5EF6\u671F\u81F3"), React.createElement("input", {
      type: "date",
      id: "delaydate"
    })), React.createElement("div", {
      className: "field"
    }, React.createElement("label", null, secondtitle), React.createElement("textarea", {
      id: "modalarea"
    })))), React.createElement("div", {
      className: "actions"
    }, React.createElement("div", {
      className: "ui button",
      onClick: this.cancelModal
    }, "\u53D6\u6D88"), React.createElement("div", {
      className: "ui green button",
      onClick: this.submit.bind(this, submittype)
    }, "\u63D0\u4EA4")));
  }

}); //数据返回元件

var StaffSelection = React.createClass({
  displayName: "StaffSelection",

  getInitialState() {
    return {
      topage: '',
      isback: false
    };
  },

  componentWillMount() {
    var _this = this;

    var obj = {};
    contactDB.iterate(function (value, key, iterationNumber) {
      obj[key] = value;
    }).then(function () {
      //手动组 上级项目成员
      var parent_members = globalData.Project.project_meta.parent_id.meta.member;

      if (parent_members != undefined) {
        obj['上层项目成员'] = [];
        parent_members.map(function (singlemember) {
          obj['上层项目成员'].push(toFullInfo(singlemember));
        });
      }

      _this.setState({
        contacts: obj
      });
    }).catch(function (err) {
      console.log(err);
    });
  },

  componentDidMount() {
    $('.staffselect').visibility({
      onUpdate: function (calculations) {
        $('.ui.sticky.mainHeader').sticky({
          context: '#kenta-app'
        });
      }
    });
  },

  componentDidUpdate() {
    var _this = this; //初始化


    $('.ui.accordion').accordion();
    $('.ui.form').form();
    $('.ui.checkbox.selectmembers').checkbox({});
    $('.ui.checkbox.selectPM').checkbox({
      //处理选择管理员后自动加上他为Member
      onChange: function () {
        var currentSelectedMember = _.compact($('.ui.form').form('get value', 'selectedMember'));

        $('.ui.checkbox.selmb_' + this.value.split('.')[0] + '_' + this.value.split('.')[1]).checkbox('set checked');
        /*if(currentSelectedMember.indexOf(this.value) == -1) {
        	currentSelectedMember.push(this.value);
        	$('.ui.form').form('set values', {
          			selectedMember   : currentSelectedMember
          		});
        }*/
      }
    });
    $('.ui.checkbox.selectmembers').checkbox({
      beforeUnchecked: function () {
        if ($('.ui.form').form('get value', 'PM').indexOf(this.value) != -1) {
          $('.ui.checkbox.selectPM').checkbox('set unchecked');
        }
      },
      onUnchecked: function () {
        var deleteuser = this.value;
        $('.ui.checkbox.selmb_' + this.value.split('.')[0] + '_' + this.value.split('.')[1]).checkbox('set unchecked');
        /*var currentSelectedMember = $('.ui.form').form('get value', 'selectedMember');
        var newmember = _.filter(currentSelectedMember, function(n) {
          return n != deleteuser;
        });
        if(currentSelectedMember != newmember) {
        	$('.ui.form').form('set values', {
        			selectedMember   : newmember
        		});
        }*/
      }
    }); //预选方法

    $('.ui.form').form('set values', {
      selectedMember: globalData.editData.member,
      PM: globalData.editData.pm
    });
  },

  _onBack() {
    this.setState({
      isback: true
    });
  },

  _onSubmit() {
    globalData.editData.member = _.reduce(_.compact($('.ui.form').form('get value', 'selectedMember')), function (result, n) {
      if (result.indexOf(n) == -1) {
        result.push(n);
      }

      return result;
    }, []);
    globalData.editData.pm = _.compact($('.ui.form').form('get value', 'PM'))[0];

    if (globalData.editData.pm == undefined || globalData.editData.pm == '') {
      alert('PM不能为空！');
      return false;
    }

    if (globalData.editData.member.length == 0) {
      alert('项目成员不能为空!');
      return false;
    }

    this.setState({
      isback: true
    });
  },

  _namesearch() {
    var filter = $('#StaffSearch').val();
    var obj = this.state.contacts;
    var arr = [];
    var arr2 = [];

    for (var key in this.state.contacts) {
      this.state.contacts[key].map(function (result) {
        if (result.real_name.indexOf(filter) != -1) {
          if (arr2.indexOf(result.user_name) == -1) {
            arr.push(result);
            arr2.push(result.user_name);
          }
        }
      });
    }

    obj['筛选人员'] = arr;
    this.setState({
      contacts: obj
    });
  },

  render: function () {
    var _this = this;

    var items = [];
    var upperstaff = '';
    var selectedstaff = '';

    if (this.state.contacts != '') {
      for (var key in this.state.contacts) {
        var users = this.state.contacts[key].map(function (result) {
          //console.log(1,result.user_name);
          var src = returnHeadImg(result.user_name);
          var selmb = 'selmb_' + result.user_name.split('.')[0] + '_' + result.user_name.split('.')[1];
          return React.createElement("div", {
            className: "row",
            style: {
              'margin-left': '0',
              'margin-right': '0'
            }
          }, React.createElement("div", {
            className: "seven wide column",
            style: {
              'padding': '0 0.5rem 0'
            }
          }, React.createElement("h4", {
            className: "ui header"
          }, React.createElement("img", {
            className: "ui medium circular image",
            src: src
          }), React.createElement("div", {
            className: "content"
          }, result.real_name, React.createElement("div", {
            className: "sub header"
          }, result.role_name)))), React.createElement("div", {
            className: "five wide column right aligned",
            style: {
              'padding': '0 0.5rem 0'
            }
          }, React.createElement("div", {
            className: "ui radio checkbox selectPM"
          }, React.createElement("input", {
            type: "radio",
            name: "PM[]",
            tabindex: "0",
            className: "hidden",
            value: result.user_name
          }), React.createElement("label", null, "\u7BA1\u7406\u5458"))), React.createElement("div", {
            className: "four wide column right aligned",
            style: {
              'padding': '0 0.5rem 0'
            }
          }, React.createElement("div", {
            className: "ui checkbox selectmembers " + selmb
          }, React.createElement("input", {
            type: "checkbox",
            name: "selectedMember[]",
            value: result.user_name,
            tabindex: "0",
            className: "hidden"
          }), React.createElement("label", null, "\u6DFB\u52A0"))));
        });

        if (key == '上层项目成员') {
          upperstaff = React.createElement("div", {
            className: "ui accordion field segment"
          }, React.createElement("div", {
            className: "title"
          }, key, React.createElement("i", {
            className: "icon dropdown"
          })), React.createElement("div", {
            className: "content"
          }, React.createElement("div", {
            className: "ui grid transition hidden"
          }, users)));
        } else if (key == '筛选人员') {
          selectedstaff = React.createElement("div", {
            className: "ui accordion field segment"
          }, React.createElement("div", {
            className: "title"
          }, key, React.createElement("i", {
            className: "icon dropdown"
          })), React.createElement("div", {
            className: "content"
          }, React.createElement("div", {
            className: "ui grid transition hidden"
          }, users)));
        } else {
          items.push(React.createElement("div", {
            className: "ui accordion field segment"
          }, React.createElement("div", {
            className: "title"
          }, key, React.createElement("i", {
            className: "icon dropdown"
          })), React.createElement("div", {
            className: "content"
          }, React.createElement("div", {
            className: "ui grid transition hidden"
          }, users))));
        }
      }

      items.unshift(upperstaff);
      items.unshift(selectedstaff);
    }

    if (this.state.isback == false) {
      return React.createElement("div", {
        id: "",
        className: "staffselect"
      }, React.createElement("div", {
        className: "ui sticky mainHeader inverted red segment",
        style: {
          'borderRadius': '0px',
          'padding': '1em 0 1.1em 0'
        }
      }, React.createElement("div", {
        className: "ui container grid"
      }, React.createElement("div", {
        className: "two wide column",
        style: {
          'padding-left': '0px'
        }
      }, React.createElement("a", {
        href: "javascript:void(0);",
        onClick: this._onBack
      }, React.createElement("i", {
        className: "chevron left icon inverted"
      }))), React.createElement("div", {
        className: "twelve wide column"
      }, React.createElement("div", {
        className: "ui small header centered inverted"
      }, "\u6DFB\u52A0\u4EBA\u5458")), React.createElement("div", {
        className: "two wide column",
        style: {
          'padding-right': '0px'
        }
      }, React.createElement("a", {
        href: "#"
      }, React.createElement("div", {
        className: "ui small header right aligned inverted",
        onClick: this._onSubmit
      }, "\u786E\u8BA4"))))), React.createElement("div", {
        className: "ui search fluid forproject"
      }, React.createElement("div", {
        className: "ui icon input fluid"
      }, React.createElement("input", {
        className: "prompt",
        type: "text",
        id: "StaffSearch",
        placeholder: "\u8F93\u5165\u59D3\u540D\u67E5\u8BE2...",
        onChange: this._namesearch
      }), React.createElement("i", {
        className: "search icon"
      })), React.createElement("div", {
        className: "results"
      })), React.createElement("hr", null), React.createElement("div", {
        className: "ui form container staffselectionform"
      }, items));
    } else {
      return React.createElement(Redirect, {
        to: "/projectcreateandedit"
      });
    }
  }
}); // App 运行入口

var KentaApp = React.createClass({
  displayName: "KentaApp",

  /* 初始化状态数据 */
  getInitialState() {
    return {};
  },

  /* 组件装载后初始化 */
  componentDidMount() {
    var _this = this;

    $('.ui.menu').menu();
  },

  contextTypes: {
    BrowserRouter: React.PropTypes.object
  },

  /* 渲染 */
  render() {
    return React.createElement(BrowserRouter, {
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
      path: "/projectmore",
      component: ProjectMore
    }), React.createElement(Route, {
      path: "/kpidetail",
      component: KPIDetail
    }), React.createElement(Route, {
      path: "/kpidetailpersonal",
      component: KPIDetailPersonal
    }), React.createElement(Route, {
      path: "/projectcreateandedit",
      component: ProjectCreateAndEdit
    }), React.createElement(Route, {
      path: "/iframewindow",
      component: IframeWindow
    }), React.createElement(Route, {
      path: "/staff",
      component: StaffSelection
    }), React.createElement(Route, {
      path: "/formdisplay",
      component: FormDisplay
    }), React.createElement(ApplyAuditModal, null)));
  }

}); //

ReactDOM.render(React.createElement(KentaApp, null), document.getElementById("kenta-app"));