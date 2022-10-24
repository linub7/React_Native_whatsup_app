import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SigninForm from '../components/auth-screen/forms/SigninForm';
import SignupForm from '../components/auth-screen/forms/SignupForm';
import PageContainer from '../components/shared/PageContainer';
import logo from '../assets/images/logo.png';

const AuthScreen = ({ navigation }) => {
  const [isSignupContent, setIsSignupContent] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <PageContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'height' : undefined}
            keyboardVerticalOffset={100}
          >
            <View style={styles.imageContainer}>
              <Image source={logo} style={styles.image} resizeMode="contain" />
            </View>
            {isSignupContent ? (
              <SignupForm
                isSignupContent={isSignupContent}
                setIsSignupContent={setIsSignupContent}
              />
            ) : (
              <SigninForm
                isSignupContent={isSignupContent}
                setIsSignupContent={setIsSignupContent}
              />
            )}
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    width: '50%',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default AuthScreen;
