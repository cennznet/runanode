import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onUnStake: value => {
    window.odin.api.cennz.doUnStake(value.wallet, value.stashAccountAddress, value.passphrase);
  },
});

const enhance = lifecycle({
  componentDidMount() {},
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
