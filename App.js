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
    btnComandas: '📦 Comandas de Insumos',
    startSupervision: '🎯 Iniciar Supervisión de Campo',
    roles: 'Jerarquía de Accesos'
  },
  en: {
    title: '🧹 InspectorClean',
    subtitle: 'Daniel Leyva Services - Operations Management',
    user: 'Username:',
    pass: 'Password:',
    loginBtn: 'Sign In',
    forgotPass: 'Forgot password? Contact Support',
    welcome: 'Welcome',
    logout: '🚪 Sign Out',
    back: '⬅️ Back',
    save: '💾 Save',
    cancel: 'Cancel',
    cartera: '📁 General Contract Portfolio',
    createContract: '🏢 Create / Edit Contract',
    reports: '📊 Evaluation Reports',
    takePhoto: '📷 Take Real Photo',
    photoAttached: '✅ Photo Captured & Attached',
    sendEvidence: '📤 Generate PDF & Share',
    btnVerPersonal: '👥 Staff List',
    btnAltaPersonal: '👤 User Management',
    btnAlertaAdmin: '✉️ Requests & Messages',
    btnComandas: '📦 Supply Orders',
    startSupervision: '🎯 Start Field Inspection',
    roles: 'Access Hierarchy'
  },
  fr: {
    title: '🧹 InspectorClean',
    subtitle: 'Daniel Leyva Services - Gestion Opérationnelle',
    user: 'Utilisateur:',
    pass: 'Mot de passe:',
    loginBtn: 'Se connecter',
    forgotPass: 'Mot de passe oublié ? Contacter el Support',
    welcome: 'Bienvenue',
    logout: '🚪 Déconnexion',
    back: '⬅️ Retour',
    save: '💾 Enregistrer',
    cancel: 'Annuler',
    cartera: '📁 Portefeuille de Contrats',
    createContract: '🏢 Créer / Modifier Contrat',
    reports: '📊 Rapports d\'Évaluation',
    takePhoto: '📷 Prendre une Photo',
    photoAttached: '✅ Photo Capturée',
    sendEvidence: '📤 Générer PDF et Partager',
    btnVerPersonal: '👥 Liste du Personnel',
    btnAltaPersonal: '👤 Gestion des Utilisateurs',
    btnAlertaAdmin: '✉️ Messages',
    btnComandas: '📦 Commandes de Matériel',
    startSupervision: '🎯 Inspecter',
    roles: 'Hiérarchie'
  },
  pt: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: 'Usuário:', pass: 'Senha:', loginBtn: 'Entrar', forgotPass: 'Esqueceu a senha?', welcome: 'Bem-vindo', logout: '🚪 Sair', back: '⬅️ Voltar', save: '💾 Salvar', cancel: 'Cancelar', cartera: '📁 Contratos', createContract: '🏢 Novo Contrato', reports: '📊 Relatórios', takePhoto: '📷 Tirar Foto', photoAttached: '✅ Foto Anexada', sendEvidence: '📤 Gerar PDF', btnVerPersonal: '👥 Equipe', btnAltaPersonal: '👤 Usuários', btnAlertaAdmin: '✉️ Mensagens', btnComandas: '📦 Pedidos', startSupervision: '🎯 Iniciar', roles: 'Hierarquia' },
  de: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: 'Benutzer:', pass: 'Passwort:', loginBtn: 'Anmelden', forgotPass: 'Passwort vergessen?', welcome: 'Willkommen', logout: '🚪 Abmelden', back: '⬅️ Zurück', save: '💾 Speichern', cancel: 'Abbrechen', cartera: '📁 Verträge', createContract: '🏢 Vertrag Erstellen', reports: '📊 Berichte', takePhoto: '📷 Foto Machen', photoAttached: '✅ Foto Angehängt', sendEvidence: '📤 PDF Erstellen', btnVerPersonal: '👥 Personal', btnAltaPersonal: '👤 Benutzer', btnAlertaAdmin: '✉️ Nachrichten', btnComandas: '📦 Bestellungen', startSupervision: '🎯 Starten', roles: 'Hierarchie' },
  it: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: 'Utente:', pass: 'Password:', loginBtn: 'Accedi', forgotPass: 'Password dimenticata?', welcome: 'Benvenuto', logout: '🚪 Esci', back: '⬅️ Indietro', save: '💾 Salva', cancel: 'Annulla', cartera: '📁 Contratti', createContract: '🏢 Nuovo Contratto', reports: '📊 Report', takePhoto: '📷 Scatta Foto', photoAttached: '✅ Foto Allegata', sendEvidence: '📤 Genera PDF', btnVerPersonal: '👥 Personale', btnAltaPersonal: '👤 Utenti', btnAlertaAdmin: '✉️ Messaggi', btnComandas: '📦 Ordini', startSupervision: '🎯 Ispezione', roles: 'Gerarchia' },
  ru: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: 'Логин:', pass: 'Пароль:', loginBtn: 'Войти', forgotPass: 'Забыли пароль?', welcome: 'Добро пожаловать', logout: '🚪 Выйти', back: '⬅️ Назад', save: '💾 Сохранить', cancel: 'Отмена', cartera: '📁 Контракты', createContract: '🏢 Новый контракт', reports: '📊 Отчеты', takePhoto: '📷 Сделать фото', photoAttached: '✅ Фото прикреплено', sendEvidence: '📤 Создать PDF', btnVerPersonal: '👥 Персонал', btnAltaPersonal: '👤 Пользователи', btnAlertaAdmin: '✉️ Сообщения', btnComandas: '📦 Заказы', startSupervision: '🎯 Инспекция', roles: 'Иерархия' },
  zh: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: '用户名:', pass: '密码:', loginBtn: '登录', forgotPass: '忘记密码？', welcome: '欢迎', logout: '🚪 退出', back: '⬅️ 返回', save: '💾 保存', cancel: '取消', cartera: '📁 合同管理', createContract: '🏢 新建合同', reports: '📊 评估报告', takePhoto: '📷 拍照', photoAttached: '✅ 照片已附加', sendEvidence: '📤 生成PDF并分享', btnVerPersonal: '👥 员工列表', btnAltaPersonal: '👤 用户管理', btnAlertaAdmin: '✉️ 消息', btnComandas: '📦 物料订单', startSupervision: '🎯 开始检查', roles: '权限等级' },
  ja: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: 'ユーザー名:', pass: 'パスワード:', loginBtn: 'ログイン', forgotPass: 'パスワードをお忘れですか？', welcome: 'ようこそ', logout: '🚪 ログアウト', back: '⬅️ 戻る', save: '💾 保存', cancel: 'キャンセル', cartera: '📁 契約一覧', createContract: '🏢 契約作成', reports: '📊 評価レポート', takePhoto: '📷 写真を撮影', photoAttached: '✅ 写真添付済み', sendEvidence: '📤 PDF生成・共有', btnVerPersonal: '👥 スタッフ一覧', btnAltaPersonal: '👤 ユーザー管理', btnAlertaAdmin: '✉️ メッセージ', btnComandas: '📦 注文管理', startSupervision: '🎯 検査開始', roles: '権限階層' },
  ar: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: 'اسم المستخدم:', pass: 'كلمة المرور:', loginBtn: 'تسجيل الدخول', forgotPass: 'هل نسيت كلمة المرور؟', welcome: 'أهلاً بك', logout: '🚪 خروج', back: '⬅️ عودة', save: '💾 حفظ', cancel: 'إلغاء', cartera: '📁 العقود', createContract: '🏢 عقد جديد', reports: '📊 التقارير', takePhoto: '📷 التقاط صورة', photoAttached: '✅ تم إرفاق الصورة', sendEvidence: '📤 إنشاؤ PDF', btnVerPersonal: '👥 الموظفين', btnAltaPersonal: '👤 المستخدمين', btnAlertaAdmin: '✉️ الرسائل', btnComandas: '📦 الطلبات', startSupervision: '🎯 بدء التفتيش', roles: 'الصلاحيات' },
  hi: { title: '🧹 InspectorClean', subtitle: 'Daniel Leyva Services', user: 'उपयोगकर्ता:', pass: 'पासवर्ड:', loginBtn: 'लॉगिन करें', forgotPass: 'पासवर्ड भूल गए?', welcome: 'स्वागत है', logout: '🚪 लॉग आउट', back: '⬅️ वापस', save: '💾 सहेजें', cancel: 'रद्द करें', cartera: '📁 अनुबंध', createContract: '🏢 नया अनुबंध', reports: '📊 रिपोर्ट', takePhoto: '📷 फोटो लें', photoAttached: '✅ फोटो संलग्न', sendEvidence: '📤 पीडीएफ बनाएं', btnVerPersonal: '👥 कर्मचारी', btnAltaPersonal: '👤 उपयोगकर्ता', btnAlertaAdmin: '✉️ संदेश', btnComandas: '📦 ऑर्डर', startSupervision: '🎯 निरीक्षण', roles: 'पदानुक्रम' }
};

// ---------------------------------------------------------
// 2. BASE DE DATOS INICIAL DE USUARIOS Y ROLES (8 NIVELES)
// ---------------------------------------------------------
const INITIAL_USERS = [
  { id: '1', nombre: 'Daniel', apellidos: 'Aguilar Leyva', user: 'ceo', pass: '1234', rol: 'CEO', tel: '514-000-0000', email: 'daniel.leyvaservices@gmail.com', contratoAsignado: 'TODOS' },
  { id: '2', nombre: 'Admin', apellidos: 'Principal', user: 'admin1', pass: '1234', rol: 'ADMINISTRADOR', tel: '514-000-0001', email: 'admin@inspectorclean.com', contratoAsignado: 'TODOS' },
  { id: '3', nombre: 'Soporte', apellidos: 'Técnico', user: 'soporte1', pass: '1234', rol: 'SOPORTE', tel: '514-000-0002', email: 'soporte@inspectorclean.com', contratoAsignado: 'TODOS' },
  { id: '4', nombre: 'Jefe Ops', apellidos: 'Operaciones', user: 'jefeops1', pass: '1234', rol: 'JEFE_DE_OPERACIONES', tel: '514-000-0003', email: 'ops@inspectorclean.com', contratoAsignado: 'TODOS' },
  { id: '5', nombre: 'Supervisor', apellidos: 'Contrato A', user: 'supcon1', pass: '1234', rol: 'SUPERVISOR_CONTRATO', tel: '514-000-0004', email: 'supcon1@inspectorclean.com', contratoAsignado: 'Torre Corporativa Montreal' },
  { id: '6', nombre: 'Líder', apellidos: 'Equipo 1', user: 'lider1', pass: '1234', rol: 'LIDER_DE_CONTRATO', tel: '514-000-0005', email: 'lider1@inspectorclean.com', contratoAsignado: 'Torre Corporativa Montreal' },
  { id: '7', nombre: 'Supervisor', apellidos: 'Ruta 1', user: 'sup1', pass: '1234', rol: 'SUPERVISOR', tel: '514-000-0006', email: 'sup1@inspectorclean.com', contratoAsignado: 'Torre Corporativa Montreal' },
  { id: '8', nombre: 'Jefe', apellidos: 'Limpieza A', user: 'jefe1', pass: '1234', rol: 'JEFE_DE_EQUIPO', tel: '514-000-0007', email: 'jefe1@inspectorclean.com', contratoAsignado: 'Torre Corporativa Montreal' }
];

// ---------------------------------------------------------
// 3. BASE DE DATOS INICIAL DE CONTRATOS Y COMANDAS
// ---------------------------------------------------------
const INITIAL_CONTRATOS = [
  {
    id: 'cnt-1',
    nombre: 'Torre Corporativa Montreal',
    direccion: '7400 Blvd Les Galeries d Anjou, Montréal',
    cliente: 'Groupe Immobilier MTL',
    pisos: [
      { id: 'p-1', nombre: 'Piso 1 - Recepción y Lobby', secciones: ['Entrada Principal', 'Baños Visitantes', 'Elevadores'] },
      { id: 'p-2', nombre: 'Piso 2 - Oficinas Ejecutivas', secciones: ['Salas de Juntas', 'Área de Cubículos', 'Cocina / Breakroom'] }
    ]
  }
];

const INITIAL_COMANDAS = [
  {
    id: 'cmd-101',
    contrato: 'Torre Corporativa Montreal',
    solicitante: 'Líder Equipo 1',
    fecha: '2026-09-05',
    estado: 'Pendiente',
    items: [
      { id: 'i-1', producto: 'Detergente Neutro 5L', cantidad: '3' },
      { id: 'i-2', producto: 'Paños de Microfibra (Pack 10)', cantidad: '2' }
    ]
  }
];

export default function App() {
  // Idioma
  const [lang, setLang] = useState('es');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  // Autenticación y Usuarios
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [usersDB, setUsersDB] = useState(INITIAL_USERS);

  // Vistas y Navegación
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // LOGIN, MAIN, CAMARA, CONTRATOS, COMANDAS, PERSONAL, REPORTES

  // Datos del Sistema
  const [contratosDB, setContratosDB] = useState(INITIAL_CONTRATOS);
  const [comandasDB, setComandasDB] = useState(INITIAL_COMANDAS);

  // Estado para Formulario de Recuperación de Contraseña
  const [modalForgotVisible, setModalForgotVisible] = useState(false);
  const [forgotUserText, setForgotUserText] = useState('');

  // Estado para la Cámara Nativa
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // Estado para Gestión de Comandas
  const [selectedContratoComanda, setSelectedContratoComanda] = useState(INITIAL_CONTRATOS[0].nombre);
  const [newProducto, setNewProducto] = useState('');
  const [newCantidad, setNewCantidad] = useState('');
  const [tempItemsComanda, setTempItemsComanda] = useState([]);

  // Estado para Gestión de Usuarios
  const [newNombreUsr, setNewNombreUsr] = useState('');
  const [newApellidosUsr, setNewApellidosUsr] = useState('');
  const [newUserUsr, setNewUserUsr] = useState('');
  const [newPassUsr, setNewPassUsr] = useState('');
  const [newRolUsr, setNewRolUsr] = useState('SUPERVISOR');
  const [newEmailUsr, setNewEmailUsr] = useState('');

  // ---------------------------------------------------------
  // MANEJO DE AUTENTICACIÓN
  // ---------------------------------------------------------
  const handleLogin = () => {
    const userFound = usersDB.find(
      u => u.user.toLowerCase() === userInput.trim().toLowerCase() && u.pass === passInput.trim()
    );

    if (userFound) {
      setCurrentUser(userFound);
      setCurrentScreen('MAIN');
      setUserInput('');
      setPassInput('');
    } else {
      Alert.alert('Error de Autenticación', 'Usuario o contraseña incorrectos. Verifique sus credenciales.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('LOGIN');
    setCapturedPhoto(null);
  };

  const handleSendForgotPassword = () => {
    if (!forgotUserText.trim()) {
      Alert.alert('Atención', 'Ingrese su nombre de usuario o correo registrado.');
      return;
    }
    const mailUrl = `mailto:daniel.leyvaservices@gmail.com?subject=Solicitud de Restablecimiento de Contraseña - InspectorClean&body=Solicito apoyo para restablecer la contraseña del usuario: ${forgotUserText}`;
    Linking.openURL(mailUrl).catch(() => {
      Alert.alert('Notificación', 'Envíe un correo a daniel.leyvaservices@gmail.com con su usuario.');
    });
    setModalForgotVisible(false);
    setForgotUserText('');
  };

  // ---------------------------------------------------------
  // MANEJO DE CÁMARA REAL NATIVA
  // ---------------------------------------------------------
  const openCameraScreen = async () => {
    if (!permission || !permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permiso Requerido', 'Se requiere acceso a la cámara para capturar evidencias de inspección.');
        return;
      }
    }
    setCurrentScreen('CAMARA');
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({ quality: 0.7, base64: true });
        setCapturedPhoto(photo.uri);
        setCurrentScreen('MAIN');
        Alert.alert('Éxito', 'Fotografía tomada e integrada correctamente al reporte.');
      } catch (e) {
        Alert.alert('Error', 'No se pudo capturar la fotografía: ' + e.message);
      }
    }
  };

  // ---------------------------------------------------------
  // MANEJO DE COMANDAS E INSUMOS
  // ---------------------------------------------------------
  const handleAddItemComanda = () => {
    if (!newProducto.trim() || !newCantidad.trim()) {
      Alert.alert('Atención', 'Ingrese el nombre del producto y la cantidad.');
      return;
    }
    setTempItemsComanda([...tempItemsComanda, { id: Date.now().toString(), producto: newProducto, cantidad: newCantidad }]);
    setNewProducto('');
    setNewCantidad('');
  };

  const handleSaveComanda = () => {
    if (tempItemsComanda.length === 0) {
      Alert.alert('Atención', 'Agregue al menos un producto a la comanda.');
      return;
    }
    const newComanda = {
      id: `cmd-${Date.now().toString().slice(-3)}`,
      contrato: selectedContratoComanda,
      solicitante: `${currentUser.nombre} (${currentUser.rol})`,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
      items: tempItemsComanda
    };
    setComandasDB([newComanda, ...comandasDB]);
    setTempItemsComanda([]);
    Alert.alert('Éxito', 'Comanda de insumos registrada correctamente.');
  };

  // ---------------------------------------------------------
  // MANEJO DE USUARIOS (SOLO CEO, ADMIN, SOPORTE)
  // ---------------------------------------------------------
  const handleCreateUser = () => {
    if (!newNombreUsr || !newUserUsr || !newPassUsr) {
      Alert.alert('Atención', 'Complete los campos obligatorios (Nombre, Usuario, Contraseña).');
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      nombre: newNombreUsr,
      apellidos: newApellidosUsr,
      user: newUserUsr,
      pass: newPassUsr,
      rol: newRolUsr,
      email: newEmailUsr,
      contratoAsignado: 'Torre Corporativa Montreal'
    };
    setUsersDB([...usersDB, newUser]);
    setNewNombreUsr(''); setNewApellidosUsr(''); setNewUserUsr(''); setNewPassUsr(''); setNewEmailUsr('');
    Alert.alert('Éxito', 'Nuevo usuario registrado con rol: ' + newRolUsr);
  };

  // ---------------------------------------------------------
  // RESTRICCIÓN DE BOTONES POR JERARQUÍA
  // ---------------------------------------------------------
  const canManageUsers = ['CEO', 'ADMINISTRADOR', 'SOPORTE'].includes(currentUser?.rol);
  const canManageContracts = ['CEO', 'ADMINISTRADOR', 'SOPORTE', 'JEFE_DE_OPERACIONES'].includes(currentUser?.rol);
  const canSupervise = ['CEO', 'ADMINISTRADOR', 'JEFE_DE_OPERACIONES', 'SUPERVISOR_CONTRATO', 'SUPERVISOR', 'LIDER_DE_CONTRATO'].includes(currentUser?.rol);

  // ---------------------------------------------------------
  // RENDER: PANTALLA DE LOGIN CON SELECTOR DE 11 IDIOMAS
  // ---------------------------------------------------------
  if (currentScreen === 'LOGIN') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollLogin}>
          {/* Encabezado Principal */}
          <View style={styles.headerBox}>
            <Text style={styles.mainTitle}>{t.title}</Text>
            <Text style={styles.subTitle}>{t.subtitle}</Text>
          </View>

          {/* Selector de 11 Idiomas */}
          <Text style={styles.langLabel}>🌐 Select Language / Seleccionar Idioma:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langSelector}>
            {[
              { code: 'es', flag: '🇲🇽 ES' }, { code: 'en', flag: '🇨🇦 EN' }, { code: 'fr', flag: '🇨🇦 FR' },
              { code: 'pt', flag: '🇧🇷 PT' }, { code: 'de', flag: '🇩🇪 DE' }, { code: 'it', flag: '🇮🇹 IT' },
              { code: 'ru', flag: '🇷🇺 RU' }, { code: 'zh', flag: '🇨🇳 ZH' }, { code: 'ja', flag: '🇯🇵 JA' },
              { code: 'ar', flag: '🇸🇦 AR' }, { code: 'hi', flag: '🇮🇳 HI' }
            ].map((item) => (
              <TouchableOpacity
                key={item.code}
                style={[styles.langBtn, lang === item.code && styles.langBtnActive]}
                onPress={() => setLang(item.code)}
              >
                <Text style={styles.langBtnText}>{item.flag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Formulario de Login */}
          <View style={styles.cardLogin}>
            <Text style={styles.cardLoginTitle}>🔑 Acceso al Sistema</Text>
            
            <Text style={styles.inputLabel}>{t.user}</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. ceo, admin1, soporte1"
              value={userInput}
              onChangeText={setUserInput}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>{t.pass}</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña de acceso"
              secureTextEntry
              value={passInput}
              onChangeText={setPassInput}
            />

            <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
              <Text style={styles.btnLoginText}>{t.loginBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnForgot} onPress={() => setModalForgotVisible(true)}>
              <Text style={styles.btnForgotText}>{t.forgotPass}</Text>
            </TouchableOpacity>
          </View>

          {/* Accesos Rápidos para Pruebas de Roles */}
          <View style={styles.rolesBox}>
            <Text style={styles.rolesTitle}>💡 Accesos Rápidos de Prueba (Roles):</Text>
            <View style={styles.rolesGrid}>
              {[
                { label: '👑 CEO', u: 'ceo' }, { label: '⚙️ Admin', u: 'admin1' },
                { label: '🛠️ Soporte', u: 'soporte1' }, { label: '🎯 Ops', u: 'jefeops1' },
                { label: '🏢 Sup. Contrato', u: 'supcon1' }, { label: '👥 Líder', u: 'lider1' },
                { label: '📋 Supervisor', u: 'sup1' }, { label: '🧹 Jefe Equipo', u: 'jefe1' }
              ].map((r, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.roleChip}
                  onPress={() => { setUserInput(r.u); setPassInput('1234'); }}
                >
                  <Text style={styles.roleChipText}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Modal de Recuperación de Contraseña */}
        <Modal visible={modalForgotVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>✉️ Restablecer Contraseña</Text>
              <Text style={styles.modalSub}>Ingrese su usuario o correo para enviar la solicitud directa a Soporte Técnico:</Text>
              <TextInput
                style={styles.input}
                placeholder="Usuario o correo electrónico"
                value={forgotUserText}
                onChangeText={setForgotUserText}
              />
              <TouchableOpacity style={styles.btnLogin} onPress={handleSendForgotPassword}>
                <Text style={styles.btnLoginText}>Enviar a Soporte</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalForgotVisible(false)}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------
  // RENDER: PANTALLA DE CÁMARA NATURA
  // ---------------------------------------------------------
  if (currentScreen === 'CAMARA') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView style={{ flex: 1 }} ref={(r) => setCameraRef(r)}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.btnCloseCamera} onPress={() => setCurrentScreen('MAIN')}>
              <Text style={styles.btnCameraText}>❌ Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCapture} onPress={takePicture}>
              <View style={styles.btnCaptureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------
  // RENDER: PANTALLA PRINCIPAL CON MENÚ SEGÚN JERARQUÍA
  // ---------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de Usuario Activo */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topUserTitle}>🧹 InspectorClean</Text>
          <Text style={styles.topUserSub}>{currentUser.nombre} ({currentUser.rol})</Text>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutText}>{t.logout}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollMain}>
        {/* Muestrario de Foto Capturada si existe */}
        {capturedPhoto && (
          <View style={styles.photoBox}>
            <Text style={styles.photoBoxTitle}>📸 Evidencia Fotográfica Capturada:</Text>
            <Image source={{ uri: capturedPhoto }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.btnDeletePhoto} onPress={() => setCapturedPhoto(null)}>
              <Text style={styles.btnDeletePhotoText}>🗑️ Eliminar Evidencia</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MENÚ DE ACCIONES SEGÚN ROLES */}
        <Text style={styles.sectionHeader}>🎯 Módulos Operativos Disponibles:</Text>

        {/* 1. Módulo de Cámara Real */}
        <TouchableOpacity style={[styles.menuCard, { backgroundColor: '#2b580c' }]} onPress={openCameraScreen}>
          <Text style={styles.menuCardTitle}>{t.takePhoto}</Text>
          <Text style={styles.menuCardSub}>Capturar evidencia fotográfica con el sensor del dispositivo</Text>
        </TouchableOpacity>

        {/* 2. Módulo de Comandas e Insumos */}
        <TouchableOpacity style={[styles.menuCard, { backgroundColor: '#005691' }]} onPress={() => setCurrentScreen('COMANDAS')}>
          <Text style={styles.menuCardTitle}>{t.btnComandas}</Text>
          <Text style={styles.menuCardSub}>Solicitudes de productos y materiales por contrato</Text>
        </TouchableOpacity>

        {/* 3. Módulo de Cartera de Contratos (Habilitado según rol) */}
        {canManageContracts && (
          <TouchableOpacity style={[styles.menuCard, { backgroundColor: '#d92027' }]} onPress={() => setCurrentScreen('CONTRATOS')}>
            <Text style={styles.menuCardTitle}>{t.cartera}</Text>
            <Text style={styles.menuCardSub}>Administración de pisos, clientes y ubicaciones</Text>
          </TouchableOpacity>
        )}

        {/* 4. Módulo de Usuarios / Personal (Habilitado solo CEO, Admin, Soporte) */}
        {canManageUsers && (
          <TouchableOpacity style={[styles.menuCard, { backgroundColor: '#ff9234' }]} onPress={() => setCurrentScreen('PERSONAL')}>
            <Text style={styles.menuCardTitle}>{t.btnVerPersonal}</Text>
            <Text style={styles.menuCardSub}>Crear nuevos usuarios y asignar roles de acceso</Text>
          </TouchableOpacity>
        )}

        {/* SUB-PANTALLA: COMANDAS */}
        {currentScreen === 'COMANDAS' && (
          <View style={styles.subScreenContainer}>
            <TouchableOpacity style={styles.btnBackSub} onPress={() => setCurrentScreen('MAIN')}>
              <Text style={styles.btnBackSubText}>⬅️ Volver al Menú Principal</Text>
            </TouchableOpacity>

            <Text style={styles.subTitleText}>📦 Nueva Comanda de Insumos</Text>
            <Text style={styles.inputLabel}>Seleccionar Contrato:</Text>
            <ScrollView horizontal style={{ marginBottom: 10 }}>
              {contratosDB.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.roleChip, selectedContratoComanda === c.nombre && { backgroundColor: '#005691' }]}
                  onPress={() => setSelectedContratoComanda(c.nombre)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{c.nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 5 }]}
                placeholder="Producto (ej. Cloro)"
                value={newProducto}
                onChangeText={setNewProducto}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Cant."
                keyboardType="numeric"
                value={newCantidad}
                onChangeText={setNewCantidad}
              />
            </View>

            <TouchableOpacity style={styles.btnAddItem} onPress={handleAddItemComanda}>
              <Text style={styles.btnAddItemText}>➕ Agregar Insumo</Text>
            </TouchableOpacity>

            {tempItemsComanda.map((item, idx) => (
              <Text key={idx} style={styles.itemText}>• {item.producto} - Cantidad: {item.cantidad}</Text>
            ))}

            {tempItemsComanda.length > 0 && (
              <TouchableOpacity style={styles.btnLogin} onPress={handleSaveComanda}>
                <Text style={styles.btnLoginText}>💾 Registrar Comanda Oficial</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.subTitleText, { marginTop: 20 }]}>📋 Historial de Comandas:</Text>
            {comandasDB.map(cmd => (
              <View key={cmd.id} style={styles.comandaCard}>
                <Text style={styles.comandaTitle}>{cmd.id} - {cmd.contrato}</Text>
                <Text style={styles.comandaSub}>Solicitado por: {cmd.solicitante} | Fecha: {cmd.fecha}</Text>
                <Text style={styles.comandaStatus}>Estado: {cmd.estado}</Text>
                {cmd.items.map((it, i) => (
                  <Text key={i} style={styles.comandaItem}>  - {it.producto}: {it.cantidad}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* SUB-PANTALLA: USUARIOS */}
        {currentScreen === 'PERSONAL' && canManageUsers && (
          <View style={styles.subScreenContainer}>
            <TouchableOpacity style={styles.btnBackSub} onPress={() => setCurrentScreen('MAIN')}>
              <Text style={styles.btnBackSubText}>⬅️ Volver al Menú Principal</Text>
            </TouchableOpacity>

            <Text style={styles.subTitleText}>👤 Alta de Nuevo Usuario</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={newNombreUsr} onChangeText={setNewNombreUsr} />
            <TextInput style={styles.input} placeholder="Apellidos" value={newApellidosUsr} onChangeText={setNewApellidosUsr} />
            <TextInput style={styles.input} placeholder="Nombre de Usuario (Login)" value={newUserUsr} onChangeText={setNewUserUsr} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Contraseña" value={newPassUsr} onChangeText={setNewPassUsr} />
            <TextInput style={styles.input} placeholder="Correo Electrónico" value={newEmailUsr} onChangeText={setNewEmailUsr} keyboardType="email-address" />

            <Text style={styles.inputLabel}>Seleccionar Rol de Acceso:</Text>
            <ScrollView horizontal style={{ marginBottom: 10 }}>
              {['CEO', 'ADMINISTRADOR', 'SOPORTE', 'JEFE_DE_OPERACIONES', 'SUPERVISOR_CONTRATO', 'LIDER_DE_CONTRATO', 'SUPERVISOR', 'JEFE_DE_EQUIPO'].map(rol => (
                <TouchableOpacity
                  key={rol}
                  style={[styles.roleChip, newRolUsr === rol && { backgroundColor: '#ff9234' }]}
                  onPress={() => setNewRolUsr(rol)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{rol}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.btnLogin} onPress={handleCreateUser}>
              <Text style={styles.btnLoginText}>💾 Guardar Usuario</Text>
            </TouchableOpacity>

            <Text style={[styles.subTitleText, { marginTop: 20 }]}>👥 Personal Registrado ({usersDB.length}):</Text>
            {usersDB.map(u => (
              <View key={u.id} style={styles.userCard}>
                <Text style={styles.userCardName}>{u.nombre} {u.apellidos}</Text>
                <Text style={styles.userCardSub}>Usuario: {u.user} | Rol: {u.rol}</Text>
                <Text style={styles.userCardSub}>Email: {u.email || 'N/A'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* SUB-PANTALLA: CONTRATOS */}
        {currentScreen === 'CONTRATOS' && canManageContracts && (
          <View style={styles.subScreenContainer}>
            <TouchableOpacity style={styles.btnBackSub} onPress={() => setCurrentScreen('MAIN')}>
              <Text style={styles.btnBackSubText}>⬅️ Volver al Menú Principal</Text>
            </TouchableOpacity>

            <Text style={styles.subTitleText}>📁 Cartera de Contratos Activos</Text>
            {contratosDB.map(c => (
              <View key={c.id} style={styles.comandaCard}>
                <Text style={styles.comandaTitle}>🏢 {c.nombre}</Text>
                <Text style={styles.comandaSub}>Cliente: {c.cliente}</Text>
                <Text style={styles.comandaSub}>Ubicación: {c.direccion}</Text>
                <Text style={[styles.inputLabel, { marginTop: 5 }]}>Pisos y Secciones:</Text>
                {c.pisos.map(p => (
                  <View key={p.id} style={{ marginLeft: 10, marginTop: 3 }}>
                    <Text style={{ fontWeight: 'bold', color: '#1a1a2e' }}>• {p.nombre}</Text>
                    {p.secciones.map((sec, idx) => (
                      <Text key={idx} style={{ color: '#555', fontSize: 12, marginLeft: 10 }}>- {sec}</Text>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------
// ESTILOS PROFESIONALES DE LA APLICACIÓN
// ---------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  scrollLogin: { padding: 20, alignItems: 'center' },
  headerBox: { alignItems: 'center', marginTop: 20, marginBottom: 15 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#1a1a2e' },
  subTitle: { fontSize: 13, color: '#4a4e69', marginTop: 4 },
  langLabel: { fontSize: 12, fontWeight: 'bold', color: '#333', alignSelf: 'flex-start', marginBottom: 5 },
  langSelector: { flexDirection: 'row', marginBottom: 15 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#e2e8f0', borderRadius: 15, marginRight: 8 },
  langBtnActive: { backgroundColor: '#005691' },
  langBtnText: { fontSize: 12, fontWeight: 'bold', color: '#1a1a2e' },
  cardLogin: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardLoginTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 15 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#4a4e69', marginTop: 10, marginBottom: 3 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, color: '#1a1a2e' },
  btnLogin: { backgroundColor: '#005691', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnLoginText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnForgot: { marginTop: 12, alignItems: 'center' },
  btnForgotText: { color: '#005691', fontSize: 12, textDecorationLine: 'underline' },
  rolesBox: { width: '100%', marginTop: 20, padding: 15, backgroundColor: '#e2e8f0', borderRadius: 10 },
  rolesTitle: { fontSize: 12, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  rolesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  roleChip: { backgroundColor: '#475569', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, margin: 3 },
  roleChipText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  modalSub: { fontSize: 12, color: '#64748b', marginBottom: 15 },
  btnCancel: { marginTop: 10, alignItems: 'center', padding: 10 },
  btnCancelText: { color: '#ef4444', fontWeight: 'bold' },
  cameraOverlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
  btnCloseCamera: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 8, alignSelf: 'flex-start', marginTop: 30 },
  btnCameraText: { color: '#fff', fontWeight: 'bold' },
  btnCapture: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#fff', alignSelf: 'center', marginBottom: 30, justifyContent: 'center', alignItems: 'center' },
  btnCaptureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  topUserTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e' },
  topUserSub: { fontSize: 11, color: '#64748b' },
  btnLogout: { backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  btnLogoutText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  scrollMain: { padding: 15 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 10 },
  menuCard: { padding: 16, borderRadius: 10, marginBottom: 10 },
  menuCardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  menuCardSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  subScreenContainer: { marginTop: 15, padding: 15, backgroundColor: '#fff', borderRadius: 10 },
  btnBackSub: { padding: 8, backgroundColor: '#cbd5e1', borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10 },
  btnBackSubText: { fontSize: 12, fontWeight: 'bold', color: '#1a1a2e' },
  subTitleText: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 10 },
  rowInputs: { flexDirection: 'row', marginBottom: 10 },
  btnAddItem: { backgroundColor: '#10b981', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 10 },
  btnAddItemText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  itemText: { fontSize: 12, color: '#334155', marginVertical: 2 },
  comandaCard: { padding: 10, backgroundColor: '#f1f5f9', borderRadius: 8, marginTop: 8 },
  comandaTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  comandaSub: { fontSize: 11, color: '#475569' },
  comandaStatus: { fontSize: 11, fontWeight: 'bold', color: '#0284c7', marginTop: 2 },
  comandaItem: { fontSize: 11, color: '#334155' },
  userCard: { padding: 10, backgroundColor: '#f1f5f9', borderRadius: 8, marginTop: 6 },
  userCardName: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  userCardSub: { fontSize: 11, color: '#475569' },
  photoBox: { marginBottom: 15, padding: 10, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  photoBoxTitle: { fontSize: 12, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  photoPreview: { width: '100%', height: 200, borderRadius: 8 },
  btnDeletePhoto: { marginTop: 8, backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnDeletePhotoText: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
});
