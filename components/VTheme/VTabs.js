import styled from 'styled-components'
import { Tabs } from 'antd'

const VTabs = styled(Tabs)`


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

`
export default VTabs
