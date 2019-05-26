import { Tag, Input, Tooltip, Icon } from 'antd'

class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputvalue: ''
  }

  render() {
      return <div>
        <Input placeholder="Search skills" 
          onChange={this.updateInputValue} 
          onPressEnter={this.addTag} 
          value={this.state.inputvalue} />
        {this.state.tags.map(tag => 
            <Tag closable
              onClose={this.removeTag}
            >{tag}</Tag>
        )}
      </div>;
  }
  
  updateInputValue = (e) => {
      // console.log(e)
      this.setState({ inputvalue: e.target.value });
  }

  addTag = (e) => {
    // console.log(e)
    if (!this.state.tags.includes(this.state.inputvalue)) {
      this.setState({tags: [...this.state.tags, this.state.inputvalue], inputvalue: ''});
    }
  }
}

export default EditableTagGroup