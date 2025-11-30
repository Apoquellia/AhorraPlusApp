import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import controller from "../controllers/AuthController"; 

export default function RecuperarContrasena({ navigation, route }) {
  const { userId } = route.params;  

  const [contrasena, setContrasena] = useState('');
  const [confContrasena, setConfContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const actualizarPassword = async () => {
    if (!contrasena || !confContrasena) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (contrasena !== confContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (contrasena.length < 6) {  
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);

    const respuesta = await controller.resetPassword(
      userId,
      contrasena,
      confContrasena
    );

    setCargando(false);

    if (!respuesta.success) {
      Alert.alert("Error", respuesta.error);
      return;
    }

    Alert.alert(
  "Éxito",
  "La contraseña ha sido actualizada correctamente",
  [{
    text: "OK",
    onPress: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }]
);
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
      />

      <TextInput 
        style={styles.input}
        placeholder="Confirma la contraseña"
        placeholderTextColor="#cccccc"
        secureTextEntry
        value={confContrasena}
        onChangeText={setConfContrasena}
      />

      <TouchableOpacity style={styles.boton} onPress={actualizarPassword}>
        <Text style={styles.textoBoton}>
          {cargando ? "Actualizando..." : "Restablecer Contraseña"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelarBoton}>Cancelar</Text>
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
    marginTop: 20,
    fontSize: 18,
    color: '#bb86fc',
    textDecorationLine: 'underline',
  },
});
