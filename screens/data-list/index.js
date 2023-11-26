import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import PageContainer from '../../components/shared/PageContainer';
import DataListScreenItem from '../../components/data-list/item';
import Bubble from '../../components/shared/bubble';

const DataListScreen = ({ navigation, route }) => {
  const data = route?.params?.data;
  const title = route?.params?.title;
  const type = route?.params?.type;
  const conversationId = route?.params?.conversationId;
  const conversationName = route?.params?.conversationName;

  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });

    return () => {};
  }, [title]);

  return (
    <PageContainer>
      <FlatList
        data={data}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => {
          if (type === 'users') {
            return (
              <DataListScreenItem
                item={item}
                conversationId={conversationId}
                conversationName={conversationName}
                userData={userData}
              />
            );
          } else if (type === 'messages') {
            const message = item?.message;
            const isOwnMessage = item?.sender?._id
              ? item?.sender?._id === userData?._id
              : item?.sender === userData?._id;
            const messageType = isOwnMessage ? 'myMessage' : 'notMyMessage';
            const senderFullName = `${item?.sender?.firstName} ${item?.sender?.lastName}`;
            return (
              <Bubble
                type={'system'}
                text={item?.message}
                isShowDateAndStar={true}
                date={item?.createdAt}
              />
              // <Bubble
              //   isEditable={false}
              //   type={messageType}
              //   text={message}
              //   isStared={item?.isStared}
              //   date={item?.createdAt}
              //   handleToggleStarMessage={() => handleToggleStarMessage(item)}
              //   handleSetReplyingTo={() => handleSetReplyingTo(item)}
              //   isReply={item?.isReply}
              //   repliedTo={item?.replyTo}
              //   imageUrl={item?.files[0]?.url}
              //   fullName={senderFullName}
              //   isShowFullName={
              //     !item?.chat?.isGroup || isOwnMessage
              //       ? undefined
              //       : senderFullName
              //   }
              // />
            );
          } else if (type === 'info-messages') {
            return (
              <Bubble
                type={'system'}
                text={item?.message}
                isShowDateAndStar={true}
                date={item?.createdAt}
              />
            );
          }
        }}
      />
    </PageContainer>
  );
};

export default DataListScreen;
