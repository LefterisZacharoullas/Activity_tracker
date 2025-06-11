import { useAuth } from '../context/AuthContext';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../assets/colors';

const HeaderLogout = () => {
  const { logout } = useAuth();
  return (
    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}

export default HeaderLogout;

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    backgroundColor: colors.accent,
    marginRight: 10,
    borderRadius: 12,
  },
  logoutText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});