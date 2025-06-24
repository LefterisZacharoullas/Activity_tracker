import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert,
} from 'react-native';
import images from "@/assets/images";
import colors from '@/assets/colors';
import { useState, useEffect } from 'react';
import TodoServices from "@/services/TodoServices"
import LoadingScreen from "@/navigation/screens/LoadingScreen"
import ErrorScreen from "@/navigation/screens/ErrorScreen"
import { useAuth } from '@/context/AuthContext';
import AddTodoModal from '@/utilities/AddTodoModal';

// Включаем LayoutAnimation на Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  //{"date_created": "2025-06-06", "id": 1, "status_id": 1, "text": "Read 50 pages today", "user_id": 1}
  const [todos, setTodos] = useState([
    { id: 1, value: "Test Goal", checked: false },
    { id: 2, value: "Drink water", checked: true },
    { id: 3, value: "Go for a walk", checked: false },
    { id: 4, value: "Test Goal", checked: false },
    { id: 5, value: "Drink water", checked: true },
    { id: 6, value: "Go for a walk", checked: false }
  ]);
  // I know that my front will use only the 1 and 2 status
  const [status, setStatus] = useState([
    { id: 1, status: "Not started" },
    { id: 2, status: "In Progress" },
    { id: 3, status: "Completed" },
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTodo, setnewTodo] = useState({
    text: "",
    date_created: new Date().toISOString().split('T')[0]
  });

  const { logout } = useAuth();
  //I am using this to ensure the connection with the server and fill status
  const check = async () => {
    setLoading(true);
    const res = await TodoServices.getTodobyStatus(1);
    setLoading(false);

    if (res.status === 200) {
      console.log("Todos fetching succesfully", res.data);

      const todosWithChecked = res.data.map(todo => ({
        ...todo,
        checked: todo.status_id !== 1, // To make the checked: false
      }));

      setTodos(todosWithChecked);
    }
    else if (res.status === 404) {
      setError(
        "No connection to server" +
        "\nPlease connect to the internet");
    } else if (res.status === 401) {
      console.error("Unauthorized access - please log in.");
      setError("Unauthorized access - please log in.");
      logout();
      return;
    } else {
      setError(res.error)
    }
  };

  useEffect(() => {
    check();
  }, []);

  if (error) {
    return <ErrorScreen error={error} />
  } else if (loading) {
    return <LoadingScreen />
  }


  const toggleCheckbox = (id) => {
    LayoutAnimation.easeInEaseOut();
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const handleDone = async () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const checkedTodos = todos.filter(todo => todo.checked);

      for (const todo of checkedTodos) {
        const res = await TodoServices.patchTodoStatus(todo.id, 3);
        if (res.status !== 200) {
          Alert.alert("Error updating todo", todo.text);
          return;
        }
      }

      setTodos(prev => prev.filter(todo => !todo.checked));
      await check(); // updtade data
    } catch (error) {
      Alert.alert("Error with the done", error);
    }
  };

  // I have to make the post request
  const onAddTodo = async (newTodo) => {
    console.log("addTodo called");
    setLoading(true);
    const res = await TodoServices.postTodo(newTodo, 1);
    setLoading(false);
    if (res.status === 200) {
      console.log("Todo succesfully created", res.data)
      setTodos(prevdata => [...prevdata, { ...res.data, checked: false }]);
    } else if (res.status === 422) {
      Alert.alert(res.error)
    } else {
      setError(res.error)
    }
  };

  const anyChecked = todos.some(todo => todo.checked);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, to the Activity tracker app</Text>
      <Text style={styles.subtitle}>Take your goal for today</Text>
      <Image source={images.notes} style={styles.image} />

      <View style={{ flex: 1, width: '80%' }}>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          bounces={false}               // disable bounce on iOS
          overScrollMode="never"        // disable overscroll glow on Android
          contentContainerStyle={{ paddingBottom: 0 }}  // remove extra bottom padding
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <View style={styles.todos}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleCheckbox(item.id)}
              >
                {item.checked && <View style={styles.innerCheck} />}
              </TouchableOpacity>
              <Text
                style={[
                  styles.todovalues,
                  item.checked && styles.todovaluesChecked,
                ]}
              >
                {item.text}
              </Text>
            </View>
          }
        />

        {/* Button below the list, not overlapping */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {!anyChecked ? (
            <TouchableOpacity style={styles.addtodo} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>+ Add Todo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addtodo} onPress={handleDone}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        <AddTodoModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          newTodo={newTodo}
          setnewTodo={setnewTodo}
          onAddTodo={onAddTodo}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    paddingTop: 40,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.text,
  },
  image: {
    width: 200,
    height: 200,
  },
  addtodo: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  todos: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
    marginBottom: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  innerCheck: {
    width: 16,
    height: 16,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  todovalues: {
    fontSize: 16,
    color: colors.text,
  },
  todovaluesChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});