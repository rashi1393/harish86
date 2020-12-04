import * as React from 'react';
import {View,Text,StyleSheet,TouchableOpacity, Alert} from 'react-native';
import {Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';

export default class ReceiverDetailsScreen extends React.Component {
    constructor(props){
        super(props);
        this.state={
          userId : firebase.auth().currentUser.email,
          receiverId : this.props.navigation.getParam('details')["user_id"],
          requestId : this.props.navigation.getParam('details')["request_id"],  
          objectName : this.props.navigation.getParam('details')["object_name"],
          reason_for_requesting : this.props.navigation.getParam('details')["reason_to_request"],
          receiverName : '',
          receiverContact : '',
          receiverAddress : '',
          receiverRequestDocId : '',
          userName: "",
        }
    }

    getReceiverDetails (){
      db.collection("users").where("email_Id","==",this.state.receiverId).get()
        .then(snapshot => {
          snapshot.forEach(doc =>{
            this.setState({
              receiverName    : doc.data().first_name,
              receiverContact : doc.data().contact,
              receiverAddress : doc.data().address,
            })
          })
        })
        db.collection('requested_objects').where('request_id','==',this.state.requestId).get()
        .then(snapshot=>{
          snapshot.forEach(doc => {
            this.setState({receiverRequestDocId:doc.id})
         })
        })
    }

    updateObjectStatus=()=>{
      db.collection('all_donations').add({
        object_name           : this.state.objectName,
        request_id          : this.state.requestId,
        requested_by        : this.state.receiverName,
        donor_id            : this.state.userId,
        request_status      :  "Donor Interested"
      })
    }

    getUserName=(userId)=>{
      db.collection("users").where("email_Id","==", userId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          this.setState({
            userName : doc.data().first_name + " " + doc.data().last_name
          })
        });
      })      
    }

    addNotification=()=>{
      var message = this.state.userName + " has shown interest in donating the book"
      db.collection("all_notifications").add({
        "targeted_user_id"    : this.state.receiverId,
        "donor_id"            : this.state.userId,
        "request_id"          : this.state.requestId,
        "book_name"           : this.state.objectName,
        "date"                : firebase.firestore.FieldValue.serverTimestamp(),
        "notification_status" : "unread",
        "message"             : message
      })
    }

    componentDidMount(){
      this.getReceiverDetails();
      this.getUserName(this.state.userId)
    }

    render(){
        return (
          <View style={styles.container}>
          <View style={{flex:0.1}}>
            <Header
              leftComponent={<Icon name='arrow-left' type='feather' 
              color='#696969'  
              onPress={() => this.props.navigation.goBack()}/>}
              centerComponent={{ 
                text:"Receiver Details", 
                style: { 
                  color: '#90A5A9', 
                  fontSize:20, 
                  fontWeight:"bold"
                }
              }}
              backgroundColor = "#eaf8fe"
            />
          </View>
          <View style={{flex:0.3}}>
            <Card
                title={"Object Information"}
                titleStyle= {{fontSize : 20}}
              >
              <Card >
                <Text style={{fontWeight:'bold'}}>Name : {this.state.objectName}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
              </Card>
            </Card>
          </View>
          <View style={{flex:0.3}}>
            <Card
              title={"Receiver Information"}
              titleStyle= {{fontSize : 20}}
              >
              <Card>
                <Text style={{fontWeight:'bold'}}>Name: {this.state.receiverName}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Contact: {this.state.receiverContact}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Address: {this.state.receiverAddress}</Text>
              </Card>
            </Card>
          </View>
          <View style={styles.buttonContainer}>
            {
              this.state.receiverId !== this.state.userId
              ?(
                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{
                      this.updateObjectStatus();
                      this.addNotification()
                      this.props.navigation.navigate('MyBarters')
                    }}>
                  <Text>I want to Donate</Text>
                </TouchableOpacity>
              )
              : null
            }
          </View>
      </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})