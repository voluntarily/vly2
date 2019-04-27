import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Selectors
import { getShowAddOrg } from '../../../App/AppReducer';
import OrgCreateWidget from '../../components/OrgCreateWidget/OrgCreateWidget';
// Import Components
import OrgList from '../../components/OrgList';
// Import Actions
import { addOrgRequest, deleteOrgRequest, fetchOrgs } from '../../OrgActions';
import { getOrgs } from '../../OrgReducer';
import { Button } from 'antd';

class OrgListPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showCreateOrgWidget: false };
  }

  componentDidMount() {
    this.props.dispatch(fetchOrgs());
  }
  handleOrgCreate = () => {
    this.setState({ showCreateOrgWidget: true });
  };
  handleCancelOrg = () => {
    this.setState({ showCreateOrgWidget: false });
  };

  handleDeleteOrg = org => {
    if (confirm('Do you want to delete this organisation')) { // eslint-disable-line
      this.props.dispatch(deleteOrgRequest(org));
    }
  };

  handleAddOrg = (name, about, type) => {
    this.setState({ showCreateOrgWidget: false });
    this.props.dispatch(addOrgRequest({ name, about, type }));
  };

  render() {
    return (
      <div>
        <h1>Organisations</h1>
        <div>
          {
            this.state.showCreateOrgWidget
            ? <OrgCreateWidget addOrg={this.handleAddOrg} cancelOrg={this.handleCancelOrg} />
            : <Button type="primary" onClick={this.handleOrgCreate} >Add Organisation</Button>
          }
        </div>
        <OrgList
          handleDeleteOrg={this.handleDeleteOrg}
          orgs={this.props.orgs}
        />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in server side.
OrgListPage.need = [() => { return fetchOrgs(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    orgs: getOrgs(state),
  };
}

OrgListPage.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

OrgListPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OrgListPage);
