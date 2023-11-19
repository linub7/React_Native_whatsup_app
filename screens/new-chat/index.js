import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import CustomHeaderButton from '../../components/chat-list-screen/buttons/CustomHeaderButton';
import PageContainer from '../../components/shared/PageContainer';
import { colors } from '../../constants/colors';
import { commonStyles } from '../../constants/commonStyles';
import { searchUsers } from '../../api/user';
import Spinner from '../../components/shared/loading/Spinner';
import SearchResultUserItem from '../../components/new-chat-screen/search/SearchResultUserItem';
import { setStoredUsers } from '../../store/slices/userSlice';
import {
  createGroupChatHandler,
  createOrOpenChatHandler,
} from '../../api/chat';
import {
  addToConversationsAction,
  makeEmptySelectedUsersForGroupChatAction,
  setActiveConversationAction,
  toggleSelectedUsersForGroupChatAction,
} from '../../store/slices/chatSlice';
import SocketContext from '../../context/SocketContext';
import ProfileImage from '../../components/shared/profile/ProfileImage';

const NewChatScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [noResultFound, setNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatName, setChatName] = useState('');
  const [createGroupLoading, setCreateGroupLoading] = useState(false);

  const selectedUsersListRef = useRef();

  const { token } = useSelector((state) => state.auth);
  const { conversations, groupChatUsers } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const isGroupChat = route?.params?.isGroupChat;
  const isGroupChatDisabled =
    groupChatUsers?.length === 0 || chatName === '' ? true : false;

  useEffect(() => {
    return () => {
      setSearchTerm('');
      setChatName('');
      dispatch(makeEmptySelectedUsersForGroupChatAction());
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Close" onPress={() => navigation.goBack()} />
          </HeaderButtons>
        );
      },
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {isGroupChat && (
              <Item
                title="Create"
                disabled={isGroupChatDisabled}
                color={isGroupChatDisabled ? colors.lightGrey : undefined}
                onPress={handleCreateGroup}
              />
            )}
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? 'Add Participants' : 'New Chat',
    });
  }, [chatName, groupChatUsers]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      setUsers();
      if (!searchTerm || searchTerm === '') {
        setUsers();
        setNoResultFound(false);
        return;
      }

      setLoading(true);

      const { err, data } = await searchUsers(searchTerm, token);

      if (err) {
        setLoading(false);
        console.log(err);
        return;
      }
      if (data?.success) {
        if (data?.result.length < 1) {
          setLoading(false);
          setNoResultFound(true);
        } else {
          setLoading(false);
          setNoResultFound(false);
          setUsers(data?.result);
          dispatch(setStoredUsers({ newUsers: data?.result }));
        }
      }

      return () => {
        setUsers();
      };
    }, 500);

    return () => {
      clearTimeout(delaySearch);
    };
  }, [searchTerm]);

  const handleChangeInput = (text) => setSearchTerm(text);
  const handleChangeChatNameInput = (text) => setChatName(text);

  const handleOnPressSearchResultItem = async (user) => {
    if (isGroupChat) {
      dispatch(toggleSelectedUsersForGroupChatAction(user));
    } else {
      await handleCreateOrOpenChat(user?._id);
      navigation.navigate('ChatScreen');
    }
  };

  const handleRemoveGroupChatUsers = async (user) => {
    dispatch(toggleSelectedUsersForGroupChatAction(user));
  };

  const handleCreateOrOpenChat = async (receiverId) => {
    const isGroup = false;
    const { err, data } = await createOrOpenChatHandler(
      receiverId,
      isGroup,
      token
    );
    if (err) {
      console.log(err);
      Alert.alert('OOPS!', err?.error);
      return;
    }
    await dispatch(setActiveConversationAction(data?.data?.data));
    socket.emit('join-chat', data?.data?.data?._id);
    const idx = conversations.findIndex(
      (item) => item?._id === data?.data?.data?._id
    );
    if (idx === -1) {
      dispatch(addToConversationsAction(data?.data?.data));
    }
  };

  const handleCreateGroup = useCallback(async () => {
    let users = [];
    for (const item of groupChatUsers) {
      users?.push(item?._id);
    }
    setCreateGroupLoading(true);
    const name = chatName;
    const { err, data } = await createGroupChatHandler(users, name, token);
    if (err) {
      console.log(err);
      setCreateGroupLoading(false);
      Alert.alert('OOPS!', err?.error);
      await dispatch(makeEmptySelectedUsersForGroupChatAction());
      return;
    }
    await dispatch(makeEmptySelectedUsersForGroupChatAction());
    await dispatch(setActiveConversationAction(data?.data?.data));
    socket.emit('join-chat', data?.data?.data?._id);
    const idx = conversations.findIndex(
      (item) => item?._id === data?.data?.data?._id
    );
    if (idx === -1) {
      dispatch(addToConversationsAction(data?.data?.data));
    }
    setCreateGroupLoading(false);
    setChatName('');
    navigation.navigate('ChatScreen');
  }, [createGroupLoading, chatName, groupChatUsers]);

  const renderSearchResultUser = (itemData) => {
    const idx = groupChatUsers?.findIndex(
      (user) => user?._id === itemData?.item?._id
    );
    let isChecked = idx !== -1 ? true : false;

    return (
      <SearchResultUserItem
        item={itemData?.item}
        onPress={handleOnPressSearchResultItem}
        type={isGroupChat ? 'checkbox' : ''}
        isChecked={isChecked}
        isGroupChat={isGroupChat}
      />
    );
  };

  return (
    <PageContainer>
      {isGroupChat && (
        <>
          <View style={styles.chatNameContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textBox}
                placeholder="Enter a name for your chat"
                autoCorrect={false}
                autoComplete="off"
                autoCapitalize="none"
                onChangeText={handleChangeChatNameInput}
              />
            </View>
          </View>

          {groupChatUsers?.length > 0 && (
            <View style={styles.selectedUsersContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={(ref) => (selectedUsersListRef.current = ref)}
                onContentSizeChange={() =>
                  selectedUsersListRef.current.scrollToEnd()
                }
                contentContainerStyle={{ alignItems: 'center' }}
                data={groupChatUsers}
                keyExtractor={(item) => item?._id}
                renderItem={({ item }) => (
                  <ProfileImage
                    imageUri={item?.image?.url}
                    onPress={() => handleRemoveGroupChatUsers(item)}
                    width={40}
                    height={40}
                    isEditable={true}
                    listItem={true}
                    showRemoveButton={true}
                    additionalStyle={styles.selectedUserStyle}
                  />
                )}
                style={styles.selectedUsersList}
              />
            </View>
          )}
        </>
      )}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={15} color={colors.lightGrey} />
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          onChangeText={handleChangeInput}
        />
      </View>

      {loading && (
        <View style={commonStyles.center}>
          <Spinner size={'large'} color={colors.blue} />
        </View>
      )}

      {!loading && noResultFound && (
        <View style={commonStyles.center}>
          <Ionicons
            name="help-outline"
            size={85}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultText}>No Users Found!</Text>
        </View>
      )}
      {users && !noResultFound && (
        <FlatList
          data={users && users}
          keyExtractor={(item) => item._id}
          renderItem={renderSearchResultUser}
        />
      )}
      {!loading && !users && !noResultFound && (
        <View style={commonStyles.center}>
          <Ionicons
            name="people-outline"
            size={85}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultText}>
            Enter a name to search for a user
          </Text>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.extraLightGrey,
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 15,
    width: '100%',
  },
  noResultIcon: {
    marginBottom: 20,
  },
  noResultText: {
    color: colors.textColor,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  chatNameContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: colors.nearlyWhite,
    flexDirection: 'row',
    borderRadius: 2,
  },
  textBox: {
    color: colors.textColor,
    width: '100%',
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  selectedUsersContainer: {
    height: 50,
    justifyContent: 'center',
  },
  selectedUsersList: {
    height: '100%',
    paddingTop: 10,
  },
  selectedUserStyle: {
    marginRight: 10,
  },
});

export default NewChatScreen;
