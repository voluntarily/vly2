import React, { Component } from 'react'
import publicPage, { A4 } from '../hocs/publicPage'
import { Button } from 'antd'
import RichTextEditor from '../components/Editor/RichTextEditor'

class TestEditor extends Component {
  state = {
    editing: false,
    text: `<div>
   
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <p>Normal body text</p>
    <em>Emphasis</em>
    <i>Italic</i>
    <strong>Strong</strong>
    <b>Bold</b>

    <h2>Lists</h2>
    <h3>Bullets</h3>
    <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    </ul>
    <h3>Numbers</h3>
    <ol>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    </ol> 
    
    <h2><span class="mw-headline" id="Example_text">Example text</span></h2>
    <p>A common form of <i>lorem ipsum</i> reads:
    </p>
    <blockquote>
    <p><i>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</i>
    </p>
    </blockquote>
    <h2><span class="mw-headline" id="Discovery">Discovery</span></h2>
    <p>"Lorem ipsum" text is derived from sections 1.10.33 of Cicero's <i><a href="/wiki/De_finibus_bonorum_et_malorum" title="De finibus bonorum et malorum">De finibus bonorum et malorum</a></i>.<sup id="cite_ref-Microsoft_1-0" class="reference"><a href="#cite_note-Microsoft-1">[1]</a></sup>
    </p><p>It is not known exactly when the text obtained its current standard form; it may have been as late as the 1960s. Dr. Richard McClintock, a Latin scholar who was the publications director at <a href="/wiki/Hampden%E2%80%93Sydney_College" title="Hampden–Sydney College">Hampden–Sydney College</a> in Virginia, discovered the source of the passage sometime before 1982 while searching for instances of the Latin word "<i><a href="https://en.wiktionary.org/wiki/consectetur" class="extiw" title="wikt:consectetur">consectetur</a></i>" ("that [he/she/it] pursue", <a href="/wiki/Subjunctive_mood" title="Subjunctive mood">subjunctive</a>), rarely used in classical literature.<sup id="cite_ref-SDop_2-0" class="reference"><a href="#cite_note-SDop-2">[2]</a></sup><sup id="cite_ref-4" class="reference"><a href="#cite_note-4">[a]</a></sup> The physical source of the <i>lorem ipsum</i> text may be the 1914 <a href="/wiki/Loeb_Classical_Library" title="Loeb Classical Library">Loeb Classical Library</a> Edition of the <i>De Finibus</i>, where the Latin text, presented on the left-hand (even) pages, breaks off on page 34 with "<i>Neque porro quisquam est qui do-</i>" and continues on page 36 with "<i>lorem ipsum ...</i>", suggesting that the <a href="/wiki/Galley_proof" title="Galley proof">galley type</a> of that page was mixed up to make the dummy text seen today.<sup id="cite_ref-Cibois_5-0" class="reference"><a href="#cite_note-Cibois-5">[4]</a></sup>
    </p>
    <h2><span class="mw-headline" id="Latin_source">Latin source</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Lorem_ipsum&amp;action=edit&amp;section=3" title="Edit section: Latin source">edit</a><span class="mw-editsection-bracket">]</span></span></h2>
    <p>The original version appears in the 1913 Loeb Classical Library Edition of the <i>De Finibus,</i> Book 1, sections 32–33<sup id="cite_ref-cicero_archive_org_6-0" class="reference"><a href="#cite_note-cicero_archive_org-6">[5]</a></sup>. The relevant section of Cicero as printed in the source is reproduced below with the example text drawn from it in bold and letters not found in the printed source in brackets:
    </p>
    <style data-mw-deduplicate="TemplateStyles:r886047036">.mw-parser-output .templatequote{overflow:hidden;margin:1em 0;padding:0 40px}.mw-parser-output .templatequote .templatequotecite{line-height:1.5em;text-align:left;padding-left:1.6em;margin-top:0}</style><blockquote class="templatequote"><p>[32] Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui do<b>lorem ipsum</b>, quia <b>dolor sit amet consectetur adipisci[ng]</b> v<b>elit, sed</b> quia non-numquam <b>[do] eius mod</b>i <b>tempor</b>a <b>inci[di]dunt, ut labore et dolore magna</b>m <b>aliqua</b>m quaerat voluptatem. <b>Ut enim ad minim</b>a <b>veniam, quis nostru</b>m<b>[d]</b> <b>exercitation</b>em <b>ullam co</b>rporis suscipit<b> labori</b>o<b>s</b>am, <b>nisi ut aliquid ex ea commod</b>i <b>consequat</b>ur? <b>Quis aute</b>m vel eum <b>iure reprehenderit,</b> qui <b>in</b> ea <b>voluptate velit esse</b>, quam nihil molestiae <b>c</b>onsequatur, vel <b>illum</b>, qui <b>dolore</b>m <b>eu</b>m <b>fugiat</b>, quo voluptas <b>nulla pariatur</b>?<i></i>
    </p><p>[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias <b>exceptur</b>i <b>sint, obcaecat</b>i <b>cupiditat</b>e <b>non-pro</b>v<b>ident</b>, similique <b>sunt in culpa</b>, <b>qui officia deserunt mollit</b>ia <b>anim</b>i, <b>id est laborum</b> et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non-recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat…
    </p>
    </blockquote>
    
    </div>`
  }

  constructor (props) {
    super(props)
    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleCancel = () => {
    this.setState({ editing: false })
  }

  handleSave = () => {
    this.setState({ editing: false })
    // and save the form to the server
  }

  handleChange (value) {
    console.log('par', value)
    this.setState({ text: value })
  }

  render () {
    return (
      <A4>
        <h1>Test RichTextEditor</h1>

        {this.state.editing
          ? <div>
            <RichTextEditor value={this.state.text} onChange={this.handleChange} />
            <Button style={{ float: 'right' }} type='primary' shape='round' onClick={this.handleSave} >Save</Button>
            <Button style={{ float: 'right' }} type='' shape='round' onClick={this.handleCancel} >Cancel</Button>
          </div>
          : <div>
            <Button style={{ float: 'right' }} type='primary' shape='round' onClick={() => this.setState({ editing: true })} >Edit</Button>
            <div dangerouslySetInnerHTML={{ __html: this.state.text }} />

          </div>}
      </A4>
    )
  }
}

export default publicPage(TestEditor)
