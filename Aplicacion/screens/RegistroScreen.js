import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native'; 
import AppLogo from './../assets/money.png';

const RegistroScreen = ({ navigation }) => {
  const [RegNombre, setRegNombre] = useState('');
  const [RegCorreo, setRegCorreo] = useState('');
  const [RegUsuario, setRegUsuario] = useState('');
  const [RegPassword, setRegPassword] = useState('');
  const [Registrando, setRegistrando] = useState(false);

  const validarRegistro = async () => {
    if (!RegNombre || !RegCorreo || !RegUsuario || !RegPassword) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (!RegCorreo.includes("@") || !RegCorreo.includes(".")) {
      Alert.alert("Error", "Correo inválido");
      return;
    }

    setRegistrando(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRegistrando(false);

  Alert.alert(
    "Registro exitoso",
    "Tu cuenta ha sido creada",
    [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  
  };

  return (
    <View style={styles.fullContainer}> 
      <View style={styles.container}>
        <Text style={styles.title}>Ahorra+ App</Text>
        <Image source={AppLogo} style={styles.logo} />
        <Text style={styles.subtitle}>Crear Cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#cccccc"
          value={RegNombre}
          onChangeText={setRegNombre}
          autoCapitalize="words"
          editable={!Registrando}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#cccccc"
          value={RegCorreo}
          onChangeText={setRegCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!Registrando}
        />

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#cccccc"
          value={RegUsuario}
          onChangeText={setRegUsuario}
          autoCapitalize="none"
          editable={!Registrando}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#cccccc"
          value={RegPassword}
          onChangeText={setRegPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          editable={!Registrando}
        />

        <TouchableOpacity
          style={[styles.loginButton, Registrando && styles.loginButtonDisabled]}
          onPress={validarRegistro}
          disabled={Registrando}
        >
          {Registrando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.Restablecer}>¿Ya tienes cuenta? Iniciar Sesión</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40, 
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
  }
});

export default RegistroScreen;