import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function RecuperarContrasena({navigation}) {
  const [contrasena, setContrasena] = useState('');
  const [confContrasena, setConfContrasena] = useState('');

  const validar = () => {
    if (!contrasena || !confContrasena) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (contrasena !== confContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    Alert.alert("Éxito", "La contraseña se ha actualizado");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Restablecer Contraseña</Text>

      <TextInput 
        style={styles.input}
        placeholder="Ingresa tu nueva contraseña"
        placeholderTextColor="#cccccc"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
        autoCapitalize="none"
      />

      <TextInput 
        style={styles.input}
        placeholder="Confirma la contraseña"
        placeholderTextColor="#cccccc"
        secureTextEntry
        value={confContrasena}
        onChangeText={setConfContrasena}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.boton} onPress={validar}>
        <Text style={styles.textoBoton}>Restablecer Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.cancelarBoton}
      onPress={() => navigation.goBack()}
      >
        <Text style={[styles.cancelarBoton, { marginTop: 20 }]}>Cancelar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000"
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center"
  },
  input: {
    width: "80%",
    fontSize: 18,
    height: 50,
    borderWidth: 1,
    borderColor: "#6000EA",
    borderRadius: 9,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 12,
    marginBottom: 15
  },
  boton: {
    backgroundColor: "#6000EA",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  cancelarBoton: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 18,
    color: '#bb86fc',
    textDecorationLine: 'underline',
  },
});
