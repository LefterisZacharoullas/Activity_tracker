import MainContainer from "@/navigation/MainContainer";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthScreen from "@/navigation/screens/AuthScreen";

import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

function LayoutContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#1e90ff" />
          <Text style={styles.text}>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  console.log("isAuthenticated:", isAuthenticated);
  return isAuthenticated ? <MainContainer /> : <AuthScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 20,
    color: '#1e90ff',
    fontWeight: '500',
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}