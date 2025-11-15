import React, { useState } from "react";
import {
  View, Image, Text, TextInput, Alert,
  TouchableOpacity, StyleSheet
} from 'react-native';
import AppLogo from './../assets/money.png';

const RecuperarContrasenia = () => {
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);

  const esCorreoValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
const manejarRecuperacion = () => {
  if (!mostrarCodigo) {
    if (!correo) {
      Alert.alert("Error", "Debe llenar el campo.");
      return;
    }
    if (!esCorreoValido(correo)) {
      Alert.alert("Error", "Correo inválido.");
      return;
    }
    Alert.alert("Correo enviado", "Revisa tu bandeja de entrada para el código.");
    setMostrarCodigo(true);
  } else {
    if (!codigo) {
      Alert.alert("Campo vacío", "Por favor ingrese el código de verificación.");
      return;
    }
    Alert.alert("Código recibido", "Ahora puedes establecer una nueva contraseña.");
  }
};

  return (
    <View style={styles.fullContainer}>
      {mostrarCodigo && (
        <TouchableOpacity style={styles.backButton} onPress={() => setMostrarCodigo(false)}>
          <Text style={styles.backArrow}>← Regresar</Text>
        </TouchableOpacity>
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Image source={AppLogo} style={styles.logo} />

        {!mostrarCodigo ? (
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Ingrese código"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />
        )}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={manejarRecuperacion}
        >
          <Text style={styles.buttonText}>
            {mostrarCodigo ? "Verificar código" : "Enviar correo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 16,
    color: '#6000EA',
    textDecorationLine: 'underline',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
    gap: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6000EA',
  },
  input: {
    width: '80%',
    fontSize: 20,
    height: 60,
    borderWidth: 1,
    color: '#fff',
    borderColor: '#6000EA',
    padding: 12,
    borderRadius: 9,
    backgroundColor: '#ffffff3a'
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
});

export default RecuperarContrasenia;