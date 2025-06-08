import { View, Text, StyleSheet } from 'react-native';

export default function BooksScreen() {
    return (
        <View style={styles.container}>
            <Text 
            style={styles.title}
            onPress={() => navigation.navigate('Home')}>
                Books Screen
            </Text>
            <Text style={styles.subtitle}>Explore your favorite books here!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
});