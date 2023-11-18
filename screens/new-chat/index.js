import { useContext, useEffect, useState } from 'react';
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
import { createOrOpenChatHandler } from '../../api/chat';
import {
  addToConversationsAction,
  setActiveConversationAction,
} from '../../store/slices/chatSlice';
import SocketContext from '../../context/SocketContext';

const NewChatScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [noResultFound, setNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { token } = useSelector((state) => state.auth);
  const { conversations } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Close" onPress={() => navigation.goBack()} />
          </HeaderButtons>
        );
      },
      headerTitle: 'New Chat',
    });
  }, []);

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

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleChangeInput = (text) => setSearchTerm(text);

  const handleNavigateToChatListScreen = async (userId) => {
    await handleCreateOrOpenChat(userId);
    navigation.navigate('ChatScreen');
  };

  const handleCreateOrOpenChat = async (receiverId) => {
    const { err, data } = await createOrOpenChatHandler(receiverId, token);
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

  const renderSearchResultUser = (itemData) => {
    return (
      <SearchResultUserItem
        item={itemData?.item}
        onPress={handleNavigateToChatListScreen}
      />
    );
  };

  return (
    <PageContainer>
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
});

export default NewChatScreen;
