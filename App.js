import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// DICCIONARIO DE 11 IDIOMAS
const TEXTOS = {
  es: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "Correo corporativo", pass: "Contraseña", login: "Iniciar Sesión", denegado: "Acceso Denegado", modulos: "Módulos Autorizados", foto: "Capturar Evidencia", exportar: "Exportar y Compartir PDF", salir: "Cerrar Sesión", langName: "Español" },
  fr: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "Courriel professionnel", pass: "Mot de passe", login: "Se connecter", denegado: "Accès refusé", modulos: "Modules autorisés", foto: "Prendre une photo", exportar: "Exporter et partager PDF", salir: "Déconnexion", langName: "Français" },
  en: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "Corporate Email", pass: "Password", login: "Log In", denegado: "Access Denied", modulos: "Authorized Modules", foto: "Capture Evidence", exportar: "Export & Share PDF", salir: "Log Out", langName: "English" },
  pt: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "E-mail corporativo", pass: "Senha", login: "Entrar", denegado: "Acesso Negado", modulos: "Módulos Autorizados", foto: "Capturar Evidência", exportar: "Exportar e Compartilhar PDF", salir: "Sair", langName: "Português" },
  ht: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "Imèl korporatib", pass: "Mawon / Siyaj", login: "Konekte", denegado: "Aksè Refize", modulos: "Modil Otorize", foto: "Prensip Foto", exportar: "Ekspòte ak Pataje PDF", salir: "Dekonekte", langName: "Kreyòl Ayisyen" },
  tl: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "Kumpanya Email", pass: "Password", login: "Mag-login", denegado: "Access Denied", modulos: "Pinahintulutang Modyul", foto: "Kumuha ng Larawan", exportar: "I-export at Ibahagi ang PDF", salir: "Mag-logout", langName: "Tagalog" },
  ar: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "البريد الإلكتروني للشركة", pass: "كلمة المرور", login: "تسجيل الدخول", denegado: "تم رفض الوصول", modulos: "الوحدات المعتمدة", foto: "التقاط الصور", exportar: "تصدير ومشاركة PDF", salir: "تسجيل الخروج", langName: "العربية" },
  pa: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "ਕੋਰਪੋਰੇਟ ਈਮੇਲ", pass: "ਪਾਸਵਰਡ", login: "ਲੌਗ ਇਨ ਕਰੋ", denegado: "ਪਹੁੰਚ ਤੋਂ ਇਨਕਾਰ", modulos: "ਅਧਿਕਾਰਤ ਮੋਡੀਊਲ", foto: "ਤਸਵੀਰ ਲਓ", exportar: "PDF ਐਕਸਪੋਰਟ ਅਤੇ ਸਾਂਝਾ ਕਰੋ", salir: "ਲੌਗ ਆਉਟ", langName: "ਪੰਜਾਬੀ" },
  zh: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "公司电子邮件", pass: "密码", login: "登录", denegado: "拒绝访问", modulos: "授权模块", foto: "拍摄照片", exportar: "导出并分享 PDF", salir: "退出登录", langName: "中文" },
  ru: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "Корпоративная почта", pass: "Пароль", login: "Войти", denegado: "Доступ запрещен", modulos: "Авторизованные модули", foto: "Сделать фото", exportar: "Экспорт и отправка PDF", salir: "Выйти", langName: "Русский" },
  pl: { titulo: "InspectorClean", sub: "Daniel Leyva Services", usuario: "E-mail firmowy", pass: "Hasło", login: "Zaloguj się", denegado: "Brak dostępu", modulos: "Uprawnione moduły", foto: "Zrób zdjęcie", exportar: "Eksportuj i udostępnij PDF", salir: "Wyloguj się", langName: "Polski" }
};

const USUARIOS_PERMITIDOS = {
  'ceo@leyvaservices.com': { pass: 'CEO2026!', rol: 'CEO', nombre: 'Daniel Leyva' },
  'admin@leyvaservices.com': { pass: 'Admin2026!', rol: 'Administrador', nombre: 'Admin Sistema' },
  'soporte@leyvaservices.com': { pass: 'Soporte2026!', rol: 'Soporte', nombre: 'Equipo Soporte' },
  'ops@leyvaservices.com': { pass: 'Ops2026!', rol: 'Jefe de Operaciones', nombre: 'Jefe Operaciones' },
  'sup_contratos@leyvaservices.com': { pass: 'SupCon2026!', rol: 'Supervisor de Contratos', nombre: 'Sup. Contratos' },
  'lider_contratos@leyvaservices.com': { pass: 'LiderCon2026!', rol: 'Líder de Contratos', nombre: 'Líder Contratos' },
  'supervisor@leyvaservices.com': { pass: 'Sup2026!', rol: 'Supervisor', nombre: 'Supervisor Campo' },
  'jefe_equipo@leyvaservices.com': { pass: 'JefeEq2026!', rol: 'Jefe de Equipo', nombre: 'Jefe de Equipo' },
};

export default function App() {
  const [lang, setLang] = useState('es');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [titulo, setTitulo] = useState('');

  const t = TEXTOS[lang];

  const manejarLogin = () => {
    const userClean = usuario.trim().toLowerCase();
    const userEncontrado = USUARIOS_PERMITIDOS[userClean];

    if (userEncontrado && userEncontrado.pass === password) {
      setUsuarioLogueado(userEncontrado);
    } else {
      Alert.alert(t.denegado, 'Usuario o contraseña incorrectos.');
    }
  };

  const tomarFoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setFotos([...fotos, result.assets[0]]);
    }
  };

  const generarPDF = async () => {
    if (!titulo) return;
    const imagenesHTML = fotos.map(f => 
      `<div style="margin-bottom: 15px; text-align: center;">
        <img src="data:image/jpeg;base64,${f.base64}" style="width: 90%; max-width: 500px; height: auto; border-radius: 8px;" />
       </div>`
    ).join('');

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #003366; text-align: center;">Daniel Leyva Services</h1>
          <h2 style="text-align: center;">Reporte: ${titulo}</h2>
          <p><strong>Inspector:</strong> ${usuarioLogueado.nombre} (${usuarioLogueado.rol})</p>
          <hr />
          ${imagenesHTML}
        </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  };

  return (
    <ScrollView style={styles.container}>
      {/* SELECTOR DE 11 IDIOMAS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langBar}>
        {Object.keys(TEXTOS).map((code) => (
          <TouchableOpacity 
            key={code} 
            style={[styles.langChip, lang === code && styles.langActive]} 
            onPress={() => setLang(code)}>
            <Text style={[styles.langText, lang === code && styles.langTextActive]}>
              {TEXTOS[code].langName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {!usuarioLogueado ? (
        <View style={styles.card}>
          <Text style={styles.titleHeader}>{t.titulo}</Text>
          <Text style={styles.subHeader}>{t.sub}</Text>
          
          <TextInput placeholder={t.usuario} style={styles.input} value={usuario} onChangeText={setUsuario} autoCapitalize="none" />
          <TextInput placeholder={t.pass} secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.btnPrimary} onPress={manejarLogin}>
            <Text style={styles.btnText}>{t.login}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.headerBar}>
            <Text style={styles.userText}>{usuarioLogueado.nombre}</Text>
            <Text style={styles.roleTag}>Rol: {usuarioLogueado.rol}</Text>
          </View>

          <Text style={styles.sectionTitle}>{t.modulos}</Text>
          
          <TouchableOpacity style={styles.btnRole} onPress={tomarFoto}>
            <Text style={styles.btnRoleText}>📷 {t.foto} ({fotos.length})</Text>
          </TouchableOpacity>

          <View style={styles.galeria}>
            {fotos.map((f, i) => (
              <Image key={i} source={{ uri: f.uri }} style={styles.previewImage} />
            ))}
          </View>

          <TextInput placeholder="Título..." style={styles.input} value={titulo} onChangeText={setTitulo} />
          <TouchableOpacity style={styles.btnSuccess} onPress={generarPDF}>
            <Text style={styles.btnText}>{t.exportar}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDanger} onPress={() => setUsuarioLogueado(null)}>
            <Text style={styles.btnText}>{t.salir}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6f9', marginTop: 30 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  langBar: { flexDirection: 'row', marginBottom: 20, paddingBottom: 10 },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 8 },
  langActive: { backgroundColor: '#003366' },
  langText: { fontSize: 12, color: '#333' },
  langTextActive: { color: '#fff', fontWeight: 'bold' },
  titleHeader: { fontSize: 26, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  subHeader: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', height: 48, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  btnPrimary: { width: '100%', height: 48, backgroundColor: '#003366', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnSuccess: { width: '100%', height: 48, backgroundColor: '#28a745', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  btnDanger: { width: '100%', height: 40, backgroundColor: '#dc3545', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  headerBar: { padding: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 15 },
  userText: { fontSize: 16, fontWeight: 'bold' },
  roleTag: { fontSize: 14, color: '#003366' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  btnRole: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  btnRoleText: { color: '#333', fontWeight: '600' },
  galeria: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  previewImage: { width: 70, height: 70, borderRadius: 8, marginRight: 10, marginBottom: 10 }
});
