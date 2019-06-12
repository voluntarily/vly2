/// Quick starter to Quill

// //Stylesheet
// <link herf="https://cdn.quilljs.com/1.3.6/quill.smow.css" rel="stylesheet"/>

// ///creating the editor container
// <div id="editor">
// <p>Testing</p>
// <p>Some Initial<strong>bold</strong>text</p>
// </div>

// /////////Including Quill library

// <script
//   src="https://cdn.quilljs.com/1.3.6/quill.js">
// </script>

// //Intialise the quill editor
// <script>
// var editor = new Quill('.editor')
// </script>

import React from 'react'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import Toolbar from 'quill/modules/toolbar'
import Snow from 'quill/themes/snow'
import Bold from 'quill/formats/bold'
import Italic from 'quill/formats/italic'
import Header from 'quill/formats/header'
import Underline from 'quill/formats/underline'
import Link from 'quill/formats/link'
import List, { ListItem } from 'quill/formats/list'
import Icons from 'quill/ui/icons'

export default class QuillEditor extends React.Component {
  componentDidMount () {
    Quill.register({
      'modules/toolbar': Toolbar,
      'themes/snow': Snow,
      'formats/bold': Bold,
      'formats/italic': Italic,
      'formats/header': Header,
      'formats/underline': Underline,
      'formats/link': Link,
      'formats/list': List,
      'formats/list/item': ListItem,
      'ui/icons': Icons
    })

    var icons = Quill.import('ui/icons')
    icons['bold'] = '<i class="fa fa-bold" aria-hidden="true"></i>'
    icons['italic'] = '<i class="fa fa-italic" aria-hidden="true"></i>'
    icons['underline'] = '<i class="fa fa-underline" aria-hidden="true"></i>'
    icons['link'] = '<i class="fa fa-link" aria-hidden="true"></i>'
    icons['clean'] = '<i class="fa fa-eraser" aria-hidden="true"></i>' 

    var quill = new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Write something awesome...'
    })
  }

  render () {
    return (
      <div>
        <div id='QuillEditor-container'>
          <div id='editor'>
            <p>Testing!</p>
            <p>Testing
              <strong>bold</strong>
              text</p>
          </div>
        </div>
      </div>
    )
  }
}
