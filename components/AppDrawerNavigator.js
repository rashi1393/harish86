import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import CustomSideBarMenu  from './CustomSideBarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import MyBarters from '../screens/MyBarters';
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedObjectsScreen from '../screens/MyReceivedObjectsScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
    },
  MyBarters : {
    screen : MyBarters
  },
  Notifications: {
    screen: NotificationScreen
  },
  MyReceivedObjects :{
    screen: MyReceivedObjectsScreen
  },
  Settings:{
    screen: SettingScreen
  },
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })