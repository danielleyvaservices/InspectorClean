import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// DICCIONARIO COMPLETO DE 11 IDIOMAS
const TRADUCCIONES = {
  es: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "Correo corporativo", pass: "Contraseña", login: "Iniciar Sesión", logout: "Cerrar Sesión", selLang: "Idioma", contrato: "Contrato / Cliente", piso: "Piso / Nivel", seccion: "Sección / Área", foto: "Capturar Foto", pdf: "Generar Reporte PDF", metrics: "📊 Métricas y Rendimiento", contracts: "📋 Gestión de Contratos", equipo: "👥 Control de Personal" },
  fr: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "Courriel professionnel", pass: "Mot de passe", login: "Se connecter", logout: "Déconnexion", selLang: "Langue", contrato: "Contrat / Client", piso: "Étage / Niveau", seccion: "Section / Zone", foto: "Prendre une photo", pdf: "Générer Rapport PDF", metrics: "📊 Métriques et Performance", contracts: "📋 Gestion des Contrats", equipo: "👥 Contrôle du Personnel" },
  en: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "Corporate Email", pass: "Password", login: "Log In", logout: "Log Out", selLang: "Language", contrato: "Contract / Client", piso: "Floor / Level", seccion: "Section / Area", foto: "Capture Photo", pdf: "Generate PDF Report", metrics: "📊 Metrics & Performance", contracts: "📋 Contract Management", equipo: "👥 Staff Control" },
  pt: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "E-mail corporativo", pass: "Senha", login: "Entrar", logout: "Sair", selLang: "Idioma", contrato: "Contrato / Cliente", piso: "Andar / Nível", seccion: "Seção / Área", foto: "Tirar Foto", pdf: "Gerar Relatório PDF", metrics: "📊 Métricas e Desempenho", contracts: "📋 Gestão de Contratos", equipo: "👥 Controle de Equipe" },
  ht: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "Imèl korporatib", pass: "Mawon / Siyaj", login: "Konekte", logout: "Dekonekte", selLang: "Lang", contrato: "Kontra / Kliyan", piso: "Etaj / Nivo", seccion: "Seksyon / Zòn", foto: "Pran Foto", pdf: "Jenerasyon Rapò PDF", metrics: "📊 Metrik ak Pèfòmans", contracts: "📋 Jestyon Kontra", equipo: "👥 Kontwòl Ekip" },
  tl: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "Kumpanya Email", pass: "Password", login: "Mag-login", logout: "Mag-logout", selLang: "Wika", contrato: "Kondrata / Kliyente", piso: "Palapag / Antas", seccion: "Seksyon / Lugar", foto: "Kumuha ng Larawan", pdf: "Gumawa ng PDF Report", metrics: "📊 Sukat at Pagganap", contracts: "📋 Pamamahala ng Kontrata", equipo: "👥 Kontrol sa Tauhan" },
  ar: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "البريد الإلكتروني", pass: "كلمة المرور", login: "تسجيل الدخول", logout: "تسجيل الخروج", selLang: "اللغة", contrato: "العقد / العميل", piso: "الطابق / المستوى", seccion: "القسم / المنطقة", foto: "التقاط صورة", pdf: "إنشاء تقرير PDF", metrics: "📊 المقاييس والأداء", contracts: "📋 إدارة العقود", equipo: "👥 إدارة الفريق" },
  pa: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "ਕੋਰਪੋਰੇਟ ਈਮੇਲ", pass: "ਪਾਸਵਰਡ", login: "ਲੌਗ ਇਨ ਕਰੋ", logout: "ਲੌਗ ਆਉਟ", selLang: "ਭਾਸ਼ਾ", contrato: "ਕਰਾਰ / ਗਾਹਕ", piso: "ਮੰਜ਼ਿਲ / ਪੱਧਰ", seccion: "ਸੈਕਸ਼ਨ / ਖੇਤਰ", foto: "ਤਸਵੀਰ ਲਓ", pdf: "PDF ਰਿਪੋਰਟ ਬਣਾਓ", metrics: "📊 ਮੈਟ੍ਰਿਕਸ ਅਤੇ ਪ੍ਰਦਰਸ਼ਨ", contracts: "📋 ਕਰਾਰ ਪ੍ਰਬੰਧਨ", equipo: "👥 ਟੀਮ ਨਿਯੰਤਰਣ" },
  zh: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "公司电子邮件", pass: "密码", login: "登录", logout: "退出", selLang: "语言", contrato: "合同 / 客户", piso: "楼层 / 级别", seccion: "区域 / 部门", foto: "拍摄照片", pdf: "生成 PDF 报告", metrics: "📊 指标与绩效", contracts: "📋 合同管理", equipo: "👥 团队管理" },
  ru: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "Корпоративная почта", pass: "Пароль", login: "Войти", logout: "Выйти", selLang: "Язык", contrato: "Контракт / Клиент", piso: "Этаж / Уровень", seccion: "Секция / Зона", foto: "Сделать фото", pdf: "Создать PDF отчет", metrics: "📊 Метрики и показатели", contracts: "📋 Управление контрактами", equipo: "👥 Управление персоналом" },
  pl: { title: "InspectorClean", sub: "Daniel Leyva Services", user: "E-mail firmowy", pass: "Hasło", login: "Zaloguj się", logout: "Wyloguj się", selLang: "Język", contrato: "Umowa / Klient", piso: "Piętro / Poziom", seccion: "Sekcja / Strefa", foto: "Zrób zdjęcie", pdf: "Generuj Raport PDF", metrics: "📊 Metryki i Wydajność", contracts: "📋 Zarządzanie Umowami", equipo: "👥 Kontrola Personelu" }
};

// USUARIOS Y ROLES DEFINITIVOS
const ROLES_MAP = {
  'ceo@leyvaservices.com': { pass: 'CEO2026!', rol: 'CEO', nombre: 'Daniel Leyva' },
  'admin@leyvaservices.com': { pass: 'Admin2026!', rol: 'Administrador', nombre: 'Admin Sistema' },
  'soporte@leyvaservices.com': { pass: 'Soporte2026!', rol: 'Soporte', nombre: 'Equipo Soporte' },
  'ops@leyvaservices.com': { pass: 'Ops2026!', rol: 'Jefe de Operaciones', nombre: 'Jefe Ops' },
  'sup_contratos@leyvaservices.com': { pass: 'SupCon2026!', rol: 'Supervisor de Contratos', nombre: 'Sup. Contratos' },
  'lider_contratos@leyvaservices.com': { pass: 'LiderCon2026!', rol: 'Líder de Contratos', nombre: 'Líder Contratos' },
  'supervisor@leyvaservices.com': { pass: 'Sup2026!', rol: 'Supervisor', nombre: 'Supervisor Campo' },
  'jefe_equipo@leyvaservices.com': { pass: 'JefeEq2026!', rol: 'Jefe de Equipo', nombre: 'Jefe Equipo' },
};

export default function App() {
  const [lang, setLang] = useState('es');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [user, setUser] = useState(null);

  // CAMPOS DE INSPECCIÓN
  const [contrato, setContrato] = useState('');
  const [piso, setPiso] = useState('');
  const [seccion, setSeccion] = useState('');
  const [fotos, setFotos] = useState([]);

  const t = TRADUCCIONES[lang];

  const login = () => {
    const cleanEmail = email.trim().toLowerCase();
    const match = ROLES_MAP[cleanEmail];
    if (match && match.pass === pass) {
      setUser(match);
    } else {
      Alert.alert("Acceso Denegado", "Credenciales incorrectas. Use una cuenta de Daniel Leyva Services.");
    }
  };

  const tomarFoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: true });
    if (!res.canceled && res.assets && res.assets[0]) {
      setFotos([...fotos, res.assets[0]]);
    }
  };

  const generarPDF = async () => {
    if (!contrato || !piso || !seccion) {
      Alert.alert("Atención", "Por favor complete Contrato, Piso y Sección.");
      return;
    }
    const htmlFotos = fotos.map(f => 
      `<div style="text-align:center; margin-bottom:15px;">
        <img src="data:image/jpeg;base64,${f.base64}" style="width:90%; max-width:500px; border-radius:8px; border:1px solid #ccc;"/>
       </div>`
    ).join('');

    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding:20px; color:#333;">
          <div style="text-align:center; border-bottom:2px solid #003366; padding-bottom:10px;">
            <h1 style="color:#003366; margin:0;">Daniel Leyva Services</h1>
            <h3 style="color:#555; margin:5px 0;">Reporte Oficial de Inspección</h3>
          </div>
          <div style="margin-top:20px; background:#f8f9fa; padding:15px; border-radius:6px;">
            <p><strong>Inspector:</strong> ${user.nombre} (${user.rol})</p>
            <p><strong>Contrato / Cliente:</strong> ${contrato}</p>
            <p><strong>Ubicación:</strong> Piso ${piso} - Sección ${seccion}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <hr style="margin:20px 0; border:0; border-top:1px solid #eee;"/>
          <h3 style="color:#003366;">Evidencias Fotográficas (${fotos.length})</h3>
          ${htmlFotos || '<p style="color:#888;">No se adjuntaron fotografías.</p>'}
        </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  return (
    <ScrollView style={styles.container}>
      {/* BARRA DE SELECCIÓN DE 11 IDIOMAS */}
      <View style={styles.langContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(TRADUCCIONES).map((code) => (
            <TouchableOpacity 
              key={code} 
              style={[styles.langChip, lang === code && styles.langChipActive]} 
              onPress={() => setLang(code)}>
              <Text style={[styles.langText, lang === code && styles.langTextActive]}>
                {code.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {!user ? (
        <View style={styles.cardLogin}>
          <Text style={styles.brandTitle}>{t.title}</Text>
          <Text style={styles.brandSub}>{t.sub}</Text>

          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>{t.user}</Text>
            <TextInput 
              style={styles.input} 
              placeholder="ej: ceo@leyvaservices.com" 
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>{t.pass}</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              secureTextEntry 
              value={pass} 
              onChangeText={setPass}
            />
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={login}>
            <Text style={styles.btnText}>{t.login}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainContent}>
          {/* PERFIL DEL USUARIO */}
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}><Text style={styles.avatarTxt}>{user.nombre.charAt(0)}</Text></View>
            <View style={{flex:1}}>
              <Text style={styles.userName}>{user.nombre}</Text>
              <Text style={styles.userRole}>{user.rol}</Text>
            </View>
            <TouchableOpacity style={styles.btnLogoutSmall} onPress={() => setUser(null)}>
              <Text style={{color:'#dc3545', fontWeight:'bold', fontSize:12}}>❌ {t.logout}</Text>
            </TouchableOpacity>
          </View>

          {/* MÓDULOS DE JERARQUÍA / GRÁFICOS */}
          {['CEO', 'Administrador', 'Jefe de Operaciones'].includes(user.rol) && (
            <View style={styles.dashboardCard}>
              <Text style={styles.cardHeader}>{t.metrics}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}><Text style={styles.statNum}>98%</Text><Text style={styles.statLbl}>Calidad</Text></View>
                <View style={styles.statBox}><Text style={styles.statNum}>24</Text><Text style={styles.statLbl}>Activos</Text></View>
                <View style={styles.statBox}><Text style={styles.statNum}>142</Text><Text style={styles.statLbl}>Inspecciones</Text></View>
              </View>
            </View>
          )}

          {['CEO', 'Administrador', 'Supervisor de Contratos', 'Líder de Contratos'].includes(user.rol) && (
            <TouchableOpacity style={styles.btnModule}>
              <Text style={styles.btnModuleText}>{t.contracts}</Text>
            </TouchableOpacity>
          )}

          {/* FORMULARIO DE INSPECCIÓN RESTRUCTURADO */}
          <View style={styles.cardSection}>
            <Text style={styles.cardHeader}>📌 Formulario de Inspección</Text>

            <TextInput style={styles.input} placeholder={t.contrato} value={contrato} onChangeText={setContrato} />
            <View style={{flexDirection:'row', gap:10}}>
              <TextInput style={[styles.input, {flex:1}]} placeholder={t.piso} value={piso} onChangeText={setPiso} />
              <TextInput style={[styles.input, {flex:1}]} placeholder={t.seccion} value={seccion} onChangeText={setSeccion} />
            </View>

            <TouchableOpacity style={styles.btnCamera} onPress={tomarFoto}>
              <Text style={styles.btnCameraText}>📷 {t.foto} ({fotos.length})</Text>
            </TouchableOpacity>

            <View style={styles.gallery}>
              {fotos.map((f, idx) => (
                <Image key={idx} source={{ uri: f.uri }} style={styles.thumbnail} />
              ))}
            </View>

            <TouchableOpacity style={styles.btnSuccess} onPress={generarPDF}>
              <Text style={styles.btnText}>📄 {t.pdf}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15, marginTop: 25 },
  langContainer: { marginBottom: 15, backgroundColor: '#fff', padding: 8, borderRadius: 25, elevation: 2 },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: '#e9ecef', marginRight: 6 },
  langChipActive: { backgroundColor: '#003366' },
  langText: { fontSize: 11, color: '#495057', fontWeight: '600' },
  langTextActive: { color: '#fff', fontWeight: 'bold' },
  cardLogin: { backgroundColor: '#fff', padding: 25, borderRadius: 12, elevation: 4, marginTop: 20 },
  brandTitle: { fontSize: 26, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  brandSub: { fontSize: 14, color: '#6c757d', textAlign: 'center', marginBottom: 25 },
  inputBox: { marginBottom: 15 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#495057', marginBottom: 5 },
  input: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, padding: 12, fontSize: 14 },
  btnPrimary: { backgroundColor: '#003366', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnSuccess: { backgroundColor: '#28a745', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  mainContent: { paddingBottom: 40 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2, marginBottom: 15 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  userRole: { fontSize: 13, color: '#003366', fontWeight: '600' },
  btnLogoutSmall: { padding: 6 },
  dashboardCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2, marginBottom: 15 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#003366', marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: '#eef2f7', padding: 10, borderRadius: 8, width: '31%', alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  statLbl: { fontSize: 10, color: '#6c757d', marginTop: 2 },
  btnModule: { backgroundColor: '#fff', padding: 14, borderRadius: 10, elevation: 2, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#003366' },
  btnModuleText: { fontWeight: 'bold', color: '#333' },
  cardSection: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
  btnCamera: { backgroundColor: '#17a2b8', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnCameraText: { color: '#fff', fontWeight: 'bold' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  thumbnail: { width: 65, height: 65, borderRadius: 6 }
});
