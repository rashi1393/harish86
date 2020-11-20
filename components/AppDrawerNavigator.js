import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import CustomSideBarMenu  from './CustomSideBarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import MyBarters from '../screens/MyBarters';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
    },
  MyBarters : {
    screen : MyBarters
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