import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import images from "@/assets/images";
import colors from '@/assets/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, to the Activity tracker app</Text>
      <Image source={images.notes} style={styles.image}/>

      <TouchableOpacity onPress={() => console.log("Button Pressed")}>
        <Text style={styles.buttontext}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    pading: 20,
    fontSize: 24,
    color: colors.text,
  },
  image: {
    width: 200,
    height: 200,
  },
  buttontext: {
    fontSize: 24,
    color: colors.background,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});