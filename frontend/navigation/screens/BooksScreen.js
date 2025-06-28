import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/assets/colors';
import BookServices from "@/services/BookServices"
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';

export default function BooksScreen() {
    const [books, setBooks] = useState([]);
    const [modalVisible, setmodalVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const res = await BookServices.getBook();
            setLoading(false);
            if (res.status === 200) {
                console.log("Fetching book data Successfully");
                setBooks(res.data)
            }
            else {
                console.error("Error book data", res.data);
                setError(res.error);
            }
        }
        loadData();
    }, [])


    const handleDelete = async (id) => {
        const res = await BookServices.deleteBook(id);
        if (res.status === 200) {
            console.log("Succesfully deleted", res.data);
            setBooks(books.filter((item) => item.id !== id));
            return;
        } else {
            console.error("Error deleting data");
            setError("Error deleting data");
        }
    };

    const handleSelect = (book) => {
        //Create select logic
    };

    const handleConfigure = (book) => {
        //Create Config button
    };

    const handleAdd = async (newBook) => {
        if (!newBook.book_name || !newBook.last_page) {
            console.warn("Missing book name or pages");
            Alert.alert("Please enter both book name and pages.");
            return false;
        }

        setLoading(true);
        const res = await BookServices.postBook(newBook);
        setLoading(false);

        if (res.status == 200) {
            console.log("Succesfully posted newBook", res.data)
            setBooks(prev => [...prev, res.data]);
            return true;
        } else if (res.status === 400) {
            console.error("This book already in your collection")
            Alert.alert("This book already in your collection")
            return false;
        }
        else {
            Alert.alert(res.error)
            return false;
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.bookItem}
            onPress={() => handleSelect(item)}
        >
            <View>
                <Text style={styles.bookTitle}>{item.book_name}</Text>
                <Text style={styles.bookSubtitle}>📄 {item.last_page} pages</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleConfigure(item)}
                >
                    <Ionicons name="settings-outline" size={22} color={colors.accent} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const AddBookModal = ({ modalVisible, setmodalVisible, handleAdd }) => {
        const [bookName, setBookName] = useState('');
        const [lastPage, setLastPage] = useState('');
        return (
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setmodalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/*TextInputs later */}

                        <TextInput
                            style={styles.input}
                            placeholder='Book name'
                            placeholderTextColor={colors.muted}
                            value={bookName}
                            onChangeText={setBookName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder='Max pages'
                            placeholderTextColor={colors.muted}
                            value={lastPage}
                            onChangeText={setLastPage}
                            keyboardType='numeric'
                        />

                        {/*TextInputs later */}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setmodalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.addButtonModal}
                                onPress={() => {
                                    handleAdd({
                                        book_name: bookName,
                                        last_page: lastPage,
                                    });
                                    setmodalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Add Book</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    if (error) {
        return <ErrorScreen error={error}/>
    }
    
    else if (loading) {
        return <LoadingScreen/>
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📚 My Books</Text>
                <Text style={styles.subtitle}>Explore your favorite books here!</Text>
            </View>

            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={{ marginTop: 20 }}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setmodalVisible(true)}>
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            <AddBookModal
                modalVisible={modalVisible}
                setmodalVisible={setmodalVisible}
                handleAdd={handleAdd}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        marginTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 15,
        color: colors.muted,
        marginTop: 4,
    },
    bookItem: {
        backgroundColor: colors.lightGray,
        padding: 16,
        marginVertical: 8,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text
    },
    bookSubtitle: {
        fontSize: 14,
        color: colors.muted,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 6,
        borderRadius: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: colors.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    //Modal Styles 
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: colors.accent,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonModal: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});