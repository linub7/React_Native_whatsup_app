import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { colors } from '../../../constants/colors';

const CustomTextInput = (props) => {
  const onChangeInput = (text) => {
    props.handleInputChange(props.id, text);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>

      <View style={styles.inputContainer}>
        {props.icon && (
          <props.iconPack
            name={props.icon}
            size={props.size || 15}
            color={props.color}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          value={props.value}
          keyboardType={props.keyboardType}
          secureTextEntry={props.secureTextEntry || false}
          onChangeText={onChangeInput}
          autoCapitalize="none"
        />
      </View>

      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginVertical: 8,
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.nearlyWhite,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    color: colors.textColor,
    flex: 1,
    fontFamily: 'regular',
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});

export default CustomTextInput;
