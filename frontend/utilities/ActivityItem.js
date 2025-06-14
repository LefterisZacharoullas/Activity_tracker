import { View, Text, StyleSheet } from 'react-native';
import colors from '../assets/colors';

const ActivityItem = ({ item }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.exerciseName}>{item.exercise_name}</Text>
            <Text style={styles.itemText}>Reps: {item.exercise_reps}</Text>
            <Text style={styles.itemText}>Weight: {item.exercise_weight}kg</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  activityList: {
    paddingBottom: 20,
  },
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
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 2,
  },
});

export default ActivityItem;
