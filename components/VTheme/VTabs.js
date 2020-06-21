import styled from 'styled-components'
import { Tabs } from 'antd'

const VTabs = styled(Tabs)`
/* 
.ant-tabs-nav {
    display: flex !important;
    width: 100% !important;
    flex-direction: row;
    flex-wrap: nowrap;

}

.ant-tabs-tab {
    flex: 1;
    text-align: center;
    justify-content: center;
    width: 50%;

} */





.ant-tabs-tab {
overflow: visible;
text-align: left;
font-weight: bold;
color: #6549AA;

}

.ant-tabs {
    overflow: visible;
 

}

.ant-tabs-top {
    overflow: visible;
}

.ant-tabs-tab-active {
    
    color: #333;
    font-weight: bold;

    :hover {
        color: #333
    }
}

.ant-tabs-nav-scroll, .ant-tabs-nav {
  display: flex;
  flex-flow: row nowrap;
  align-content: flex-start;

} 

`
export default VTabs
