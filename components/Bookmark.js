import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Card} from 'react-native-paper';
import {BOOKMARK_REMOVE} from '../redux/actionTypes';
import Icon from 'react-native-vector-icons/Ionicons';
import {SearchBar} from 'react-native-elements';

const Bookmark = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const bookmarked = useSelector(state => state.bookmark);

  const removeBookmark = item => {
    dispatch({
      type: BOOKMARK_REMOVE,
      payload: item,
    });
  };

  const handleSearch = text => {
    if (text) {
      const newData = bookmarked.filter(item => {
        const itemData = item.login
          ? item.login.toLowerCase()
          : ''.toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setQuery(text);
    } else {
      setData(bookmarked);
      setQuery(text);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={{justifyContent: 'center', padding: 10}}>
          <Card
            style={{
              padding: 20,
              margin: 10,

              flex: 1,
              justifyContent: 'center',
            }}>
            <Text style={{alignSelf: 'center', bottom: 10}}>{item.login}</Text>
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
              style={{flexDirection: 'row', top: 10}}
              activeOpacity={0.5}
              onPress={() => removeBookmark(item)}>
              <Icon name="bookmark" size={25} />
              <Text>Remove Bookmark</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    );
  };

  return (
    <>
      <View>
        {bookmarked.length !== 0 ? (
          <FlatList
            data={bookmarked}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={renderItem}
            ListHeaderComponent={
              <SearchBar
                lightTheme
                placeholder="Search Bookmarked"
                value={query}
                onChangeText={text => handleSearch(text)}
                onEndEditing={() => handleSearch(query)}
              />
            }
          />
        ) : (
          <View>
            <Text
              style={{
                fontSize: 24,
                alignSelf: 'center',
                top: 150,
              }}>
              No Bookmarked here!
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});
