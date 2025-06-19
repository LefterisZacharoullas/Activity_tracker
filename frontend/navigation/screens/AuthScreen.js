import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Authscreen = () => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isregistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(false);

  const handleAuth = async () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password are required.");
      return;
    }
    // Ensure that the users is is on the regirtering page
    if (isregistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let response;
    if (isregistering) {
      response = await register(username, password);
    } else {
      response = await login(username, password);
    }
    if (response?.status === 404) {
      Alert.alert("Network Error, please connect to the internet");
      return;
    }
    else if (response?.error) {
      Alert.alert("Error", response.error);
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isregistering ? "Sign Up" : "Login"}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="grey"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="grey"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="none"
      />

      {isregistering && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="grey"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="none"
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isregistering ? "Register" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegistering(!isregistering)}>
        <Text style={styles.swithtext}>
          {isregistering
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
  },
  swithtext: {
    color: "#1e90ff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
});


export default Authscreen;