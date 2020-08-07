var { HashRouter, Router, Route, Link, Redirect, browserHistory } = ReactRouterDOM;
/** 取得手機UUID */
var mobileUUID = "Non Mobile Device";

//moment.js中文
moment.locale('zh-cn');

/** 全局常量 */
var KentaConstants = {
	API_URL_PREFIX: 'https://www.kenta.cn/app3/',
	// RELATIVE_PATH: '/wangjiayi/webweb3',
	RELATIVE_PATH: '',
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
window.deskToGX = {
	T0001:'J00715',  
	T0003:'J00718',
}
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
				<Redirect to='/Home'/>
			</div>
			)
	}
}

// 页内元件
class MainMenu extends React.Component{
	componentDidMount() {
		$('.ui.sticky').sticky({context:'#kenta-app'});
	}
	render () {		
		return (
<div    >
	<a id="gotop"></a>
	<div  style={{"color":"#ddd",'background-color':'#292d34',"width": "100%", "height": "34px"}}>
	<span style={{"margin-left":"160px","line-height":"34px"}}>香港金银贸易场AA类50号行员 | 鸿丰金业官方网站</span>
	</div>
<div className="ui sticky" style={{'background':'white'}}>

<div className="mycontent">
		<div style={{"float":"left","height":"99px"}} >
			<Link to='/Home'>
			<img style={{"margin":"8px 80px 8px 0"}}  src="./images/logo.png" alt="LOGO"></img>
			</Link>
		</div>
	<ul style={{'margin':'0'}}>
		<Link className="hoverlink" to='/Aboutus'>
		<li  className="hoverli" id="关于我们">
		关于我们
		<div className="moveli">
		<div className="ui grid  movemid nomanopa">
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Aboutus'>
			公司简介
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Qualification'>
			公司资质
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Award'>
		公司奖项
		</Link>
		</div>
		</div>
		</div>
		</li>
		</Link>
		<Link className="hoverlink"   to='/Advantage'>
		<li className="hoverli" id="鸿丰优势">
		鸿丰优势
		<div className="moveli">
		<div className="ui grid  movemid nomanopa">
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Advantage'>
		产品优势
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Reputation'>
		信誉优势
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Deposit'>
		存取款优势
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Member'>
		会员系统
		</Link>	
		</div>
		</div>
		</div>
		</li>
		</Link>
		<Link className="hoverlink"   to='/Productdescription'>
		<li className="hoverli" id="产品介绍">
		产品介绍
		<div className="moveli" id="childthree">
		<div className="ui grid  movemid nomanopa">
		<div className="eight wide column movesmall nomanopa">
		<Link  to='/Productdescription'>
			现货黄金
		</Link>
			</div>
		<div className="eight wide column movesmall nomanopa">
		<Link  to='/Silver'>
			现货白银
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link  to='/Rmbgjt'>
		人民币公斤条
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link  to='/TradingRules'>
		交易细则
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link  to='/Withdraw'>
		提取实金
		</Link></div>
		</div>
		</div>
		</li>
		</Link>
		<Link className="hoverlink"   to='/Latestnews'>
		<li className="hoverli" id="最新资讯">
		最新资讯
		<div className="moveli" id="childfour">
		<div className="ui grid  movemid nomanopa">
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Latestnews'>
		公司公告
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Economicnews'>
		经济新闻
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Economicdata'>
		经济数据
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Professionalreviews'>
		专业评论
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Dailyexchangerate'>
		每日汇率
		</Link>
		</div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Companyactivities'>
		公司活动
		</Link>
		</div>
		</div>
		</div>
		</li>
		</Link>
		<Link className="hoverlink"   to='/Addaccount'>
		<li className="hoverli" id="网上开户">
		网上开户
		<div className="moveli">
		<div className="ui grid  movemid nomanopa">
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Addaccount'>
		开立真实账户
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Addaccountprocess'>
		开立真实帐户过程
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Commonproblem'>
		常见问题
		</Link></div>
		</div>
		</div>
		</li>
		</Link>
		<Link className="hoverlink"   to='/Fundaccess'>
		<li className="hoverli" id="资金存取过程">
		资金存取过程
		<div className="moveli">
		<div className="ui grid  movemid nomanopa">
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Fundaccess'>
		存款流程
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Online'>
		在线取款流程
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Discount'>
		国内卡优惠
		</Link>
		</div>
		</div>
		</div>
		</li>
		</Link>
		<Link className="hoverlink"   to='/Download'>
		<li className="hoverli" id="下载">
			下载
			<div className="moveli" id="childseven">
		<div className="ui grid  movemid nomanopa">
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Download'>
		下载交易软件
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Downloadpdf'>
		下载表格
		</Link></div>
		<div className="eight wide column movesmall nomanopa">
		<Link to='/Downloadpdf2'>
		下载指引
		</Link></div>
		</div>
		</div>
		</li>
			</Link>
			<Link className="hoverlink"   to='/Contactus'>
			<li className="hoverli" id="联络我们">
			联络我们
			<div className="moveli" id="childeight">
		<div className="ui grid  movemid nomanopa">
		<div className="sixteen wide column movesmall nomanopa">联络资料</div>
		</div>
		</div>
			</li>
			</Link>
	</ul>
	</div>


</div>
</div>
			)
	}
};

// 页内元件
class Home extends React.Component{
	componentDidMount() {
			window.onscroll = function(){
				var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				if(scrollTop!=0){
					jQuery("#clicktop").css("display","block")   
				}else{
					jQuery("#clicktop").css("display","none")   
				}
			}


		$(function () {
			$('#myTab a:first').tab('show');
		  })
		  $('#myTab a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
		})
		$(function () {
			$('#mysecTab a:first').tab('show');
		  })
		  $('#mysecTab a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
		})

		var chart = Highcharts.chart('buyChart', {
			tooltip: {
                pointFormat: '{name}{point.percentage:.1f}%'//官方只给了鼠标放上去的百分比，后来发现在图例中直接用 this.percentage 就行
            },
			credits: {
				enabled:false
			},
			chart: {
				type: 'bar'
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: ['黄金,Gold', '白银,Silver']
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				},
				reversedStacks : false 
			},
			legend: {
				reversed: false
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series: [{
				name: '买入',
				data: [48, 50],
				color:"rgb(115, 190, 60)"
			}, {
				name: '卖出',
				data: [52, 50],
				color:"rgb(245,70, 64)"
			}]
		});
		
		var chart = Highcharts.chart('silverchart', {
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			credits: {
				enabled:false
			},
			yAxis: {
				title: {
					text: ''
				}
			},
			xAxis: {
				title: {
					text: ''
				},
				categories: ['13:43', '13:44', '13:45', '13:46', '13:47', '13:48', '13:49', '13:50', '13:51', '13:52']   // x 轴分类
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},
			series: [{
				name: '',
				data: [18.06, 18.05, 18.05, 18.03, 18.05, 18.03, 18.02, 18.01]
			}],
		});

		var chart = Highcharts.chart('spdrchart', {
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			credits: {
				enabled:false
			},
			yAxis: {
				title: {
					text: ''
				}
			},
			xAxis: {
				title: {
					text: ''
				},
				categories: ['10-26', '10-27', '10-28', '10-29', '10-30', '10-31', '11-01', '11-02','11-03', '11-04']   // x 轴分类
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},
			series: [{
				name: '',
				data: [914.1, 915.2, 916.05, 917.03, 914.05, 915.03, 916.02, 917.01, 918.01, 918.01]
			}],
		
		});

		
		var chart = Highcharts.chart('ishachart', {
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			credits: {
				enabled:false
			},
			yAxis: {
				title: {
					text: ''
				}
			},
			xAxis: {
				title: {
					text: ''
				},
				categories: ['10-26', '10-27', '10-28', '10-29', '10-30', '10-31', '11-01', '11-02','11-03', '11-04']   // x 轴分类
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},
			series: [{
				name: '',
				data: [0.0, 0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0, 0.0]
			}],
		
		});

		var chart = Highcharts.chart('goldchart', {
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			credits: {
				enabled:false
			},
			yAxis: {
				title: {
					text: ''
				}
			},
			xAxis: {
				title: {
					text: ''
				},
				categories: ['13:43', '13:44', '13:45', '13:46', '13:47', '13:48', '13:49', '13:50', '13:51', '13:52']   // x 轴分类
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},
			series: [{
				name: '',
				data: [43934, 52503, 57177, 69658, 97031, 19931, 37133, 54175]
			}],
		});
	}
	render () {		
		return (
<div>
	{/* 轮播图 */}
	<div id="banner">
	<div   className="carousel slide" id="carousel-example-generic" data-ride="carousel" data-interval="5000">
		<ol className="carousel-indicators">
			<li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
			<li data-target="#carousel-example-generic" data-slide-to="1"></li>
			<li data-target="#carousel-example-generic" data-slide-to="2"></li>
			<li data-target="#carousel-example-generic" data-slide-to="3"></li>
			<li data-target="#carousel-example-generic" data-slide-to="4"></li>
			<li data-target="#carousel-example-generic" data-slide-to="5"></li>
		</ol>
		<div style={{"height":"600px"}} className="carousel-inner " id="hxp_lunbo">
			<div className="item active ">
			<img src="./images/lunboimages/banner1.jpg" style={{"display":"block","height":"600px"}} alt="..."></img>
			</div>
			<div className="item">
			<img src="./images/lunboimages/banner2.jpg" style={{"display":"block","height":"600px"}} alt="..."></img>
			</div>
			<div className="item">
			<img src="./images/lunboimages/banner3.jpg" style={{"display":"block","height":"600px"}} alt="..."></img>
			</div>
			<div className="item">
			<img src="./images/lunboimages/banner4.jpg" style={{"display":"block","height":"600px"}} alt="..."></img>
			</div>
			<div className="item">
			<img src="./images/lunboimages/banner5.jpg" style={{"display":"block","height":"600px"}} alt="..."></img>
			</div>
			<div className="item">
			<img src="./images/lunboimages/banner6.jpg" style={{"display":"block","height":"600px"}} alt="..."></img>
			</div>
			
		</div>
		<a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
			<span className="glyphicon glyphicon-chevron-left"></span>
		</a>
		<a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
			<span className="glyphicon glyphicon-chevron-right"></span>
		</a>
	</div>
	</div>

	<div id="news" style={{"height":"60px","background-color":"white"}}>
<div className="mycontent" >
<div className="page" style={{"width":"960px"}}>
<ul className="box item1">
	<li>
		<div className="blc">2019-10-21 冬令交易时间</div>
		<div className="blc">2019-09-23 2019 国庆节假期及重阳节假期交易安排</div>
	</li>
	<li>
		<div className="blc">2019-08-29  美国劳动节假期交易安排</div>
		<div className="blc">2019-07-31  2019 如遇颱风天气的交易安排</div>
	</li>
</ul>
<ul className="box item2">
	<li>
		<div className="blc">2019-10-21 冬令交易时间</div>
		<div className="blc">2019-09-23 2019 国庆节假期及重阳节假期交易安排</div>
	</li>
	<li>
		<div className="blc">2019-08-29  美国劳动节假期交易安排</div>
		<div className="blc">2019-07-31  2019 如遇颱风天气的交易安排</div>
	</li>
</ul>
	<span id="more" >历史公告 >></span>
</div> 
</div>
</div>
<div id="adv" style={{"background":"url(./images/banner7.jpg) no-repeat","width":"100%","height":"769px","background-size":"100% 100%"}}>
<div className="mycontent" >
<h2 >为什么选择鸿丰金业？</h2>
<p className="ext_txt">香港金银业贸易场AA类50号行员</p>
<div className="ui grid">
<div className="tenbox b1" id="b1">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b2">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b3">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b4">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b5">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b6">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b7">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b8">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b9">
	<div className="adv_ico" ></div>
</div>
<div className="tenbox b10">
	<div className="adv_ico" ></div>
</div>
</div>
</div>
</div>
<div style={{"width":"100%","height":"436px","background-color":"white"}} >
<div className="mycontent" style={{"height":"436px"}} >
	<div className="ui grid">
{/* 左边图表 */}
<div className="ten wide column" style={{"height":"436px"}}>
<ul className="nav nav-tabs" id="myTab">
  <li className="active seltab"><a href="#lone">价格行情</a></li>
  <li className="seltab"><a href="#ltwo">多空持仓比例</a></li>
  <li className="seltab"><a href="#lthree">SPDR GOLD SHARE</a></li>
  <li className="seltab"><a href="#lfour">iShares Silver Trust</a></li>
</ul>

<div className="tab-content">
  <div className="tab-pane active" id="lone">
    <div className="ui grid" style={{"margin-top":"20px"}}>
       <div className="three wide column" id="titleleft">
			<b>现货黄金</b><br></br>
			Gold
	   </div>
	   <div className="ten wide column" id="titlemid">
			1506.7
	   </div>
	   <div className="three wide column" id="titleright">
		   <div style={{"background":"url(./images/up.gif) no-repeat","width":"20px","height":"20px","background-size":"100% 100%","margin-top":"10px"}}>
		   </div>
	  
	   </div>
	</div>
	<table className="ui very basic table" style={{"height":"200px","position":"relative"}}>
  <thead>
    <tr className="center aligned">
      <th className="left aligned">产品</th>
      <th>最新价</th>
      <th>最高价</th>
      <th>最低价</th>
    </tr>
  </thead>
  <tbody>
    <tr className="center aligned">
      <td id="gold_t" className="left aligned">现货黄金 
	  <span className="price_u"></span>
	  </td>
      <td className="up">1506.74</td>
      <td className="up">1509.33</td>
      <td className="up">1502.32</td>
    </tr>
    <tr className="center aligned">
      <td id="silver_t" className="left aligned">现货白银
	  <span className="price_u"></span>
	  </td>
      <td className="up">18.03</td>
      <td className="up">18.07</td>
      <td className="up">17.97</td>
    </tr>
    <tr className="center aligned">
      <td id="rmb_t" className="left aligned">人民币公斤条
	  <span className="price_d"></span>
	  </td>
      <td className="down">343.52</td>
      <td className="down">344.16</td>
      <td className="down">342.52</td>
    </tr>
  </tbody>
</table>
  </div>
  <div className="tab-pane" id="ltwo">
  <div id="buyChart" style={{"width":"100%","height":"250px","margin-top":"20px"}}></div>
  </div>
  <div className="tab-pane" id="lthree">
  <div id="spdrchart" style={{"width":"100%","height":"200px","margin-top":"20px"}}></div>
  <table className="ui celled  table" style={{"height":"100px"}}>
    <tr className="center aligned">
      <th className="center aligned" rowSpan="2">名称</th>
      <th className="center aligned" rowSpan="2">持有量(吨)</th>
      <th className="center aligned" rowSpan="1" colSpan="2">前一日增减</th>
      <th className="center aligned" rowSpan="3">查看更多</th>
    </tr>
	<tr>
	<td>(吨)</td>
	<td>%</td>
	</tr>
    <tr className="center aligned">
      <td>SPDR GOLD SHARE</td>
      <td >914.67</td>
      <td >0</td>
      <td >0</td>
    </tr>  
</table>
 </div>
  <div className="tab-pane" id="lfour">
  <div id="ishachart" style={{"width":"100%","height":"200px","margin-top":"20px"}}></div>
  <table className="ui celled  table" style={{"height":"100px"}}>
    <tr className="center aligned">
      <th className="center aligned" rowSpan="2">名称</th>
      <th className="center aligned" rowSpan="2">持有量(吨)</th>
      <th className="center aligned" rowSpan="1" colSpan="2">前一日增减</th>
      <th className="center aligned" rowSpan="3">查看更多</th>
    </tr>
	<tr>
	<td>(吨)</td>
	<td>%</td>
	</tr>
    <tr className="center aligned">
      <td>iShares Silver Trust</td>
      <td ></td>
      <td >0</td>
      <td >0</td>
    </tr>  
</table>

  </div>
</div>
</div>
{/* 左边图表 */}
{/* 右边图表 */}
<div className="six wide column">
<ul className="nav nav-tabs" id="mysecTab">
  <li className="active seltab"><a href="#rone">现货黄金</a></li>
  <li className="seltab"><a href="#rtwo">现货白银</a></li>
  <li className="seltab"></li>
  <li className="seltab"><button className="ui button" style={{"width":"100%","height":"100%","font":"14px 微软雅黑","color":"white","background-color":"#c1262c"}}>查看大图</button></li>
</ul>
<div className="tab-content">
  <div className="tab-pane active" id="rone" >
  <div id="goldchart" style={{"width":"100%","height":"250px","margin-top":"50px"}}></div>
  </div>
  <div className="tab-pane" id="rtwo">
  <div id="silverchart" style={{"width":"100%","height":"250px","margin-top":"50px"}}></div>
</div>
</div>
</div>
{/* 右边图表 */}

	</div>
</div>
</div>

{/* 介绍 */}
<div id="intro">
<div className="mycontent">
<div className="intro_txt">
<h3>鸿丰金业集团(香港)有限公司</h3>
<p>鸿丰金业集团(香港)有限公司，为香港金银业贸易场50号行员，持有AA类牌照，属于香港金银业贸易场认可电子交易商。</p>
<p>我们提供24小时伦敦金、银及人民币公斤条网络交易，各种专业、快捷、准确资讯。为客户提供专业服务团队，24小时客服解答客户交易问题。</p>
<p>鸿丰金业致力提供稳定、公平、公正的交易平台。专业优秀服务团队以客为本，务求满足客户的投资需求。成为业界內其中一间最优秀的黄金投资企业，树立良好形象，获取广大客户爱护及信任。</p>
</div>
<div className="clear"></div>
</div>
</div>
{/* 介绍 */}
<div id="newsarea" className="newsarea">
<div className="mycontent">
<h2>最新资讯</h2>
<p className="ext_txt">香港金银业贸易场AA类50号行员</p>
<div className="tab">
<a >公司公告</a><a >即时新闻</a><a >专业评论</a>
</div>
<div className="ui padded grid">
  <div className="three column row">
    <div className="column">
	<img src="./images/news_1.jpg"></img>
	<ul className="newsul">
<li>10/21 &nbsp; <a>冬令交易时间</a></li>
<li>09/23 &nbsp; <a>2019 国庆节假期及重阳节假期交易安排</a></li>
<li>08/29 &nbsp; <a>美国劳动节假期交易安排</a></li>
<li>07/31 &nbsp; <a>如遇颱风天气的交易安排</a></li>
<li>07/12 &nbsp; <a>锁仓保证金调整</a></li>
</ul>
<a className="more">更多&gt;&gt;</a>
	</div>
    <div className="column">
	<img src="./images/news_2.jpg"></img>
	<ul className="newsul">
<li>13:13 &nbsp; <a>美国财长姆努钦会见沙特王储，美沙生意或继...</a></li>
<li>13:08 &nbsp; <a>美银美林：黄金重拾其组合对冲地位；① 美...</a></li>
<li>13:03 &nbsp; <a>海关总署：中国9月汽油出口73万吨，为2...</a></li>
<li>13:01 &nbsp; <a>...</a></li>
<li>13:01 &nbsp; <a>...</a></li>
</ul>
<a className="more">更多&gt;&gt;</a>
	</div>
    <div className="column">
	<img src="./images/news_1.jpg"></img>
	<ul className="newsul">
<li>11/05 &nbsp; <a>避险属性虽有下降 经济担忧仍挺黄金</a></li>
<li>10/28 &nbsp; <a>英脱欧又现迷雾 数据疲弱支撑黄金</a></li>
<li>10/21 &nbsp; <a>基本面仍强力支撑 避险属性暂有下降</a></li>
<li>10/14 &nbsp; <a>贸易谈判取得进展 黄金闻讯出现下滑</a></li>
<li>10/08 &nbsp; <a>美经济又现疲态 黄金震荡上涨</a></li>
</ul>
<a className="more">更多&gt;&gt;</a>
	</div>
  </div>
</div>
</div>
</div>
{/* 荣誉 */}
<div id="pref" className="pref">
<div className="mycontent">
<h2>荣誉与资质</h2>
<p className="ext_txt">香港金银业贸易场AA类50号行员</p>
<div className="ui grid">
  <div className="three wide column lpbox">
  <img src="./images/zj1.jpg"></img>
  <br></br>
  香港金银贸易场行员证书
  </div>
  <div className="three wide column lpbox">
  <img src="./images/zj2.jpg"></img>
  <br></br>
  香港金银贸易场行员牌照
  </div>
  <div className="three wide column lpbox">
  <img src="./images/pec3.jpg"></img>
  <br></br>
  第十二届财经风云榜获奖企业
  </div>
  <div className="three wide column lpbox">
  <img src="./images/pec4.jpg"></img>
  <br></br>
  第十三届财经风云榜获奖企业 
  </div>
  <div className="four wide column">
  <div className="two column row">
    <div className="column spbox">
	<img src="./images/pec5.jpg"></img>
	<a id="zzcx">资质查询</a>
	<a id="bmcx">交易编码查询</a>
	</div>
    <div className="column spbox">
	<img src="./images/pec6.jpg"></img>
	</div>
  </div>
  </div>
</div>
</div>
</div>
{/* 荣誉 */}
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Aboutus extends React.Component{
	componentDidMount() {
				$("#关于我们").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="aboutusbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 公司简介 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>

</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a className="ys">公司简介</a></li>
<li><a >公司资质</a></li>
<li><a >公司奖项</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">公司简介</h1>
<div className="detail">
<div className="abt">关于鸿丰</div>
<p className="abp">鸿丰金业集团(香港)有限公司，为香港金银业贸易场50号行员，持有AA类牌照，属于香港金银业贸易场认可电子交易商。</p>
<div className="abt">服务范围</div>
<p className="abp">提供24小时伦敦金、银及人民币公斤条网络交易，各种专业、快捷、准确资讯。<br></br>为客户提供专业服务团队，24小时客服解答客户交易问题。</p>
<div className="abt">鸿丰经营理念</div>
<p className="abp">致力提供稳定、公平、公正的交易平台。专业优秀服务团队以客为本，务求满足客户的投资需求。成为业界內其中一间最优秀的黄金投资企业，树立良好形象，获取广大客户爱护及信任。</p></div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Qualification extends React.Component{
	componentDidMount() {
		$("#关于我们").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="qualificationbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 公司资质 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>

</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >公司简介</a></li>
<li><a className="ys">公司资质</a></li>
<li><a >公司奖项</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">公司资质</h1>
<div id="vlightbox">
<div className="bt">香港金银业贸易埸50号行员，AA类牌照</div>
<div className="zjbox">
	<a className="vlightbox" href="./images/zj1.jpg" id="firstImage">
	<img alt="证书1" src="./images/zj1.jpg" width="300"></img>
	</a> <a className="vlightbox" href="./images/newzj2.jpg">
			<img alt="" src="http://www.gwgold.com.hk/uploadfile/2016/0302/20160302011127463.jpg" style={{"width":"275px","height":"424px"}}></img>
			</a> <a className="vlightbox" href="./images/zj3.jpg">
				<img alt="证书3" src="./images/zj3.jpg" width="300"></img>
				</a></div>
<br></br>
<br></br>
<div className="bt">狮子会慈善赞助企业</div>
<div className="zjbox"><a className="vlightbox" href="./images/zj4.jpg"><img alt="证书1" src="./images/zj4.jpg" width="300"></img></a> <a className="vlightbox" href="./images/zj5.jpg"><img alt="证书2" src="./images/zj5.jpg" width="300"></img></a></div>
<br></br>
<br></br>
<div className="bt">中国财经风云榜得奖金企</div>
<div className="zjbox"><a className="vlightbox" href="./images/zj6.jpg"><img alt="证书1" src="./images/zj6.jpg" width="300"></img></a> <a class="vlightbox" href="./images/zj7.jpg"><img alt="证书2" src="./images/zj7.jpg" width="300"></img></a></div>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};


class Award extends React.Component{
	componentDidMount() {
		$("#关于我们").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="awardbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 公司奖项 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >公司简介</a></li>
<li><a >公司资质</a></li>
<li><a className="ys">公司奖项</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">公司奖项</h1>
<div className="jiangxiang">
    <div className="jxbox left">
        <span style={{"background-color":"initial","color":"rgb(41, 45, 52)","font-size":"16px","font-weight":"bold"}}>鸿丰金业喜获「2015年度香港最受欢迎品牌」奖项</span>
    <br></br>
        <span style={{"color":"rgb(136, 136, 136)","font-size":"13px"}}>由亚洲品牌发展协会设立的「香港最受欢迎品牌Famous Brands Hong
            Kong」计划，表彰不同企业在品牌发展上的努力，并对积极承担社会责任的企业作出肯定。而鸿丰金业十分荣幸于2015年度获选为「香港最受欢迎品牌」。</span><br></br>
        <a href="http://www.famousbrands.asia/2015finalist_gwgold.asp" style={{"display":"inline !important"}}
            target="_blank">了解详情&gt;&gt;</a>
    </div>
    <div className="jxbox right">
        <span
            style={{"color":"rgb(41, 45, 52)","font-size":"16px","font-weight" :"bold", "line-height": "20px", "background-color":"initial"}}>鸿丰金业荣获四月份贸易场十大行员</span><br></br>
        <span
            style={{"color":"rgb(136, 136, 136)","font-size":"13px","line-height":"24px","background-color":"initial"}}>热烈祝贺鸿丰金业荣获2015年4月份金银业贸易场十大最活跃伦敦金/银交易行员</span><br></br>
        <a href="http://www.cgse.com.hk/cn/media_06_1.php?r=0&amp;id=472"
            style={{"display":"inline !important", "background-color": "initial"}} target="_blank">了解详情&gt;&gt;</a>
        </div>
    <div className="jxbox right">
        <p className="jxtt">鸿丰金业被选评为“最佳综合服务黄金公司”</p>
        <p>鸿丰金业在由中国财经网络门户和讯网、中国证券市场研究设计中心等机构联合主办的财经互联网第一大型评选活动"第十二届财经风云榜黄金行业颁奖典礼"中凭借雄厚的实力被评选为"2014年度最佳综合服务黄金公司"。</p>
        <a href="http://gold.hexun.com/2015-01-21/172610158.html" target="_blank">了解详情&gt;&gt;</a>
    </div>
    <div className="jxbox left">
        <p className="jxtt">鸿丰金业荣获一月份贸易场十大行员</p>
        <p>热烈祝贺鸿丰金业荣获2015年1月份金银业贸易场十大最活跃伦敦金/银交易行员</p>
        <a href="http://www.cgse.com.hk/cn/media_06_1.php?r=3&amp;id=469" target="_blank">了解详情&gt;&gt;</a>
    </div>
    <div className="clear">&nbsp;</div>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Advantage extends React.Component{
	componentDidMount() {
		$("#鸿丰优势").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="ProductAdvantagesbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 产品优势 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a className="ys">产品优势</a></li>
<li><a >信誉优势</a></li>
<li><a >存取款优势</a></li>
<li><a >会员系统</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">产品优势</h1>
<div className="ui grid">
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="lefticon1">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">低门槛</p>
<p className="otkdown">最低可交易0.05手，资金低，为更广泛的投资者创造了小资金、低门槛的入门机会。</p>
</div>
</div>
</div>
</div>
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="lefticon2">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">双向交易</p>
<p className="otkdown">交易现货黄金和现货白银可做多或做空，黄金价格或白银价格上涨可做多盈利，相反下跌则可做空盈利，无论升市或跌市均有投资获利机会。</p>
</div>
</div>
</div>
</div>
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="lefticon3">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">高杠杆</p>
<p className="otkdown">1-50倍杠杆，高杠杆，高回报。 伦敦金交易实行保証金制度，1-50倍杠杆，金价每波动1美元，一手就有100美元的收益，以小博大，更有效的利用资金，放大投资回报率。</p>
</div>
</div>
</div>
</div>
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="lefticon4">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">投资便捷</p>
<p className="otkdown">MT4交易平台24小时随时交易。 伦敦、纽约、香港等全球黄金市场交易时间连成一体，构成一个24小时无间断的投资交易系统，客户通过MT4电子交易系统进行24小时交易。</p>
</div>
</div>
</div>
</div>



</div>

</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};



class Reputation extends React.Component{
	componentDidMount() {
		$("#鸿丰优势").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="ReputationAdvantagebg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 信誉优势 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >产品优势</a></li>
<li><a className="ys">信誉优势</a></li>
<li><a >存取款优势</a></li>
<li><a >会员系统</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">信誉优势</h1>
<div className="ui grid">
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="Reputationicon1">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">信心保证</p>
<p className="otkdown">鸿丰金业是香港金银业贸易场AA类会员第50号行员，是香港金银业贸易场认可的伦敦金和伦敦银交易及电子交易商。</p>
</div>
</div>
</div>
</div>
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="Reputationicon2">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">交易公平、公正、公开</p>
<p className="otkdown">单笔1手或以上的交易单均提供金银业贸易场交易编码，交易平台的所有订单价格由金银业贸易场认证,确保公平公正，客户可在本网站或香港金银业贸易场查询相关交易资料。</p>
</div>
</div>
</div>
</div>
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="Reputationicon3">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">交易平台迅速及稳定</p>
<p className="otkdown">鸿丰金业现正使用多年来广授国际使用的Metaquotes MetaTrader4 (MT4) 交易软体，主要是因为MT4交易平台稳定，交易迅速及易学易用，确保客户交易简便、迅速及稳定。</p>
</div>
</div>
</div>
</div>




</div>

</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};


class Deposit extends React.Component{
	componentDidMount() {
		$("#鸿丰优势").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Depositbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 存取款优势 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >产品优势</a></li>
<li><a >信誉优势</a></li>
<li><a className="ys">存取款优势</a></li>
<li><a >会员系统</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">存取款优势优势</h1>
<div className="ui grid">
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="Deposit1">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">存款即时到帐</p>
<p className="otkdown">银联24小时在线入金，即时入帐到MT4交易帐户，方便客户在波动的市场作出即时的资金调配，捕捉每一个获利机会或避免损失。</p>
</div>
</div>
</div>
</div>
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="Deposit2">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">24小时取款</p>
<p className="otkdown">客户可随时透过完善的网上用户中心，提取帐户內的资金，方便客户灵活调配资金。,确保公平公正，客户可在本网站或香港金银业贸易场查询相关交易资料。</p>
</div>
</div>
</div>
</div>
<div className="eight wide column">
<div className="credbox">
<div className="ui grid">
<div className="five wide column" >
<div id="Deposit3">
</div>
</div>
<div className="eleven wide column">
<p className="otkup">公平货币兑换</p>
<p className="otkdown">按照银行公布的货币兑换汇率，并在官网发报最新汇率，提高兑换透明度，保证货币兑换公平，公正，清晰。 </p>
</div>
</div>
</div>
</div>




</div>

</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Member extends React.Component{
	componentDidMount() {
		$("#鸿丰优势").addClass("activeblack")
				
	}
	render () {		
		return (
<div  style={{"background-color":"white"}} >
<div id="Memberbg" >
<div >
	<img src="./images/banner.png" style={{"max-width":"100%"}}/>
</div>
<div className="method-banner">
<img src="./images/exchange_method.png"/>
</div>
<div  className="ui grid">
<div  className="eight wide nopadding column">
<img id="book" src="./images/accumulation.png"/>
</div>
<div  className="eight wide nopadding column">
<img  id="bow" src="./images/exchange_gift.png"/>
</div>
</div>
<div className="mid-banner">
<img src="./images/hot.png"/>
</div>

<div  className="ui grid">
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/40cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/40present.jpg"/>
</div>

</div>
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/60cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/60present.jpg"/>
</div>
</div>
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/250cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/250present.jpg"/>
</div>
</div>
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/750cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/750present.jpg"/>
</div>
</div>
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/1000cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/1000present.jpg"/>
</div>
</div>
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/1500cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/1500present.jpg"/>
</div>
</div>
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/2000cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/2000present.jpg"/>
</div>
</div>
<div  className="four wide nopadding column rotate">
<div  className="shadowsurface">
<img className="innerimg" src="./images/10000cover.png"/>
</div>
<div  className="shadow">
<img className="innerimg" src="./images/10000present.jpg"/>
</div>
</div>

<div className="eight wide nopadding column">
<div className="sm-banner">
<img src="./images/more.png"/>
</div>
</div>
<div className="eight wide nopadding column">
<div className="sm-banner">
<img src="./images/redemption_details.png"/>
</div>
</div>
</div>

</div>

{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};


class Productdescription extends React.Component{
	componentDidMount() {
		$("#产品介绍").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Productdescriptionbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 现货黄金 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a className="ys">现货黄金</a></li>
<li><a >现货白银</a></li>
<li><a >人民币公斤条</a></li>
<li><a >交易细则</a></li>
<li><a >提取实金</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">现货黄金</h1>
<div className="detail">

<p className="pro_tt">现货黄金的由来</p>
<p>伦敦是历史最悠久的黄金交易所，故现货黄金的另一个名称"伦敦金"亦由此而来<br/>
现今主流的四个黄金交易中心包括</p>
<img alt="现货黄金1" src="http://www.gwgold.com.hk/uploadfile/2016/0115/20160115043953646.jpg"/>
<p>国际黄金价格亦因以上四个交易中心而得以接轨，并提供24小时的黄金交易</p>
<p className="pro_tt">黄金的用途</p>
<p>黄金自古以来已经被应用于货币、婚嫁饰物、国际储备以及各类工业用途</p>
<p>在投资层面，近年黄金已渐渐发展成为主流投资产品，不再只是以往的保值和避险作用</p>
<img alt="现货黄金2" src="http://www.gwgold.com.hk/uploadfile/2016/0115/20160115044006657.jpg"/>
<p className="pro_tt">影响黄金价格的因素</p>
<ul className="yinsu">
<li>
<div className="ystt">美元强弱</div>
<p>美元跟黄金同为避险的其中一种工具，也能视为彼此间的竞争对手。</p>
<p>资金往往会选择较强势的资产避险，当美元强势的时候, 资金会从各类资产(包括黄金)流入美元, 相反则会流出。</p>
<p>故此黄金价格会与美元的强弱形成一个反比情况, 当然亦会出现少数正比的情况。</p>
</li>
<li>
<div className="ystt">通胀</div>
<p>由于黄金被视为保值以及避险的作用, 不少投资者皆会以黄金作为对抗通胀的一种投资产品, 所以通胀亦会令黄金的价格上升。</p>
</li>
<li>
<div className="ystt">黄金需求</div>
<p>按照经济学的定义, 当需求比供应更大时, 就会带动价格上升。</p>
<p>黄金的供应难于扩大(因为开采难度,以及金矿的出产量), 面对日渐增大的黄金需求, 黄金的价格亦会因此而上升。</p>
</li>
<li>
<div className="ystt">各国政府政策</div>
<p>近期各国政府皆推出各种货币量化宽松政策, 货币亦因此而贬值, 故此令到资金寻求保值的投资产品。</p>
<p>使黄金成为其中一种受到追捧的投资产品。</p>
</li>
<li>
<div className="ystt">突发事件<br/>
(如战争)</div>
<p>各种突发事件, 如战争,地震等都有机会令到当地政局不稳或经济受到影响, 这会促使投资者买入黄金作避险。</p>
</li>
</ul>
<p className="pro_tt">鸿丰优势</p>
<p>鸿丰金业为投资者提供优质的黄金投资渠道</p>
<ul className="hfys_ul">
<li className="hf1">
<div className="ysico">&nbsp;</div>
<p className="hftt">高回报</p>
<p>低成本获取可观的回报,提供高达100倍的杠杆交易</p>
</li>
<li className="hf2">
<div className="ysico">&nbsp;</div>
<p className="hftt">低门槛</p>
<p>最低交易量0.05张合约, 125美元即可进行交易(鸿丰金业每张合约需要2500美元保证金)</p>
</li>
<li className="hf3">
<div className="ysico">&nbsp;</div>
<p className="hftt">灵活</p>
<p>24小时双向交易让客户能把握每个财富增值时机</p>
</li>
</ul>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Silver extends React.Component{
	componentDidMount() {
		$("#产品介绍").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Silverbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 现货白银 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >现货黄金</a></li>
<li><a className="ys">现货白银</a></li>
<li><a >人民币公斤条</a></li>
<li><a >交易细则</a></li>
<li><a >提取实金</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">现货白银</h1>
<div className="detail">

<p className="pro_tt">白银的用途</p>
<p>白银以往是仅次于黄金的一种贵金属<br></br>
白银是古时货币的其中一种<br></br>
随著现今社会白银的重要性越来越低,白银已经不再视为货币金属<br></br>
基于其特性,良好的导电和导热,使白银成为了工业金属<br></br>
除了工业用途,白银亦被应用于各种不同的产品里,包括饰物,餐具,摄影器材及投资用途等等</p>
<img alt="现货白银" src="http://www.gwgold.com.hk/uploadfile/2016/0115/20160115051811731.jpg"/>
<p>国际黄金价格亦因以上四个交易中心而得以接轨，并提供24小时的黄金交易</p>
<p className="pro_tt">影响白银价格的因素</p>
<div className="svyinsu">
<p className="sv1"><span>供应与需求：</span>受到生产国每年生产的数量影响</p>
<p className="sv2"><span>回收供给：</span>受到回收供给的行为影响每年生产的数量影响</p>
</div>
<p className="pro_tt">白银投资</p>
<p>鸿丰金业为投资者提供优质的黄金投资渠道</p>
<div className="bytz tz1">
<div className="tzico">&nbsp;</div>
<p className="tztt">高杠杆</p>
<p>拥有比现货黄金更高的杠杆比例</p>
</div>
<div className="bytz tz2">
<div className="tzico">&nbsp;</div>
<p className="tztt">灵活</p>
<p>24小时双向交易让客户能把握每个财富增值时机</p>
</div>
<br></br>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Rmbgjt extends React.Component{
	componentDidMount() {
		$("#产品介绍").addClass("activeblack")
				
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Rmbgjtbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 人民币公斤条 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >现货黄金</a></li>
<li><a >现货白银</a></li>
<li><a className="ys">人民币公斤条</a></li>
<li><a >交易细则</a></li>
<li><a >提取实金</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">人民币公斤条</h1>
<div className="detail">

<p className="pro_tt">什么是人民币公斤条</p>
<p style={{"margin-bottom":"30px"}}>由于香港的人民币存款​​不断增加。据香港金融管理局数据显示人民币存款​​已约佔香港总存款10%。但与此同时，离岸人民币产品仍相当缺乏。</p>
<p style={{"margin-bottom":"30px"}}>国务院副总理李克强在十二五规划促进两地金融经贸合作时，为了推进人民币国际化进​​程，特批香港金银业贸易场推出全球首个离岸市场、以人民币计价黄金现货交易产品--人民币公斤条黄金。金银业贸易场在新闻稿中表示，新产品可帮助推动人民币国际化及香港人民币离岸中心发展，为投资者提供更多人民币投资产品选择，也可巩固香港作为世界主要黄金交易中心的地位。</p>
<p style={{"margin-bottom":"30px"}}>人民币公斤条黄金在香港金银业贸易场设立及营运之自动对盘及交易系统內进行交易。金条规格与上海黄金交易所划一，是贸易场认可炼铸商生产的9999成色公斤条，可透过贸易场电子交易系统交易。</p>
<img alt="什么是公斤条" src="http://www.gwgold.com.hk/uploadfile/2016/0115/20160115055617818.jpg"/>
<p className="pro_tt">影响人民币公斤条价格的因素</p>
<p>持仓成本影响人民币公斤条黄金的定价，若没有现货市埸供求的因素，人民币公斤条黄金的理论价等于买入相关现货黄金的成本。而现货市埸由实金供求为基础，与金融市埸以资金拆借成本定借贷供求的模式有所不同。人民币公斤条黄金的现货交割机制是上板交割实金时，交割双方在现货市埸上套取现金为考虑因素之一，另有意建立中立仓套取息差的行员将有意欲参与实金交割，间接影响现货市埸的供求。如仓费由持仓者支付予欠仓者，俗称「低息」。相反，如仓费由持仓者收取或欠仓者支付，则为「高息」。</p>
<img alt="价格因素" src="http://www.gwgold.com.hk/uploadfile/2016/0115/20160115055632301.jpg"></img>
<p>人民币公斤条黄金价格将受现货市埸供求的变化所影响，再者，市埸情绪及参与行员亦是影响短期价格的因素，因此，人民币公斤条黄金的市埸价格不一定与相关市埸价格相同。</p>
<p className="pro_tt">人民币公斤条黄金特点</p>
<div className="gjttd">
<p className="td1">人民币报价及以人民币作合约结算</p>
<p className="td2">采用现行电子交易<br></br>
平台提供人民币公斤条黄金</p>
<p className="td3">民币报价及以人民币作合约结算，<br></br>
即实金交割清算。认可上海黄金<br></br>
交易所1号金(成色9999)或2号金<br></br>
(成色9995)及或贸易场认可黄金炼铸商炼铸之公斤条(成色9999)，为一公斤合约。投资者可透过贸易场的会员进行买卖。</p>
<p className="td4">采用现行电子交易平台提供人<br></br>
民币公斤条黄金，只提供已参<br></br>
与电子交易平台行员。所有透<br></br>
过贸易场电子交易平台进行之<br></br>
合约买卖均获贸易场派发独有<br></br>
的[合约交易编码]，以证明有关交易透过贸易场之电子交易平台进行，投资者更可以凭藉有关[合约交易编码]于贸易场网站查阅交易资料,大大提高投资黄金的透明度,以保障投资者的利益。</p>
</div>
<div className="pro_tt">投资鸿丰人民币公斤条黄金优势</div>
<div className="gjtbox">
<div className="gjtys gjt1">
<div className="gjtico">&nbsp;</div>
<p className="gjttt">低门槛</p>
<p>最低交易量0.5张合约,1,500人民币即可进行交易(鸿丰金业每张合约需要3000人民币保证金)</p>
</div>
<div className="gjtys gjt2">
<div className="gjtico">&nbsp;</div>
<p className="gjttt">灵活</p>
<p>24小时双向交易让客户能把握每个财富增值时机</p>
</div>
</div>


</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};


class TradingRules extends React.Component{
	componentDidMount() {
		$("#产品介绍").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="TradingRulesbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 交易细则 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >现货黄金</a></li>
<li><a >现货白银</a></li>
<li><a >人民币公斤条</a></li>
<li><a className="ys">交易细则</a></li>
<li><a >提取实金</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">交易细则</h1>
<div className="detail">
<div className="xztt">商品交易细则</div>
<table  className="ui celled table xztb">
<tbody>
<tr>
<td className="center aligned">&nbsp;</td>
<td className="center aligned">本地现货金(LLG)</td>
<td className="center aligned">本地现货白银(LLS)</td>
<td className="center aligned">人民币公斤条(LKG)</td>
</tr>
<tr>
<td className="center aligned">合约单位(每手)</td>
<td className="center aligned">100盎司</td>
<td className="center aligned">5000盎司</td>
<td className="center aligned">1公斤</td>
</tr>
<tr>
<td className="center aligned">交易差价</td>
<td className="center aligned">0.50美元/盎司</td>
<td className="center aligned">0.05美元/盎司</td>
<td className="center aligned">0.15人民币/克</td>
</tr>
<tr>
<td className="center aligned">基本保证金</td>
<td className="center aligned" colSpan="2">每手2500美元</td>
<td className="center aligned">每手人民币6000元</td>
</tr>
<tr>
<td className="center aligned">单笔最低交易数量</td>
<td className="center aligned" colSpan="2">0.05手合约</td>
<td className="center aligned">0.5手合约</td>
</tr>
<tr>
<td className="center aligned">单笔最大交易数量</td>
<td className="center aligned" colSpan="2">20手合约</td>
<td className="center aligned">50手合约</td>
</tr>
<tr>
<td className="center aligned">手续费 (每手)</td>
<td className="center aligned" colSpan="2">50美元</td>
<td className="center aligned">每手人民币150元</td>
</tr>
<tr>
<td className="center aligned">每日利息</td>
<td className="center aligned">5美金</td>
<td className="center aligned">10美金</td>
<td className="center aligned">人民币30元</td>
</tr>
<tr>
<td className="center aligned">每日仓租</td>
<td className="center aligned" colSpan="3">--------------------不适用--------------------</td>
</tr>
<tr>
<td className="center aligned">锁仓保证金</td>
<td className="center aligned" colSpan="2">625美元<br></br>
(一套1250美元)</td>
<td className="center aligned">人民币1500元<br></br>
(一套人民币3000元)</td>
</tr>
</tbody>
</table>
<div className="xztt">交易时间及结算时间</div>
<table  className="ui celled table xztb">
<tbody>
<tr>
<th width="20%">
&nbsp;</th>
<th width="40%" style={{"color":"#C1262C","font-size":"20px"}}>
夏令</th>
<th width="40%" style={{"color":"#C1262C","font-size":"20px"}}>
冬令</th>
</tr>
<tr>
<td className="center aligned">交易时间</td>
<td className="center aligned">由星期一上午07:01至星期六凌晨03:59</td>
<td className="center aligned">由星期一上午<span style={{"color":"rgb(68, 68, 68)","font-size":"14px"}}>07:01</span>至星期六凌晨03:59</td>
</tr>
<tr>
<td className="center aligned">结算时间</td>
<td className="center aligned">每日香港时间凌晨五时至六时正</td>
<td className="center aligned">每日香港时间凌晨六时至七时正</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">美国冬令时间由十一月第一个星期日早上二时至三月第二个星期日早上二时；</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">美国夏令时间由三月第二个星期日早上二时至十一月第一个星期日早上二时。</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">交易时将会按国际假期更改,如有更动将会于本公司网页公布</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">持仓过巿星期五,六,日,需付三天利息</td>
</tr>
</tbody>
</table>
<div className="xztt">交易方式</div>
<div className="jyfs">
<div className="fs1">
<p><span className="fspan">市价单：</span>以当时巿场价格进行交易,如遇上巿况波动,巿价单有可能不会成交</p>
</div>
<div className="fs2">
<p><span className="fspan">限价单：</span>现货黄金限价单需要与巿场价格相距最少200个价位(即2美元)或以上才能设定, 现货白银限价单需要与巿场价格相距最少20个价位(即0.2美元)或以上才能设定, 人民币公斤条限价单需要与巿场价格相距最少40个价位(即0.4元人民币)或以上才能设定, 当巿场价格触及客户所设定的价格,便会自动成交</p>
<p><span>* 若客户交易帐号內的保证金不足, 巿价单及限价单皆不会成交, 并会即时取消处理</span></p>
</div>
<div className="fs3">
<p><span className="fspan">止盈单及止损单：</span>可为仍未平仓的合约设定, 现货黄金需要与巿场价格200个价位以上才能设定,<span style={{"color":"rgb(68, 68, 68)","font-size":"16px","background-color":"initial"}}>现货白银需要与巿场价格20个价位以上才能设定,</span><span style={{"color":"rgb(68, 68, 68)","font-size":"16px","background-color":"initial"}}>而人民币公斤条需要与巿场价格40个价位以上才能设定, 当巿场价格触及客户所设定的价格,便会自动成交</span></p>
<p><span>* 所有限价单,止盈单,止损单有效时间直至当周收巿时间或假期收巿前, 除非已成交或客户自行取消</span></p>
</div>
</div>
<div className="xztt">锁仓</div>
<table  className="ui celled table xztb">
<tbody>
<tr>
<td>帐号內同时拥有同等数量合约的长仓及短仓</td>
<td>帐号內的可用预付款比例必需高于100%才能进行锁仓</td>
</tr>
<tr>
<td colSpan="2"><span>* 本公司并不建议客户进行锁仓, 锁仓会增加客户手续费及利息成本, 客户锁仓时请留意交易帐号內的情况</span></td>
</tr>
</tbody>
</table>
<p className="xzp" style={{"text-align":"left"}}>对于锁仓操作的规定是当客户凈值大于已用预付款时，客户可以进行锁单，并且只佔用单边的保证金。例如，客户交易了1手多单，已用预付款为2500美金，只要客户的凈值大于2500美金，客户即可随时锁仓。如果客户的凈值小于2500美金，客户将只能够平仓，不能够进行锁仓操作。当客户锁仓之后，可随时进行解锁操作。如果预付款比例小于100%执行锁单就会出现“资金不够”的提示。</p>
<p className="xzp" style={{"text-align":"left"}}>鑑于客户会使用掛单的方式进行锁单，敬请留意账户的资金情况。例如，账户资金有2800美金，于1420买入1手多单，同时在1415设置了掛单，希望价格跌到1415的时候系统帮忙锁单。而这种情况下，如果价格真的跌到1415，预付款比例是小于100%的，这就会造成无法锁仓的情况，因此请您在交易的时候务必安排好资金。</p>
<p className="xzp" style={{"text-align":"left"}}>註：预付款比例= 凈值÷已用预付款</p>
<div className="xztt">强制平仓</div>
<p className="xzp">当交易帐号內的净值低于保证金50%或以下，客户将被要求追加预付款至基本预付款比例。</p>
<p className="xzp">当交易帐号內的净值低于保证金要求的20%或以下, 为保障客户利益, 本公司将会为客户持单部分合约或全部合约平仓, 直至净值回到保证金要求的20%以上</p>
<div className="xztt">异常交易</div>
<p className="xzp" style={{"text-align":"left"}}>1、如因网路延迟,故障,电脑故障,报价误差或报价系统漏洞, 均有可能造成交易平台上的报价无法准确地反映即时巿场价格, 为维护网络交易的公平性,鸿丰金业并不接受任何利用故障或漏洞进行之交易,如经发现会将所有有关交易取消并追回, 所有非法利润及其所产生的额外费用</p>
<p className="xzp" style={{"text-align":"left"}}>2、如当中有30%的订单持仓时间低于3分钟，或属于3分钟內建立的锁仓订单，账户会被判定为交易异常</p>
<p className="zhuyi">★ 交易单亏损额达到交易本金10%或以上，不作任何处理，将客户的取款金额发放给客户并会销户处理</p>
<p className="zhuyi">★ 交易单亏损额低于交易本金10%，我们会收取注资金额的10%作为异常交易产生的成本费用，再将余额发放给客户并会销户处理。</p>
<p className="zhuyi">★ 审核周期內的交易单是盈利的，我们会扣除所有盈利并会收取注资金额的10%作为异常交易产生的成本费用，再将余额发放给客户并会销户处理。</p>
<div className="xztt">跳空规则</div>
<p className="xzp" style={{"text-align":"center"}}>在一般跳空情况下, 所有限价单将根据客户所订立的价格成交, 如遇上客户同时存在未平仓合约及限价单, 跳空导致保证金不足, 持有仓位会被斩仓及限价单被取消, 鸿丰金业保留对客户的以上情况的最终审批权</p>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};


class Withdraw extends React.Component{
	componentDidMount() {
		$("#产品介绍").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="TradingRulesbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 提取实金 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >现货黄金</a></li>
<li><a >现货白银</a></li>
<li><a >人民币公斤条</a></li>
<li><a className="ys">交易细则</a></li>
<li><a >提取实金</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">交易细则</h1>
<div className="detail">
<div className="xztt">商品交易细则</div>
<table  className="ui celled table xztb">
<tbody>
<tr>
<td className="center aligned">&nbsp;</td>
<td className="center aligned">本地现货金(LLG)</td>
<td className="center aligned">本地现货白银(LLS)</td>
<td className="center aligned">人民币公斤条(LKG)</td>
</tr>
<tr>
<td className="center aligned">合约单位(每手)</td>
<td className="center aligned">100盎司</td>
<td className="center aligned">5000盎司</td>
<td className="center aligned">1公斤</td>
</tr>
<tr>
<td className="center aligned">交易差价</td>
<td className="center aligned">0.50美元/盎司</td>
<td className="center aligned">0.05美元/盎司</td>
<td className="center aligned">0.15人民币/克</td>
</tr>
<tr>
<td className="center aligned">基本保证金</td>
<td className="center aligned" colSpan="2">每手2500美元</td>
<td className="center aligned">每手人民币6000元</td>
</tr>
<tr>
<td className="center aligned">单笔最低交易数量</td>
<td className="center aligned" colSpan="2">0.05手合约</td>
<td className="center aligned">0.5手合约</td>
</tr>
<tr>
<td className="center aligned">单笔最大交易数量</td>
<td className="center aligned" colSpan="2">20手合约</td>
<td className="center aligned">50手合约</td>
</tr>
<tr>
<td className="center aligned">手续费 (每手)</td>
<td className="center aligned" colSpan="2">50美元</td>
<td className="center aligned">每手人民币150元</td>
</tr>
<tr>
<td className="center aligned">每日利息</td>
<td className="center aligned">5美金</td>
<td className="center aligned">10美金</td>
<td className="center aligned">人民币30元</td>
</tr>
<tr>
<td className="center aligned">每日仓租</td>
<td className="center aligned" colSpan="3">--------------------不适用--------------------</td>
</tr>
<tr>
<td className="center aligned">锁仓保证金</td>
<td className="center aligned" colSpan="2">625美元<br></br>
(一套1250美元)</td>
<td className="center aligned">人民币1500元<br></br>
(一套人民币3000元)</td>
</tr>
</tbody>
</table>
<div className="xztt">交易时间及结算时间</div>
<table  className="ui celled table xztb">
<tbody>
<tr>
<th width="20%">
&nbsp;</th>
<th width="40%" style={{"color":"#C1262C","font-size":"20px"}}>
夏令</th>
<th width="40%" style={{"color":"#C1262C","font-size":"20px"}}>
冬令</th>
</tr>
<tr>
<td className="center aligned">交易时间</td>
<td className="center aligned">由星期一上午07:01至星期六凌晨03:59</td>
<td className="center aligned">由星期一上午<span style={{"color":"rgb(68, 68, 68)","font-size":"14px"}}>07:01</span>至星期六凌晨03:59</td>
</tr>
<tr>
<td className="center aligned">结算时间</td>
<td className="center aligned">每日香港时间凌晨五时至六时正</td>
<td className="center aligned">每日香港时间凌晨六时至七时正</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">美国冬令时间由十一月第一个星期日早上二时至三月第二个星期日早上二时；</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">美国夏令时间由三月第二个星期日早上二时至十一月第一个星期日早上二时。</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">交易时将会按国际假期更改,如有更动将会于本公司网页公布</td>
</tr>
<tr>
<td class="tbleft" colSpan="3">持仓过巿星期五,六,日,需付三天利息</td>
</tr>
</tbody>
</table>
<div className="xztt">交易方式</div>
<div className="jyfs">
<div className="fs1">
<p><span className="fspan">市价单：</span>以当时巿场价格进行交易,如遇上巿况波动,巿价单有可能不会成交</p>
</div>
<div className="fs2">
<p><span className="fspan">限价单：</span>现货黄金限价单需要与巿场价格相距最少200个价位(即2美元)或以上才能设定, 现货白银限价单需要与巿场价格相距最少20个价位(即0.2美元)或以上才能设定, 人民币公斤条限价单需要与巿场价格相距最少40个价位(即0.4元人民币)或以上才能设定, 当巿场价格触及客户所设定的价格,便会自动成交</p>
<p><span>* 若客户交易帐号內的保证金不足, 巿价单及限价单皆不会成交, 并会即时取消处理</span></p>
</div>
<div className="fs3">
<p><span className="fspan">止盈单及止损单：</span>可为仍未平仓的合约设定, 现货黄金需要与巿场价格200个价位以上才能设定,<span style={{"color":"rgb(68, 68, 68)","font-size":"16px","background-color":"initial"}}>现货白银需要与巿场价格20个价位以上才能设定,</span><span style={{"color":"rgb(68, 68, 68)","font-size":"16px","background-color":"initial"}}>而人民币公斤条需要与巿场价格40个价位以上才能设定, 当巿场价格触及客户所设定的价格,便会自动成交</span></p>
<p><span>* 所有限价单,止盈单,止损单有效时间直至当周收巿时间或假期收巿前, 除非已成交或客户自行取消</span></p>
</div>
</div>
<div className="xztt">锁仓</div>
<table  className="ui celled table xztb">
<tbody>
<tr>
<td>帐号內同时拥有同等数量合约的长仓及短仓</td>
<td>帐号內的可用预付款比例必需高于100%才能进行锁仓</td>
</tr>
<tr>
<td colSpan="2"><span>* 本公司并不建议客户进行锁仓, 锁仓会增加客户手续费及利息成本, 客户锁仓时请留意交易帐号內的情况</span></td>
</tr>
</tbody>
</table>
<p className="xzp" style={{"text-align":"left"}}>对于锁仓操作的规定是当客户凈值大于已用预付款时，客户可以进行锁单，并且只佔用单边的保证金。例如，客户交易了1手多单，已用预付款为2500美金，只要客户的凈值大于2500美金，客户即可随时锁仓。如果客户的凈值小于2500美金，客户将只能够平仓，不能够进行锁仓操作。当客户锁仓之后，可随时进行解锁操作。如果预付款比例小于100%执行锁单就会出现“资金不够”的提示。</p>
<p className="xzp" style={{"text-align":"left"}}>鑑于客户会使用掛单的方式进行锁单，敬请留意账户的资金情况。例如，账户资金有2800美金，于1420买入1手多单，同时在1415设置了掛单，希望价格跌到1415的时候系统帮忙锁单。而这种情况下，如果价格真的跌到1415，预付款比例是小于100%的，这就会造成无法锁仓的情况，因此请您在交易的时候务必安排好资金。</p>
<p className="xzp" style={{"text-align":"left"}}>註：预付款比例= 凈值÷已用预付款</p>
<div className="xztt">强制平仓</div>
<p className="xzp">当交易帐号內的净值低于保证金50%或以下，客户将被要求追加预付款至基本预付款比例。</p>
<p className="xzp">当交易帐号內的净值低于保证金要求的20%或以下, 为保障客户利益, 本公司将会为客户持单部分合约或全部合约平仓, 直至净值回到保证金要求的20%以上</p>
<div className="xztt">异常交易</div>
<p className="xzp" style={{"text-align":"left"}}>1、如因网路延迟,故障,电脑故障,报价误差或报价系统漏洞, 均有可能造成交易平台上的报价无法准确地反映即时巿场价格, 为维护网络交易的公平性,鸿丰金业并不接受任何利用故障或漏洞进行之交易,如经发现会将所有有关交易取消并追回, 所有非法利润及其所产生的额外费用</p>
<p className="xzp" style={{"text-align":"left"}}>2、如当中有30%的订单持仓时间低于3分钟，或属于3分钟內建立的锁仓订单，账户会被判定为交易异常</p>
<p className="zhuyi">★ 交易单亏损额达到交易本金10%或以上，不作任何处理，将客户的取款金额发放给客户并会销户处理</p>
<p className="zhuyi">★ 交易单亏损额低于交易本金10%，我们会收取注资金额的10%作为异常交易产生的成本费用，再将余额发放给客户并会销户处理。</p>
<p className="zhuyi">★ 审核周期內的交易单是盈利的，我们会扣除所有盈利并会收取注资金额的10%作为异常交易产生的成本费用，再将余额发放给客户并会销户处理。</p>
<div className="xztt">跳空规则</div>
<p className="xzp" style={{"text-align":"center"}}>在一般跳空情况下, 所有限价单将根据客户所订立的价格成交, 如遇上客户同时存在未平仓合约及限价单, 跳空导致保证金不足, 持有仓位会被斩仓及限价单被取消, 鸿丰金业保留对客户的以上情况的最终审批权</p>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Latestnews extends React.Component{
	constructor(props) {
		        super(props);
		        this.state = {
			     article: ""
		        };        
		    }


	componentDidMount() {
var _this=this
$("#最新资讯").addClass("activeblack")

  //分页
  $.ajaxSetup({
	async: false
	});
  $.ajax({                
	type:"GET",
	 url:"https://www.kenta.cn/app3/wp-json/wp/v2/posts?page=1",
	 dataType:'json', //数据类型
	 success:function(data){                        
	  console.log("文章数据",data)
	  _this.setState({article:data})
	  console.log("11111",_this.state.article)

	 }
  });



  var onPagechange = function(page){
	console.log('当前点击页码', page);
	$.ajax({                
		type:"GET",
		 url:"https://www.kenta.cn/app3/wp-json/wp/v2/posts?page="+page,
		 dataType:'json', //数据类型
		 success:function(data){                        
		  _this.setState({article:data})
		 }
	  });
}
var obj = {
	wrapid:'wrap1', //页面显示分页器容器id
	total:1000,//总条数
	pagesize:10,//每页显示10条
	currentPage:1,//当前页
	onPagechange:onPagechange,
	//btnCount:7 页数过多时，显示省略号的边界页码按钮数量，可省略，且值是大于5的奇数
}
pagination.init(obj);



	}
	render () {	
		var _this=this
		console.log("333333",_this.state.article)

var arthtml=[]
if(_this.state.article !=""){
	console.log("11111",_this.state.article)
_.map(_this.state.article,function(item){
	var yearDate=moment(item.date).format('YYYY-MM')
	var date=moment(item.date).format('DD')

	arthtml.push(
    <div className="ui grid">
    <div className="two wide column square">
	<div style={{"font":"50px 微软雅黑","fontWeight":"900","text-align":"center"}}>{date}</div>
	<div style={{"text-align":"center"}}>{yearDate}</div>
	</div>
	<div className="one wide column"></div>
	<div className="thirteen wide column">
	<div style={{"color":"#c1262c","font-size":"18px","fontWeight":"700","lineHeight":"50px"}}>{item.title.rendered}</div>
	<div style={{}}>{item.title.rendered}</div>
	</div>
	<div className="ui divider" style={{"width":"100%"}}></div>
  </div>
	)
})
}
		



		return (
<div style={{"background-color":"white"}}>
<div id="Latestnewsbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 公司公告 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a className="ys">公司公告</a></li>
<li><a >经济新闻</a></li>
<li><a >经济数据</a></li>
<li><a >专业评论</a></li>
<li><a >每日汇率</a></li>
<li><a >公司活动</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">公司公告</h1>
<div className="detail">
{arthtml}
<div className="paginationjs-theme-red paginationjs-big" id="wrap1"></div>
























</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Economicnews extends React.Component{
	componentDidMount() {
		$("#最新资讯").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Economicnewsbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 经济新闻 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >公司公告</a></li>
<li><a className="ys">经济新闻</a></li>
<li><a >经济数据</a></li>
<li><a >专业评论</a></li>
<li><a >每日汇率</a></li>
<li><a >公司活动</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">经济新闻</h1>
<div className="detail">
<ul id="fresh_news" className="newslist"><li><span className="time">13:13</span><p>
<span>
美国财长姆努钦会见沙特王储，美沙生意或继续；<br></br>① 据外媒10月22日报道，沙特外交部官方推特账号当天发布了姆努钦与王储在利雅得会见的合照，王储在会面中强调了沙美战略伙伴关系对沙特“2030愿景”的重要性，“2030愿景”是沙特一项长期的发展计划，旨在减少该国对石油收入的依赖，并使其以“化石燃料驱动”的经济变得多样化；<br></br>② 报道称，该会议并没有作为姆努钦中东六国之行的一部分而被特别宣布，与此同时，特朗普正因拒绝停止向利雅得出售价值4500亿美元的武器，面临来自国内的压力；<br></br>③ 两人见面的消息也在美国议员和观察人士中引发新一轮的愤怒，参议员布卢门撒尔在推特上写道“我们现在是沙特阿拉伯的宣传品吗” </span>
</p></li><li><span className="time">13:08</span><p>
<span>
美银美林：黄金重拾其组合对冲地位；<br></br>① 美银美林策略师看好与黄金挂钩的看涨期权。包括詹姆斯·巴蒂(James Barty)在内的美银美林投资策略师称目前的环境是，这种贵金属正重新成为一种投资组合对冲工具，并具有价值；<br></br>② 市场目前过度做空黄金期货，如果美联储在年底至2019年期间采取相对不那么强硬的货币政策，可能会推高非美元交叉货币，并推高黄金价值；<br></br>③ 根据该报告，策略师们对金价可能上涨持短期看法——他们做多1月到期的SPDR Gold Shares交易所买卖基金(ETF)的看涨期权。该期权执行价为117美元，上周五收盘价为116.01美元；<br></br>④ 在经历了连续6个月的下跌后，黄金价格本月上涨了约3%，今年迄今为止已经下跌了近6%。美国商品期货交易委员会(CFTC)最新数据显示，对冲基金和其他大型投机者减少了自3月份以来对黄金的看跌押注 </span>
</p></li><li><span className="time">13:03</span><p>
<span>
海关总署：中国9月汽油出口73万吨，为2017年9月以来新低；<br></br>中国9月柴油出口103万吨，为2017年1月以来新低。<br></br>中国9月液化天然气进口437万吨；<br></br>中国9月氧化铝出口165839吨，为今年最高；<br></br>中国9月废金属进口36万吨，为年内新低。<br></br>中国9月液化天然气进口437万吨；<br></br>中国9月废铝进口10万吨，为今年最低；<br></br>中国9月废铜进口20万吨；<br></br>中国9月玉米进口4万吨，为2016年11月以来新低 </span>
</p></li><li><span className="time">13:01</span><p>
<span>新加坡 9月 核心CPI年率</span>
<br></br><span className="nom_bg">前值：<span>1.90%</span></span> <span className="nom_bg">&nbsp;预期：<span>1.90%</span> </span>
</p></li><li><span className="time">13:01</span><p>
<span>日本 9月 超市销售年率</span>
<br></br><span className="nom_bg">前值：<span>0.10%</span></span> <span className="nom_bg">&nbsp;预期：<span>-</span> </span>
</p></li><li><span className="time">13:00</span><p>
<span>
现货黄金现报1224.01美元/盎司，涨0.16%；现货白银现报14.55美元/盎司，跌0.12%；<br></br>COMEX黄金期货现报1226.80美元/盎司，涨0.18%；COMEX白银期货现报14.57美元/盎司，跌0.15% </span>
</p></li><li><span className="time">13:00</span><p>
<span>
美原油现报69.16美元/桶，跌0.29%；布伦特原油现报79.52美元/桶，跌0.39%；<br></br>美燃油现报2.3104美元/加仑，跌0.34%；美天然气现报3.149美元/百万英热单位(mmBtu)，涨0.35% </span>
</p></li><li><span className="time">13:00</span><p>
<span>
美元指数现报96.06，涨0.02%；欧元兑美元现报1.1456，跌0.07%；<br></br>英镑兑美元现报1.2959，跌0.03%；美元兑日元现报112.55，跌0.24%；<br></br>澳元兑美元现报0.7061，跌0.28%；纽元兑美元现报0.6540，跌0.64%；<br></br>美元兑加元现报1.3098，跌0.02%；美元兑瑞郎现报0.9963，涨0.03% </span>
</p></li><li><span className="time">13:00</span><p>
<span>
澳洲股市指标S&amp;P/ASX200指数周二收盘下跌0.98%，报5847.10点 </span>
</p></li><li><span className="time">13:00</span><p>
<span>新加坡 9月 CPI月率</span>
<br></br><span className="nom_bg">前值：<span>0.40%</span></span> <span className="nom_bg">&nbsp;预期：<span>0.10%</span> </span>
</p></li></ul>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Economicdata extends React.Component{
	componentDidMount() {
		$("#最新资讯").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Economicdatabg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 经济数据 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >公司公告</a></li>
<li><a >经济新闻</a></li>
<li><a className="ys">经济数据</a></li>
<li><a >专业评论</a></li>
<li><a >每日汇率</a></li>
<li><a >公司活动</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">经济数据</h1>
<div className="detail">
<div className="cdate">
<ul id="calendar_ul">
	<li><a >星期三<br></br>27</a></li>
	<li><a >星期四<br></br>28</a></li>
	<li><a >星期五<br></br>29</a></li>
	<li><a  className="now">星期一<br></br>02</a></li>
	<li><a >星期二<br></br>03</a></li>
	<li><a >星期三<br></br>04</a></li>
	<li><a >星期四<br></br>05</a></li>
</ul>
<div className="clear"></div>
</div>
<table className="ui single line  striped table">
<thead>
<tr >
<th className="trstyle">时间</th>
<th className="trstyle">指标</th>
<th className="trstyle">经济体</th>
<th className="trstyle">实际值</th>
<th className="trstyle">预期值</th>
<th className="trstyle">前值</th>
</tr>
</thead>
<tbody>
<tr>
<td>2019年12月02日09:30</td>
<td className="tcenter">人民币对卢布汇率中间价</td>
<td className="coun"><span></span><i className="cn flag"></i>中国</td>
<td>10.2765</td>
<td>--</td>
<td>10.2521</td>
</tr><tr className="odd"><td>2019年12月02日09:30</td>
<td className="tcenter">澳元对人民币汇率中间价</td>
<td className="coun"><span></span><i className="cn flag"></i>中国</td>
<td>4.5807</td>
<td>--</td>
<td>4.5513</td>
</tr><tr><td>2019年12月02日12:30</td>
<td className="tcenter">欧洲央行再融资利率</td>
<td className="coun"><span></span><i className="eu flag"></i>欧元区</td>
<td>0.05%</td>
<td>0.05%</td>
<td>0.05%</td>
</tr><tr className="odd"><td>2019年12月02日12:30</td>
<td className="tcenter">当周外国央行持有国债变动(亿美元)(至0903)</td>
<td className="coun"><span></span><i className="us flag"></i>美国</td>
<td>-170</td>
<td>--</td>
<td>+55.64</td>
</tr><tr><td>2019年12月02日14:30</td>
<td className="tcenter">官方银行利率</td>
<td className="coun"><span></span><i className="gb flag"></i>英国</td>
<td>0.50%</td>
<td>0.50%</td>
<td>0.50%</td>
</tr><tr className="odd"><td>2019年12月02日14:30</td>
<td className="tcenter">隔夜目标利率</td>
<td className="coun"><span></span><i className="ca flag"></i>加拿大</td>
<td>0.50%</td>
<td>0.50%</td>
<td>0.50%</td>
</tr><tr><td>2019年12月02日14:30</td>
<td className="tcenter">官方现金利率</td>
<td className="coun"><span></span><i className="nz flag"></i>新西兰</td>
<td>2.75%</td>
<td>2.75%</td>
<td>3%</td>
</tr><tr className="odd"><td>2019年12月02日16:30</td>
<td className="tcenter">当周外国央行持有国债变动(亿美元)(至0917)</td>
<td className="coun"><span></span><i className="us flag"></i>美国</td>
<td>+230</td>
<td>--</td>
<td>-170</td>
</tr><tr><td>2019年12月02日17:00</td>
<td className="tcenter">上周买进外国股票(亿日元)(至0918)</td>
<td className="coun"><span></span><i className="jp flag"></i>日本</td>
<td>+4111</td>
<td>--</td>
<td>+3858</td>
</tr>
<tr className="odd">
<td>2019年12月02日20:30</td>
<td className="tcenter">澳洲联储现金利率</td>
<td className="coun"><span></span><i className="au flag"></i>澳大利亚</td>
<td>+2.00%</td>
<td>+2.00%</td>
<td>+2.00%</td>
</tr>
<tr>
<td>2019年12月02日20:30</td>
<td className="tcenter">上周季调后续请失业金人数(至0926)</td>
<td className="coun"><span></span><i className="us flag"></i>美国</td>
<td>220.4</td>
<td>220.5</td>
<td>219.5</td>
</tr>
<tr className="odd">
<td>2019年12月02日20:30</td>
<td className="tcenter">上周货币供给M1变动(亿美元)(至0928)</td>
<td className="coun"><span></span><i className="us flag"></i>美国</td>
<td>-93</td>
<td>--</td>
<td>+69</td>
</tr><tr><td>2019年12月02日22:00</td>
<td className="tcenter">上周ECRI领先指标(至1002)</td>
<td className="coun"><span></span><i className="us flag"></i>美国</td>
<td>132.5</td>
<td>--</td>
<td>130.7</td>
</tr></tbody>
</table>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Professionalreviews extends React.Component{
	componentDidMount() {
		$("#最新资讯").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Professionalreviewsbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 专业评论 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >公司公告</a></li>
<li><a >经济新闻</a></li>
<li><a >经济数据</a></li>
<li><a className="ys">专业评论</a></li>
<li><a >每日汇率</a></li>
<li><a >公司活动</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">专业评论</h1>
<div className="detail">
分页
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Dailyexchangerate extends React.Component{
	componentDidMount() {
		$("#最新资讯").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Dailyexchangeratebg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 每日汇率 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >公司公告</a></li>
<li><a >经济新闻</a></li>
<li><a >经济数据</a></li>
<li><a >专业评论</a></li>
<li><a className="ys">每日汇率</a></li>
<li><a >公司活动</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">每日汇率</h1>
<div className="detail">
<table className="ui celled table" >
<tbody>
<tr>
<th className="trstyle">兑换货币</th>
<th className="trstyle">兑换率</th>
<th className="trstyle">更新时间</th>
</tr>
<tr>
<td>美元 兑 港元</td>
<td>1 美元 = 7.8 港元</td>
<td>2013-04-18 23:11:44</td>
</tr>
<tr>
<td><span >美元 兑 人民币</span></td>
<td>1 美元 = 7.0262 人民币</td>
<td>2019-12-02 09:31:03</td>
</tr>
<tr>
<td>美元 兑 人民币(提款)</td>
<td>1 美元 = 7.0262 人民币</td>
<td>2019-12-02 09:31:03</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Companyactivities extends React.Component{
	componentDidMount() {
		$("#最新资讯").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Companyactivitiesbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 公司活动 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >公司公告</a></li>
<li><a >经济新闻</a></li>
<li><a >经济数据</a></li>
<li><a >专业评论</a></li>
<li><a >每日汇率</a></li>
<li><a className="ys">公司活动</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">公司活动</h1>
<div className="detail">

<div className="ui grid actbox">
	<div className="three wide column ongoact">进行中活动</div>
	<div className="thirteen wide column"></div>
	<div className="one wide column"></div>
	<div className="four wide column">
	<div className="boxtime">2017-05-08 - 2020-05-08</div>	
	<img className="boximg" src="./images/thumb_739_287_20170508105201446.jpg"/>
	</div>
	<div className="eight wide column"><b>鸿丰金业隆重推出全新的会员系统- 礼品换领计划</b><span className="act-tg-online">进行中</span>
	<br></br>
	鸿丰金业隆重推出全新的会员系统- 礼品换领计划
	</div>
	<div assName="three wide column"></div>
	<div className="fourteen wide column"></div>
	<div className="two wide column seedet">
		查看详情>
	</div>
</div>

<div className="ui grid actbox">
	<div className="three wide column ungoact">已结束活动</div>
	<div className="thirteen wide column"></div>
	<div className="one wide column"></div>
	<div className="four wide column">
	<div className="boxtime">2019-04-01 - 2019-05-03</div>	
	<img className="boximg" src="./images/20190318112944277.jpg"/>
	</div>
	<div className="eight wide column"><b>复活节及劳动节入金赠金活动</b>
	<br></br>
	复活节及劳动节入金赠金活动
	</div>
	<div className="three wide column"></div>
	<div className="fourteen wide column"></div>
	<div className="two wide column seedet">
		查看详情>
	</div>
</div>

















</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};





















class Addaccount extends React.Component{
	componentDidMount() {
		$("#网上开户").addClass("activeblack");
		$('.ui.radio.checkbox').checkbox();
		$('.ui.checkbox').checkbox();
	}
	render () {		
		return (
			<div  >
<div id="Wskhbg" style={{"padding":"40px"}}>
<div id="regbox"  >
<div className="regtitle"><span>开立真实帐户</span>&nbsp;&nbsp;|&nbsp;&nbsp;立即开启投资之旅</div>
<div className="ui grid">
<div className="one wide column">
	{/* 111 */}
</div>
<div className="nine wide column">
<div className="textcenter">
24小时开户
</div>
<div className="ui form">
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  真实姓名:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  性别:
  </div>
 </div>
    <div className="field">
      <div className="ui radio checkbox">
        <input type="radio" name="gender" tabindex="0" className="hidden"/>
        <label>男</label>
      </div>
    </div>
    <div className="field">
      <div className="ui radio checkbox">
        <input type="radio" name="gender" tabindex="0" className="hidden"/>
        <label>女</label>
      </div>
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  身份证号码:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  身份证副本(正面):
  </div>
 </div>
    <div className="twelve wide field">
      <div className="ui huge button">选择文件</div>
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  手持身份证照片:
  </div>
 </div>
    <div className="twelve wide field">
      <div className="ui huge button">选择文件</div>
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  手机号码:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  电子邮箱:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  开户银行:
  </div>
 </div>
    <div className="four wide field">
      <input type="text" />
    </div>
	<div className="two wide field">
      银行
    </div>
	<div className="four wide field">
      <input type="text" />
    </div>
	<div className="two wide field">
      省
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
 </div>
    <div className="four wide field">
      <input type="text" />
    </div>
	<div className="two wide field">
      市
    </div>
	<div className="four wide field">
      <input type="text" />
    </div>
	<div className="two wide field">
      支行
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  银行号码:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  银行卡副本(正面):
  </div>
 </div>
    <div className="twelve wide field">
      <div className="ui huge button">选择文件</div>
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  介绍人编号:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
  <input type="checkbox" name="example"/>
  </div>
 </div>
    <div className="twelve wide field">
	<div className="ui checkbox">
    </div>
	我已阅读并同意【私隐条款】【免责声明】【风险声明】【客户协议】
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  验证方式:
  </div>
 </div>
    <div className="field">
      <div className="ui radio checkbox">
        <input type="radio" name="gender" tabindex="0" className="hidden"/>
        <label>电子邮箱验证</label>
      </div>
    </div>
    <div className="field">
      <div className="ui radio checkbox">
        <input type="radio" name="gender" tabindex="0" className="hidden"/>
        <label>手机号码验证</label>
      </div>
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  开户验证码:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
	  <div className="ui black large button">获取验证码</div>
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  自选密码:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="password" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  确认密码:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="password" />
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
  <div className="textright">
      <span>*</span>
	  输入验证码:
  </div>
 </div>
    <div className="twelve wide field">
      <input type="text" />
	  <div className="ui black large button">验证码图片</div>
    </div>
  </div>
  <div className="inline fields">
  <div className="four wide field">
 </div>
    <div className="twelve wide field">
	  <div className="ui red huge button">提交</div>
    </div>
  </div>
</div>
</div>
<div className="six wide column">
	{/* 222 */}
</div>
</div>
</div>
</div>
{/* 底部 */}
<div id="footer" style={{"margin-top":"0"}}>
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
</div>
			)
	}
};


class Addaccountprocess extends React.Component{
	componentDidMount() {
		$("#网上开户").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Addaccountprocessbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 开立真实帐户过程 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >开立真实帐户</a></li>
<li><a className="ys">开立真实帐户过程</a></li>
<li><a >常见问题</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">开立真实帐户过程</h1>
{/* <div className="detail"> */}
<div className="kltt">客户可经由以下途径开立交易帐户</div>
<ul id="tujing">
<li id="tj1">
<p className="tj">在线客服开户</p>
<p>客户可与鸿丰金业客户服务部联系, 协助客户完成开户手续</p>
</li>
<li id="tj2">
<p className="tj">网上开户</p>
<p>客户可自行登上鸿丰金业网站, 并透过网上开户表格进行即时开户申请, 填妥个人资料并上传有效身份证副本及银行卡副本, 即可完成申请手续</p>
</li>
<li id="tj3">
<p className="tj">亲身办理</p>
<p>客户可于鸿丰金业办公时间內, 亲临本公司办理开户手续</p>
</li>
<li id="tj4">
<p className="tj">邮寄申请</p>
<p>客户可将开户所需文件一同寄到鸿丰金业, 本公司在收到所有文件后替客户办理开户手续</p>
</li>
</ul>
<div className="kltt">开户所需文件</div>
<div className="wenjian">
<p>已签署的开户申请书及协议书</p>
<p>身份证副本</p>
<p>最近3个月之住址证明</p>
<p>银行卡副本</p>
</div>
<div className="kltt">网上开户流程</div>
<div className="lcbox">
<p className="lctt">在线客服开户</p>
<p>阅客户协议书,该协议书包括:</p>
<p>1、客户协议</p>
<p>2、免责声明</p>
<p>3、风险披露声明</p>
<p>若客户已经仔细阅读完毕,理解并同意协议书內容,请在协议书下方的"我已阅读,理解,并同意以上协议"的方格內打勾</p>
<p className="lctt">填写个人资料</p>
<p>1、个人基本资料</p>
<p>2、银行帐号资料, 请务必填写详尽的资料, 方便日后准确与及时将款项汇出</p>
<p>3、上传身份证副本及银行卡副本</p>
<p>4、安全提问, 用于日后与客户核实帐号资料</p>
<p className="lctt">确认个人资料</p>
<p>客户确认资料无误后请于"我确认以上资料准确无误"的方格內打勾</p>
<p className="lctt" style={{"margin-top":"100px"}}>查看开户信息</p>
<p>核实客户所提交的资料无误后，开户信息将会以电邮或短讯形式通知客户，开户信息包括</p>
<p>1、网上帐号及密码</p>
<p>2、交易平台帐号及密码</p>
<p>3、电话密码</p>
</div>
{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Commonproblem extends React.Component{
	componentDidMount() {
		$("#网上开户").addClass("activeblack")
		$('.ui.accordion').accordion();
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Commonproblembg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 常见问题
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >开立真实帐户</a></li>
<li><a >开立真实帐户过程</a></li>
<li><a className="ys">常见问题</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column">
<h1 className="cname">常见问题</h1>
{/* <div className="detail"> */}
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    我可以透过什么途径在鸿丰金业申请开立贵金属买卖户口?
  </div>
  <div className="content">
    <p className="transition hidden">客户可以透过网上提交表格给我们,或联络客户服务部协助填写表格, 亦可于办公时间內亲临本公司办理手续(详见：开户流程)</p>
  </div>
</div>

<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    在鸿丰金业开立账户有没有最低存款要求,要不要收费?
  </div>
  <div className="content">
    <p className="transition hidden">开立账户没有最低存款要求，现货黄金/白银只需要在买卖时存入足够资金(100美元)就可以，而人民币公斤条只需要在买卖时存入足够资金(1500人民币)就可以，开立账户也不需要收取任何费用。</p>
  </div>
</div>

<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    鸿丰金业提供什么产品交易服务?
  </div>
  <div className="content">
    <p className="transition hidden">鸿丰金业提供现货黄金,现货白银,实物黄金及人民币公斤条交易服务。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    我可以用什么方式进行贵金属买卖?
  </div>
  <div className="content">
    <p className="transition hidden">客户可以透过MT4交易平台(包括电脑及手机版本)或以电话下单方式进行贵金属买卖。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    我可以先开立模拟账户作测试吗?
  </div>
  <div className="content">
    <p className="transition hidden">可以, 客户可以先开设MT4模拟帐号进行模拟交易, 熟悉交易平台的操作。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    MT4 平台有什么特点?
  </div>
  <div className="content">
    <p className="transition hidden">MT4 平台操作简单方面, 图表功能齐全, 协助客户进行技术分析。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    鸿丰金业提供什么形式的帐户纪录给客户查阅?
  </div>
  <div className="content">
    <p className="transition hidden">客户可随时登陆交易平台查阅帐户资料及交易纪录, 亦可登上鸿丰金业网站查阅相关资料。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    如何使用鸿丰金业提供的客户密码?
  </div>
  <div className="content">
    <p className="transition hidden">鸿丰金业会在客户开户时以手提电话短讯及电邮方式传送交易平台帐号,密码及电话密码给客户，客户可以使用交易平台密码登陆MT4交易平台及网上帐户，电话密码则适用于客户进行电话落盘时供核实身份使用。本公司建议客户收到有关密码后尽快修改密码，并作定期更改。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    我可以设定什么格式的密码?
  </div>
  <div className="content">
    <p className="transition hidden">MT4交易平台密码可以由5位或以上的英文及数字组成；鸿丰金业电话密码由4位数字组成。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    如果我忘记或遗失了密码，应该怎样补领?
  </div>
  <div className="content">
    <p className="transition hidden">客户请即时致电或透过网站通知客户服务部，我们会立即冻结阅下的交易帐号。客户需提交重置密码申请书, 本公司核实客户身份后, 会以短讯及电邮形式送出新的密码。请客户收到新密码后即时更改。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    存入资金
  </div>
  <div className="content">
    <p className="transition hidden">客户可透过以下方式存入资金(可参阅存款流程)，国內卡存款、香港银行存款/电汇，除国內卡存款外, 客户必须于存款完成后, 提交汇款单, 回单的截图, 以电邮/传真/线上提交的方式将截图提交到客户服务部, 资金将于核实存款后10分钟內存到客户的交易帐户中。鸿丰金业不接受第三方入金。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    提取资金
  </div>
  <div className="content">
    <p className="transition hidden">客户可于每天下午四时三十分前以以下方式提交出金申请(可参阅提款流程)，网上提交出金申请、亲身办理、邮寄/电邮/QQ。逾时之申请将会在下一个工作天处理，若取款高于50美元，支款及收款银行可能收取转账所需之行政费，一切手续费均会从提款中扣除。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    鸿丰金业有提供24小时贵金属买卖吗?
  </div>
  <div className="content">
    <p className="transition hidden">鸿丰金业提供现货黄金,现货白银,实物黄金及人民币公斤条24小时买卖服务,由星期一早上七时开市直至星期六早上四时正收市，并于每天早上5时进行日结(冬令时间为早上6时)日结时不会影响客户买卖操作(国际假期将有特別安排，并于假期前公布，敬请客户留意。)</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    如何使用鸿丰金业MT4交易平台买卖?
  </div>
  <div className="content">
    <p className="transition hidden">客户可于本公司网站，下载交易平台软件，安装后输入帐户号码及登入密码，即可进行交易。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    账户以什么货币结算?
  </div>
  <div className="content">
    <p className="transition hidden">鸿丰金业贵金属现货黄金及白银采用美元为账户结算货币。客户以港币存入或提取款项，本公司会以1美元: 7.8港元处理。若客户以人民币存入或提取款项, 本公司会按照当日中国银行汇率处理。而人民币公斤条账户则以人民币为结算货币。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    我可以选择以哪种方式下单?
  </div>
  <div className="content">
    <p className="transition hidden">
巿价单：以当时巿场价格进行交易,如遇上巿况波动,巿价单有可能不会成交。<br></br>
限价单：现货黄金限价单需要与巿场价格相距最少20个价位(即2美元)或以上才能设定, 现货白银限价单需要与巿场价格相距最少20个价位(即0.2美元)或以上才能设定, 人民币公斤条限价单需要与巿场价格相距最少40个价位(即0.4元人民币)或以上才能设定, 当巿场价格触及客户所设定的价格,便会自动成交。<br></br>
* 若客户交易帐号內的保证金不足, 巿价单及限价单皆不会成交, 并会即时取消处理。<br></br>
止盈单及止损单：可为仍未平仓的合约设定, 现货黄金和白银需要与巿场价格20个价位以上才能设定,而人民币公斤条需要与巿场价格40个价位以上才能设定, 当巿场价格触及客户所设定的价格,便会自动成交。		
		</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    我可以怎样设定买卖盘的有效时限?
  </div>
  <div className="content">
    <p className="transition hidden">所有限价单,止盈单,止损单有效时间直至当周收巿时间或假期收巿前, 除非已成交或客户自行取消。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    鸿丰金业网站贵金属报价是否参考价?
  </div>
  <div className="content">
    <p className="transition hidden">是。鸿丰金业网站贵金属报价所提供的买卖价格报价只是参考价。所有买卖价格均按交易室职员报价及交易平台內之可成交价格为准。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    MT4锁单需要多少保证金？
  </div>
  <div className="content">
    <p className="transition hidden">锁单需要账户內有一定资金，您可以查看交易时候的“可用预付款比例”，只要大于100%就可以进行锁仓。对于锁仓的规定是当客户凈值大于已用预付款时，客户可以进行锁单，并且只佔用单边的保证金。例如客户交易了1手多单，已用预付款为2500美金，只要客户的凈值大于2500美金，客户即可随时锁仓。如果客户的凈值小于2500美金，客户将只能够平仓，不能够进行锁仓操作。当客户锁仓之后，可随时进行解锁操作。如果预付款比例小于100%执行锁单就会出现“资金不够”的提示。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    MT4交易平台的自动强制平仓水平是什么？
  </div>
  <div className="content">
    <p className="transition hidden">当交易帐号內的净值低于保证金50%或以下，客户将被要求追加预付款至基本预付款比例。当交易帐号內的净值低于保证金要求的20%或以下, 为保障客户利益, 本公司将会为客户持单部分合约或全部合约平仓, 直至净值回到保证金要求的20%以上。</p>
  </div>
</div>
<div className="ui styled fluid accordion changeh">
  <div className="title">
    <i className="qtt"></i>
    使用MT4 交易平台有什么系统需求?
  </div>
  <div className="content">
    <p className="transition hidden">
操作系统：Microsoft Windows XP (SP2) 或以上<br></br>
处理器： Pentium III 500MHz 或以上<br></br>
记忆体： 256MB RAM 或以上<br></br>
解像度： 1024 X 768<br></br>
	</p>
  </div>
</div>

{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
			
class Fundaccess extends React.Component{
	componentDidMount() {
		$("#资金存取过程").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Fundaccessbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 存款流程 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a className="ys">存款流程</a></li>
<li><a >在线取款流程</a></li>
<li><a >国内卡优惠</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column nopadding">
<h1 className="cname">存款流程</h1>
{/* <div className="detail"> */}
<div className="kltt">国內卡存款</div>
<div id="gn">
<p className="gn1"><span>1</span>在鸿丰金业网站登录</p>
<p className="gn2"><span>2</span>于网站內的入金资讯选择国內卡存款</p>

<p className="gn3"><span>3</span>使用国內卡存款方法将会豁免银联存款手续费</p>
<p className="gn4"><span>4</span>使用国內卡存款并”不需要”提交单据截图</p>
</div>
<p className="cqktt">香港银行存款/电汇</p>
<div id="dh">
<p className="dh1"><span>1</span>存款到鸿丰金业香港银行户口</p>
<p className="dh2"><span>2</span>存款完成后,单据截图请以电邮/传真/QQ等方式提交到鸿丰金业客户服务部</p>
<p className="dh3"><span>3</span>假若客户是以电汇形式进行存款,存款时间会因应各地银行而有所不同</p>
<p className="dh4"><span>4</span>确认资金到帐后,资金将会立即存到交易帐户,客户可即时进行交易</p>
</div>
<p className="cqktt">存款银行资料</p>
<table  className="ui celled table cqktb">
<tbody>
<tr>
<th className="center aligned" style={{"width":"190px","font-size":"18px","line-height":"70px"}} >
银行名称</th>
<td>OCBC Wing Hang Bank Limited<br></br>
华侨永亨银行有限公司</td>
</tr>
<tr>
<th className="center aligned" style={{"width":"190px","font-size":"18px","line-height":"70px"}}>
账户名称</th>
<td>Goodwill Gold Group (Hong Kong) Limited<br></br>
鸿丰金业集团(香港)有限公司</td>
</tr>
<tr>
<th className="center aligned" style={{"width":"190px","font-size":"18px","line-height":"70px"}}>
银行帐号</th>
<td>035-443359-001 (HKD/港元)<br></br>
035-687307-001 (USD/美元)<br></br>
035-358649-057 (RMB/人民币)</td>
</tr>
<tr>
<th className="center aligned" style={{"width":"190px","font-size":"18px","line-height":"70px"}}>
国际汇款代码</th>
<td>WIHBHKHH</td>
</tr>
<tr>
<th className="center aligned" style={{"width":"190px","font-size":"18px","line-height":"70px"}}>
银行地址</th>
<td>Gold &amp; Silver Exchange Branch: 1/F, 12-18 Mercer Street, Sheung Wan<br></br>
金银贸易场分行：上环孖沙街12至18号一楼</td>
</tr>
</tbody>
</table>
{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};

class Online extends React.Component{
	componentDidMount() {
		$("#资金存取过程").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Onlinebg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 在线取款流程 
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >存款流程</a></li>
<li><a className="ys">在线取款流程</a></li>
<li><a >国内卡优惠</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column nopadding">
<h1 className="cname">在线取款流程</h1>
{/* <div className="detail"> */}
<div className="lcbox">
<p className="lctt black" >网上提交出金申请</p>
<p>客户只需使用鸿丰金业所提供的网上帐号及密码登陆鸿丰金业网站, 即可透过网站提交出金申请, 本公司在核实资料无误后, 保证资金1小时內到账</p>
<p className="lctt black" >亲身办理</p>
<p>客户可以在鸿丰金业办公时间內亲临本公司提交出金申请</p>
<p className="lctt black" >邮寄/电邮/QQ</p>
<p>客户可以将已签署及填写出金金额的申请表, 以邮寄/电邮/QQ形式提交到鸿丰金业</p>
<div className="lcbz">注意事项<br></br>
&nbsp;</div>
<p>1、鸿丰金业只接受客户本人之名义存款及提取资金, 不接受第三方入金以及提款至第三方帐户<br></br>
&nbsp;</p>
<p>2、为客户能尽早提取资金, 请核实阁下的银行帐户资料是否正确无误<br></br>
&nbsp;</p>
<p>3、每个工作日递交提取资金申请的截止时间为下午4时30分, 逾时之申请将会在下一个工作天处理<br></br>
&nbsp;</p>
<p>4、客户申请取款，收款银行可能收取转账所需之行政费，一切手续费均会从提款中扣除<br></br>
&nbsp;</p>
<p>5、客户申请取款后, 若发现有任何问题请尽快联络客服部门查询<br></br>
&nbsp;</p>
<p>6、鸿丰金业将有以下措施防范不法份子:</p>
<p>客户帐号出金金额中有50%不曾用于建仓交易或最后一次存款后未有进行建仓交易, 取款时将被收取6%手续费。客户完成入金后, 申请出金金额时达到以下交易手数可免除出金手续费:</p>
<p><br></br>
<strong>可申请出金金额 = 交易手数 x 开仓保证金要求x 2</strong><br></br>
<br></br>
<br></br>
<strong>现货金(LLG)及现货白银(LLS)</strong><br></br>
&nbsp;</p>
<p>1)若客户存入金额5,000美元, 当中的50% 即2500美元需曾用作建仓交易的基本保证金, 若客人曾经建仓交易1手, 即可免除出金金额的6%手续费。</p>
<p><br></br>
2)若客户存入金额5,000美元, 而建仓交易不足 1手时, 例如0.2手, 客户若申请出金金额为1000美元或以下, 即可免除6%的出金手续费, 若建仓0.2手而申请出金金额大于1000美元, 则需要收取出金金额的6%手续费, 假若客户申请出金额为1,500美元, 出金手续费即90美元。</p>
<p><br></br>
<br></br>
<strong>人民币公斤条(LKG)</strong><br></br>
&nbsp;</p>
<p>1)若客户存入金额12,000人民币, 当中的50% 即6,000人民币需曾用作建仓交易的基本保证金, 若客人曾经建仓交易1手, 即可免免除出金金额的6%手续费</p>
<p><br></br>
2)若客户存入金额12,000人民币, 而建仓交易不足 1手时, 例如0.2手, 客户若申请出金金额为2,400人民币或以下, 即可免除6%的出金手续费, 若建仓0.2手而申请出金金额大于2,400人民币, 则需要收取出金金额的6%手续费, 假若客户申请出金额为3,000人民币, 出金手续费即180人民币。</p>
<p><br></br>
<br></br>
<strong>NDD金/ 银可申请出金金额</strong>:&nbsp;<br></br>
&nbsp;</p>
<p>假设客户建仓时的金价为每安士1,200美元</p>
<p><br></br>
1)若客户存入金额4,800美元, 当中的50% 即2,400美元需曾用作建仓交易的基本保证金, 若客人曾经建仓交易1手, 即可免除出金金额的6%手续费</p>
<p><br></br>
2)若客户存入金额4,800美元, 而建仓交易不足 1手时, 例如0.5手, 客户若申请出金金额为2,400美元或以下, 即可免除6%的出金手续费, 若申请出金金额大于2,400美元, 则需要收取出金金额的6%手续费, 假若客户申请出金额为3,000美元, 出金手续费即180美元。</p>
</div>
{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};



class Discount extends React.Component{
	componentDidMount() {
		$("#资金存取过程").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Discountbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 国内卡优惠
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >存款流程</a></li>
<li><a >在线取款流程</a></li>
<li><a className="ys">国内卡优惠</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column nopadding">
<h1 className="cname">国内卡优惠</h1>
{/* <div className="detail"> */}
<div id="gnk">
<p className="cqktt">国內卡优惠(现货黄金/白银/人民币公斤条)</p>
<p>为回馈鸿丰客户, 鸿丰金业将由2017年4月3日起, 豁免银联存款手续费。 客户帐号旧有的信用额则按照原有的规则回赠。</p>
<p><img alt="国內卡优惠" src="./images/cqk3.jpg"/></p>
<p className="cqkbt">条款及细则</p>
<p>1、只适用于透过国內银行卡注入的资金</p>
<p>2、鸿丰金业有权利随时修改或终止此优惠活动</p>
<p style={{"margin-bottom":"50px"}}>3、如有任何争议, 鸿丰金业拥有最终决定权</p>
</div>
{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Download extends React.Component{
	componentDidMount() {
		$("#下载").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Downloadbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 下载交易软件
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a className="ys">下载交易软件</a></li>
<li><a >下载表格</a></li>
<li><a >下载指引</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column nopadding">
<h1 className="cname">下载交易软件</h1>
{/* <div className="detail"> */}
<div className="down_tt">桌面版交易平台</div>
<div className="pc_con"><a className="pc1" href="https://download.mql5.com/cdn/web/goodwill.gold.group/mt4/gwgold4setup.exe?utm_campaign=gwgold">交易软件下载</a>
<p>真实交易软件</p>
<a className="pc2" href="https://download.mql5.com/cdn/web/goodwill.gold.group/mt4/gwgold4setup.exe?utm_campaign=gwgold">交易软件下载</a>
<p>模拟交易平台</p>
</div>
<div className="down_tt">移动版交易平台</div>
<div className="mobile_con">
<div className="mbox mobile1">
<p>扫描二维码下载iphone版,即可安装</p>
<a href="https://download.mql5.com/cdn/mobile/mt4/ios?utm_campaign=gwgold">下载iphone版</a></div>
<div className="mbox mobile2">
<p>扫描二维码下载Android版,即可安装</p>
<a href="https://download.mql5.com/cdn/mobile/mt4/android?utm_campaign=gwgold">下载Android版</a>
</div>
<div className="mbox mobile3">
<p>如没有谷歌商店的手机可直接下载安装档</p>
<a href="download/MT4_1136.apk">下载Android版</a>
 </div>
</div>
{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Downloadpdf extends React.Component{
	componentDidMount() {
		$("#下载").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Downloadpdfbg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 下载表格
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >下载交易软件</a></li>
<li><a className="ys">下载表格</a></li>
<li><a >下载指引</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column nopadding">
<h1 className="cname">下载表格</h1>
{/* <div className="detail"> */}
<ul id="down_ul">
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/開户申請表new.pdf" target="_blank">开户申请书</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/開户申請表new.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/客戶協議書.pdf" target="_blank">客户协议书</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/客戶協議書.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/重設密碼申請表new.pdf" target="_blank">重置密码申请表</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/重設密碼申請表new.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/資料信息更改申請表.pdf" target="_blank">资料信息更改申请表</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/資料信息更改申請表.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/提取資金申請表.pdf" target="_blank">提取资金申请书</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/提取資金申請表.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/取消帳號申請表new.pdf" target="_blank">取消帐户申请书</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/取消帳號申請表new.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
</ul>
{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Downloadpdf2 extends React.Component{
	componentDidMount() {
		$("#下载").addClass("activeblack")
	}
	render () {		
		return (
<div style={{"background-color":"white"}} >
<div id="Downloadpdf2bg">
</div>
<div className="mycontent" >			
<div id="pos" >
<div className="left pos">
首页 &gt; 下载指引
</div>
<div className="right qnav">
<ul>
<li><a  className="qn_1">开立真实帐户</a></li>
<li><a  className="qn_3">帐户注资</a></li>
</ul>
</div>
<div className="clear"></div>
</div>
<div className="ui grid" style={{"width":"100%","margin-top":"25px"}}>
<div className="four wide column">
<ul className="sec_nav">
<li><a >下载交易软件</a></li>
<li><a >下载表格</a></li>
<li><a className="ys">下载指引</a></li>
</ul>
<div className="qdown">下载中心</div>
<div><img src="./images/down.jpg" alt="下载中心"></img></div>
<ul className="qdown_ul">
<li><span>下载交易软件</span><a  className="downa">下载</a></li>
<li><span>下载表格</span><a className="downa">下载</a></li>
<li><span>24小时客服中心</span><a>进入</a></li>
</ul>
<div className="clear"></div>
<div className="quick1">
<p className="q1 nomanopa">香港金银业贸易场</p>
<p className="q2 nomanopa">AA类50号行员</p>
<p><a href="http://www.cgse.com.hk/cn/member_03.php">资质查询</a><a href="http://www.cgse.com.hk/cn/">交易编码查询</a></p>
</div>
<div className="quick2">
<p className="q1">香港金银业贸易场</p>
<p className="q2">最活跃伦敦金/银交易商</p>
</div>
</div>
<div className="twelve wide column nopadding">
<h1 className="cname">下载指引</h1>
{/* <div className="detail"> */}
<ul id="down_ul">
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/MT4iphone手機使用指引.pdf" target="_blank">MT4 Iphone手机使用指引</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/MT4iphone手機使用指引.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/MT4安卓手機使用指引.pdf" target="_blank">MT4 安卓手机使用指引</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/MT4安卓手機使用指引.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
<li>
	<div className="ui grid">
	    <div className="eight wide column">
	<a className="dbt" href="./download/在線入金使用指引.pdf" target="_blank">在线入金使用指引</a>
		</div>
		<div className="seven wide column">
		</div>
		<div className="one wide column">
	<a href="./download/在線入金使用指引.pdf"><span>&nbsp;</span></a>
		</div>
	</div>
</li>
</ul>
{/* </div> */}
</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};
class Contactus extends React.Component{
	componentDidMount() {
		$("#联络我们").addClass("activeblack")
		// var map = new BMap.Map("myMap");
		// var point = new BMap.Point(114.119038,22.378349);
		// map.addOverlay(new BMap.Marker(point));
		// map.centerAndZoom(point, 20);
		// map.addControl(new BMap.NavigationControl());    
		// map.addControl(new BMap.ScaleControl());    
		// map.addControl(new BMap.OverviewMapControl());    
		// map.addControl(new BMap.MapTypeControl()); 
		// map.enableScrollWheelZoom()
		// var marker = new BMap.Marker(point);        // 创建标注    
		// map.addOverlay(marker);

		const BMap = window.BMap
		//实例化，并设置最大最小缩放层级
		  const map = new BMap.Map("myMap", {
			minZoom: 3,
			maxZoom: 20,
		  });
		//清楚覆盖物
		  map.clearOverlays();
		//设置中心点、默认缩放层级
		  map.centerAndZoom(new BMap.Point(114.119038,22.378349), 19);
		//可以鼠标缩放
		//   map.enableScrollWheelZoom(true);
		map.addControl(new BMap.NavigationControl());    
		map.addControl(new BMap.ScaleControl());    
		map.addControl(new BMap.OverviewMapControl());    
		map.addControl(new BMap.MapTypeControl()); 

		const points = [
			{ lng: 114.119038, lat: 22.378349, infoWindow: 'default', func: true},
		  ]
		  const markerClusterers = [[], []]
		  points.forEach(item => {
			//实例化点
			const point = new BMap.Point(item.lng, item.lat)
		//自定义点的样式red
			const icon = new BMap.Icon(
			  './images/red.png',
			  new BMap.Size(40, 40)
			);
		//生成点标注
			const marker = new BMap.Marker(point, { icon: icon });
			//动画
			// marker.setAnimation(BMAP_ANIMATION_BOUNCE)
			//文字标签
			const label = new BMap.Label(
			  '鸿丰金业集团（香港）有限公司 ',
			  { offset: new BMap.Size( 30, 30 ) }
			)
			label.setStyle({
			  color : "red",
				fontSize : "16px",
				height : "30px",
				lineHeight : "30px",
				fontFamily:"微软雅黑",
				backgroundColor:"white",
				maxWidth:"none" 
			});
			marker.setLabel(label);


 if (item.infoWindow === 'search') {
//使用默认的综合功能类窗口
      const searchInfoWindow = new window.BMapLib.SearchInfoWindow(map, '综合功能型信息窗口', {
        width: 200,
        height: 80,
        panel: "panel",
        enableAutoPan : true,
//这几个是添加导航、所有等功能的，具体每个啥意思，看官方文档
          searchTypes:[
            BMAPLIB_TAB_SEARCH,
            BMAPLIB_TAB_TO_HERE,
            BMAPLIB_TAB_FROM_HERE
          ]
      });
      marker.addEventListener("click", function(){
        searchInfoWindow.open(point)
      });
	} 
	

	if (item.infoWindow === 'default') {
		const infoWindow = new BMap.InfoWindow('详细地址：香港荃湾沙咀道6号嘉达环球中心9楼908室')
  //绑定事件，显示窗口
  
		marker.addEventListener("click", function(){
		  this.map.openInfoWindow(infoWindow,point);
		});
	  } 
		//绑定事件
			if (item.func) marker.addEventListener("click", function () {});
			markerClusterers[item.type || 0].push(marker)
		//添加点标注即添加覆盖物
			map.addOverlay(marker);
		  })
	}
	render () {		
		return (
<div  >
<div id="myMap"  style={{"height":"500px",'background':'pink'}}>
</div>
<div className="mycontent">
<div className="ui grid">
	<div className="nine wide column">
	<p className="ctt">联系我们</p>
	<p>感谢您来到鸿丰金业集团，如对我们的服务及产品有任何意见或疑问，欢迎随时透过以下途径联络我们，我们将尽快给您回复，并为您提供最真诚的服务，谢谢！</p>
<div className="c_xx">
<p>地址：香港荃湾沙咀道6号嘉达环球中心9楼908室</p>
<p>香港电话：(852) 3978 8188</p>
<p>国內免费专线：4001 206 668</p>
<p>传真：(852) 3978 8198</p>
<p>电邮：cs@gwgold.com.hk</p>
</div>
<div style={{"height":"30px"}}></div>
<p className="dyh">Wechat<br></br>订阅号:GWGOLD</p>
<p className="fwh">Wechat 服务号:<br></br>GoodwillGoldGroup</p>
	</div>
	<div className="seven wide column">
	<p className="ctt">快速提交您的需求</p>
	<form className="ui form">
  <div className="field">
    <input type="text" name="姓名" placeholder="姓名"/>
  </div>
  <div className="field">
    <input type="text" name="联络QQ" placeholder="联络QQ"/>
  </div>
  <div className="field">
    <input type="text" name="联络电话" placeholder="联络电话"/>
  </div>
  <div className="field">
    <input type="text" name="联络电邮" placeholder="联络电邮"/>
  </div>
  <div className="field">
  <textarea placeholder="留言内容"></textarea>
</div>
<div className="field">
<input type="text" name="验证码" placeholder="验证码"/>
</div>
  <div className="field">
  <button className="ui huge red button" type="submit">Submit</button>
</div>
</form>
	</div>
</div>
</div>
{/* 底部 */}
<div id="footer">
<div className="mycontent">
<dl className="footmenu bs1">
<dt>关于我们</dt>
<dd><a title="公司简介">公司简介</a></dd>
<dd><a title="公司资质">公司资质</a></dd>
<dd><a title="公司奖项">公司奖项</a></dd>
</dl>
<dl className="footmenu bs2">
<dt>鸿丰优势</dt>
<dd><a title="产品优势">产品优势</a></dd>
<dd><a title="信誉优势">信誉优势</a></dd>
<dd><a title="存取款优势">存取款优势</a></dd>
<dd><a title="会员系统">会员系统</a></dd>
</dl>
<dl className="footmenu bs3">
<dt>产品介绍</dt>
<dd><a title="现货黄金">现货黄金</a></dd>
<dd><a title="现货白银">现货白银</a></dd>
<dd><a title="人民币公斤条">人民币公斤条</a></dd>
<dd><a title="交易细则">交易细则</a></dd>
<dd><a title="提取实金">提取实金</a></dd>
</dl>
<dl className="footmenu bs6">
<dt>最新资讯</dt>
<dd><a title="公司公告">公司公告</a></dd>
<dd><a title="经济新闻">经济新闻</a></dd>
<dd><a title="经济数据">经济数据</a></dd>
<dd><a title="专业评论">专业评论</a></dd>
<dd><a title="每日汇率">每日汇率</a></dd>
<dd><a title="公司活动">公司活动</a></dd>
</dl>
<dl className="footmenu bs4">
<dt>网上开户</dt>
<dd><a title="开立真实帐户">开立真实帐户</a></dd>
<dd><a title="开立真实帐户过程">开立真实帐户过程</a></dd>
<dd><a title="常见问题">常见问题</a></dd>
</dl>
<dl className="footmenu bs5">
<dt>资金存取过程</dt>
<dd><a title="存款流程">存款流程</a></dd>
<dd><a title="在线取款流程">在线取款流程</a></dd>
<dd><a title="国內卡优惠">国內卡优惠</a></dd>
</dl>
<dl className="footmenu bs7">
<dt>下载</dt>
<dd><a title="下载交易软件">下载交易软件</a></dd>
<dd><a title="下载表格">下载表格</a></dd>
<dd><a title="下载指引">下载指引</a></dd>
</dl>
<dl className="footmenu bs8">
<dt>联络我们</dt>
<dd><a title="联络资料">联络资料</a></dd>
</dl>
</div>
</div>
{/* 底部 */}
{/* 底标 */}
<div id="btbg">
<div className="mycontent">
<div className="btbar btup">
<p className="btmenu">
	<a >私隐条款</a> |
	 <a >免责声明</a> |
	 <a >风险声明</a> |
	 <a >联络我们</a>
</p>
</div>
<div className="ui grid btbar">
<div className="seven wide column  btdown">
鸿丰金业版权所有 © 未经许可不得复制、转载或摘编，违者必究！
<br></br>
Copyright © 2013-2019 GOODWILL GOLD GROUP (HONG KONG) LIMITED
</div>
<div className="one wide column">
	
</div>
<div className="one wide column" style={{"position":"relative","left":"-30px"}}>
 <img style={{"width":"98.7px","height":"50px"}} src="./images/footerlogo1.png"></img>
</div>
<div className="one wide column">
<img style={{"width":"62.98px","height":"50px"}} src="./images/footerlogo2.png"></img>
</div>
<div className="two wide column" style={{"position":"relative","left":"10px"}}>
 <img style={{"width":"115.58px","height":"50px"}} src="./images/footerlogo3.png"></img>
</div>
<div className="two wide column">
<img style={{"width":"145.45px","height":"50px"}} src="./images/footerlogo5.jpg"></img>
</div>
<div className="two wide column">
<img style={{"width":"135.1px","height":"50px"}} src="./images/cnnic.png"></img>
</div>
</div>
</div>
</div>
{/* 底标 */}
{/* 侧边 */}
<div id="service">
	<div className="sv1">
		<a >即时开户</a>
	</div>
	<div className="sv2">
		<a >在线客服</a>
	</div>
	<div className="sv3">
		<a >用户登入</a>
	</div>
	<div className="sv4">
		<a >帐户注资</a>
	</div>
	<div className="sv5">
		<a >帐户取款</a>
	</div>
	<div className="sv6">
		<a >官方微信</a>
		<div id="weixin" >
			<img src="./images/ewm1.jpg" alt="订阅号"></img>
			<p>订阅号</p>
			<img src="./images/ewm2.jpg" alt="服务号"></img>
			<p>服务号</p>
		</div>
	</div>
	<div className="sv7" id="clicktop" >
		<a  href="#gotop" style={{"color":"black"}}>返回顶部</a>
	</div>
</div>
{/* 侧边 */}
</div>
			)
	}
};


class KentaApp extends React.Component {
	constructor(props) {
    super(props);
    this.state = {}; 
	}
	render() {
    return (
      <HashRouter basename={KentaConstants.RELATIVE_PATH}>
				<div id="example1">
					<Route exact path='/' component={initializeElement}/>
					<Route path='/Home' component={MainMenu}/>
					<Route path='/Home' component={Home}/>
					<Route path='/Aboutus' component={MainMenu}/>
					<Route path='/Aboutus' component={Aboutus}/>
					<Route path='/Qualification' component={MainMenu}/>
					<Route path='/Qualification' component={Qualification}/>
					<Route path='/Award' component={MainMenu}/>
					<Route path='/Award' component={Award}/>
					<Route path='/Advantage' component={MainMenu}/>
					<Route path='/Advantage' component={Advantage}/>
					<Route path='/Reputation' component={MainMenu}/>
					<Route path='/Reputation' component={Reputation}/>
					<Route path='/Deposit' component={MainMenu}/>
					<Route path='/Deposit' component={Deposit}/>
					<Route path='/Member' component={MainMenu}/>
					<Route path='/Member' component={Member}/>
					<Route path='/Productdescription' component={MainMenu}/>
					<Route path='/Productdescription' component={Productdescription}/>
					<Route path='/Silver' component={MainMenu}/>
					<Route path='/Silver' component={Silver}/>
					<Route path='/Rmbgjt' component={MainMenu}/>
					<Route path='/Rmbgjt' component={Rmbgjt}/>
					<Route path='/TradingRules' component={MainMenu}/>
					<Route path='/TradingRules' component={TradingRules}/>
					<Route path='/Withdraw' component={MainMenu}/>
					<Route path='/Withdraw' component={Withdraw}/>
					<Route path='/Latestnews' component={MainMenu}/>
					<Route path='/Latestnews' component={Latestnews}/>
					<Route path='/Economicnews' component={MainMenu}/>
					<Route path='/Economicnews' component={Economicnews}/>
					<Route path='/Economicdata' component={MainMenu}/>
					<Route path='/Economicdata' component={Economicdata}/>
					<Route path='/Professionalreviews' component={MainMenu}/>
					<Route path='/Professionalreviews' component={Professionalreviews}/>
					<Route path='/Dailyexchangerate' component={MainMenu}/>
					<Route path='/Dailyexchangerate' component={Dailyexchangerate}/>
					<Route path='/Companyactivities' component={MainMenu}/>
					<Route path='/Companyactivities' component={Companyactivities}/>
					<Route path='/Addaccount' component={MainMenu}/>
					<Route path='/Addaccount' component={Addaccount}/>
					<Route path='/Addaccountprocess' component={MainMenu}/>
					<Route path='/Addaccountprocess' component={Addaccountprocess}/>
					<Route path='/Commonproblem' component={MainMenu}/>
					<Route path='/Commonproblem' component={Commonproblem}/>
					<Route path='/Fundaccess' component={MainMenu}/>
					<Route path='/Fundaccess' component={Fundaccess}/>
					<Route path='/Online' component={MainMenu}/>
					<Route path='/Online' component={Online}/>
					<Route path='/Discount' component={MainMenu}/>
					<Route path='/Discount' component={Discount}/>
					<Route path='/Download' component={MainMenu}/>
					<Route path='/Download' component={Download}/>
					<Route path='/Downloadpdf' component={MainMenu}/>
					<Route path='/Downloadpdf' component={Downloadpdf}/>
					<Route path='/Downloadpdf2' component={MainMenu}/>
					<Route path='/Downloadpdf2' component={Downloadpdf2}/>
					<Route path='/Contactus' component={MainMenu}/>
					<Route path='/Contactus' component={Contactus}/>
					
				</div>
			</HashRouter>
    );
  }
}




ReactDOM.render(
	<KentaApp />,
	document.getElementById("kenta-app")
);
		