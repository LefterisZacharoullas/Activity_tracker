import { View, Text, StyleSheet } from 'react-native';
import colors from "../../assets/colors";

const ErrorScreen = ({ error }) => {
    const errorMessage =
        typeof error === 'string'
            ? error
            : error?.message || 'An unexpected error occurred.';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>{errorMessage}</Text>
        </View>
    );
};

export default ErrorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        lineHeight: 22,
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
    },
});
