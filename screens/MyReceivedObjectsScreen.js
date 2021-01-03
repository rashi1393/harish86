import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyReceivedObjectsScreen extends Component{
    constructor(){
        super()
        this.state = {
          userId  : firebase.auth().currentUser.email,
          receivedObjectsList : []
        }
      this.requestRef= null
    }
    
    getReceivedObjectsList =()=>{
        this.requestRef = db.collection("requested_objects")
        .where('user_id','==',this.state.userId)
        .where("object_status", '==','received')
        .onSnapshot((snapshot)=>{
          var receivedObjectsList = snapshot.docs.map((doc) => doc.data())
          this.setState({
            receivedObjectsList : receivedObjectsList
          });
        })
    }

    omponentDidMount(){
        this.getReceivedObjectsList()
    }
    
    componentWillUnmount(){
        this.requestRef();
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) =>{
        console.log(item.object_name);
        return (
        <ListItem
            key={i}
            title={item.object_name}
            subtitle={item.objectStatus}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            bottomDivider
        />
        )
    }

    render(){
        return(
            <View style={{flex:1}}>
            <MyHeader title="Received Objects" navigation ={this.props.navigation}/>
            <View style={{flex:1}}>
            {
                this.state.receivedObjectsList.length === 0
                ?(
                <View style={styles.subContainer}>
                    <Text style={{ fontSize: 20}}>List Of All Received Objects</Text>
                </View>
                )
                :(
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.receivedObjectsList}
                    renderItem={this.renderItem}
                />
                )
            }
        </View>
      </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    }
  })