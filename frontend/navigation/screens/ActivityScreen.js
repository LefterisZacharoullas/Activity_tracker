import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityServices from "../../services/ActivityServices";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import colors from "@/assets/colors";
import ActivityList from '@/utilities/ActivityList';
import { useAuth } from '@/context/AuthContext';
import AddActivityModal from '@/utilities/AddActivityModal';

export default function ActivityScreen() {

  // Get activity data of the current user
  // [{"date": "2025-06-06", "exercise_name": "Deadlift",
  //  "exercise_reps": 5, "exercise_weight": 100, "id": 2, "user_id": 2}]

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const { logout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState({
    exercise_name: '',
    exercise_reps: '',
    exercise_weight: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
  });

  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      const res = await ActivityServices.getActivities();
      if (res.status >= 200 && res.status < 300) {
        console.log("API response:", res.data);
        setActivityData(res.data);
        setLoading(false);
      } else if (res.status === 401) {
        console.error("Unauthorized access - please log in.");
        setError("Unauthorized access - please log in.");
        logout();
        return;
      } else {
        console.error("Error fetching activity data:", res.error);
        setError(res.error);
        setLoading(false);
      }
    };
    fetchActivityData();
  }, []);

  const onAddActivity = async () => {

    const res = await ActivityServices.postActivity(newActivity);
    if (res.status >= 200 && res.status < 300) {
      console.log("Activity added successfully:", res.data);
      setActivityData(prevData => [...prevData, res.data]);
    } else if (res.status === 401) {
      console.error("Unauthorized access - please log in.");
      setError("Unauthorized access - please log in.");
      logout();
      return;
    } else if (res.status === 422) {
      console.error("Validation error:", res.error);
      const inputMsg = res.invalidInput !== undefined
        ? `\nInvalid input: ${res.invalidInput}`
        : '';
      Alert.alert(
        "Validation Error",
        `${res.error}${inputMsg}\nPlease check your input and try again.`
      );
      return;
    } else {
      console.error("Error adding activity:", res.error);
      Alert.alert(`Error adding activity: ${res.error}`);
    }

  }

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
      <View style={styles.header}>
        <Text style={styles.title}>Activity Screen</Text>
        <Text style={styles.subtitle}>Track your activities here!</Text>
      </View>

      <View style={{ flex: 1 }}>
        <ActivityList activitydata={activityData} />
      </View>

      <TouchableOpacity style={styles.activityButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.activityButtonText}>Add Activity</Text>
      </TouchableOpacity>

      {/* Modal for adding new activity */}
      <AddActivityModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        onAddActivity={onAddActivity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 4,
  },
  activityButton: {
    position: 'sticky',
    bottom: 15,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 34,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  activityButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
})