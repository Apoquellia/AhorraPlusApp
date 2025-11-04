import React from "react";
import { 
  Text, 
  StyleSheet, 
  View, 
  Pressable, 
  Image 
} from "react-native";


export function HeaderApp() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>AHORRA + APP</Text>

      <Pressable
        onPress={() => alert("¡Notificaciones!")}
        style={({ pressed }) => [
          styles.btnPressable,
          pressed && styles.btnPressed,
        ]}
      >
        <Image
          source={require("../assets/icons/notificacion.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}


export function FooterApp() {
  return (
    <View style={styles.footerContainer}>
      <Pressable
        onPress={() => alert("¡Presupuesto!")}
        style={({ pressed }) => [
          styles.btnPressable,
          pressed && styles.btnPressed,
        ]}
      >
        <Image
          source={require("../assets/icons/presupuesto.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </Pressable>

     
      <Pressable
        onPress={() => alert("¡Gráficas!")}
        style={({ pressed }) => [
          styles.btnPressable,
          pressed && styles.btnPressed,
        ]}
      >
        <Image
          source={require("../assets/icons/graficas.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </Pressable>

  
      <Pressable
        onPress={() => alert("¡Configuración!")}
        style={({ pressed }) => [
          styles.btnPressable,
          pressed && styles.btnPressed,
        ]}
      >
        <Image
          source={require("../assets/icons/engranaje.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}


export default function GraficosScreen() {
  return (
    <View style={styles.container}>
      <HeaderApp />

      <View style={styles.content}>
        <Text style={styles.title}>Gráfica Mensual de Gastos</Text>
        <Image
          source={require("../assets/grafica.png")}
          style={{ width: 250, height: 250 }}
          resizeMode="contain"
        />
      </View>

      
      <FooterApp />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA", // color del fondo de la pantalla
    justifyContent: "space-between", // header arriba y footer abajo
  },


  headerContainer: {
    backgroundColor: "#4A148C", // morado oscuro
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  // FOOTER
  footerContainer: {
    backgroundColor: "#311B92", // color diferente al header
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  // CONTENIDO CENTRAL
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#000000",
  },

  // BOTONES
  btnPressable: {
    backgroundColor: "#212221",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.3)", 
  },
  btnPressed: {
    backgroundColor: "#FFFFFF",
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
    boxShadow: "0px 2px 3px rgba(0,0,0,0.2)",
  },
});
