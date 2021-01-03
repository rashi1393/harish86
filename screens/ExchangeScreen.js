import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component {
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            objectName: '',
            reasonToRequest:'',
            IsRequestActive:"",
            requestedObjectName:"",
            objectStatus:"",
            requestId:"",
            docId:"",
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addRequest = async(objectName,reasonToRequest)=>{
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        db.collection('requested_objects').add({
            "user_id": userId,
            "object_name":objectName,
            "reason_to_request":reasonToRequest,
            "request_id"  : randomRequestId,
            "object_status" : "requested",
            "date"       : firebase.firestore.FieldValue.serverTimestamp()
        })

        await this.getRequest()
          db.collection('users').where("email_id","==",userId).get()
          .then()
          .then((snapshot)=>{
            snapshot.forEach((doc)=>{
              db.collection('users').doc(doc.id).update({
                  IsRequestActive: true
            })
          })
        })
    
        this.setState({
            objectName :'',
            reasonToRequest : ''
        })
    
        return Alert.alert(" Requested Successfully")
      }

      getRequest =()=>{
        // getting the requested item
        var itemRequest = db.collection('requested_objects')
        .where('user_id','==',this.state.userId)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            if(doc.data().object_status !== "received"){
              this.setState({
                requestId : doc.data().request_id,
                requestedObjectName: doc.data().object_name,
                objectStatus:doc.data().object_status,
                docId     : doc.id
              })
            }
          })
      })}

      getIsObjectRequestActive(){
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.setState({
              IsRequestActive:doc.data().IsRequestActive,
              userDocId : doc.id
            })
          })
        })
      }

      updateObjectRequestStatus=()=>{
        //updating the object status after receiving the object
        db.collection('requested_objects').doc(this.state.docId)
        .update({
          object_status : 'received'
        })
      
        //getting the  doc id to update the users doc
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            //updating the doc
            db.collection('users').doc(doc.id).update({
              IsRequestActive: false
            })
          })
        })
      }

      sendNotification=()=>{
        //to get the first name and last name
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var name = doc.data().first_name
            var lastName = doc.data().last_name
      
            // to get the donor id and book nam
            db.collection('all_notifications')
              .where('request_id','==',this.state.requestId).get()
            .then((snapshot)=>{
              snapshot.forEach((doc) => {
                var donorId  = doc.data().donor_id
                var objectName =  doc.data().object_name
      
                //targert user id is the donor id to send notification to the user
                db.collection('all_notifications').add({
                  "targeted_user_id" : donorId,
                  "message" : name +" " + lastName + " received the book " + objectName ,
                  "notification_status" : "unread",
                  "object_name" : objectName
                })
              })
            })
          })
        })
      }

      omponentDidMount(){
        this.getRequest()
        this.getIsObjectRequestActive()      
      }

    render(){
      if(this.state.IsRequestActive === true){
        return(  
          // Status screen  
          <View style = {{flex:1,justifyContent:'center'}}>
            <View style={{borderColor:"orange",borderWidth:2,
            justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Object Name</Text>
            <Text>{this.state.requestedObjectName}</Text>
            </View>
            <View style={{borderColor:"orange",borderWidth:2,
            justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Object Status </Text>
            <Text>{this.state.objectStatus}</Text>
            </View>
  
            <TouchableOpacity 
            style={{borderWidth:1,borderColor:'orange',
            backgroundColor:"orange",width:300,alignSelf:'center',
            alignItems:'center',height:30,marginTop:30}}
            onPress={()=>{
              this.sendNotification()
              this.updateObjectRequestStatus();
              this.receivedObjects(this.state.requestedObjectName)
            }}>
            <Text>I receifved the object </Text>
            </TouchableOpacity>
          </View>
        )
      }
      else{
        //form screen 
        return(
          <View style={{flex:1}}>
            <MyHeader title="Barter System" />
              <KeyboardAvoidingView style={styles.keyBoardStyle}>
                <TextInput
                  style ={styles.formTextInput}
                  placeholder={"enter object name"}
                  onChangeText={(text)=>{
                      this.setState({
                          objectName:text
                      })
                  }}
                  value={this.state.objectName}
                />
                <TextInput
                  style ={[styles.formTextInput,{height:300}]}
                  multiline
                  numberOfLines ={8}
                  placeholder={"Why do you need this object?"}
                  onChangeText ={(text)=>{
                      this.setState({
                          reasonToRequest:text
                      })
                  }}
                  value ={this.state.reasonToRequest}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={()=>
                      {this.addRequest(this.state.objectName,this.state.reasonToRequest)}
                  } >
                  <Text>Request</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
          </View>
        )
      }
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
        alignItems:'center',
        justifyContent:'center',
      },
      formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10,
      },
      button:{
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop:20
      },
})




















