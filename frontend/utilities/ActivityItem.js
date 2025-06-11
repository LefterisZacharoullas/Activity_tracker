import { View, Text, StyleSheet } from 'react-native';
import colors from '../assets/colors';

const ActivityItem = ({ item }) => {
    return (
        <View style={styles.activityText}>
            {console.log("Activity Item:", item)}
            <Text style={styles.itemText}>{item.exercise_name}</Text>
            <Text style={styles.itemText}>Reps: {item.exercise_reps}</Text>
            <Text style={styles.itemText}>Weight: {item.exercise_weight}kg</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    activityText: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    itemText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: "bold"
    },
});

export default ActivityItem;
