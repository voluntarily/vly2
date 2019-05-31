
import React from 'react'

//importing the CSS fro quil  
import 'quill/dist/quill.snow.css'

//importing the features from quill
import Quill from 'quill/core'
import ToolBar from 'quill/module/toolbar' 
import Snow  from 'quil/themes/Snow'

import Bold from 'quill/formats/bold'
import Italic from 'quill/formats/italic'
import Header from 'quill/formats/header'
import Underline from 'quill/formats/underline'
import Link from 'quill/formats/link'
import List, {ListItem} from 'quill/formats/list'
import Icons from 'quill/ui/icons'


export default class OqQuill extends React.Component{
    componentDidMount(){
        Quill.register({
            'modules/toolbar': ToolBar,
            'themes/snow': Snow,
            'formats/bold': Bold,
            'formats/italic':Italic,
            'formats/header':Header,
            'formats/Underline': Underline,
            'formats/Link':Link,
            'format/List':List,
            'format/list/listItem':ListItem,
                              
        });

    var icon = Quill.import('ui/icons');
    icons['bold'] = '<i class="fa fa-bold" aria-hidden="true"></i>';
    icons['italic'] = '<i class="fa fa-bold" aria-hidden="true"></i>';
    
    }
} 