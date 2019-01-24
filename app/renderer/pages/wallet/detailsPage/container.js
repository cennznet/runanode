import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import history from 'renderer/history';
import ROUTES from 'renderer/constants/routes';

const mapStateToProps = ({ localStorage }) => ({ wallets: localStorage[storageKeys.WALLETS] });

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {},
});

const enhance = compose(
  lifecycle({
    componentDidMount() {},
  })
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
