import Spinner from '../../shared/loading/Spinner';
import { colors } from '../../../constants/colors';
import SubmitButton from '../../auth-screen/buttons/SubmitButton';

const ChatSettingsScreenSubmit = ({
  loading,
  isUpdateButtonDisabled,
  handleUpdate = () => {},
}) => {
  return loading ? (
    <Spinner size={'large'} color={colors.blue} />
  ) : (
    <>
      <SubmitButton
        label={'Update My Group Name'}
        disabled={isUpdateButtonDisabled}
        onPress={handleUpdate}
        additionalStyle={{ marginTop: 20, width: '100%' }}
      />
    </>
  );
};

export default ChatSettingsScreenSubmit;
