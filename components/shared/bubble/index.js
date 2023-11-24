import { useRef } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../constants/colors';
import ReplyMenuItem from '../reply-menu-item';
import { getFormattedTime } from '../../../utils/general';

const Bubble = ({
  text,
  type,
  isStared = false,
  date,
  repliedTo,
  fullName,
  isShowDateAndStar = true,
  isShowFullName = false,
  isReply = false,
  imageUrl,
  handleToggleStarMessage = () => {},
  handleSetReplyingTo = () => {},
}) => {
  const menuRef = useRef(null);
  const idRef = useRef(uuid.v4());

  const wrapperStyle = { ...styles.wrapperStyle };
  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };

  let Container = View;

  switch (type) {
    case 'system':
      textStyle.color = colors.systemTextColor;
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;
    case 'error':
      textStyle.color = 'white';
      bubbleStyle.backgroundColor = colors.red;
      bubbleStyle.marginTop = 10;
      break;
    case 'myMessage':
      wrapperStyle.justifyContent = 'flex-end';
      bubbleStyle.backgroundColor = isStared ? '#CAFDA4' : '#E7FED6';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableWithoutFeedback;
      break;
    case 'notMyMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.backgroundColor = isStared ? '#CAFDA4' : '#fff';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableWithoutFeedback;
      break;
    case 'reply':
      bubbleStyle.backgroundColor = '#F2F2F2';
      break;
    default:
      break;
  }

  const handleCopyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(idRef.current)
        }
        style={{ width: '100%' }}
      >
        <View style={bubbleStyle}>
          {isShowFullName && fullName && (
            <Text style={styles.fullName}>{fullName}</Text>
          )}
          {isReply && repliedTo === null ? (
            <Text style={styles.fullName}>Deleted Message</Text>
          ) : (
            isReply &&
            repliedTo?.sender?._id && (
              <Bubble
                type={'reply'}
                text={repliedTo?.message}
                imageUrl={repliedTo?.files[0]?.url}
                fullName={`${repliedTo?.sender?.firstName} ${repliedTo?.sender?.lastName}`}
                isShowDateAndStar={false}
              />
            )
          )}
          <Text style={textStyle}>{text}</Text>

          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}

          {isShowDateAndStar && (
            <View style={styles.timeContainer}>
              {isStared && (
                <Ionicons name="star" size={14} color={colors.textColor} />
              )}
              <Text style={styles.time}>{getFormattedTime(date)}</Text>
            </View>
          )}

          <Menu name={idRef.current} ref={menuRef}>
            <MenuTrigger />

            <MenuOptions>
              <ReplyMenuItem
                icon={'copy-outline'}
                size={18}
                text="Copy to clipboard"
                onSelect={() => handleCopyToClipboard(text)}
              />
              <ReplyMenuItem
                icon={isStared ? 'star' : 'star-outline'}
                size={18}
                text="Star message"
                onSelect={handleToggleStarMessage}
              />
              <ReplyMenuItem
                icon={'return-up-back-outline'}
                size={18}
                text="Reply"
                onSelect={handleSetReplyingTo}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: colors.borderColor,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
  },
  time: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
    color: colors.grey,
    fontSize: 12,
  },
  fullName: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 5,
  },
});

export default Bubble;
