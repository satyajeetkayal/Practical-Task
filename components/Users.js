import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {Card} from 'react-native-paper';
import Axios from 'axios';
import {SearchBar} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {BOOKMARK_ADD, BOOKMARK_REMOVE} from '../redux/actionTypes';
import Icon from 'react-native-vector-icons/Ionicons';

const Users = () => {
  const bookmarks = useSelector(state => state.bookmark);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [searchData, setSearchData] = useState([]);

  const loadMore = () => {
    setLoading(true);
    Axios.get('https://api.github.com/users?page=' + page)
      .then(response => {
        setPage(page + 1);
        setData([...data, ...response.data]);
        setIsRefreshing(false);
        setLoading(false);
      })
      .catch(e => alert(e.message));
  };

  const fetchUsersData = () => {
    setLoading(true);
    Axios.get('https://api.github.com/users?page=' + page)
      .then(response => {
        setPage(page + 1);
        setIsRefreshing(false);
        setData(response.data);
        setSearchData(response.data);
        setLoading(false);
      })
      .catch(e => alert(e.message));
  };

  useEffect(() => {
    fetchUsersData();
    //handleSearch();
  }, []);

  const onRefresh = () => {
    setData([]);
    fetchUsersData();
  };

  const renderFooter = () => {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={loadMore}>
          <Text style={{alignSelf: 'center', fontSize: 20}}>Load More</Text>
          {loading ? (
            <ActivityIndicator color="black" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const handleSearch = text => {
    if (text) {
      const newData = searchData.filter(item => {
        const itemData = item.login
          ? item.login.toLowerCase()
          : ''.toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setQuery(text);
    } else {
      setData(searchData);
      setQuery(text);
    }
  };

  const addBookmark = item => {
    dispatch({
      type: BOOKMARK_ADD,
      payload: item,
    });
  };
  const removeBookmark = item => {
    dispatch({
      type: BOOKMARK_REMOVE,
      payload: item,
    });
  };

  const bookmarkExists = book => {
    if (bookmarks.filter(item => item.id === book.id).length > 0) {
      return true;
    }

    return false;
  };

  const renderItem = ({item}) => {
    return (
      <>
        <View>
          <View style={{justifyContent: 'center', padding: 10}}>
            <Card
              style={{
                padding: 20,
                margin: 10,

                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={{alignSelf: 'center', bottom: 10}}>
                {item.login}
              </Text>
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  alignSelf: 'center',
                }}
                source={{uri: item.avatar_url}}
              />
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                activeOpacity={0.5}
                onPress={() =>
                  bookmarkExists(item)
                    ? removeBookmark(item)
                    : addBookmark(item)
                }>
                <Icon
                  name={bookmarkExists(item) ? 'bookmark' : 'bookmark-outline'}
                  size={25}
                />
                <Text>{bookmarkExists(item) ? 'Bookmarked' : 'Bookmark'}</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <KeyboardAvoidingView behavior="height">
        <View>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                enabled={true}
              />
            }
            scrollEnabled
            removeClippedSubviews
            showsHorizontalScrollIndicator
            data={data}
            maxToRenderPerBatch={5}
            enableEmptySections={true}
            ListFooterComponent={renderFooter}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListHeaderComponent={
              <SearchBar
                placeholder="Search"
                lightTheme
                round
                value={query}
                onChangeText={text => handleSearch(text)}
                onEndEditing={() => handleSearch(query)}
                onClear={() => fetchUsersData()}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Users;

const styles = StyleSheet.create({});
