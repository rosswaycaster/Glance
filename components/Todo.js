import React from "react";
import {
  Dimensions,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Prompt from "react-native-prompt-crossplatform";
import * as firebase from "firebase";
import Row from "./Row";

const screenWidth = Dimensions.get("window").width;

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAHfwZPWgXh0qW7CBvgcFFs6n3VmlpTWgs",
    authDomain: "ipad-todo.firebaseapp.com",
    databaseURL: "https://ipad-todo.firebaseio.com",
    projectId: "ipad-todo",
    storageBucket: "ipad-todo.appspot.com",
    messagingSenderId: "291212073083"
  });
}

const database = firebase.database();

class Todo extends React.Component {
  state = {
    todos: [],
    promptVisible: false,
    promptValue: "",
    editPromptVisible: false,
    editKey: "",
    editTitle: ""
  };

  componentDidMount() {
    database.ref("todo").on("value", snapshot => {
      var todos = [];
      snapshot.forEach(ss => {
        todos.push({ key: ss.key, ...ss.val() });
      });
      this.setState({ todos: todos });
    });
  }

  delete(key) {
    database
      .ref("todo")
      .child(key)
      .remove();
  }

  addPressed() {
    this.setState({
      promptVisible: true
    });
  }

  hideAddPrompt() {
    this.setState({
      promptValue: "",
      promptVisible: false
    });
  }

  onAddSubmit() {
    database.ref("todo").push({ title: this.state.promptValue });

    this.hideAddPrompt();
  }

  editPressed(key, title) {
    this.setState({
      editKey: key,
      editTitle: title,
      editPromptVisible: true
    });
  }

  hideEditPrompt() {
    this.setState({
      editKey: "",
      editTitle: "",
      editPromptVisible: false
    });
  }

  onEditSave() {
    database
      .ref("todo")
      .child(this.state.editKey)
      .set({
        title: this.state.editTitle
      });

    this.hideEditPrompt();
  }

  render() {
    return (
      <Row>
        <View style={styles.container}>
          <ScrollView style={styles.scrollContainer}>
            {this.state.todos.map(todo => {
              return (
                <Row key={todo.key}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => this.delete(todo.key)}
                  >
                    <Text style={styles.todo}> X </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => this.editPressed(todo.key, todo.title)}
                  >
                    <Text style={styles.todo}>{todo.title}</Text>
                  </TouchableOpacity>
                </Row>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => this.addPressed()}
          >
            <Text style={styles.addText}> Add Todo </Text>
          </TouchableOpacity>
        </View>
        <Prompt
          title="New Todo"
          inputPlaceholder=""
          submitButtonText="Add"
          cancelButtonText="Cancel"
          primaryColor="black"
          isVisible={this.state.promptVisible}
          onChangeText={text => this.setState({ promptValue: text })}
          onCancel={() => this.hideAddPrompt()}
          onSubmit={() => this.onAddSubmit()}
          autoFocus={true}
        />
        <Prompt
          title="Edit Todo"
          inputPlaceholder=""
          defaultValue={this.state.editTitle}
          submitButtonText="Save"
          cancelButtonText="Cancel"
          primaryColor="black"
          isVisible={this.state.editPromptVisible}
          onChangeText={text => this.setState({ editTitle: text })}
          onCancel={() => this.hideEditPrompt()}
          onSubmit={() => this.onEditSave()}
          autoFocus={true}
        />
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  scrollContainer: {
    flex: 1,
    flexDirection: "column"
  },
  deleteButton: {
    marginRight: 10
  },
  todo: {
    color: "white",
    fontSize: 0.045 * screenWidth
  },
  addButton: {
    flexDirection: "column",
    alignSelf: "stretch",
    justifyContent: "center",
    backgroundColor: "rgba(250,250,250,0.15)",
    paddingTop: 5,
    paddingBottom: 5
  },
  addText: {
    alignSelf: "center",
    color: "white",
    fontSize: 0.045 * screenWidth
  }
});

export default Todo;
