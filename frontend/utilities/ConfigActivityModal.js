import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import colors from '../assets/colors';

const ConfigActivityModal = ({ modalVisible, setModalVisible, configActivity, setConfigActivity, onConfigActivity }) => {
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Configure Activity</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Exercise Name"
                        value={configActivity.exercise_name}
                        onChangeText={text => setConfigActivity({ ...configActivity, exercise_name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Reps"
                        keyboardType='numeric'
                        value={String(configActivity.exercise_reps)}
                        onChangeText={text => setConfigActivity({ ...configActivity, exercise_reps: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Weight (kg)"
                        keyboardType='numeric'
                        value={String(configActivity.exercise_weight)}
                        onChangeText={text => setConfigActivity({ ...configActivity, exercise_weight: text })}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.addButton} onPress={() => {
                            onConfigActivity(
                                configActivity,
                                parseInt(configActivity.exercise_weight),
                                parseInt(configActivity.exercise_reps)
                            );
                            setModalVisible(false);
                        }}>
                            <Text style={styles.buttonText}>Add Activity</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        color: colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 20,
    },
    addButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: colors.accent,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ConfigActivityModal;
