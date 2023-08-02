import { CloseOutlined } from '@ant-design/icons';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { companySelect, addCompanies } from '/redux/company/companySlice';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Select } from 'antd';
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { setAccesLevels } from '/functions/setAccesLevels';
import logout from '/functions/logout';
import { setTab } from '/redux/tabs/tabSlice';

const { Header, Content, Sider } = Layout;

const MainLayout = ({children}) => {

  const newRouter = useRouter();

  const [load, setLoad] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [company, setCompany] = useState('');
  const tabs = useSelector((state) => state.tabs.value);
  const tabItems = useSelector((state) => state.tabs.tabs);
  const dispatch = useDispatch();
  useEffect(() => { getCompanies(); }, [])

  async function getCompanies(){
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_COMPANIES)
    .then((x)=>{
      setLoad(false);
      dispatch(addCompanies(x.data.result))
      let tempState = [];
      x.data.result.forEach((x, index) => {
        tempState[index]={value:x.id, label:x.title}
      });
      setCompanies(tempState)
    });
  }

  const items = setAccesLevels(dispatch, collapsed);

  const handleChange = (value) => {
    Cookies.set('companyId', value, { expires: 1 });
    setCompany(value);
    dispatch(companySelect(value))
    Router.push('/')
  };

  useEffect(() => {
    // When visiting pages inside folders the initial path in url confilts, so to this is mandatory for resolving it
    if(
      newRouter.pathname.includes("seJob/") &&  
      !newRouter.pathname.includes("seJob/seJobList") && 
      !newRouter.pathname.includes("seJob/seBlList")
    ){
      setToggleState('4-3');
    }
    if(newRouter.pathname.includes("seJob/bl/")){
      setToggleState('4-4');
    }
    if(newRouter.pathname.includes("accounts/vouchers/")){
      setToggleState('3-5');
    }
    if(!newRouter.pathname.includes("/accounts/officeVouchers/list") && newRouter.pathname.includes("/accounts/officeVouchers/")){
      setToggleState('3-8');
    }
    if(newRouter.pathname.includes("setup/client") && !newRouter.pathname.includes("setup/clientList")){
      setToggleState('2-7');
    }
    if(newRouter.pathname.includes("setup/vendor") && !newRouter.pathname.includes("setup/vendorList")){
      setToggleState('2-8');
    }
    if(newRouter.pathname.includes("setup/voyage")){
      setToggleState('2-4');
    }
    if(newRouter.pathname.includes("tasks/riders/riderAssign/")){
      setToggleState('6-2');
    }
  }, [newRouter])

  const [toggleState, setToggleState] = useState(0);
  //const [tabItems, setTabItems] = useState([]);

  const [tabActive, setTabActive] = useState({
    home:false,
    requests:false,
    employee:false,
    clientList:false,
    client:false,
    accounts:false,
    history:false,
    vendorList:false,
    vendor:false,
    commodity:false,
    voyage:false,
    seJobList:false,
    seJob:false,
    seBl:false,
    charges:false,
    invoiceBills:false,
    paymentReceipt:false,
    jobBalancing:false,
    accountActivity:false,
    balanceSheet:false,
    voucherSys:false,
    voucherList:false,
    officeVoucherList:false,
    officeVoucher:false,
    jobPlReport:false,
    riders:false,
    riderAssign:false,
    ledger:false,
    nonGlParties:false,
  });

  useEffect(()=>{ alterTabs(); }, [tabs]);

  const alterTabs = () => {
    if(Object.keys(tabs).length>0){
      let tempTabs = [...tabItems];
      let cancel = false;
      tempTabs.forEach((x,i) => {
        if(x.key==tabs.key){
          cancel = true;
        }
      })
      if(cancel==false){
        tempTabs.push(tabs);
        let tempTabActive = {...tabActive};
        if(tabs.key=='1-1'){ tempTabActive.home=true }
        else if(tabs.key=='1-2'){ tempTabActive.requests=true }
        else if(tabs.key=='2-1'){ tempTabActive.employee=true }
        else if(tabs.key=='2-2'){ tempTabActive.clientList=true }
        else if(tabs.key=='2-7'){ tempTabActive.client=true }
        else if(tabs.key=='2-3'){ tempTabActive.commodity=true }
        else if(tabs.key=='2-4'){ tempTabActive.voyage=true }
        else if(tabs.key=='2-5'){ tempTabActive.vendorList=true }
        else if(tabs.key=='2-8'){ tempTabActive.vendor=true }
        else if(tabs.key=='2-9'){ tempTabActive.nonGlParties=true }
        else if(tabs.key=='2-6'){ tempTabActive.charges=true }
        else if(tabs.key=='3-1'){ tempTabActive.accounts=true }
        else if(tabs.key=='3-3'){ tempTabActive.invoiceBills=true }
        else if(tabs.key=='3-4'){ tempTabActive.paymentReceipt=true }
        else if(tabs.key=='3-5'){ tempTabActive.voucherSys=true }
        else if(tabs.key=='3-6'){ tempTabActive.voucherList=true }
        else if(tabs.key=='3-7'){ tempTabActive.officeVoucherList=true }
        else if(tabs.key=='3-8'){ tempTabActive.officeVoucher=true }
        else if(tabs.key=='4-1'){ tempTabActive.seJobList=true }
        else if(tabs.key=='4-2'){ tempTabActive.seBl=true }
        else if(tabs.key=='4-3'){ tempTabActive.seJob=true }
        else if(tabs.key=='4-4'){ tempTabActive.seBl=true }
        else if(tabs.key=='5-1'){ tempTabActive.jobBalancing=true }
        else if(tabs.key=='5-2'){ tempTabActive.accountActivity=true }
        else if(tabs.key=='5-3'){ tempTabActive.balanceSheet=true }
        else if(tabs.key=='5-4'){ tempTabActive.jobPlReport=true }
        else if(tabs.key=='5-5'){ tempTabActive.ledger=true }
        else if(tabs.key=='6-1'){ tempTabActive.riders=true }
        else if(tabs.key=='6-1'){ tempTabActive.riderAssign=true }
        dispatch(setTab(tempTabs))
        //setTabItems(tempTabs);
        setTabActive(tempTabActive);
      }
    }
  };

  const setKey = (value) => {
    let result = "";
    let index = 0;
    if(tabs.id!=value.id && tabs.key==value.key){
      let tempTabes = [...tabItems];
      tempTabes.forEach((x, i)=>{
        if(x.key==value.key){
          index = i
        }
      })
      tempTabes = tempTabes.filter((x)=>{
        return x.key!=value.key;
      })
      tempTabes.splice(index,0,tabs);
      dispatch(setTab(tempTabes))
      //setTabItems(tempTabes)
      result = tabs.id
    }else{
      result = value.id
    }
    return result
  }

  const toggleTab = (x) => {
    setToggleState(x.key);
    if(x.key=='1-1'){ Router.push('/dashboard/home') }
    else if(x.key=='1-2'){ Router.push('/dashboard/requests') }
    else if(x.key=='2-1'){ Router.push('/employees') }
    else if(x.key=='2-2'){ Router.push('/setup/clientList') }
    else if(x.key=='2-7'){ Router.push(`/setup/client/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='2-3'){ Router.push('/commodity') }
    else if(x.key=='2-4'){ Router.push('/setup/voyage') }
    else if(x.key=='2-5'){ Router.push('/setup/vendorList') }
    else if(x.key=='2-8'){ Router.push(`/setup/vendor/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='2-9'){ Router.push('/setup/nonGlPartiesList') }
    else if(x.key=='2-6'){ Router.push('/charges') }
    else if(x.key=='3-1'){ Router.push('/accounts/chartOfAccount') }
    else if(x.key=='3-2'){ Router.push('/accounts/accountActivity') }
    else if(x.key=='3-3'){ Router.push('/accounts/invoiceAndBills') }
    else if(x.key=='3-4'){ Router.push('/accounts/paymentReceipt') }
    else if(x.key=='3-5'){ Router.push(`/accounts/vouchers/${setKey(x)}`)} //these routes are also settled in 2nd useEffect
    else if(x.key=='3-6'){ Router.push('/accounts/voucherList') }
    else if(x.key=='3-7'){ Router.push('/accounts/officeVouchers/list') }
    else if(x.key=='3-8'){ Router.push(`/accounts/officeVouchers/${setKey(x)}`) }
    else if(x.key=='4-1'){ Router.push('/seJob/seJobList') }
    else if(x.key=='4-2'){ Router.push('/seJob/seBlList') }
    else if(x.key=='4-3'){ Router.push(`/seJob/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='4-4'){ Router.push(`/seJob/bl/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='5-1'){ Router.push('/reports/jobBalancing') }
    else if(x.key=='5-2'){ Router.push('/reports/accountActivity') }
    else if(x.key=='5-3'){ Router.push('/reports/balanceSheet') }
    else if(x.key=='5-4'){ Router.push('/reports/jobPLReport') }
    else if(x.key=='5-5'){ Router.push('/reports/ledger') }
    else if(x.key=='6-1'){ Router.push('/tasks/riders') }
    else if(x.key=='6-2'){ Router.push(`/tasks/riders/riderAssign/${setKey(x)}`) }
  };

  const removeTab = (index) => {
    let tempTabs = [...tabItems];
    tempTabs = tempTabs.filter((x)=>{
      return x.key!=index
    })
    dispatch(setTab(tempTabs))
    //setTabItems(tempTabs);
    if(toggleState==index){
      setToggleState(0)
    }
    if(tempTabs.length==0){
      Router.push('/')
    }
  };

return (
  <Layout className="main-dashboard-layout">
    {!load && 
    <Sider trigger={null} collapsible collapsed={collapsed} className='side-menu-styles' style={{maxHeight:'100vh',overflowY:'auto'}}>
      <div className={!collapsed?'big-logo':'small-logo'}>
        <span>
          <img src={company=='1'?'/seanet-logo.png':company=='3'?'/aircargo-logo.png':company=='2'?'/cargolinkers-logo.png':null}/>
          <p>Dashboard</p>
        </span>
      </div>
      <Menu mode="inline" theme="dark" defaultSelectedKeys={['1']} items={!collapsed?items:[]} />
    </Sider>
    }
    <Layout className="site-layout">
    <Header className="site-layout-background" style={{padding:0}}>
    {collapsed && <span className="menu-toggler" onClick={() => setCollapsed(!collapsed)}><AiOutlineRight /></span>}
    {!collapsed && <span className="menu-toggler" onClick={() => setCollapsed(!collapsed)} ><AiOutlineLeft /></span>}
    <Select style={{width: 155, opacity:0.7}} onChange={handleChange} options={companies} />
    <span style={{float:'right'}} className='mx-5 cur' onClick={()=>logout()}> Logout </span>
    </Header>
    <Content style={{ margin:'24px 16px', padding:0, minHeight:280}}> 
    <div className='dashboard-styles'>
      <div className="bloc-tabs">
        {tabItems.map((x, index)=>{
          return(
          <div key={index} className={toggleState===x.key?"tabs active-tabs":"tabs"}>
            <button onClick={()=>toggleTab(x)}> {x.label} </button>
              <CloseOutlined onClick={()=>removeTab(x.key)} className='clos-btn'/>
          </div>
        )})}
      </div>
      <div className="content-tabs">
        {children}
      </div>
    </div>
    </Content>
    </Layout>
  </Layout>
)};
export default MainLayout;