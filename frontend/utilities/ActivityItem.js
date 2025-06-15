import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import colors from "@/assets/colors"

const ActivityItem = ({ item, onDeleteActivity, onConfigActivity, onSelectActivity, selectedActivity }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const isSelected = selectedActivity.some(selected => selected.id === item.id);

  const toggleMenu = () => {
    setMenuVisible(prev => {
      const newValue = !prev;

      Animated.timing(animation, {
        toValue: newValue ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();

      return newValue;
    });
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70], // высота раскрытия меню
  });

  return (
    <View style={[styles.card, isSelected && { backgroundColor: "lightgreen" }]}>
      <View style={styles.headerRow}>
        <Text style={styles.exerciseName} onPress={() => {onSelectActivity(item.id)}}>{item.exercise_name}</Text>
        <TouchableOpacity style={styles.moreBtn} onPress={toggleMenu}>
          <Text style={styles.moreText}>⋮</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.itemText}>Reps: {item.exercise_reps}</Text>
      <Text style={styles.itemText}>Weight: {item.exercise_weight}kg</Text>

      <Animated.View style={[styles.dropdownMenu, { height: heightInterpolation, opacity: animation }]}>
        {menuVisible && (
          <>
            <TouchableOpacity onPress={() => onConfigActivity(item.id)}>
              <Text style={[styles.menuItem, { color: colors.muted }]}>⚙️ Config</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDeleteActivity(item.id)}>
              <Text style={[styles.menuItem, { color: 'red' }]}>🗑 Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  itemText: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 8,
  },
  moreBtn: {
    padding: 6,
  },
  moreText: {
    fontSize: 20,
    color: colors.muted,
  },
  dropdownMenu: {
    overflow: 'hidden',
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default ActivityItem