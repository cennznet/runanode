import React, { PureComponent } from 'react';
import { Route as ReactRoute } from 'react-router-dom';
import { connect } from 'react-redux';

class EntryActionEmmiter extends PureComponent {
  componentDidMount() {
    const { match, onEntryAction, dispatch } = this.props;
    dispatch({ type: onEntryAction, payload: match });
  }
  render() {
    const { component: Component, match } = this.props;
    return Component ? <Component match={match} /> : <div />;
  }
}

const EntryActionEmmiterContainer = connect()(EntryActionEmmiter);
const Route = ({ onEntryAction, component, ...rest }) =>
  onEntryAction ? (
    <ReactRoute
      render={({ match }) => (
        <EntryActionEmmiterContainer key={onEntryAction} {...{ onEntryAction, match, component }} />
      )}
      {...rest}
    />
  ) : (
    <ReactRoute component={component} {...rest} />
  );

export default Route;
