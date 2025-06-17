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
} from 'react-native';
import images from "@/assets/images";
import colors from '@/assets/colors';
import { useState, useEffect } from 'react';

// Включаем LayoutAnimation на Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const [todos, setTodos] = useState([
    { id: 1, value: "Test Goal", checked: false },
    { id: 2, value: "Drink water", checked: true },
    { id: 3, value: "Go for a walk", checked: false },
    { id: 4, value: "Test Goal", checked: false },
    { id: 5, value: "Drink water", checked: true },
    { id: 6, value: "Go for a walk", checked: false }
  ]);

  const toggleCheckbox = (id) => {
    LayoutAnimation.easeInEaseOut();
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const handleDone = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos((prev) => prev.filter(todo => !todo.checked));
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
                {item.value}
              </Text>
            </View>
          }
        />

        {/* Button below the list, not overlapping */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {!anyChecked ? (
            <TouchableOpacity style={styles.addtodo} onPress={() => console.log('Add todo pressed')}>
              <Text style={styles.buttonText}>+ Add Todo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addtodo} onPress={handleDone}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
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