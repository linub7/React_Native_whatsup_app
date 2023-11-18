import { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/chat-list-screen/buttons/CustomHeaderButton';
import SocketContext from '../../context/SocketContext';
import ChatListScreenChatItem from '../../components/chat-list-screen/chat-item';
import PageContainer from '../../components/shared/PageContainer';
import PageTitle from '../../components/shared/PageTitle';

const ChatListScreen = ({ navigation, route }) => {
  // const [chatId, setChatId] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { userData, token } = useSelector((state) => state.auth);
  const { conversations } = useSelector((state) => state.chat);

  // const selectedUser = route?.params?.selectedUserId;

  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New Chat"
              iconName="create-outline"
              onPress={() => navigation.navigate('ٔNewChatScreen')}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    socket.emit('join', userData?._id);

    // get online users
    socket.on('get-online-users', (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
  }, [userData]);

  // useEffect(() => {
  //   if (!selectedUser) return;

  //   handleCreateOrOpenChat();

  //   const chatUsers = [selectedUser, userData._id];
  //   const navigationProps = {
  //     newChatData: { users: chatUsers, chatId, onlineUsers },
  //   };

  //   navigation.navigate('ChatScreen', navigationProps);

  //   return () => setChatId();
  // }, [route?.params]);

  // const handleCreateOrOpenChat = async () => {
  //   const receiverId = selectedUser;
  //   const { err, data } = await createOrOpenChatHandler(receiverId, token);
  //   if (err) {
  //     console.log(err);
  //     Alert.alert('OOPS!', err?.error);
  //     return;
  //   }
  //   setChatId(data?.data?.data?._id);
  //   await dispatch(setActiveConversationAction(data?.data?.data));
  //   socket.emit('join-chat', data?.data?.data?._id);
  //   const idx = conversations.findIndex(
  //     (item) => item?._id === data?.data?.data?._id
  //   );
  //   if (idx === -1) {
  //     dispatch(addToConversationsAction(data?.data?.data));
  //   }
  // };

  return (
    <PageContainer>
      <PageTitle title={'Chats'} />
      <FlatList
        data={conversations}
        keyExtractor={(el) => el?._id}
        renderItem={({ item }) => (
          <ChatListScreenChatItem
            item={item}
            userData={userData}
            token={token}
            socket={socket}
            onlineUsers={onlineUsers}
          />
        )}
      />
    </PageContainer>
  );
};

export default ChatListScreen;
