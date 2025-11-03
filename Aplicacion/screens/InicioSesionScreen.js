import React, { useState } from "react";
import { 
  View, Image, Text, TextInput, Alert, 
TouchableOpacity, StyleSheet 
} from 'react-native'; 
import AppLogo from './../assets/money.png';

const InicioSesion = () => {
  const [Usuario, setUsuario] = useState('');
  const [Contraseña, setContraseña] = useState('');

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

  return (
    <View style={styles.fullContainer}> 
      <View style={styles.container}>
        <Text style={styles.title}>Ahorra+ App</Text>

        <Image source={AppLogo} style={styles.logo} />

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={Usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={Contraseña}
          onChangeText={setContraseña}
          secureTextEntry={true}
        />

        <Text style={styles.Restablecer}>¿Olvidó su contraseña?</Text>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={validarCredenciales}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80, 
    backgroundColor: '#ffffff',
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
    color: '#6000EA',
  },
  input: {
    width: '80%',
    fontSize: 20,
    height: 60,
    borderWidth: 1, 
    color: '#000',
    borderColor: '#6000EA',
    padding: 12,
    borderRadius: 9,
    backgroundColor: '#6200ea3a'
  },
  Restablecer: { 
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14,
    color: '#6000EA', 
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
});

export default InicioSesion;
