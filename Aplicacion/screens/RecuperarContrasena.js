import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const RecuperarContrasena = () => {
  const [contrasena, setContrasena] = useState('');
  const [confContrasena, setConfContrasena] = useState('');

  const validar = () => {
    if (contrasena === '' || confContrasena === '' ){
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (contrasena!== confContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    Alert.alert (
      "Éxito", 
      "La contraseña se ha actualizado",
      [{ text: "OK"}]
    );

  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Restablecer Contraseña</Text>

        <TextInput 
          style={styles.input}
          placeholder="Ingresa tu nueva contraseña"
          secureTextEntry
          placeholderTextColor="#cccccc"
          value={contrasena}
          onChangeText={setContrasena}
          autoCapitalize="none"
        />

        <TextInput 
          style={styles.input}
          placeholder="Confirma la contraseña"
          secureTextEntry
          placeholderTextColor="#cccccc"
          value={confContrasena}
          onChangeText={setConfContrasena}
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.RestablecerBoton}
          onPress={validar}
        >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Restablecer Contraseña</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create ({
  fullContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  titulo: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
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
    backgroundColor: '#1a1a1a',
    marginBottom: 20
  },
  RestablecerBoton: {
    backgroundColor: '#6000EA', 
    paddingVertical: 12,        
    paddingHorizontal: 40,
    borderRadius: 9,            
    alignItems: 'center',       
    justifyContent: 'center',  
  },
});

export default RecuperarContrasena;
