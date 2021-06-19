import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import Users from './components/Users';
import Bookmark from './components/Bookmark';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import reduxStore from './redux/store';

const Tabs = createBottomTabNavigator();
const App = () => {
  const {store, persistor} = reduxStore();
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer>
            <Tabs.Navigator>
              <Tabs.Screen name="User" component={Users} />
              <Tabs.Screen name="BookMark" component={Bookmark} />
            </Tabs.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;
