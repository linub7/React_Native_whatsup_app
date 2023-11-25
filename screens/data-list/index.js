import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import PageContainer from '../../components/shared/PageContainer';
import DataListScreenItem from '../../components/data-list/item';

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
        renderItem={({ item }) => (
          <DataListScreenItem
            item={item}
            conversationId={conversationId}
            conversationName={conversationName}
            userData={userData}
          />
        )}
      />
    </PageContainer>
  );
};

export default DataListScreen;
