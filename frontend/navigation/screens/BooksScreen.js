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
    Pressable,
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
    const [SelectedBook, setSelectedBook] = useState([]);
    const [modalVisibleConfirm, setmodalVisibleConfirm] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const res = await BookServices.getBook();
            setLoading(false);
            if (res.status === 200) {
                console.log("Fetching book data Successfully", res.data);
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
        const isSelected = SelectedBook.some(selected => selected.id === book.id);
        if (isSelected) {
            setSelectedBook([]); // Deselect if already selected
        } else {
            setSelectedBook([book]); // Select only this one
        }
    };

    const handleConfigure = async (updatedBook) => {
        if (!updatedBook.book_name || !updatedBook.last_page) {
            Alert.alert("Please fill in all fields.");
            return;
        }
        console.log("The updating data", updatedBook)
        const res = await BookServices.updateBook(updatedBook.id, updatedBook);
        if (res.status === 200) {
            setBooks(prevData => prevData.map(item => item.id === updatedBook.id ? res.data : item));
            console.log("Book updated:", res.data);
        } else if (res.status === 400) {
            Alert.alert("This book already in your collection please delete the book")
        }


        else {
            Alert.alert("Failed to update book.");
        }
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

    const handleConfirm = async (bookFinished, pagesRead) => {
        if (pagesRead.pages_read == "" || pagesRead.pages_read <= 0) {
            Alert.alert("Please enter a valid number of pages read.");
            return;
        } else if (bookFinished === null) {
            Alert.alert("Please select whether you finished the book or not.");
            return;
        }

        setLoading(true);
        // 2 for finished, 1 for not finished
        const res = await BookServices.postBookProgress(SelectedBook[0].id, bookFinished ? 3 : 2, pagesRead);
        setLoading(false);
        if (res.status === 200) {
            console.log("Book progress updated successfully", res.data);
            setmodalVisible(false);
            Alert.alert("Book progress updated successfully", 
                `You have read ${pagesRead.pages_read} in the book called ${SelectedBook[0].book_name} on ${pagesRead.date}.`);
        } else {
            Alert.alert("Error updating book progress", res.error || "An error occurred");
            setmodalVisible(false);
        }

    }

    const BookItem = ({ item, handleDelete, handleSelect, handleConfigure, SelectedBook }) => {
        const [modalVisibleConfig, setmodalVisibleConfig] = useState(false);
        const [configBook, setConfigBook] = useState({
            id: item.id,
            book_name: item.book_name,
            last_page: item.last_page,
        })
        const isSelected = SelectedBook.some(selected => selected.id === item.id);

        return (
            <TouchableOpacity
                style={[styles.bookItem, isSelected && { backgroundColor: "lightgreen" }]}
                onPress={() => handleSelect(item)}
            >
                <View>
                    <Text style={styles.bookTitle}>{item.book_name}</Text>
                    <Text style={styles.bookSubtitle}>📄 {item.last_page} pages</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                            setmodalVisibleConfig(true)
                        }}
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

                <ConfigBook
                    modalVisibleConfig={modalVisibleConfig}
                    setmodalVisibleConfig={setmodalVisibleConfig}
                    handleConfigure={handleConfigure}
                    configBook={configBook}
                    setConfigBook={setConfigBook}
                />
            </TouchableOpacity>
        )
    }

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

    const ConfigBook = ({ modalVisibleConfig, setmodalVisibleConfig, handleConfigure, configBook, setConfigBook }) => {
        return (
            <Modal
                visible={modalVisibleConfig}
                animationType="slide"
                transparent
                onRequestClose={() => setmodalVisibleConfig(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder='Book name'
                            placeholderTextColor={colors.muted}
                            value={configBook.book_name}
                            onChangeText={text => setConfigBook({ ...configBook, book_name: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder='Max pages'
                            placeholderTextColor={colors.muted}
                            value={String(configBook.last_page)}
                            onChangeText={text => setConfigBook({ ...configBook, last_page: text })}
                            keyboardType='numeric'
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setmodalVisibleConfig(false)}
                            >
                                <Text> Cancel </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.addButtonModal}
                                onPress={() => {
                                    handleConfigure(configBook)
                                    setmodalVisibleConfig(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Add Book</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>
        )
    }

    const ConfirmBookModal = ({ modalVisible, setmodalVisible, handleConfirm }) => {
        const [pagesRead, setPagesRead] = useState({
            "pages_read": "",
            "date": new Date().toISOString().split('T')[0],
        });
        const [bookFinished, setBookFinished] = useState(null); // null, true or false

        return (
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setmodalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 20 }}>Confirm Selection</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='Enter pages read'
                            placeholderTextColor={colors.muted}
                            keyboardType='numeric'
                            value={String(pagesRead.pages_read)}
                            onChangeText={text => setPagesRead({ ...pagesRead, pages_read: parseInt(text) })}
                        />

                        <Text style={{ marginTop: 10, color: colors.muted }}>
                            Did you finish your book?
                        </Text>

                        <View style={styles.selectionContainer}>
                            <Pressable
                                style={[
                                    styles.option,
                                    bookFinished === true && styles.selectedOption,
                                ]}
                                onPress={() => setBookFinished(true)}
                            >
                                <Text style={styles.optionText}>Yes</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.option,
                                    bookFinished === false && styles.selectedOption,
                                ]}
                                onPress={() => setBookFinished(false)}
                            >
                                <Text style={styles.optionText}>No</Text>
                            </Pressable>
                        </View>

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
                                    handleConfirm(bookFinished, pagesRead);
                                    setmodalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (error) {
        return <ErrorScreen error={error} />
    }

    else if (loading) {
        return <LoadingScreen />
    }

    //Main 
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📚 My Books</Text>
                <Text style={styles.subtitle}>Explore your favorite books here!</Text>
            </View>

            <FlatList
                data={books}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => <BookItem
                    item={item}
                    handleDelete={handleDelete}
                    handleSelect={handleSelect}
                    handleConfigure={handleConfigure}
                    SelectedBook={SelectedBook}
                />
                }
                style={{ marginTop: 20 }}
            />

            <View style={styles.fabContainer}>
                {SelectedBook.length > 0 && (
                    <TouchableOpacity style={styles.confirmButton} onPress={() => setmodalVisibleConfirm(true)}>
                        <Text style={styles.buttonText}>Confirm Selection</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.addButton} onPress={() => setmodalVisible(true)}>
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>

            <AddBookModal
                modalVisible={modalVisible}
                setmodalVisible={setmodalVisible}
                handleAdd={handleAdd}
            />

            <ConfirmBookModal
                modalVisible={modalVisibleConfirm}
                setmodalVisible={setmodalVisibleConfirm}
                handleConfirm={handleConfirm}
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
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    confirmButton: {
        marginRight: 44,
        height: 55,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: colors.primary,
    },
    addButton: {
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
    //Confirm Book Modal Styles
    input: {
        borderWidth: 1,
        borderColor: colors.muted,
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    selectionContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.muted,
        borderRadius: 6,
    },
    selectedOption: {
        backgroundColor: colors.selected,
        borderColor: colors.primary,
    },
    optionText: {
        color: colors.primary,
    },
});