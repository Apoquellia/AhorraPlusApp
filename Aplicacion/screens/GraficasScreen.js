import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  ScrollView,
} from 'react-native';

export default function HeaderApp(){
    return (<View>
        <Text style={styles.header}> AHORRA + APP</Text> 
        <Pressable
          onPress={() => alert("notificaciones!")}
          style={({ pressed }) => [
            styles.btnPressable,
            pressed && styles.btnPressed,
          ]}
        >
          <Image
            source={require("../assets/icons/notification.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"// mantiene las proporciones del icono 
          />
        </Pressable>

    </View>
    );

}

export default function FooterApp(){
  return(<View>

    <Pressable //Boton de presupuesto
          onPress={() => alert("Presupuesto!")} 
          style={({ pressed }) => [
            styles.btnPressable,
            pressed && styles.btnPressed,
          ]}
        >
          <Image
            source={require("../assets/icons/presupuesto.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"// mantiene las proporciones del icono 
          />
        </Pressable>

    <Pressable //Boton de Graficas
          onPress={() => alert("Graficas!")} 
          style={({ pressed }) => [
            styles.btnPressable,
            pressed && styles.btnPressed,
          ]}
        >
          <Image
            source={require("../assets/icons/graficas.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"// mantiene las proporciones del icono 
          />
        </Pressable>

    <Pressable //Boton de Configuracion
          onPress={() => alert("Configuración!")} 
          style={({ pressed }) => [
            styles.btnPressable,
            pressed && styles.btnPressed,
          ]}
        >
          <Image
            source={require("../assets/icons/engranaje.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"// mantiene las proporciones del icono 
          />
        </Pressable>



  </View>)


}

export default function GraficosScreen(){
  <View>
    <Text style = {styles.title} > Gráfica Mensual de Gastos</Text>
   
  </View>

}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffffff", // Color de fondo de toda la pantalla
    alignItems: "center",        // Centra horizontalmente los elementos dentro del container
    justifyContent: "flex-start",// Alinea verticalmente los elementos desde arriba
    padding: 20,                 // Espacio interno alrededor del contenido
    paddingTop: 50,              // Espacio extra en la parte superior
  },
  header: {
    fontSize: 22,                // Tamaño de letra del encabezado
    fontWeight: "bold",          // Pone el texto en negrita
    marginBottom: 20,            // Espacio debajo del encabezado
    color: "#333",               // Color del texto
    textAlign: "center",         // Centra el texto horizontalmente
  },

  footer: {
    fontSize: 22,                // Tamaño de letra del encabezado
    fontWeight: "bold",          // Pone el texto en negrita
    marginBottom: 20,            // Espacio debajo del encabezado
    color: "#333",               // Color del texto
    textAlign: "center",         // Centra el texto horizontalmente
  },

  title: {
    fontWeight: "bold",          // Título de cada sección en negrita
    marginTop: 20,               // Espacio arriba del título
    marginBottom: 5,             // Espacio debajo del título
    color: "#333",               // Color del texto
  },
  text: {
    color: "white",              // Color del texto dentro de los botones
    fontWeight: "600",           // Grosor del texto para que resalte
  },

  btnPressable: {
    backgroundColor: "#212221ff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },

  btnPressed: {
    backgroundColor: "#ffffffff",
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

});