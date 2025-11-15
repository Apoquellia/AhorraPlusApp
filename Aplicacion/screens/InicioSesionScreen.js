import React, { useState } from "react";
import { View, Image, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Modal, ActivityIndicator} from 'react-native'; 
import AppLogo from './../assets/money.png';

const InicioSesion = ({ onGoToRegister }) => {
  const [Usuario, setUsuario] = useState('');
  const [Contraseña, setContraseña] = useState('');
  const [Cargando, setCargando] = useState(false);
  const [Recuperando, setRecuperando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [CorreoRecuperar, setCorreoRecuperar] = useState('');

  const validarCredenciales = () => {
    if (!Usuario || !Contraseña) {
      Alert.alert("Error de acceso", "Campos incompletos, ingresa tu Usuario y Contraseña");
      return;
    }

    const UsuarioCorrecto = 'TIID 212';
    const ContraseñaCorrecta = 'contrasena123';

    if (Usuario === UsuarioCorrecto && Contraseña === ContraseñaCorrecta) {
      Alert.alert(" Acceso Correcto", "Bienvenido a Ahorra+ App");
    } else {
      Alert.alert("Error de acceso", "Usuario o contraseña incorrectos");
    }
  };

  const validarRecuperacion = async () => {
    if (!CorreoRecuperar.includes('@') || !CorreoRecuperar.includes('.')) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return;
    }

    setRecuperando(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRecuperando(false);

    Alert.alert(
      "Revise su correo",
      "Se ha enviado un correo con instrucciones",
      [{ text: "OK", onPress: () => setModalVisible(false) }]
    );
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
        {/* --- FIN --- */}

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

        <TouchableOpacity onPress={onGoToRegister}>
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
            <Text style={styles.modalSubtitle}>Ingresa tu correo para enviarte un enlace.</Text>

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
                <Text style={styles.modalButtonText}>Enviar Instrucciones</Text>
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