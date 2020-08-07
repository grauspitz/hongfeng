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
window.globalData = {
  menu_page: {
    219999: 'special.js',
    220084: 'MaterialScreen.js',
    221092: 'bzscript.js',
    221091: 'qcscript.js'
  }
  /**
   * +-----------------------------------------------------------
   * | 外部内容
   * +-----------------------------------------------------------
   */

};
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
      console.log(11, currentUser.login);

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
          if (logindata == 'FALSE') {
            $('.ui.basic.modal.indexLogin').modal('show');
            $('#loginloading').removeClass();
          } else {
            if (logindata.status == 'error') {
              $('.ui.basic.modal.indexLogin').modal('show');
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
      }, " 2019 KENTA Electronic Mfg.Co.,Ltd")))), React.createElement("div", {
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
    }))))));
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
      }, currentUser.real_name, "|\u603B\u5206", React.createElement("div", {
        className: "sub header"
      }, currentUser.role_name, " | ", currentUser.department))))), React.createElement("div", {
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
      logout: false,
      initCompleted: false
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

  goMES() {
    globalData.iframeurl = 'https://www.kenta.cn/jm/newform/formdiyscript.html?id=220084&script=MaterialScreen';
    this.setState({
      initCompleted: true,
      screen: 'iframewindow'
    });
  }

  HgxPage(pageid) {
    globalid = pageid;
    $.get('https://www.kenta.cn:8895/type=getdata?dataname=桌子对应关系', function (result) {
      deskToGX = result;
      console.log('deskToGX', deskToGX);
    }, 'json');
    this.setState({
      initCompleted: true,
      topage: 'hgxscreen'
    });
  }

  _print() {
    console.log('run print');
    var bdhtml = window.document.body.innerHTML;
    console.log('bdhtml', bdhtml);
    var prnhtml = 'Hello World';
    window.document.body.innerHTML = prnhtml; //把需要打印的指定内容赋给body.innerHTML

    window.print(); //调用浏览器的打印功能打印指定区域

    window.document.body.innerHTML = bdhtml; // 最后还原页面
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
          className: "ui segment",
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
        })))))), React.createElement("div", {
          className: "eight wide column"
        }, React.createElement("div", {
          className: "sub header"
        }, "\u8BBE\u5B9A"), React.createElement("div", {
          className: "ui red raised loading segments"
        }, React.createElement("a", {
          href: "javascript:void(0);",
          onClick: this._print
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
          className: "ui segment",
          onClick: this.HgxPage.bind(this, 220084)
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
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment",
          onClick: this.HgxPage.bind(this, 219999)
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
        }, "\u7EBF\u957F\u754C\u9762"))), React.createElement("div", {
          className: "three wide column"
        })))), React.createElement("a", {
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment",
          onClick: this.HgxPage.bind(this, 221092)
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
          href: "javascript:void(0);"
        }, React.createElement("div", {
          className: "ui segment",
          onClick: this.HgxPage.bind(this, 221091)
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
      return React.createElement(Redirect, {
        to: "/login"
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
    console.log(55, globalData.menu_page[globalid]);
    $.getScript("script/" + globalData.menu_page[globalid], function () {
      //加载test.js,成功后，并执行回调函数
      console.log("加载js文件", globalid);
      showformtemplate(globalid);
    }); //console.log(globalData.menu_pageid);
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
        to: "/more"
      });
    }
  }

}

; // 页内元件

class MainMenu extends React.Component {
  componentDidMount() {}

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
    })));
  }

}

ReactDOM.render(React.createElement(KentaApp, null), document.getElementById("kenta-app"));