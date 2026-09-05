import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView,
  Alert, TextInput, Linking, Image, Modal, FlatList, ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// ---------------------------------------------------------
// 1. DICCIONARIO MULTILINGÜE DE 11 IDIOMAS
// ---------------------------------------------------------
const TRANSLATIONS = {
  es: {
    title: '🧹 InspectorClean',
    subtitle: 'Daniel Leyva Services - Gestión Operativa',
    user: 'Usuario:',
    pass: 'Contraseña:',
    loginBtn: 'Iniciar Sesión',
    forgotPass: '¿Olvidaste tu contraseña? Contactar Soporte',
    welcome: 'Bienvenido',
    logout: '🚪 Cerrar Sesión',
    back: '⬅️ Volver',
    save: '💾 Guardar',
    cancel: 'Cancelar',
    cartera: '📁 Cartera General de Contratos',
    createContract: '🏢 Crear / Editar Contrato',
    reports: '📊 Reportes de Evaluación',
    takePhoto: '📷 Tomar Foto Real con Cámara',
    photoAttached: '✅ Foto Capturada y Adjunta',
    sendEvidence: '📤 Generar PDF y Compartir Reporte',
    btnVerPersonal: '👥 Lista de Personal',
    btnAltaPersonal: '👤 Gestión de Usuarios',
    btnAlertaAdmin: '✉️ Solicitudes y Mensajes',
  },
  en: {
    title: '🧹 InspectorClean',
    subtitle: 'Daniel Leyva Services - Operations Management',
    user: 'Username:',
    pass: 'Password:',
    loginBtn: 'Log In',
    forgotPass: 'Forgot password? Contact Support',
    welcome: 'Welcome',
    logout: '🚪 Log Out',
    back: '⬅️ Back',
    save: '💾 Save',
    cancel: 'Cancel',
    cartera: '📁 Contract Portfolio',
    createContract: '🏢 Create / Edit Contract',
    reports: '📊 Evaluation Reports',
    takePhoto: '📷 Take Photo',
    photoAttached: '✅ Photo Attached',
    sendEvidence: '📤 Export PDF & Share',
    btnVerPersonal: '👥 Staff List',
    btnAltaPersonal: '👤 User Management',
    btnAlertaAdmin: '✉️ Requests & Messages',
  },
  fr: {
    title: '🧹 InspectorClean',
    subtitle: 'Daniel Leyva Services - Gestion Opérationnelle',
    user: 'Nom d\'utilisateur:',
    pass: 'Mot de passe:',
    loginBtn: 'Se connecter',
    forgotPass: 'Mot de passe oublié? Contacter le support',
    welcome: 'Bienvenue',
    logout: '🚪 Déconnexion',
    back: '⬅️ Retour',
    save: '💾 Enregistrer',
    cancel: 'Annuler',
    cartera: '📁 Portefeuille de Contrats',
    createContract: '🏢 Créer / Modifier Contrat',
    reports: '📊 Rapports d\'Évaluation',
    takePhoto: '📷 Prendre una photo',
    photoAttached: '✅ Photo attachée',
    sendEvidence: '📤 Exporter PDF et Partager',
    btnVerPersonal: '👥 Liste du Personnel',
    btnAltaPersonal: '👤 Gestion des Utilisateurs',
    btnAlertaAdmin: '✉️ Demandes et Messages',
  },
  ar: {
    title: '🧹 InspectorClean',
    subtitle: 'Daniel Leyva Services - إدارة العمليات',
    user: 'اسم المستخدم:',
    pass: 'كلمة المرور:',
    loginBtn: 'تسجيل الدخول',
    forgotPass: 'هل نسيت كلمة المرور؟ اتصل بالدعم',
    welcome: 'مرحبا بك',
    logout: '🚪 خروج',
    back: '⬅️ عودة',
    save: '💾 حفظ',
    cancel: 'إلغاء',
    cartera: '📁 العقود',
    createContract: '🏢 عقد جديد',
    reports: '📊 التقارير',
    takePhoto: '📷 التقاط صورة',
    photoAttached: '✅ تم إرفاق الصورة',
    sendEvidence: '📤 تصدير PDF ومشاركة',
    btnVerPersonal: '👥 قائمة الموظفين',
    btnAltaPersonal: '👤 إدارة المستخدمين',
    btnAlertaAdmin: '✉️ الطلبات والرسائل',
  }
};

export default function App() {
  const [lang, setLang] = useState('es');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const handleLogin = () => {
    if (user.trim() !== '' && pass.trim() !== '') {
      setIsLogged(true);
    } else {
      Alert.alert('Error', 'Ingresa usuario y contraseña.');
    }
  };

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara.');
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setShowCamera(false);
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <Text style={styles.captureBtnText}>📸 CAPTURAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCamera(false)}>
              <Text style={styles.cancelBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isLogged ? (
        <ScrollView contentContainerStyle={styles.loginContainer}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>

          <View style={styles.langContainer}>
            {['es', 'en', 'fr', 'ar'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.langBtn, lang === item && styles.langBtnActive]}
                onPress={() => setLang(item)}
              >
                <Text style={styles.langText}>{item.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t.user}</Text>
          <TextInput
            style={styles.input}
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />

          <Text style={styles.label}>{t.pass}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={pass}
            onChangeText={setPass}
          />

          <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
            <Text style={styles.btnPrimaryText}>{t.loginBtn}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Soporte', 'Contacta a daniel.leyvaservices@gmail.com')}>
            <Text style={styles.forgotText}>{t.forgotPass}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>{t.welcome}, {user}</Text>
            <TouchableOpacity style={styles.btnLogout} onPress={() => setIsLogged(false)}>
              <Text style={styles.btnLogoutText}>{t.logout}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuGrid}>
            <TouchableOpacity style={styles.cardBtn}>
              <Text style={styles.cardBtnText}>{t.cartera}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardBtn}>
              <Text style={styles.cardBtnText}>{t.createContract}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardBtn}>
              <Text style={styles.cardBtnText}>{t.reports}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardBtn} onPress={handleTakePhoto}>
              <Text style={styles.cardBtnText}>{t.takePhoto}</Text>
            </TouchableOpacity>
          </View>

          {photoUri && (
            <View style={styles.photoPreviewContainer}>
              <Text style={styles.photoAttachedText}>{t.photoAttached}</Text>
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            </View>
          )}

          <TouchableOpacity style={styles.btnSend}>
            <Text style={styles.btnSendText}>{t.sendEvidence}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loginContainer: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  mainContainer: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  langContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  langBtn: { padding: 8, marginHorizontal: 4, borderRadius: 6, backgroundColor: '#e2e8f0' },
  langBtnActive: { backgroundColor: '#2563eb' },
  langText: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginTop: 4, backgroundColor: '#fff' },
  btnPrimary: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgotText: { color: '#64748b', textAlign: 'center', marginTop: 16, fontSize: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  btnLogout: { backgroundColor: '#ef4444', padding: 8, borderRadius: 6 },
  btnLogoutText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  menuGrid: { gap: 12 },
  cardBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  cardBtnText: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1, justifyContent: 'flex-end' },
  cameraButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' },
  captureBtn: { backgroundColor: '#22c55e', padding: 16, borderRadius: 50 },
  captureBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#ef4444', padding: 16, borderRadius: 50 },
  cancelBtnText: { color: '#fff', fontWeight: 'bold' },
  photoPreviewContainer: { marginTop: 20, alignItems: 'center' },
  photoAttachedText: { color: '#16a34a', fontWeight: 'bold', marginBottom: 8 },
  previewImage: { width: 200, height: 200, borderRadius: 10 },
  btnSend: { backgroundColor: '#059669', padding: 16, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  btnSendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
