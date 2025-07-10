import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import colors from "@/assets/colors"
import StatsServices from "@/services/StatsServices"
import { formatWeekRange, formatMonthRange } from "@/utilities/FormatWeekRange"

export default function StatsScreen() {
  const [range, setRange] = useState("week")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [range])

  const fetchData = async () => {
    setLoading(true)
    const response = await StatsServices.getUserStats(range)
    setLoading(false)
    if (response.status >= 200 && response.status < 300) {
      setData(response.data)
    } else {
      console.error('Failed to fetch stats:', response)
    }
  }

  const isEmpty =
    data &&
    data.activities?.total_activities === 0 &&
    data.readings?.total_readings === 0

  const formatRange = (key) => {
    const parsedKey = parseInt(key)
    return range === "week"
      ? formatWeekRange(parsedKey)
      : formatMonthRange(parsedKey)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your {range} Summary</Text>

      <View style={styles.toggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            range === 'week' && styles.activeToggle,
          ]}
          onPress={() => setRange('week')}
        >
          <Text
            style={[
              styles.toggleText,
              range === 'week' && styles.activeToggleText,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            range === 'month' && styles.activeToggle,
          ]}
          onPress={() => setRange('month')}
        >
          <Text
            style={[
              styles.toggleText,
              range === 'month' && styles.activeToggleText,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : data ? (
        isEmpty ? (
          <View style={styles.card}>
            <Text style={styles.emptyText}>
              No data found for this range.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Workout Summary</Text>
              <Text>Total Activities: {data.activities.total_activities}</Text>
              {Object.entries(data.activities.activities_per_range).map(
                ([key, value]) => (
                  <Text key={key}>
                    {formatRange(key)}: {value} activities
                  </Text>
                )
              )}
              {Object.entries(data.activities.avg_reps_per_range).map(
                ([key, value]) => (
                  <Text key={key}>{formatRange(key)}: {value} reps</Text>
                )
              )}
              {Object.entries(data.activities.avg_weight_per_range).map(
                ([key, value]) => (
                  <Text key={key}>{formatRange(key)}: {value} kg</Text>
                )
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Reading Summary</Text>
              <Text>Total Reading Sessions: {data.readings.total_readings}</Text>
              {Object.entries(data.readings.pages_read_by_range).map(
                ([key, value]) => (
                  <Text key={key}>{formatRange(key)}: {value} pages</Text>
                )
              )}
            </View>
          </>
        )
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  activeToggleText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
})