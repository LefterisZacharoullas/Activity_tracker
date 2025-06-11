import { View, Text, StyleSheet, FlatList } from 'react-native';
import ActivityServices from "../../services/ActivityServices";
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import colors from "@/assets/colors";
import ActivityList from '@/utilities/ActivityList';

export default function ActivityScreen() {

  // Get activity data of the current user
  // [{"date": "2025-06-06", "exercise_name": "Deadlift",
  //  "exercise_reps": 5, "exercise_weight": 100, "id": 2, "user_id": 2}]

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityData, setActivityData] = useState([
    {
      id: 1,
      exercise_name: "Test Lift",
      exercise_reps: 10,
      exercise_weight: 50,
      date: "2025-06-06",
      user_id: 1
    }
  ]);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const res = await ActivityServices.getActivities();
        console.log("API response:", res);
        setActivityData(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchActivityData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Screen</Text>
      <Text style={styles.subtitle}>Track your activities here!</Text>
      <ActivityList activitydata={activityData} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
})