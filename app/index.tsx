import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, 
  Image, Alert, Modal, Share, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [language, setLanguage] = useState<'es' | 'en' | 'fr'>('es');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'jefe1' | 'soporte' | 'inspector' | 'supervisor' | 'operario' | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotName, setForgotName] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotForgotUserPass, setForgotForgotUserPass] = useState(true);

  const [supportRequests, setSupportRequests] = useState<any[]>([]);

  const [inspectionTitle, setInspectionTitle] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const t = {
    es: {
      loginTitle: 'InspectorClean - Iniciar Sesión',
      userPlaceholder: 'Usuario',
      passPlaceholder: 'Contraseña',
      loginBtn: 'Ingresar',
      forgotBtn: '¿Olvidaste tu contraseña?',
      supportTitle: 'Solicitudes de Soporte (Credenciales)',
      takePhoto: 'Tomar Foto de Evidencia',
      exportPdf: 'Exportar / Descargar PDF',
      sendEmail: 'Enviar por Correo a Jefes',
      preview: 'Vista Previa de Inspección',
    },
    en: {
      loginTitle: 'InspectorClean - Login',
      userPlaceholder: 'Username',
      passPlaceholder: 'Password',
      loginBtn: 'Sign In',
      forgotBtn: 'Forgot password?',
      supportTitle: 'Support Requests (Credentials)',
      takePhoto: 'Take Evidence Photo',
      exportPdf: 'Export / Download PDF',
      sendEmail: 'Send Email to Managers',
      preview: 'Inspection Preview',
    },
    fr: {
      loginTitle: 'InspectorClean - Connexion',
      userPlaceholder: 'Utilisateur',
      passPlaceholder: 'Mot de passe',
      loginBtn: 'Se connecter',
      forgotBtn: 'Mot de passe oublié?',
      supportTitle: 'Demandes de support (Identifiants)',
      takePhoto: 'Prendre une photo de preuve',
      exportPdf: 'Exporter / Télécharger PDF',
      sendEmail: 'Envoyer par courriel aux gestionnaires',
      preview: 'Aperçu de l\'inspection',
    }
  }[language];

  const handleLogin = () => {
    const userClean = username.toLowerCase().trim();
    if (userClean === 'soporte') {
      setCurrentUser('Soporte Técnico');
      setRole('soporte');
    } else if (userClean === 'jefe1') {
      setCurrentUser('Supervisor Jefe 1');
      setRole('jefe1');
    } else if (userClean === 'inspector') {
      setCurrentUser('Inspector de Campo');
      setRole('inspector');
    } else if (userClean === 'supervisor') {
      setCurrentUser('Supervisor General');
      setRole('supervisor');
    } else if (userClean === 'operario') {
      setCurrentUser('Operario de Limpieza');
      setRole('operario');
    } else if (username && password) {
      setCurrentUser(username);
      setRole('admin');
    } else {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña.');
    }
  };

  const handleSendForgotRequest = () => {
    if (!forgotName || !forgotPhone) {
      Alert.alert('Atención', 'Por favor ingresa tu nombre completo y teléfono.');
      return;
    }
    const newRequest = {
      id: Date.now(),
      name: forgotName,
      phone: forgotPhone,
      requestType: forgotForgotUserPass ? 'Olvidó usuario y contraseña' : 'Restablecer contraseña',
      date: new Date().toLocaleString()
    };
    setSupportRequests([...supportRequests, newRequest]);
    setShowForgotModal(false);
    setForgotName('');
    setForgotPhone('');
    Alert.alert('Solicitud Enviada', 'Tu mensaje ha sido enviado al equipo de Soporte para su validación en la lista de personal.');
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso requerido', 'Se requiere acceso a la cámara para tomar fotos de evidencia.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedPhotos([...capturedPhotos, result.assets[0].uri]);
    }
  };

  const handleGeneratePdf = async () => {
    if (!inspectionTitle) {
      Alert.alert('Atención', 'Ingresa un título para la inspección.');
      return;
    }

    const photosHtml = capturedPhotos.map(uri => 
      `<img src="${uri}" style="width: 100%; max-width: 300px; margin: 10px 0; border-radius: 8px;" />`
    ).join('');

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #0284c7;">InspectorClean - Reporte de Inspección</h1>
          <p><strong>Usuario / Inspector:</strong> ${currentUser}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <h2>${inspectionTitle}</h2>
          <p><strong>Observaciones:</strong> ${inspectionNotes}</p>
          <h3>Fotografías de Evidencia:</h3>
          ${photosHtml || '<p>No se adjuntaron fotografías.</p>'}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el archivo de reporte.');
    }
  };

  const handleSendEmailWithAttachment = async () => {
    await handleGeneratePdf();
  };

  if (!currentUser) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t.loginTitle}</Text>

        <View style={styles.langContainer}>
          <TouchableOpacity onPress={() => setLanguage('es')} style={[styles.langBtn, language === 'es' && styles.langActive]}>
            <Text style={styles.langText}>ES</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('en')} style={[styles.langBtn, language === 'en' && styles.langActive]}>
            <Text style={styles.langText}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('fr')} style={[styles.langBtn, language === 'fr' && styles.langActive]}>
            <Text style={styles.langText}>FR</Text>
          </TouchableOpacity>
        </View>

        <TextInput 
          style={styles.input} 
          placeholder={t.userPlaceholder} 
          value={username} 
          onChangeText={setUsername} 
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder={t.passPlaceholder} 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.btnText}>{t.loginBtn}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={() => setShowForgotModal(true)}>
          <Text style={styles.linkText}>{t.forgotBtn}</Text>
        </TouchableOpacity>

        <Modal visible={showForgotModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Solicitud a Soporte Técnico</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre Completo" 
                value={forgotName} 
                onChangeText={setForgotName} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Número de Teléfono" 
                keyboardType="phone-pad" 
                value={forgotPhone} 
                onChangeText={setForgotPhone} 
              />
              <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => setForgotForgotUserPass(!forgotForgotUserPass)}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  {forgotForgotUserPass ? '☑' : '☐'} Olvidé mi usuario y contraseña
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleSendForgotRequest}>
                <Text style={styles.btnText}>Enviar mensaje a Soporte</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForgotModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.welcomeText}>Usuario: {currentUser}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setCurrentUser(null)}>
          <Text style={{ color: '#fff' }}>Salir</Text>
        </TouchableOpacity>
      </View>

      {role === 'soporte' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.supportTitle}</Text>
          {supportRequests.length === 0 ? (
            <Text style={styles.emptyText}>No hay solicitudes pendientes de credenciales.</Text>
          ) : (
            supportRequests.map((req) => (
              <View key={req.id} style={styles.card}>
                <Text style={{ fontWeight: 'bold' }}>{req.name}</Text>
                <Text>Teléfono: {req.phone}</Text>
                <Text>Estado: {req.requestType}</Text>
                <Text style={{ fontSize: 11, color: '#666' }}>Recibido: {req.date}</Text>
              </View>
            ))
          )}
        </View>
      )}

      {(role === 'jefe1' || role === 'admin' || role === 'inspector' || role === 'supervisor' || role === 'operario') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Módulo de Inspección y Evidencia</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Título o Área de Inspección" 
            value={inspectionTitle} 
            onChangeText={setInspectionTitle} 
          />
          
          <TextInput 
            style={[styles.input, { height: 80 }]} 
            placeholder="Observaciones y notas de inspección..." 
            multiline 
            value={inspectionNotes} 
            onChangeText={setInspectionNotes} 
          />

          <TouchableOpacity style={styles.cameraBtn} onPress={handleTakePhoto}>
            <Text style={styles.btnText}>📷 {t.takePhoto}</Text>
          </TouchableOpacity>

          <View style={styles.photoGrid}>
            {capturedPhotos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.photoThumb} />
            ))}
          </View>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPreviewModalVisible(true)}>
            <Text style={styles.secondaryText}>👁️ {t.preview}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportBtn} onPress={handleGeneratePdf}>
            <Text style={styles.btnText}>📄 {t.exportPdf}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emailBtn} onPress={handleSendEmailWithAttachment}>
            <Text style={styles.btnText}>✉️ {t.sendEmail}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={previewModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionTitle}>Vista Previa del Reporte</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 5 }}>{inspectionTitle || 'Sin Título'}</Text>
          <Text style={{ marginVertical: 10 }}>{inspectionNotes || 'Sin observaciones guardadas.'}</Text>
          {capturedPhotos.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={{ width: '100%', height: 220, borderRadius: 8, marginVertical: 5 }} />
          ))}
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setPreviewModalVisible(false)}>
            <Text style={styles.btnText}>Cerrar Vista Previa</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, backgroundColor: '#f8fafc', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 20, textAlign: 'center' },
  langContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  langBtn: { padding: 8, marginHorizontal: 5, borderRadius: 5, backgroundColor: '#cbd5e1' },
  langActive: { backgroundColor: '#0284c7' },
  langText: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#94a3b8', borderRadius: 8, padding: 12, marginBottom: 12 },
  primaryBtn: { backgroundColor: '#0284c7', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  secondaryBtn: { backgroundColor: '#e2e8f0', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 5 },
  secondaryText: { color: '#0f172a', fontWeight: 'bold' },
  cameraBtn: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  exportBtn: { backgroundColor: '#d97706', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 5 },
  emailBtn: { backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  linkBtn: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#0284c7', textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  checkboxRow: { marginVertical: 10 },
  cancelBtn: { marginTop: 10, alignItems: 'center' },
  cancelText: { color: '#dc2626' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 18, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#dc2626', padding: 8, borderRadius: 5 },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { color: '#64748b', fontStyle: 'italic' },
  card: { backgroundColor: '#f1f5f9', padding: 10, borderRadius: 6, marginVertical: 5 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
  photoThumb: { width: 80, height: 80, borderRadius: 6, marginRight: 8, marginBottom: 8 }
});
