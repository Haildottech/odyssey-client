import Cookies from "js-cookie";
import { incrementTab } from '/redux/tabs/tabSlice';
import { AccountBookOutlined, HomeOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { IoMdArrowDropleft } from "react-icons/io";
import { RiShipLine } from "react-icons/ri";

function setAccesLevels(dispatch, collapsed){
    let items = [];
    const dashboard = getParentItem('Dashboard', '1', <HomeOutlined />,[
      getItem('Home', '1-1',<></>, null, {
        label: `Home`,
        key: '1-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Requests', '1-2',<></>, null, {
        label: `Requests`,
        key: '1-2',
        children: `Content of Tab Pane 2`,
      }),
    ])
    const setup = getParentItem('Setup', '2', <SettingOutlined />,
    [
      getItem('Employees', '2-1',<></>, null, {
        label: `Employees`,
        key: '2-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Client List', '2-2',<></>, null, {
        label: `Client List`,
        key: '2-2',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Vendor List', '2-5',<></>, null, {
        label: `Vendor List`,
        key: '2-5',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Non-GL Parties', '2-9',<></>, null, {
        label: `Non-GL Parties`,
        key: '2-9',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Commodity', '2-3',<></>, null, {
        label: `Commodity`,
        key: '2-3',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Voyage', '2-4',<></>, null, {
        label: `Voyage`,
        key: '2-4',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Charges', '2-6',<></>, null, {
        label: `Charges`,
        key: '2-6',
        children: `Content of Tab Pane 2`,
      }),
    ]
    )
    const accounts = getParentItem('Accounts', '3', <AccountBookOutlined />,
    [
      getItem('Chart Of Account', '3-1',<></>, null, {
        label: `Chart Of Account`,
        key: '3-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Invoice / Bills', '3-3',<></>, null, {
        label: `Invoice / Bills`,
        key: '3-3',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Payment / Receipt', '3-4',<></>, null, {
        label: `Payment / Receipt`,
        key: '3-4',
        children: `Content of Tab Pane 2`,
      }),
      // getItem('Voucher', '3-5',<></>, null, {
      //   label: `Voucher`,
      //   key: '3-5',
      //   children: `Content of Tab Pane 2`,
      // }),
      getItem('Voucher List', '3-6',<></>, null, {
        label: `Voucher List`,
        key: '3-6',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Office Voucher List', '3-7',<></>, null, {
        label: `Office Voucher List`,
        key: '3-7',
        children: `Content of Tab Pane 3-7`,
      }),
    ]
    )
    const reports = getParentItem('Reports', '5', <HiOutlineDocumentSearch/>,
    [
      getItem('Job Balancing', '5-1',<></>, null, {
        label: `Job Balancing`,
        key: '5-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Account Activity', '5-2',<></>, null, {
        label: `Account Activity`,
        key: '5-2',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Balance Sheet', '5-3',<></>, null, {
        label: `Balance Sheet`,
        key: '5-3',
        children: `Content of Tab Pane 3`,
      }),
      getItem('Job Profit/Loss', '5-4',<></>, null, {
        label: `Job Profit/Loss`,
        key: '5-4',
        children: `Content of Tab Pane 3`,
      }),
      getItem('Ledger', '5-5',<></>, null, {
        label: `Ledger`,
        key: '5-5',
        children: `Content of Tab Pane 3`,
      }),
    ]
    )
    const se = getParentItem('Sea Export', '4', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      getItem('SE Job List', '4-1',<></>, null, {
        label: `SE Job List`,
        key: '4-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('SE BL List', '4-2',<></>, null, {
        label: `SE BL List`,
        key: '4-2',
        children: `Content of Tab Pane 2`,
      }),
    ]
    )
    const tasks = getParentItem('Tasks', '6', <UnorderedListOutlined  />,
    [
      getItem('Riders List', '6-1',<></>, null, {
        label: `Riders List`,
        key: '6-1',
        children: `Content of Tab Pane 2`,
      }),
    ]
    )
    function getParentItem(label, key, icon, children) {
        return { key, icon, children, label}
    }
    function getItem(label, key, icon, children, tab) {
        return { key, icon, children, label,
        onClick:()=>{
          if(!collapsed){ dispatch(incrementTab(tab)); }
        }
    }}

    let obj = { se:false, ae:false, setup:false, accounts:false, admin:false }
    let levels = Cookies.get("access");
    if(levels){
        levels = levels.slice(0, -1)
        levels = levels.substring(1);
        levels = levels.split(", ")
        levels.forEach(x => {
        switch (x) {
          case "se":
              obj.se = true;
              break;
          case "ae":
              obj.ae = true;
              break;
          case "setup":
              obj.setup = true;
              break;
          case "accounts":
              obj.accounts = true;
              break;
          case "admin":
              obj.admin = true;
              break;
          default:
              searchPartyId = state.selectedRecord.localVendorId;
              break;
          }
        });
    }
    // console.log(obj)
    obj.se?
    items.push(se):null;
    obj.setup?
    items.push(setup):null
    
    obj.accounts?
    items = [
      se,
      accounts,
      reports
    ]:null
    obj.admin?
      items = [
        //dashboard,
        setup,
        accounts,
        se,
        reports
    ]:null
    Cookies.set("permissions", JSON.stringify(obj));
    items.unshift(dashboard)
    items.push(tasks)
    return items
}

export { setAccesLevels }