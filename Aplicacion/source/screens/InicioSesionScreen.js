ola vale crees que puedas hacer un commit con este código de InicioSesionScreen? import React, { useState } from "react";
import { View, Image, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import AppLogo from './../../assets/money.png';
import AuthController from '../controllers/AuthController';
import { useAuth } from '../context/AuthContext';

const InicioSesion = ({ navigation }) => {
  const [Usuario, setUsuario] = useState('');
  const [Contraseña, setContraseña] = useState('');
  const [Cargando, setCargando] = useState(false);
  const [Recuperando, setRecuperando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [CorreoRecuperar, setCorreoRecuperar] = useState('');

  const authController = AuthController;
  const { login } = useAuth();

  const validarCredenciales = async () => {
    if (!Usuario || !Contraseña) {
      Alert.alert("Error de acceso", "Ingresa tu Usuario y Contraseña");
      return;
    }

    setCargando(true);

    const res = await authController.login(Usuario, Contraseña);

    setCargando(false);

    if (!res.success) {
      Alert.alert("Error de acceso", res.error || res.message || 'Error');
      return;
    }

    // Guardar usuario en contexto global
    if (login) {
      login(res.data);
    }

    Alert.alert("Bienvenido", `Hola ${res.data.nombre}`);
    navigation.replace("HomeTabs");
  };

  const validarRecuperacion = async () => {
    if (!CorreoRecuperar.includes('@') || !CorreoRecuperar.includes('.')) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return;
    }

    setRecuperando(true);

    const res = await authController.recoverPassword(CorreoRecuperar);

    setRecuperando(false);

    if (!res.success) {
      Alert.alert("Error", res.error || res.message || 'Error');
      return;
    }

    setModalVisible(false);

    Alert.alert(
      "Usuario encontrado",
      `Tu nombre de usuario es: ${res.data.username}. Procede a restablecer tu contraseña.`
    );

    navigation.navigate("Restablecer", {
      userId: res.data.id,
    });
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Ahorra+ App</Text>

        <Image source={AppLogo} style={styles.logo} />

        <Text style={styles.subtitle}>Bienvenido</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#cccccc"
          value={Usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          editable={!Cargando}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#cccccc"
          value={Contraseña}
          onChangeText={setContraseña}
          secureTextEntry={true}
          autoCapitalize="none"
          editable={!Cargando}
        />

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.Restablecer}>¿Olvidó su contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, Cargando && styles.loginButtonDisabled]}
          onPress={validarCredenciales}
          disabled={Cargando}
        >
          {Cargando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.Restablecer}>¿No tienes cuenta? Crear cuenta</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Recuperar Contraseña</Text>
            <Text style={styles.modalSubtitle}>Ingresa tu correo para verificar.</Text>

            <TextInput
              style={styles.inputModal}
              placeholder="Correo Electrónico"
              placeholderTextColor="#cccccc"
              value={CorreoRecuperar}
              onChangeText={setCorreoRecuperar}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!Recuperando}
            />

            <TouchableOpacity
              style={[styles.modalButton, Recuperando && styles.loginButtonDisabled]}
              onPress={validarRecuperacion}
              disabled={Recuperando}
            >
              {Recuperando ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Verificar Correo</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.Restablecer, { marginTop: 20 }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: '#000'
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#cccccc',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    fontSize: 20,
    height: 60,
    borderWidth: 1,
    color: '#ffffff',
    borderColor: '#6000EA',
    padding: 12,
    borderRadius: 9,
    backgroundColor: '#1a1a1a'
  },
  Restablecer: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14,
    color: '#bb86fc',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#6000EA',
    paddingVertical: 12,
    paddingHorizontal: 90,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginButtonDisabled: {
    backgroundColor: '#444'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputModal: {
    width: '100%',
    fontSize: 18,
    height: 50,
    borderWidth: 1,
    color: '#ffffff',
    borderColor: '#6000EA',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    marginBottom: 15
  },
  modalButton: {
    backgroundColor: '#6000EA',
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default InicioSesion;