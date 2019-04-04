import { connect } from 'react-redux';
import { Logger } from 'renderer/utils/logging';
import types from 'renderer/types';
import ROUTES from '../../constants/routes';

const mapStateToProps = ({ appStore: { globalModal } }) => ({
  isOpen: globalModal.isOpen,
  modalType: globalModal.type,
});

const mapDispatchToProps = dispatch => ({
  onToggleGlobalModal: payload => {
    dispatch({
      type: types.toggleGlobalModal.triggered,
      payload,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
