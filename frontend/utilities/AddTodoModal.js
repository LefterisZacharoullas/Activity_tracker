import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import colors from "@/assets/colors"

const AddTodoModal = ({ modalVisible, setModalVisible, newTodo, setnewTodo, onAddTodo }) => {
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Todo</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Your task"
                        value={newTodo.text}
                        onChangeText={(value) => setnewTodo({ ...newTodo, text: value })}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.addButton} onPress={() => {
                            onAddTodo(newTodo);
                            setnewTodo({
                                text: "",
                                date_created: new Date().toISOString().split('T')[0], // Reset date to today
                            });
                            setModalVisible(false);
                        }}>
                            <Text style={styles.buttonText}>Add Todo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default AddTodoModal

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