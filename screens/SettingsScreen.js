import { useEffect, useReducer } from 'react';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import CustomTextInput from '../components/shared/input/CustomTextInput';
import PageContainer from '../components/shared/PageContainer';
import PageTitle from '../components/shared/PageTitle';
import { colors } from '../constants/colors';
import { formReducer } from '../utils/reducers/formReducer';
import { validateInput } from '../utils/actions/formActions';
import SettingsForm from '../components/settings-screen/form/SettingsForm';

const SettingsScreen = ({ navigation }) => {
  return (
    <PageContainer>
      <PageTitle title={'Settings'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          keyboardVerticalOffset={100}
        >
          <SettingsForm />
        </KeyboardAvoidingView>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SettingsScreen;
