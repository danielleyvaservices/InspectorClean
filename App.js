import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, Alert, TextInput, StyleSheet, Linking } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
const LANGUAGES = [
  { code: 'es', label: 'Español (Latinoamérica)', flag: '🇲🇽' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'el', label: 'Ελληνικά (Griego)', flag: '🇬🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ko', label: '한국어 (Coreano)', flag: '🇰🇷' },
  { code: 'ja', label: '日本語 (Japonés)', flag: '🇯🇵' },
  { code: 'ar', label: 'العربية (Árabe)', flag: '🇸🇦' },
  { code: 'zh', label: '中文 (Chino)', flag: '🇨🇳' },
];
{/* BOTÓN SUPERIOR DE CONFIGURACIÓN DE IDIOMA */}
<View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 10 }}>
  <TouchableOpacity
    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 8, borderRadius: 20, elevation: 2 }}
    onPress={() => setLangModalVisible(true)}
  >
    <Ionicons name="settings-outline" size={22} color="#444" />
    <MaterialIcons name="language" size={22} color="#007AFF" style={{ marginLeft: 6 }} />
  </TouchableOpacity>
</View>

{/* MODAL DESPLEGABLE CON LOS 11 IDIOMAS */}
<Modal
  visible={isLangModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setLangModalVisible(false)}
>
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
    <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Seleccionar Idioma / Select Language</Text>
        <TouchableOpacity onPress={() => setLangModalVisible(false)}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 10,
              backgroundColor: currentLang === item.code ? '#EBF3FF' : 'transparent',
              borderRadius: 8
            }}
            onPress={() => {
              setCurrentLang(item.code);
              setLangModalVisible(false);
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.flag}   {item.label}</Text>
            {currentLang === item.code && (
              <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>

const TRANSLATIONS = {
  es: {
    title: '🧹 InspectorClean',
    subtitle: 'Gestión Empresarial y Operativa',
    user: 'Usuario:',
    pass: 'Contraseña:',
    loginBtn: 'Iniciar Sesión',
    quickAccess: '💡 Accesos Rápidos (Roles):',
    welcome: 'Bienvenido',
    logout: '🚪 Cerrar Sesión',
    back: '⬅️ Volver',
    save: '💾 Guardar',
    cancel: 'Cancelar',
    cartera: '📁 Cartera General de Contratos',
    createContract: '🏢 Crear o Editar Contrato',
    reports: '📊 Reportes',
    viewSections: '🔍 Evaluación',
    takePhoto: '📷 Tomar Foto Real con Cámara',
    photoAttached: '✅ Foto Capturada y Adjunta',
    sendEvidence: '📤 Enviar Reporte Completo',
    btnVerPersonal: '👥 Lista de Personal',
    btnAltaPersonal: '👤 Usuarios',
    btnAlertaAdmin: '✉️ Mensajes',
    btnComandas: '📦 Comanda',
    startSupervision: '🎯 Hacer Supervisión'
  },
  en: {
    title: '🧹 InspectorClean',
    subtitle: 'Business & Operations Management',
    user: 'Username:',
    pass: 'Password:',
    loginBtn: 'Sign In',
    quickAccess: '💡 Quick Logins:',
    welcome: 'Welcome',
    logout: '🚪 Sign Out',
    back: '⬅️ Back',
    save: '💾 Save',
    cancel: 'Cancel',
    cartera: '📁 General Contract Portfolio',
    createContract: '🏢 Create or Edit Contract',
    reports: '📊 Reports',
    viewSections: '🔍 Evaluation',
    takePhoto: '📷 Take Real Camera Photo',
    photoAttached: '✅ Photo Captured & Attached',
    sendEvidence: '📤 Send Complete Report',
    btnVerPersonal: '👥 Staff List',
    btnAltaPersonal: '👤 Users',
    btnAlertaAdmin: '✉️ Messages',
    btnComandas: '📦 Comanda',
    startSupervision: '🎯 Start Supervision'
  }
};

export default function App() {
const [currentLang, setCurrentLang] = useState('es'); // Español oficial por defecto
const [isLangModalVisible, setLangModalVisible] = useState(false);
  // --- SOPORTE Y RECUPERACIÓN DE CONTRASEÑA ---
  const [modalForgotVisible, setModalForgotVisible] = useState(false);
  const [forgotNombre, setForgotNombre] = useState('');
  const [forgotTelefono, setForgotTelefono] = useState('');
  const [forgotCorreo, setForgotCorreo] = useState('');

  const enviarSolicitudSoporte1 = () => {
      Alert.alert('Campos Incompletos', 'Por favor llena todos los campos para notificar a Soporte 1.');
      return;
    }
    Alert.alert(
      'Solicitud Enviada a Soporte 1',
      `Gracias ${forgotNombre}. Se ha notificado a Soporte 1. Te contactaremos al correo ${forgotCorreo} o teléfono ${forgotTelefono} con tus credenciales.`
    );
    setForgotNombre('');
    setForgotTelefono('');
    setForgotCorreo('');
    setModalForgotVisible(false);
  };

// --- CÁMARA REAL Y CAPTURA ---
  const tomarFotoEvidencia = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso Denegado', 'Se requiere acceso a la cámara.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!res.canceled) {
      Alert.alert('Foto Capturada', 'Imagen guardada correctamente como evidencia.');
    }
  };

  // --- REPORTES PDF Y ENVÍO POR CORREO ---
  const generarYCompartirPDF = async () => {
    try {
      const html = '<html><body><h1 style="color:#0284c7;">Reporte InspectorClean</h1><p>Inspección completada con éxito.</p></body></html>';
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('PDF Generado', 'Guardado en: ' + uri);
      }
    } catch (e) {
      Alert.alert('Error PDF', e.message);
    }
  };
  const enviarPDFPorCorreo = async () => {
    try {
      const disponible = await MailComposer.isAvailableAsync();
      if (!disponible) {
        Alert.alert('Sin Correo', 'No hay un cliente de correo configurado en el dispositivo.');
        return;
      }
      await MailComposer.composeAsync({
        recipients: ['daniel.leyvaservices@gmail.com'],
        subject: 'Reporte de Inspección - InspectorClean',
        body: 'Adjunto se encuentra el reporte detallado de la inspección realizada.',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la aplicación de correo.');
    }
  };
  const [u, setU] = useState('soporte1');
  const [p, setP] = useState(''); 
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [fase, setFase] = useState('LOGIN'); 
  const [seg, setSeg] = useState(0); 
  const [on, setOn] = useState(false);

  const [idiomaActual, setIdiomaActual] = useState('es');
  const t = TRANSLATIONS[idiomaActual] || TRANSLATIONS.es;

  // Permisos de cámara de Expo
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [fotoCapturadaUri, setFotoCapturadaUri] = useState(null);

  // Base de datos de usuarios
  const [usuariosDB, setUsuariosDB] = useState([
    { id: '1', nombre: 'Director', apellidos: 'CEO', user: 'ceo', pass: '1234', rol: 'CEO', tel: '555-0000', email: 'ceo@inspectorclean.com', jefeInmediato: '', contratoAsignado: 'TODOS' },
    { id: '2', nombre: 'Admin Uno', apellidos: 'Pérez', user: 'admin1', pass: '1234', rol: 'ADMINISTRADOR', tel: '555-0001', email: 'admin1@inspectorclean.com', jefeInmediato: 'Director', contratoAsignado: 'TODOS' },
    { id: '3', nombre: 'Soporte', apellidos: 'Técnico', user: 'soporte1', pass: '1234', rol: 'SOPORTE', tel: '555-0002', email: 'soporte@inspectorclean.com', jefeInmediato: 'Director', contratoAsignado: 'TODOS' },
    { id: '4', nombre: 'Jefe Ops', apellidos: 'Alfa', user: 'jefeops1', pass: '1234', rol: 'JEFE_DE_OPERACIONES', tel: '555-0003', email: 'ops1@inspectorclean.com', jefeInmediato: 'Director', contratoAsignado: 'TODOS' },
    { id: '5', nombre: 'Supervisor Contrato', apellidos: 'Beta', user: 'supcon1', pass: '1234', rol: 'SUPERVISOR_CONTRATO', tel: '555-0004', email: 'supcon1@inspectorclean.com', jefeInmediato: 'Jefe Ops Alfa', contratoAsignado: 'Torre Corporativa Reforma' },
    { id: '6', nombre: 'Líder', apellidos: 'Gama', user: 'lider1', pass: '1234', rol: 'LIDER_DE_CONTRATO', tel: '555-5678', email: 'lider1@inspectorclean.com', jefeInmediato: 'Supervisor Contrato Beta', contratoAsignado: 'Torre Corporativa Reforma' },
    { id: '7', nombre: 'Supervisor Ruta', apellidos: 'Delta', user: 'sup1', pass: '1234', rol: 'SUPERVISOR', tel: '555-1234', email: 'sup1@inspectorclean.com', jefeInmediato: 'Líder Gama', contratoAsignado: 'Torre Corporativa Reforma' },
    { id: '8', nombre: 'Pedro', apellidos: 'Limpieza', user: 'jefe1', pass: '1234', rol: 'JEFE_DE_EQUIPO', tel: '555-9999', email: 'pedro@inspectorclean.com', jefeInmediato: 'Supervisor Ruta Delta', contratoAsignado: 'Torre Corporativa Reforma' }
  ]);

  const [edificios, setEdificios] = useState([
    { 
      id: '1', 
      nombre: 'Torre Corporativa Reforma', 
      tipo: 'Comercial', 
      direccion: 'Av. Principal 100', 
      personaContacto: 'Lic. Ana Torres',
      telefonoContacto: '555-4321',
      supervisorContratoAsignado: 'Supervisor Contrato Beta',
      liderAsignado: 'Líder Gama',
      supervisorRutaAsignado: 'Supervisor Ruta Delta',
      jefesEquipoAsignados: ['Pedro Limpieza'],
      pisosData: {
        "Piso 1": ['Baños', 'Cocina', 'Corredores', 'Oficinas', 'Salas de Juntas', 'Área Común o Descanso', 'Ascensores'],
        "Piso 2": ['Baños', 'Cocina', 'Corredores', 'Oficinas', 'Salas de Juntas', 'Área Común o Descanso']
      }
    }
  ]);

  const [reportesGlobales, setReportesGlobales] = useState([
    { id: 'rep-1', edificio: 'Torre Corporativa Reforma', supervisor: 'Pedro Limpieza', fechaHora: '07/08/2026, 11:15 AM', tipo: 'Comercial', tiempo: '6m 12s', detalle: 'Evaluación completa con evidencia fotográfica.' }
  ]);

  const [alertasDB, setAlertasDB] = useState([
    { id: 'alt-1', de: 'Pedro Limpieza', para: 'Líder Gama', mensaje: 'Falta químico en el baño del piso 2.', fecha: '07/08/2026 10:00 AM', respuesta: '' }
  ]);

  const [comandasDB, setComandasDB] = useState([
    { id: 'cmd-1', contrato: 'Torre Corporativa Reforma', fecha: '03 Julio 2026', hora: '09:30 AM', items: [{cantidad: '5', material: 'Cloro industrial 20L', stock: '2 unidades'}], estado: 'Pendiente de revisión' }
  ]);

  const [listaItemsTempComanda, setListaItemsTempComanda] = useState([]);
  const [comandaMaterialInput, setComandaMaterialInput] = useState('');
  const [comandaCantidadInput, setComandaCantidadInput] = useState('');
  const [comandaStockInput, setComandaStockInput] = useState('');

  // Estados para edición de comanda
  const [comandaEditandoId, setComandaEditandoId] = useState(null);
  const [itemsEdicionActual, setItemsEdicionActual] = useState([]);
  const [nuevoMatEdicion, setNuevoMatEdicion] = useState('');
  const [nuevaCantEdicion, setNuevaCantEdicion] = useState('');

  // Edición y vistas detalladas de usuarios
  const [editandoUsrId, setEditandoUsrId] = useState(null);
  const [formNombreUsr, setFormNombreUsr] = useState('');
  const [formApellidosUsr, setFormApellidosUsr] = useState('');
  const [formUserUsr, setFormUserUsr] = useState('');
  const [formPassUsr, setFormPassUsr] = useState('');
  const [formTelUsr, setFormTelUsr] = useState('');
  const [formEmailUsr, setFormEmailUsr] = useState('');
  const [formJefeInmediatoUsr, setFormJefeInmediatoUsr] = useState('');
  const [formRolUsr, setFormRolUsr] = useState('SUPERVISOR');
  const [formContratoAsignadoUsr, setFormContratoAsignadoUsr] = useState('');
  const [busquedaUsuarioInput, setBusquedaUsuarioInput] = useState('');
  const [usuarioSeleccionadoDetalle, setUsuarioSeleccionadoDetalle] = useState(null);

  // Estados avanzados para Contratos, Pisos y Secciones (Solo Soporte, Admin, CEO)
  const [editandoContratoId, setEditandoContratoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('Comercial');
  const [nuevaDir, setNuevaDir] = useState('');
  const [nuevaPersonaContacto, setNuevaPersonaContacto] = useState('');
  const [nuevoTelContacto, setNuevoTelContacto] = useState('');
  
  const [nuevoSupervisorContrato, setNuevoSupervisorContrato] = useState('');
  const [nuevoLiderContrato, setNuevoLiderContrato] = useState('');
  const [nuevoSupervisorRuta, setNuevoSupervisorRuta] = useState('');
  const [nuevoJefeEquipoRotativo, setNuevoJefeEquipoRotativo] = useState('');

  // Estructura de Pisos y Secciones dinámicas para creación/edición de contratos
  const [pisosContratoTemp, setPisosContratoTemp] = useState({
    "Piso 1": ['Baños', 'Cocina', 'Área Común o Descanso', 'Oficinas', 'Ascensores']
  });
  const [nuevoPisoNombreInput, setNuevoPisoNombreInput] = useState('');
  const [pisoSeleccionadoParaSeccion, setPisoSeleccionadoParaSeccion] = useState('Piso 1');
  const [nuevaSeccionManualInput, setNuevaSeccionManualInput] = useState('');

  // Listas de sugerencias para autocompletar en contratos
  const [listaSugerenciasSupContrato, setListaSugerenciasSupContrato] = useState([]);
  const [listaSugerenciasLideres, setListaSugerenciasLideres] = useState([]);
  const [listaSugerenciasSupRuta, setListaSugerenciasSupRuta] = useState([]);

  const [busquedaContratoInput, setBusquedaContratoInput] = useState('');
  const [contratoSeleccionadoDetalle, setContratoSeleccionadoDetalle] = useState(null);

  const [destinatarioAlerta, setDestinatarioAlerta] = useState('');
  const [mensajeAlertaInput, setMensajeAlertaInput] = useState('');
  const [busquedaAlertaInput, setBusquedaAlertaInput] = useState('');
  const [alertaSeleccionadaDetalle, setAlertaSeleccionadaDetalle] = useState(null);
  const [respuestaAlertaInput, setRespuestaAlertaInput] = useState('');

  // Estados para Supervisión / Inspección
  const [edSelec, setEdSelec] = useState(null); 
  const [pisoInspeccionKey, setPisoInspeccionKey] = useState('');
  const [seccionInspeccionIdx, setSeccionInspeccionIdx] = useState(0);
  const [evaluacionesInspeccion, setEvaluacionesInspeccion] = useState({});

  useEffect(() => {
    let tTimer;
    if (on) {
      tTimer = setInterval(() => setSeg(s => s + 1), 1000);
    }
    return () => {
      if (tTimer) clearInterval(tTimer);
    };
  }, [on]);

  const login = () => {
    const encontrado = usuariosDB.find(item => item.user.toLowerCase() === u.trim().toLowerCase() && item.pass === p);
    if (encontrado) {
      setUsuarioActual(encontrado);
      setP('');
      setFase('PANEL_PRINCIPAL');
    } else {
      Alert.alert("Error", "Usuario o contraseña inválidos.");
    }
  };

  const irAtras = () => {
    if (!usuarioActual) {
      setFase('LOGIN');
    } else {
      setFase('PANEL_PRINCIPAL');
    }
  };

  const abrirCamaraDispositivo = async () => {
    if (!cameraPermission || !cameraPermission.granted) {
      const permissionResult = await requestCameraPermission();
      if (!permissionResult.granted) {
        Alert.alert("Permiso denegado", "Se requieren permisos de cámara para tomar fotos de evidencia.");
        return;
      }
    }
    setCamaraActiva(true);
  };

  const tomarFotoReal = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({ skipProcessing: true });
        setFotoCapturadaUri(photo.uri);
        setCamaraActiva(false);
        Alert.alert("Foto Capturada", "Evidencia fotográfica guardada con éxito.");
      } catch (error) {
        Alert.alert("Error", "No se pudo capturar la foto.");
        setCamaraActiva(false);
      }
    }
  };

  const guardarUsuario = () => {
    if (!formNombreUsr.trim() || !formApellidosUsr.trim() || !formUserUsr.trim() || !formPassUsr.trim()) {
      Alert.alert("Incompleto", "Nombre, Apellidos, Usuario y Contraseña son obligatorios.");
      return;
    }

    if (editandoUsrId) {
      setUsuariosDB(usuariosDB.map(usr => usr.id === editandoUsrId ? {
        ...usr, nombre: formNombreUsr, apellidos: formApellidosUsr, user: formUserUsr, pass: formPassUsr, 
        tel: formTelUsr, email: formEmailUsr, jefeInmediato: formJefeInmediatoUsr, rol: formRolUsr, contratoAsignado: formContratoAsignadoUsr
      } : usr));
      Alert.alert("Éxito", "Usuario actualizado.");
    } else {
      const nuevoU = {
        id: Date.now().toString(),
        nombre: formNombreUsr, apellidos: formApellidosUsr, user: formUserUsr, pass: formPassUsr, 
        tel: formTelUsr, email: formEmailUsr, jefeInmediato: formJefeInmediatoUsr, rol: formRolUsr, contratoAsignado: formContratoAsignadoUsr
      };
      setUsuariosDB([...usuariosDB, nuevoU]);
      Alert.alert("Éxito", "Usuario registrado.");
    }

    setEditandoUsrId(null); setFormNombreUsr(''); setFormApellidosUsr(''); setFormUserUsr(''); 
    setFormPassUsr(''); setFormTelUsr(''); setFormEmailUsr(''); setFormJefeInmediatoUsr(''); setFormContratoAsignadoUsr('');
    setUsuarioSeleccionadoDetalle(null);
  };

  const eliminarUsuario = (id) => {
    if (usuarioActual?.rol === 'SUPERVISOR') {
      Alert.alert("Acción no permitida", "El supervisor no cuenta con permisos para eliminar usuarios.");
      return;
    }
    setUsuariosDB(usuariosDB.filter(usr => usr.id !== id));
    setUsuarioSeleccionadoDetalle(null);
    Alert.alert("Eliminado", "El usuario ha sido removido.");
  };

  const prepararEdicionUsuario = (usr) => {
    setEditandoUsrId(usr.id);
    setFormNombreUsr(usr.nombre);
    setFormApellidosUsr(usr.apellidos || '');
    setFormUserUsr(usr.user);
    setFormPassUsr(usr.pass);
    setFormTelUsr(usr.tel || '');
    setFormEmailUsr(usr.email || '');
    setFormJefeInmediatoUsr(usr.jefeInmediato || '');
    setFormRolUsr(usr.rol);
    setFormContratoAsignadoUsr(usr.contratoAsignado || '');
  };

  const handleSupContratoInput = (texto) => {
    setNuevoSupervisorContrato(texto);
    if (texto.trim().length > 0) {
      const filtrados = usuariosDB
        .filter(u => u.rol === 'SUPERVISOR_CONTRATO' && `${u.nombre} ${u.apellidos}`.toLowerCase().includes(texto.toLowerCase()))
        .map(u => `${u.nombre} ${u.apellidos}`);
      setListaSugerenciasSupContrato(filtrados);
    } else {
      setListaSugerenciasSupContrato([]);
    }
  };

  const handleLiderContratoInput = (texto) => {
    setNuevoLiderContrato(texto);
    if (texto.trim().length > 0) {
      const filtrados = usuariosDB
        .filter(u => u.rol === 'LIDER_DE_CONTRATO' && `${u.nombre} ${u.apellidos}`.toLowerCase().includes(texto.toLowerCase()))
        .map(u => `${u.nombre} ${u.apellidos}`);
      setListaSugerenciasLideres(filtrados);
    } else {
      setListaSugerenciasLideres([]);
    }
  };

  const handleSupRutaInput = (texto) => {
    setNuevoSupervisorRuta(texto);
    if (texto.trim().length > 0) {
      const filtrados = usuariosDB
        .filter(u => u.rol === 'SUPERVISOR' && `${u.nombre} ${u.apellidos}`.toLowerCase().includes(texto.toLowerCase()))
        .map(u => `${u.nombre} ${u.apellidos}`);
      setListaSugerenciasSupRuta(filtrados);
    } else {
      setListaSugerenciasSupRuta([]);
    }
  };

  // Funciones para administrar Pisos y Secciones al crear/editar contratos
  const agregarPisoContrato = () => {
    if (!nuevoPisoNombreInput.trim()) return;
    const nombrePiso = nuevoPisoNombreInput.trim();
    if (pisosContratoTemp[nombrePiso]) {
      Alert.alert("Aviso", "Este piso ya existe en el contrato.");
      return;
    }
    setPisosContratoTemp({
      ...pisosContratoTemp,
      [nombrePiso]: ['Baños', 'Cocina', 'Área Común o Descanso', 'Oficinas', 'Ascensores']
    });
    setNuevoPisoNombreInput('');
    setPisoSeleccionadoParaSeccion(nombrePiso);
  };

  const agregarSeccionManualAPiso = () => {
    if (!nuevaSeccionManualInput.trim() || !pisoSeleccionadoParaSeccion) return;
    const secNueva = nuevaSeccionManualInput.trim();
    const seccionesActuales = pisosContratoTemp[pisoSeleccionadoParaSeccion] || [];
    if (seccionesActuales.includes(secNueva)) {
      Alert.alert("Aviso", "Esta sección ya está agregada en este piso.");
      return;
    }
    setPisosContratoTemp({
      ...pisosContratoTemp,
      [pisoSeleccionadoParaSeccion]: [...seccionesActuales, secNueva]
    });
    setNuevaSeccionManualInput('');
  };

  const eliminarSeccionDePiso = (pisoKey, secItem) => {
    const seccionesActuales = pisosContratoTemp[pisoKey] || [];
    const filtradas = seccionesActuales.filter(s => s !== secItem);
    setPisosContratoTemp({
      ...pisosContratoTemp,
      [pisoKey]: filtradas
    });
  };

  const guardarContratoCompleto = () => {
    if (!nuevoNombre.trim() || !nuevaDir.trim()) {
      Alert.alert("Incompleto", "Ingresa el nombre y la dirección del contrato.");
      return;
    }

    if (editandoContratoId) {
      setEdificios(edificios.map(ed => ed.id === editandoContratoId ? {
        ...ed, 
        nombre: nuevoNombre.trim(), 
        tipo: nuevoTipo, 
        direccion: nuevaDir.trim(),
        personaContacto: nuevaPersonaContacto.trim(), 
        telefonoContacto: nuevoTelContacto.trim(),
        supervisorContratoAsignado: nuevoSupervisorContrato.trim() || ed.supervisorContratoAsignado,
        liderAsignado: nuevoLiderContrato.trim() || ed.liderAsignado,
        supervisorRutaAsignado: nuevoSupervisorRuta.trim() || ed.supervisorRutaAsignado,
        pisosData: pisosContratoTemp,
        jefesEquipoAsignados: nuevoJefeEquipoRotativo.trim() 
          ? [nuevoJefeEquipoRotativo.trim(), ...(ed.jefesEquipoAsignados || [])] 
          : (ed.jefesEquipoAsignados || [])
      } : ed));
      Alert.alert("Éxito", "Contrato, tipo, pisos y secciones actualizados correctamente.");
    } else {
      const nuevoContratoObj = {
        id: 'cli-' + Date.now(),
        nombre: nuevoNombre.trim(),
        tipo: nuevoTipo,
        direccion: nuevaDir.trim(),
        personaContacto: nuevaPersonaContacto.trim(),
        telefonoContacto: nuevoTelContacto.trim(),
        supervisorContratoAsignado: nuevoSupervisorContrato.trim() || 'Sin asignar',
        liderAsignado: nuevoLiderContrato.trim() || 'Sin asignar',
        supervisorRutaAsignado: nuevoSupervisorRuta.trim() || 'Sin asignar',
        jefesEquipoAsignados: nuevoJefeEquipoRotativo.trim() ? [nuevoJefeEquipoRotativo.trim()] : [],
        pisosData: pisosContratoTemp
      };
      setEdificios([...edificios, nuevoContratoObj]);
      Alert.alert("Éxito", "Nuevo contrato creado con éxito.");
    }

    setEditandoContratoId(null);
    setNuevoNombre(''); setNuevaDir(''); setNuevaPersonaContacto(''); setNuevoTelContacto(''); 
    setNuevoSupervisorContrato(''); setNuevoLiderContrato(''); setNuevoSupervisorRuta(''); setNuevoJefeEquipoRotativo('');
    setPisosContratoTemp({ "Piso 1": ['Baños', 'Cocina', 'Área Común o Descanso', 'Oficinas', 'Ascensores'] });
    setContratoSeleccionadoDetalle(null);
    setFase('PANEL_PRINCIPAL');
  };

  const eliminarContrato = (id) => {
    if (!['CEO', 'ADMINISTRADOR', 'SOPORTE'].includes(usuarioActual?.rol)) {
      Alert.alert("Acción no permitida", "Solo Soporte, Admin y CEO pueden eliminar contratos.");
      return;
    }
    setEdificios(edificios.filter(e => e.id !== id));
    setContratoSeleccionadoDetalle(null);
    Alert.alert("Eliminado", "El contrato ha sido removido.");
  };

  const prepararEdicionContrato = (cli) => {
    setEditandoContratoId(cli.id);
    setNuevoNombre(cli.nombre);
    setNuevoTipo(cli.tipo || 'Comercial');
    setNuevaDir(cli.direccion);
    setNuevaPersonaContacto(cli.personaContacto || '');
    setNuevoTelContacto(cli.telefonoContacto || '');
    setNuevoSupervisorContrato(cli.supervisorContratoAsignado || '');
    setNuevoLiderContrato(cli.liderAsignado || '');
    setNuevoSupervisorRuta(cli.supervisorRutaAsignado || '');
    setPisosContratoTemp(cli.pisosData || { "Piso 1": ['Baños', 'Cocina', 'Área Común o Descanso', 'Oficinas', 'Ascensores'] });
    setFase('NUEVO_CONTRATO');
  };

  const iniciarEdicionComanda = (cmd) => {
    setComandaEditandoId(cmd.id);
    setItemsEdicionActual([...cmd.items]);
  };

  const eliminarItemEdicion = (idx) => {
    const actualizados = itemsEdicionActual.filter((_, i) => i !== idx);
    setItemsEdicionActual(actualizados);
  };

  const agregarItemEdicion = () => {
    if (!nuevoMatEdicion.trim() || !nuevaCantEdicion.trim()) {
      Alert.alert("Incompleto", "Ingresa cantidad y material.");
      return;
    }
    setItemsEdicionActual([...itemsEdicionActual, { cantidad: nuevaCantEdicion.trim(), material: nuevoMatEdicion.trim(), stock: 'N/A' }]);
    setNuevoMatEdicion('');
    setNuevaCantEdicion('');
  };

  const guardarCambiosComanda = (cmdId) => {
    setComandasDB(comandasDB.map(c => c.id === cmdId ? { ...c, items: itemsEdicionActual } : c));
    setComandaEditandoId(null);
    Alert.alert("Actualizado", "Los artículos de la comanda fueron modificados.");
  };

  const supervisorValidaYEnviaOps = (cmd) => {
    const actualizada = {
      ...cmd,
      items: comandaEditandoId === cmd.id ? itemsEdicionActual : cmd.items,
      estado: 'Validado por Supervisor, enviado a Operaciones'
    };
    setComandasDB(comandasDB.map(c => c.id === cmd.id ? actualizada : c));
    setComandaEditandoId(null);
    Alert.alert("📦 Comanda Validada", "La comanda fue revisada y enviada a Operaciones.");
  };

  const supervisorContratoValidaYEnviaOps = (cmd) => {
    const actualizada = {
      ...cmd,
      items: comandaEditandoId === cmd.id ? itemsEdicionActual : cmd.items,
      estado: 'Validado por Supervisor de Contrato, enviado a Operaciones'
    };
    setComandasDB(comandasDB.map(c => c.id === cmd.id ? actualizada : c));
    setComandaEditandoId(null);
    Alert.alert("📦 Comanda Validada", "El Supervisor de Contrato validó y envió la comanda a Operaciones.");
  };

  const liderValidaYEnviaOps = (cmd) => {
    const actualizada = {
      ...cmd,
      items: comandaEditandoId === cmd.id ? itemsEdicionActual : cmd.items,
      estado: 'Validado por Líder, enviado a Operaciones'
    };
    setComandasDB(comandasDB.map(c => c.id === cmd.id ? actualizada : c));
    setComandaEditandoId(null);
    Alert.alert("🚀 Comanda Validada", "La comanda fue revisada por el líder y enviada a Operaciones.");
  };

  const abrirCorreoNativoProveedor = (cmd, medio) => {
    const asunto = encodeURIComponent(`Comanda de Pedido - ${cmd.contrato}`);
    let cuerpoTexto = `Estimado Proveedor,\n\nAdjunto los detalles de la comanda oficial para el contrato ${cmd.contrato} (Fecha: ${cmd.fecha}):\n\n`;
    
    cmd.items.forEach((it, i) => {
      cuerpoTexto += `${i + 1}. Cantidad: ${it.cantidad} - Producto: ${it.material} (Stock: ${it.stock})\n`;
    });

    cuerpoTexto += `\nEstado: ${cmd.estado}\n\nAtentamente,\nJefatura de Operaciones - InspectorClean`;

    const cuerpo = encodeURIComponent(cuerpoTexto);
    const mailtoUrl = `mailto:proveedor@inspectorclean.com?subject=${asunto}&body=${cuerpo}`;

    Linking.openURL(mailtoUrl).catch((err) => {
      Alert.alert("Error", "No se pudo abrir la aplicación de correo en este dispositivo.");
    });

    const actualizada = {
      ...cmd,
      estado: `Enviada a Proveedor vía ${medio}`
    };
    setComandasDB(comandasDB.map(c => c.id === cmd.id ? actualizada : c));
  };

  const agregarItemAComandaTemp = () => {
    if (!comandaMaterialInput.trim() || !comandaCantidadInput.trim()) {
      Alert.alert("Incompleto", "Ingresa la cantidad y el material.");
      return;
    }
    const nuevoItem = {
      cantidad: comandaCantidadInput.trim(),
      material: comandaMaterialInput.trim(),
      stock: comandaStockInput.trim() || 'N/A'
    };
    setListaItemsTempComanda([...listaItemsTempComanda, nuevoItem]);
    setComandaMaterialInput('');
    setComandaCantidadInput('');
    setComandaStockInput('');
  };

  const guardarYEnviarComandaFinal = () => {
    if (listaItemsTempComanda.length === 0) return;
    const nuevaComanda = {
      id: 'cmd-' + Date.now(),
      contrato: usuarioActual?.contratoAsignado !== 'TODOS' ? usuarioActual?.contratoAsignado : 'Torre Corporativa Reforma',
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      items: listaItemsTempComanda,
      estado: 'Pendiente de revisión'
    };
    setComandasDB([nuevaComanda, ...comandasDB]);
    setListaItemsTempComanda([]);
    Alert.alert("📦 Comanda Creada", "El pedido se generó y envió con éxito.");
  };

  const enviarAlerta = () => {
    if (!destinatarioAlerta.trim() || !mensajeAlertaInput.trim()) {
      Alert.alert("Incompleto", "Escribe un destinatario y un mensaje para la alerta.");
      return;
    }
    const nuevaAlerta = {
      id: 'alt-' + Date.now(),
      de: `${usuarioActual?.nombre} ${usuarioActual?.apellidos || ''}`,
      para: destinatarioAlerta.trim(),
      mensaje: mensajeAlertaInput.trim(),
      fecha: new Date().toLocaleString(),
      respuesta: ''
    };
    setAlertasDB([nuevaAlerta, ...alertasDB]);
    setDestinatarioAlerta('');
    setMensajeAlertaInput('');
    Alert.alert("🚀 Alerta Enviada", "La notificación se ha registrado con éxito.");
  };

  const responderAlerta = () => {
    if (!respuestaAlertaInput.trim() || !alertaSeleccionadaDetalle) return;
    setAlertasDB(alertasDB.map(alt => alt.id === alertaSeleccionadaDetalle.id ? { ...alt, respuesta: respuestaAlertaInput.trim() } : alt));
    setRespuestaAlertaInput('');
    setAlertaSeleccionadaDetalle(null);
    Alert.alert("Éxito", "Respuesta enviada a la alerta.");
  };

  const finalizarInspeccion = () => {
    setOn(false);
    const nuevoReporte = {
      id: 'rep-' + Date.now(),
      edificio: edSelec?.nombre,
      tipo: edSelec?.tipo ?? 'General',
      supervisor: `${usuarioActual?.nombre} ${usuarioActual?.apellidos || ''}`,
      fechaHora: new Date().toLocaleString(),
      tiempo: `${Math.floor(seg / 60)}m ${seg % 60}s`,
      detalle: fotoCapturadaUri ? 'Inspección completada con foto real adjunta.' : 'Inspección completada.'
    };
    setReportesGlobales([nuevoReporte, ...reportesGlobales]);
    setEvaluacionesInspeccion({});
    setFotoCapturadaUri(null);
    setFase('PANEL_PRINCIPAL');
    Alert.alert("☁️ Reporte Enviado", "Reporte y foto guardados correctamente.");
  };

  const actualizarEvaluacionItem = (pisoNombre, seccionNombre, campo, valor) => {
    setEvaluacionesInspeccion(prev => {
      const pisoMap = prev[pisoNombre] || {};
      const seccionData = pisoMap[seccionNombre] || { nota: 5, comentario: '', foto: false };
      return {
        ...prev,
        [pisoNombre]: {
          ...pisoMap,
          [seccionNombre]: { ...seccionData, [campo]: valor }
        }
      };
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f9', padding: 20 }}>
      <ScrollView style={{ direction: 'ltr' }}>

        {camaraActiva ? (
          <View style={{ height: 500, width: '100%', marginBottom: 15 }}>
            <CameraView style={{ flex: 1 }} ref={(ref) => setCameraRef(ref)}>
              <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', padding: 20, alignItems: 'center' }}>
                <TouchableOpacity style={[styles.btnR, { backgroundColor: '#34495e', width: '80%' }]} onPress={tomarFotoReal}>
                  <Text style={styles.txt}>📸 Capturar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnR, { backgroundColor: '#e74c3c', width: '80%', marginTop: 8 }]} onPress={() => setCamaraActiva(false)}>
                  <Text style={styles.txt}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 15, alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', marginRight: 8, color: '#7f8c8d' }}>🌍 Lang:</Text>
          {['es', 'en'].map((lang) => (
            <TouchableOpacity 
              key={lang} 
              style={[styles.btnLang, idiomaActual === lang ? { backgroundColor: '#34495e' } : { backgroundColor: '#e2e8f0' }]}
              onPress={() => setIdiomaActual(lang)}
            >
              <Text style={idiomaActual === lang ? { color: '#FFF', fontWeight: 'bold', fontSize: 10 } : { color: '#333', fontSize: 10, fontWeight: 'bold' }}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {fase === 'LOGIN' && (
          <View style={{ marginTop: 20, backgroundColor: '#ffffff', padding: 25, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#2c3e50' }}>{t.title}</Text>
            <Text style={{ fontSize: 13, color: '#7f8c8d', textAlign: 'center', marginBottom: 25 }}>{t.subtitle}</Text>
            
            <Text style={{ marginBottom: 5, fontWeight: 'bold', color: '#34495e' }}>{t.user}</Text>
            <TextInput style={styles.input} placeholder="ceo, soporte1, admin1, supcon1, lider1" value={u} onChangeText={setU} autoCapitalize="none" />
            
            <Text style={{ marginBottom: 5, fontWeight: 'bold', color: '#34495e' }}>{t.pass}</Text>
            <TextInput style={styles.input} placeholder="••••" secureTextEntry value={p} onChangeText={setP} />

            <TouchableOpacity style={styles.btnR} onPress={login}><Text style={styles.txt}>{t.loginBtn}</Text></TouchableOpacity>

            <View style={[styles.card, { marginTop: 25, backgroundColor: '#f8f9fa' }]}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>{t.quickAccess}</Text>
              <Text style={{ fontSize: 11, color: '#666' }}>• Soporte: soporte1 / 1234</Text>
              <Text style={{ fontSize: 11, color: '#666' }}>• Admin: admin1 / 1234</Text>
              <Text style={{ fontSize: 11, color: '#666' }}>• CEO: ceo / 1234</Text>
            </View>
          </View>
        )}

        {/* PANEL PRINCIPAL */}
        {fase === 'PANEL_PRINCIPAL' && usuarioActual && (
          <View style={{ marginTop: 10 }}>
            <View style={{ marginBottom: 20, backgroundColor: '#ffffff', padding: 15, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#34495e' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2c3e50' }}>
                ⚙️ Panel ({usuarioActual.rol})
              </Text>
              <Text style={{ color: '#7f8c8d', marginTop: 2 }}>{t.welcome}, {usuarioActual.nombre} {usuarioActual.apellidos || ''}</Text>
            </View>

            <View style={styles.gridContainer}>

              {usuarioActual.rol === 'JEFE_DE_EQUIPO' ? (
                <>
                  <TouchableOpacity style={styles.tileButton} onPress={() => {
                    const contratoObj = edificios.find(e => e.nombre === usuarioActual.contratoAsignado) || edificios[0];
                    setEdSelec(contratoObj);
                    const primerPiso = Object.keys(contratoObj.pisosData)[0];
                    setPisoInspeccionKey(primerPiso);
                    setSeccionInspeccionIdx(0);
                    setSeg(0); setOn(true); setEvaluacionesInspeccion({});
                    setFase('INSPECCION');
                  }}>
                    <Text style={styles.tileIcon}>🔍</Text>
                    <Text style={styles.tileText}>{t.viewSections}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.tileButton} onPress={() => setFase('SECCION_COMANDAS')}>
                    <Text style={styles.tileIcon}>📦</Text>
                    <Text style={styles.tileText}>{t.btnComandas}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.tileButton} onPress={() => setFase('SECCION_ALERTAS')}>
                    <Text style={styles.tileIcon}>✉️</Text>
                    <Text style={styles.tileText}>{t.btnAlertaAdmin}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {(['CEO', 'ADMINISTRADOR', 'SOPORTE', 'JEFE_DE_OPERACIONES', 'SUPERVISOR_CONTRATO', 'LIDER_DE_CONTRATO', 'SUPERVISOR'].includes(usuarioActual.rol)) && (
                    <TouchableOpacity style={styles.tileButton} onPress={() => { setEditandoContratoId(null); setFase('CARTERA_CLIENTES'); }}>
                      <Text style={styles.tileIcon}>🏢</Text>
                      <Text style={styles.tileText}>Contratos</Text>
                    </TouchableOpacity>
                  )}

                  {(['CEO', 'ADMINISTRADOR', 'SOPORTE', 'JEFE_DE_OPERACIONES'].includes(usuarioActual.rol)) && (
                    <TouchableOpacity style={styles.tileButton} onPress={() => { setEditandoUsrId(null); setFormNombreUsr(''); setFormApellidosUsr(''); setFormUserUsr(''); setFormPassUsr(''); setFormTelUsr(''); setFormEmailUsr(''); setFase('ALTA_PERSONAL'); }}>
                      <Text style={styles.tileIcon}>👤</Text>
                      <Text style={styles.tileText}>{t.btnAltaPersonal}</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.tileButton} onPress={() => setFase('SECCION_ALERTAS')}>
                    <Text style={styles.tileIcon}>✉️</Text>
                    <Text style={styles.tileText}>{t.btnAlertaAdmin}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.tileButton} onPress={() => setFase('SECCION_COMANDAS')}>
                    <Text style={styles.tileIcon}>📦</Text>
                    <Text style={styles.tileText}>{t.btnComandas}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.tileButton} onPress={() => setFase('VER_REPORTES_ADMIN')}>
                    <Text style={styles.tileIcon}>📋</Text>
                    <Text style={styles.tileText}>{t.reports}</Text>
                  </TouchableOpacity>

                  {(['CEO', 'JEFE_DE_OPERACIONES', 'SUPERVISOR_CONTRATO', 'LIDER_DE_CONTRATO', 'SUPERVISOR'].includes(usuarioActual.rol)) && (
                    <TouchableOpacity style={styles.tileButton} onPress={() => setFase('SELECCIONAR_CONTRATO_SUPERVISION')}>
                      <Text style={styles.tileIcon}>🎯</Text>
                      <Text style={styles.tileText}>Supervisión</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

            </View>

            <TouchableOpacity style={[styles.btnR, { backgroundColor: '#c0392b', marginTop: 25, borderRadius: 8 }]} onPress={() => { setUsuarioActual(null); setFase('LOGIN'); }}>
              <Text style={styles.txt}>{t.logout}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SELECCIÓN PREVIA DE CONTRATO PARA SUPERVISIÓN */}
        {fase === 'SELECCIONAR_CONTRATO_SUPERVISION' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 }}>🎯 Seleccionar Contrato</Text>
            <Text style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 15 }}>Selecciona el edificio asignado para iniciar el contador y la supervisión:</Text>

            {edificios
              .filter(cli => {
                if (['CEO', 'JEFE_DE_OPERACIONES', 'ADMINISTRADOR', 'SOPORTE'].includes(usuarioActual?.rol)) return true;
                const nombreCompleto = `${usuarioActual.nombre} ${usuarioActual.apellidos}`;
                return cli.supervisorContratoAsignado === nombreCompleto || 
                       cli.liderAsignado === nombreCompleto || 
                       cli.supervisorRutaAsignado === nombreCompleto;
              })
              .map((cli) => (
                <TouchableOpacity 
                  key={cli.id} 
                  style={[styles.card, { backgroundColor: '#ffffff', borderColor: '#34495e', borderWidth: 1.5 }]} 
                  onPress={() => {
                    setEdSelec(cli);
                    const primerPiso = Object.keys(cli.pisosData)[0];
                    setPisoInspeccionKey(primerPiso);
                    setSeccionInspeccionIdx(0);
                    setSeg(0); 
                    setOn(true); 
                    setEvaluacionesInspeccion({});
                    setFase('INSPECCION');
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#2c3e50' }}>🏢 {cli.nombre}</Text>
                  <Text style={{ fontSize: 11, color: '#27ae60', fontWeight: 'bold', marginTop: 3 }}>🏷️ Tipo: {cli.tipo}</Text>
                  <Text style={{ fontSize: 12, color: '#7f8c8d', marginTop: 2 }}>📍 {cli.direccion}</Text>
                  <Text style={{ fontSize: 11, color: '#2980b9', fontWeight: 'bold', marginTop: 5 }}>👉 Toca para iniciar supervisión</Text>
                </TouchableOpacity>
              ))}

            <TouchableOpacity style={[styles.btnBackGrande, { marginTop: 15 }]} onPress={irAtras}>
              <Text style={styles.txtBackGrande}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* LISTA DE PERSONAL */}
        {fase === 'VER_LISTA_PERSONAL' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 }}>👥 Personal Registrado</Text>
            <TextInput style={styles.input} placeholder="🔍 Buscar por nombre..." value={busquedaUsuarioInput} onChangeText={setBusquedaUsuarioInput} />

            {usuariosDB
              .filter(usr => {
                const matchNombre = `${usr.nombre} ${usr.apellidos || ''}`.toLowerCase().includes(busquedaUsuarioInput.toLowerCase());
                if (usuarioActual?.rol === 'SUPERVISOR') {
                  return matchNombre && (usr.jefeInmediato === `${usuarioActual.nombre} ${usuarioActual.apellidos}` || usr.rol === 'JEFE_DE_EQUIPO');
                }
                return matchNombre;
              })
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((usr) => (
                <TouchableOpacity key={usr.id} style={[styles.card, { backgroundColor: '#ffffff' }]} onPress={() => setUsuarioSeleccionadoDetalle(usr)}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#2c3e50' }}>👤 {usr.nombre} {usr.apellidos || ''}</Text>
                  <Text style={{ fontSize: 12, color: '#34495e' }}>🏷️ Rol: {usr.rol}</Text>
                </TouchableOpacity>
              ))}

            {usuarioSeleccionadoDetalle && (
              <View style={[styles.card, { backgroundColor: '#ffffff', borderColor: '#34495e', borderWidth: 2 }]}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 6 }}>📄 Detalles de {usuarioSeleccionadoDetalle.nombre}</Text>
                <Text style={{ fontSize: 12 }}>🔑 Usuario: {usuarioSeleccionadoDetalle.user}</Text>
                <Text style={{ fontSize: 12 }}>📱 Tel: {usuarioSeleccionadoDetalle.tel || 'N/A'}</Text>
                <Text style={{ fontSize: 12 }}>📧 Email: {usuarioSeleccionadoDetalle.email || 'N/A'}</Text>
                <Text style={{ fontSize: 12, color: 'green', fontWeight: 'bold' }}>🏢 Contrato: {usuarioSeleccionadoDetalle.contratoAsignado}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                  <TouchableOpacity style={{ backgroundColor: '#f39c12', padding: 8, borderRadius: 6, flex: 1, marginRight: 5, alignItems: 'center' }} onPress={() => { prepararEdicionUsuario(usuarioSeleccionadoDetalle); setFase('ALTA_PERSONAL'); }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>✏️ Editar</Text>
                  </TouchableOpacity>
                  {usuarioActual?.rol !== 'SUPERVISOR' && (
                    <TouchableOpacity style={{ backgroundColor: '#e74c3c', padding: 8, borderRadius: 6, flex: 1, marginLeft: 5, alignItems: 'center' }} onPress={() => eliminarUsuario(usuarioSeleccionadoDetalle.id)}>
                      <Text style={{ fontSize: 12, color: '#FFF', fontWeight: 'bold' }}>🗑️ Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity style={[styles.btnBackGrande, { marginTop: 15 }]} onPress={() => setFase('ALTA_PERSONAL')}>
              <Text style={styles.txtBackGrande}>⬅️ Volver a Alta de Usuario</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CARTERA DE CONTRATOS */}
        {fase === 'CARTERA_CLIENTES' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 }}>{t.cartera}</Text>

            {/* Únicamente SOPORTE, ADMIN y CEO pueden crear contratos */}
            {(['CEO', 'ADMINISTRADOR', 'SOPORTE'].includes(usuarioActual?.rol)) && (
              <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginBottom: 15 }]} onPress={() => { 
                setEditandoContratoId(null); 
                setNuevoNombre(''); 
                setNuevaDir(''); 
                setNuevaPersonaContacto(''); 
                setNuevoTelContacto(''); 
                setNuevoSupervisorContrato(''); 
                setNuevoLiderContrato(''); 
                setNuevoSupervisorRuta(''); 
                setPisosContratoTemp({ "Piso 1": ['Baños', 'Cocina', 'Área Común o Descanso', 'Oficinas', 'Ascensores'] });
                setFase('NUEVO_CONTRATO'); 
              }}>
                <Text style={styles.txt}>➕ Crear Nuevo Contrato</Text>
              </TouchableOpacity>
            )}

            <TextInput style={styles.input} placeholder="🔍 Buscar contrato..." value={busquedaContratoInput} onChangeText={setBusquedaContratoInput} />

            {edificios
              .filter(cli => {
                const matchNombre = cli.nombre.toLowerCase().includes(busquedaContratoInput.toLowerCase());
                if (usuarioActual?.rol === 'SUPERVISOR_CONTRATO') {
                  return matchNombre && cli.supervisorContratoAsignado === `${usuarioActual.nombre} ${usuarioActual.apellidos}`;
                }
                if (usuarioActual?.rol === 'LIDER_DE_CONTRATO') {
                  return matchNombre && cli.liderAsignado === `${usuarioActual.nombre} ${usuarioActual.apellidos}`;
                }
                if (usuarioActual?.rol === 'SUPERVISOR') {
                  return matchNombre && cli.supervisorRutaAsignado === `${usuarioActual.nombre} ${usuarioActual.apellidos}`;
                }
                return matchNombre;
              })
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((cli) => (
                <TouchableOpacity key={cli.id} style={[styles.card, { backgroundColor: '#ffffff' }]} onPress={() => setContratoSeleccionadoDetalle(cli)}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#2c3e50' }}>🏢 {cli.nombre}</Text>
                  <Text style={{ fontSize: 12, color: '#27ae60', fontWeight: 'bold' }}>🏷️ Tipo: {cli.tipo}</Text>
                </TouchableOpacity>
              ))}

            {contratoSeleccionadoDetalle && (
              <View style={[styles.card, { backgroundColor: '#ffffff', borderColor: '#27ae60', borderWidth: 2 }]}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#27ae60', marginBottom: 6 }}>🏢 {contratoSeleccionadoDetalle.nombre}</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#2980b9' }}>🏷️ Tipo de Contrato: {contratoSeleccionadoDetalle.tipo}</Text>
                <Text style={{ fontSize: 12 }}>📍 Dirección: {contratoSeleccionadoDetalle.direccion}</Text>
                <Text style={{ fontSize: 12 }}>👤 Contacto: {contratoSeleccionadoDetalle.personaContacto} | 📞 {contratoSeleccionadoDetalle.telefonoContacto}</Text>
                <Text style={{ fontSize: 12 }}>👔 Sup. Contrato: {contratoSeleccionadoDetalle.supervisorContratoAsignado}</Text>
                <Text style={{ fontSize: 12 }}>👑 Líder Asignado: {contratoSeleccionadoDetalle.liderAsignado}</Text>
                <Text style={{ fontSize: 12 }}>🎯 Sup. Ruta: {contratoSeleccionadoDetalle.supervisorRutaAsignado}</Text>
                <Text style={{ fontSize: 12, color: '#2980b9', fontWeight: 'bold', marginTop: 4 }}>🧹 Jefes de Equipo Actuales: {contratoSeleccionadoDetalle.jefesEquipoAsignados?.join(', ') || 'Ninguno asignado'}</Text>

                <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>🏗️ Pisos y Secciones Configurados:</Text>
                  {contratoSeleccionadoDetalle.pisosData && Object.keys(contratoSeleccionadoDetalle.pisosData).map((pKey, i) => (
                    <Text key={i} style={{ fontSize: 11, color: '#555', marginTop: 2 }}>• {pKey}: {(contratoSeleccionadoDetalle.pisosData[pKey] || []).join(', ')}</Text>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                  {/* Únicamente SOPORTE, ADMIN y CEO pueden editar contratos */}
                  {(['CEO', 'ADMINISTRADOR', 'SOPORTE'].includes(usuarioActual?.rol)) && (
                    <TouchableOpacity style={{ backgroundColor: '#f39c12', padding: 8, borderRadius: 6, flex: 1, marginRight: 5, alignItems: 'center' }} onPress={() => prepararEdicionContrato(contratoSeleccionadoDetalle)}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>✏️ Editar Contrato</Text>
                    </TouchableOpacity>
                  )}
                  {(['CEO', 'ADMINISTRADOR', 'SOPORTE'].includes(usuarioActual?.rol)) && (
                    <TouchableOpacity style={{ backgroundColor: '#e74c3c', padding: 8, borderRadius: 6, flex: 1, marginLeft: 5, alignItems: 'center' }} onPress={() => eliminarContrato(contratoSeleccionadoDetalle.id)}>
                      <Text style={{ fontSize: 12, color: '#FFF', fontWeight: 'bold' }}>🗑️ Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity style={[styles.btnBackGrande, { marginTop: 15 }]} onPress={irAtras}>
              <Text style={styles.txtBackGrande}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECCIÓN ALERTAS */}
        {fase === 'SECCION_ALERTAS' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 }}>✉️ Mensajes y Alertas</Text>
            
            {alertasDB.map((alt) => (
              <TouchableOpacity key={alt.id} style={[styles.card, { backgroundColor: '#fef9e7' }]} onPress={() => setAlertaSeleccionadaDetalle(alt)}>
                <Text style={{ fontWeight: 'bold', color: '#d68910' }}>De: {alt.de} ➔ Para: {alt.para}</Text>
                <Text style={{ fontSize: 13, color: '#333', marginTop: 4 }}>{alt.mensaje}</Text>
                <Text style={{ fontSize: 10, color: '#7f8c8d', marginTop: 2 }}>{alt.fecha}</Text>
                {alt.respuesta ? <Text style={{ fontSize: 11, color: 'green', fontWeight: 'bold', marginTop: 4 }}>Respuesta: {alt.respuesta}</Text> : null}
              </TouchableOpacity>
            ))}

            <TextInput style={[styles.input, { marginTop: 5 }]} placeholder="🔍 Buscar mensaje..." value={busquedaAlertaInput} onChangeText={setBusquedaAlertaInput} />

            {alertaSeleccionadaDetalle && (
              <View style={[styles.card, { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#f39c12' }]}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Responder Mensaje:</Text>
                <TextInput style={[styles.input, { height: 60 }]} placeholder="Escribe tu respuesta..." value={respuestaAlertaInput} onChangeText={setRespuestaAlertaInput} multiline />
                <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60' }]} onPress={responderAlerta}>
                  <Text style={styles.txt}>📤 Enviar Respuesta</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.card, { backgroundColor: '#ffffff', marginTop: 15 }]}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8, color: '#2c3e50' }}>Nuevo Mensaje:</Text>
              <TextInput style={styles.input} placeholder="Destinatario..." value={destinatarioAlerta} onChangeText={setDestinatarioAlerta} />
              <TextInput style={[styles.input, { height: 60 }]} placeholder="Mensaje..." value={mensajeAlertaInput} onChangeText={setMensajeAlertaInput} multiline />
              <TouchableOpacity style={[styles.btnR, { backgroundColor: '#e67e22' }]} onPress={enviarAlerta}>
                <Text style={styles.txt}>🚀 Enviar Mensaje</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.btnBackGrande, { marginTop: 15 }]} onPress={irAtras}>
              <Text style={styles.txtBackGrande}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* COMANDAS Y PEDIDOS */}
        {fase === 'SECCION_COMANDAS' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 }}>📦 Comandas y Pedidos</Text>

            {comandasDB.map((cmd) => {
              const estaEditandoEste = comandaEditandoId === cmd.id;

              return (
                <View key={cmd.id} style={[styles.card, { backgroundColor: '#ffffff' }]}>
                  <Text style={{ fontWeight: 'bold', color: '#2c3e50' }}>📋 Comanda de {cmd.contrato}</Text>
                  <Text style={{ fontSize: 12, color: '#7f8c8d' }}>🕒 {cmd.fecha} - {cmd.hora}</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#8e44ad', marginTop: 2 }}>Estado: {cmd.estado}</Text>
                  
                  {!estaEditandoEste ? (
                    <>
                      {cmd.items?.map((it, idx) => (
                        <Text key={idx} style={{ fontSize: 12, color: '#333', marginTop: 2 }}>• {it.cantidad}x {it.material} (Stock: {it.stock})</Text>
                      ))}

                      {(['SUPERVISOR', 'SUPERVISOR_CONTRATO', 'LIDER_DE_CONTRATO'].includes(usuarioActual?.rol)) && (
                        <TouchableOpacity style={[styles.btnR, { backgroundColor: '#f39c12', marginTop: 8 }]} onPress={() => iniciarEdicionComanda(cmd)}>
                          <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>✏️ Modificar / Quitar / Agregar Artículos</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <View style={{ marginTop: 10, padding: 10, backgroundColor: '#fef9e7', borderRadius: 6, borderWidth: 1, borderColor: '#fcf3cf' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#7d6608', marginBottom: 6 }}>⚙️ Editando Artículos de la Comanda:</Text>
                      
                      {itemsEdicionActual.map((it, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, backgroundColor: '#FFF', padding: 6, borderRadius: 4 }}>
                          <Text style={{ fontSize: 12, color: '#333', flex: 1 }}>• {it.cantidad}x {it.material}</Text>
                          <TouchableOpacity style={{ backgroundColor: '#e74c3c', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3 }} onPress={() => eliminarItemEdicion(idx)}>
                            <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>❌ Quitar</Text>
                          </TouchableOpacity>
                        </View>
                      ))}

                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#7d6608', marginTop: 8, marginBottom: 4 }}>➕ Agregar Nuevo Artículo:</Text>
                      <TextInput style={[styles.input, { height: 36, marginBottom: 6, backgroundColor: '#FFF' }]} placeholder="Cantidad..." value={nuevaCantEdicion} onChangeText={setNuevaCantEdicion} keyboardType="numeric" />
                      <TextInput style={[styles.input, { height: 36, marginBottom: 6, backgroundColor: '#FFF' }]} placeholder="Material o producto..." value={nuevoMatEdicion} onChangeText={setNuevoMatEdicion} />
                      
                      <TouchableOpacity style={[styles.btnR, { backgroundColor: '#2980b9', marginTop: 2, padding: 8 }]} onPress={agregarItemEdicion}>
                        <Text style={styles.txt}>➕ Añadir a la Comanda</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginTop: 6, padding: 8 }]} onPress={() => guardarCambiosComanda(cmd.id)}>
                        <Text style={styles.txt}>💾 Guardar Cambios en Artículos</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {usuarioActual?.rol === 'SUPERVISOR' && !estaEditandoEste && (
                    <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginTop: 10 }]} onPress={() => supervisorValidaYEnviaOps(cmd)}>
                      <Text style={styles.txt}>📤 Validar y Enviar a Operaciones</Text>
                    </TouchableOpacity>
                  )}

                  {usuarioActual?.rol === 'SUPERVISOR_CONTRATO' && !estaEditandoEste && (
                    <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginTop: 10 }]} onPress={() => supervisorContratoValidaYEnviaOps(cmd)}>
                      <Text style={styles.txt}>📤 Validar y Enviar a Operaciones</Text>
                    </TouchableOpacity>
                  )}

                  {usuarioActual?.rol === 'LIDER_DE_CONTRATO' && !estaEditandoEste && (
                    <TouchableOpacity style={[styles.btnR, { backgroundColor: '#34495e', marginTop: 10 }]} onPress={() => liderValidaYEnviaOps(cmd)}>
                      <Text style={styles.txt}>🚀 Validar y Enviar a Operaciones</Text>
                    </TouchableOpacity>
                  )}

                  {(['JEFE_DE_OPERACIONES', 'CEO', 'ADMINISTRADOR'].includes(usuarioActual?.rol)) && (
                    <View style={{ marginTop: 10, padding: 8, backgroundColor: '#ebf5fb', borderRadius: 6, borderWidth: 1, borderColor: '#AED6F1' }}>
                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#2980b9', marginBottom: 6 }}>⚙️ Panel de Operaciones (Proveedor):</Text>
                      
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <TouchableOpacity style={{ backgroundColor: '#f39c12', padding: 6, borderRadius: 4, flex: 1, marginRight: 4, alignItems: 'center' }} onPress={() => Alert.alert("Edición Rápida", "Comanda habilitada para ajuste de última hora.")}>
                          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FFF' }}>✏️ Ajustar Items</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#2980b9', padding: 6, borderRadius: 4, flex: 1, marginHorizontal: 2, alignItems: 'center' }} onPress={() => Alert.alert("📥 Exportado", "Archivo PDF / Excel generado con éxito.")}>
                          <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>📄 Generar PDF/Excel</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ backgroundColor: '#27ae60', padding: 6, borderRadius: 4, flex: 1, marginRight: 2, alignItems: 'center' }} onPress={() => abrirCorreoNativoProveedor(cmd, 'Correo Electrónico')}>
                          <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>📧 Enviar por Correo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#16a085', padding: 6, borderRadius: 4, flex: 1, marginLeft: 2, alignItems: 'center' }} onPress={() => abrirCorreoNativoProveedor(cmd, 'Mensajería Digital')}>
                          <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>💬 Enviar por Mensaje</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}

            {(['JEFE_DE_EQUIPO', 'SUPERVISOR', 'SUPERVISOR_CONTRATO', 'LIDER_DE_CONTRATO'].includes(usuarioActual?.rol)) && (
              <View style={[styles.card, { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#bdc3c7' }]}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8, color: '#2c3e50' }}>📝 Armar y Generar Nueva Comanda:</Text>
                <TextInput style={styles.input} placeholder="Cantidad..." value={comandaCantidadInput} onChangeText={setComandaCantidadInput} keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="Material o Producto..." value={comandaMaterialInput} onChangeText={setComandaMaterialInput} />
                <TextInput style={styles.input} placeholder="Stock actual..." value={comandaStockInput} onChangeText={setComandaStockInput} />
                
                <TouchableOpacity style={[styles.btnR, { backgroundColor: '#2980b9', marginBottom: 10 }]} onPress={agregarItemAComandaTemp}>
                  <Text style={styles.txt}>➕ Agregar a Comanda</Text>
                </TouchableOpacity>

                {listaItemsTempComanda.length > 0 && (
                  <View style={{ backgroundColor: '#f8f9fa', padding: 10, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>Artículos en lista ({listaItemsTempComanda.length}):</Text>
                    {listaItemsTempComanda.map((it, idx) => (
                      <Text key={idx} style={{ fontSize: 11, color: '#333' }}>• {it.cantidad} - {it.material} (Stock: {it.stock})</Text>
                    ))}
                    <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginTop: 8 }]} onPress={guardarYEnviarComandaFinal}>
                      <Text style={styles.txt}>💾 Guardar y Enviar Comanda</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity style={[styles.btnBackGrande, { marginTop: 15 }]} onPress={irAtras}>
              <Text style={styles.txtBackGrande}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ALTA DE PERSONAL */}
        {fase === 'ALTA_PERSONAL' && (
          <View style={{ marginTop: 10 }}>
            <View style={[styles.card, { backgroundColor: '#ffffff', borderColor: '#bdc3c7', borderWidth: 1 }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12, color: '#2c3e50' }}>👤 Gestión de Usuarios</Text>
              
              <TextInput style={styles.input} placeholder="Nombre" value={formNombreUsr} onChangeText={setFormNombreUsr} />
              <TextInput style={styles.input} placeholder="Apellidos" value={formApellidosUsr} onChangeText={setFormApellidosUsr} />
              <TextInput style={styles.input} placeholder="Usuario" value={formUserUsr} onChangeText={setFormUserUsr} autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={formPassUsr} onChangeText={setFormPassUsr} />
              <TextInput style={styles.input} placeholder="Teléfono" value={formTelUsr} onChangeText={setFormTelUsr} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Correo electrónico" value={formEmailUsr} onChangeText={setFormEmailUsr} autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Jefe Inmediato" value={formJefeInmediatoUsr} onChangeText={setFormJefeInmediatoUsr} />
              
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#34495e' }}>Plaza / Rol:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {['CEO', 'ADMINISTRADOR', 'SOPORTE', 'JEFE_DE_OPERACIONES', 'SUPERVISOR_CONTRATO', 'LIDER_DE_CONTRATO', 'SUPERVISOR', 'JEFE_DE_EQUIPO'].map((rolOpt) => (
                  <TouchableOpacity key={rolOpt} style={[styles.btnP, formRolUsr === rolOpt ? { backgroundColor: '#34495e' } : { backgroundColor: '#e2e8f0' }, { marginRight: 6, padding: 8 }]} onPress={() => setFormRolUsr(rolOpt)}>
                    <Text style={formRolUsr === rolOpt ? styles.txt : { fontSize: 10, color: '#333', fontWeight: 'bold' }}>{rolOpt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginBottom: 10 }]} onPress={() => { guardarUsuario(); setFase('PANEL_PRINCIPAL'); }}>
                <Text style={styles.txt}>{editandoUsrId ? "💾 Actualizar Usuario" : "➕ Registrar Usuario"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btnR, { backgroundColor: '#2980b9' }]} onPress={() => { setBusquedaUsuarioInput(''); setUsuarioSeleccionadoDetalle(null); setFase('VER_LISTA_PERSONAL'); }}>
                <Text style={styles.txt}>👥 Ver Lista Completa de Personal</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.btnBackGrande, { marginTop: 15 }]} onPress={irAtras}>
              <Text style={styles.txtBackGrande}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CREAR / EDITAR CONTRATO (CON SELECCIÓN DE TIPO, PISOS Y SECCIONES BASE O MANUALES) */}
        {fase === 'NUEVO_CONTRATO' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50' }}>🏢 {editandoContratoId ? "Editar Contrato y Secciones" : "Crear Nuevo Contrato"}</Text>
            
            <TextInput style={styles.input} placeholder="Nombre del Contrato (ej. Torre Alfa)" value={nuevoNombre} onChangeText={setNuevoNombre} />
            <TextInput style={styles.input} placeholder="Dirección" value={nuevaDir} onChangeText={setNuevaDir} />
            <TextInput style={styles.input} placeholder="Persona de Contacto" value={nuevaPersonaContacto} onChangeText={setNuevaPersonaContacto} />
            <TextInput style={styles.input} placeholder="Teléfono de Contacto" value={nuevoTelContacto} onChangeText={setNuevoTelContacto} keyboardType="phone-pad" />

            {/* SELECCIÓN DE TIPO DE CONTRATO */}
            <Text style={{ marginBottom: 5, fontWeight: 'bold', color: '#34495e' }}>🏷️ Tipo de Contrato:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
              {['Comercial', 'Residencial', 'Salud', 'Gobierno', 'Industrial', 'Educativo'].map((tipoOpt) => (
                <TouchableOpacity 
                  key={tipoOpt} 
                  style={[styles.btnP, nuevoTipo === tipoOpt ? { backgroundColor: '#27ae60' } : { backgroundColor: '#e2e8f0' }, { marginRight: 6, padding: 8 }]} 
                  onPress={() => setNuevoTipo(tipoOpt)}
                >
                  <Text style={nuevoTipo === tipoOpt ? styles.txt : { fontSize: 11, color: '#333', fontWeight: 'bold' }}>{tipoOpt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ADMINISTRADOR DE PISOS Y SECCIONES */}
            <View style={[styles.card, { backgroundColor: '#fdfefe', borderColor: '#bdc3c7', borderWidth: 1 }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#2c3e50', marginBottom: 8 }}>🏗️ Configuración de Pisos y Secciones</Text>
              
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <TextInput style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 6, height: 40 }]} placeholder="Nuevo piso (ej. Piso 3, Sótano)..." value={nuevoPisoNombreInput} onChangeText={setNuevoPisoNombreInput} />
                <TouchableOpacity style={{ backgroundColor: '#2980b9', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8 }} onPress={agregarPisoContrato}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>➕ Agregar Piso</Text>
                </TouchableOpacity>
              </View>

              {/* LISTADO DE PISOS CREADOS */}
              {Object.keys(pisosContratoTemp).map((pKey) => (
                <View key={pKey} style={{ backgroundColor: '#f2f4f4', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e5e8e8' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: 13 }}>📍 {pKey}</Text>
                    <TouchableOpacity onPress={() => {
                      const copia = { ...pisosContratoTemp };
                      delete copia[pKey];
                      setPisosContratoTemp(copia);
                    }}>
                      <Text style={{ color: '#e74c3c', fontSize: 11, fontWeight: 'bold' }}>🗑️ Quitar Piso</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={{ fontSize: 11, color: '#7f8c8d', marginBottom: 4 }}>Secciones a limpiar en este piso:</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                    {(pisosContratoTemp[pKey] || []).map((sec, sIdx) => (
                      <View key={sIdx} style={{ backgroundColor: '#e8f8f5', borderWidth: 1, borderColor: '#a3e4d7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 6, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: '#117a65', marginRight: 4 }}>{sec}</Text>
                        <TouchableOpacity onPress={() => eliminarSeccionDePiso(pKey, sec)}>
                          <Text style={{ fontSize: 10, color: '#c0392b', fontWeight: 'bold' }}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* AGREGAR SECCIÓN MANUAL O BASE A ESTE PISO */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput 
                      style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 6, height: 36, backgroundColor: '#FFF' }]} 
                      placeholder="Añadir sección (ej. Baños, Cocina, Oficinas)..." 
                      value={pisoSeleccionadoParaSeccion === pKey ? nuevaSeccionManualInput : ''} 
                      onChangeText={(txt) => {
                        setPisoSeleccionadoParaSeccion(pKey);
                        setNuevaSeccionManualInput(txt);
                      }} 
                    />
                    <TouchableOpacity style={{ backgroundColor: '#16a085', justifyContent: 'center', paddingHorizontal: 10, height: 36, borderRadius: 6 }} onPress={() => {
                      setPisoSeleccionadoParaSeccion(pKey);
                      agregarSeccionManualAPiso();
                    }}>
                      <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>+ Sección</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* ASIGNACIÓN DE PUESTOS EN CADENA */}
            <Text style={{ marginBottom: 4, fontWeight: 'bold', color: '#34495e', marginTop: 10 }}>👔 1. Supervisor de Contrato (Autorelleno):</Text>
            <TextInput style={styles.input} placeholder="Escribe para buscar supervisor..." value={nuevoSupervisorContrato} onChangeText={handleSupContratoInput} />
            {listaSugerenciasSupContrato.length > 0 && (
              <View style={{ backgroundColor: '#f1f1f1', padding: 5, borderRadius: 5, marginBottom: 10 }}>
                {listaSugerenciasSupContrato.map((sup, idx) => (
                  <TouchableOpacity key={idx} onPress={() => { setNuevoSupervisorContrato(sup); setListaSugerenciasSupContrato([]); }}>
                    <Text style={{ padding: 6, color: '#2980b9', fontWeight: 'bold' }}>🔹 {sup}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={{ marginBottom: 4, fontWeight: 'bold', color: '#34495e' }}>👑 2. Líder de Contrato (Autorelleno):</Text>
            <TextInput style={styles.input} placeholder="Escribe para buscar líder..." value={nuevoLiderContrato} onChangeText={handleLiderContratoInput} />
            {listaSugerenciasLideres.length > 0 && (
              <View style={{ backgroundColor: '#f1f1f1', padding: 5, borderRadius: 5, marginBottom: 10 }}>
                {listaSugerenciasLideres.map((lid, idx) => (
                  <TouchableOpacity key={idx} onPress={() => { setNuevoLiderContrato(lid); setListaSugerenciasLideres([]); }}>
                    <Text style={{ padding: 6, color: '#2980b9', fontWeight: 'bold' }}>🔹 {lid}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={{ marginBottom: 4, fontWeight: 'bold', color: '#34495e' }}>🎯 3. Supervisor de Ruta (Autorelleno):</Text>
            <TextInput style={styles.input} placeholder="Escribe para buscar supervisor de ruta..." value={nuevoSupervisorRuta} onChangeText={handleSupRutaInput} />
            {listaSugerenciasSupRuta.length > 0 && (
              <View style={{ backgroundColor: '#f1f1f1', padding: 5, borderRadius: 5, marginBottom: 10 }}>
                {listaSugerenciasSupRuta.map((sr, idx) => (
                  <TouchableOpacity key={idx} onPress={() => { setNuevoSupervisorRuta(sr); setListaSugerenciasSupRuta([]); }}>
                    <Text style={{ padding: 6, color: '#2980b9', fontWeight: 'bold' }}>🔹 {sr}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginTop: 15, marginBottom: 15 }]} onPress={guardarContratoCompleto}>
              <Text style={styles.txt}>{t.save}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnBackGrande} onPress={() => setFase('CARTERA_CLIENTES')}>
              <Text style={styles.txtBackGrande}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* VER REPORTES */}
        {fase === 'VER_REPORTES_ADMIN' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' }}>📋 Reportes Recibidos</Text>
            {reportesGlobales.map((rep) => (
              <View key={rep.id} style={[styles.card, { backgroundColor: '#ffffff' }]}>
                <Text style={{ fontWeight: 'bold', color: '#2c3e50' }}>🏢 {rep.edificio}</Text>
                <Text style={{ fontSize: 12, color: '#7f8c8d' }}>🕵️‍♂️ Responsable: {rep.supervisor}</Text>
                <Text style={{ fontSize: 12, color: 'green', fontWeight: 'bold' }}>🕒 {rep.fechaHora}</Text>
                
                <TouchableOpacity style={[styles.btnA, { marginTop: 8, backgroundColor: '#8e44ad', padding: 8 }]} onPress={() => Alert.alert("📥 Descarga Exitosa", "Reporte descargado con fotografías en alta resolución.")}>
                  <Text style={styles.txt}>📥 Descargar PDF (Alta Resolución)</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={[styles.btnBackGrande, { marginTop: 15 }]} onPress={irAtras}>
              <Text style={styles.txtBackGrande}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* INSPECCIÓN */}
        {fase === 'INSPECCION' && edSelec && (
          <View style={{ marginTop: 10 }}>
            <View style={styles.card}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#2c3e50' }}>{edSelec.nombre}</Text>
              <Text style={{ fontSize: 12, color: '#27ae60', fontWeight: 'bold', marginTop: 2 }}>🏷️ Tipo: {edSelec.tipo}</Text>
              <Text style={{ color: 'green', fontWeight: 'bold', marginTop: 3 }}>⏱️ Tiempo: {Math.floor(seg / 60)}m {seg % 60}s</Text>
            </View>

            <View style={styles.card}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8, color: '#2c3e50' }}>Pisos:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.keys(edSelec.pisosData).map((pKey) => (
                  <TouchableOpacity key={pKey} style={[styles.btnP, pisoInspeccionKey === pKey ? { backgroundColor: '#34495e' } : { backgroundColor: '#e2e8f0' }, { marginRight: 6 }]} onPress={() => { setPisoInspeccionKey(pKey); setSeccionInspeccionIdx(0); }}>
                    <Text style={pisoInspeccionKey === pKey ? styles.txt : { color: '#333', fontSize: 11, fontWeight: 'bold' }}>{pKey}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {pisoInspeccionKey && (
              <View style={styles.card}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8, color: '#2c3e50' }}>Secciones:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {(edSelec.pisosData[pisoInspeccionKey] || []).map((secNombre, sIdx) => (
                    <TouchableOpacity key={sIdx} style={[styles.btnP, seccionInspeccionIdx === sIdx ? { backgroundColor: '#27ae60' } : { backgroundColor: '#e2e8f0' }, { marginRight: 6 }]} onPress={() => setSeccionInspeccionIdx(sIdx)}>
                      <Text style={seccionInspeccionIdx === sIdx ? styles.txt : { color: '#333', fontSize: 11, fontWeight: 'bold' }}>{secNombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {pisoInspeccionKey && (() => {
              const listaSeccionesPiso = edSelec.pisosData[pisoInspeccionKey] || [];
              const seccionActualNombre = listaSeccionesPiso[seccionInspeccionIdx] || 'Área';
              const datosSeccion = evaluacionesInspeccion[pisoInspeccionKey]?.[seccionActualNombre] || { nota: 5, comentario: '', foto: false };

              return (
                <View style={[styles.card, { backgroundColor: '#fff', borderWidth: 2, borderColor: '#34495e33' }]}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#2c3e50', marginBottom: 10 }}>📍 {pisoInspeccionKey} ➔ {seccionActualNombre}</Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <TouchableOpacity key={num} onPress={() => actualizarEvaluacionItem(pisoInspeccionKey, seccionActualNombre, 'nota', num)}>
                        <Text style={{ fontSize: 26 }}>{datosSeccion.nota >= num ? "⭐" : "☆"}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput style={[styles.input, { height: 45, marginBottom: 8 }]} placeholder="Comentarios opcionales..." value={datosSeccion.comentario} onChangeText={(txt) => actualizarEvaluacionItem(pisoInspeccionKey, seccionActualNombre, 'comentario', txt)} />

                  <TouchableOpacity style={[styles.btnA, { backgroundColor: fotoCapturadaUri ? '#27ae60' : '#34495e', padding: 10, marginBottom: 8 }]} onPress={abrirCamaraDispositivo}>
                    <Text style={styles.txt}>{fotoCapturadaUri ? t.photoAttached : t.takePhoto}</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}

            <TouchableOpacity style={[styles.btnR, { backgroundColor: '#27ae60', marginTop: 15, marginBottom: 20 }]} onPress={finalizarInspeccion}>
              <Text style={styles.txt}>{t.sendEvidence}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnBackGrande} onPress={() => setFase('SELECCIONAR_CONTRATO_SUPERVISION')}>
              <Text style={styles.txtBackGrande}>⬅️ Cambiar Contrato</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#dcdde1', padding: 10, borderRadius: 8, marginBottom: 15, backgroundColor: '#ffffff' },
  btnR: { backgroundColor: '#34495e', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnA: { backgroundColor: '#27ae60', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnP: { padding: 10, borderRadius: 6, minWidth: 70, alignItems: 'center' },
  btnLang: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginLeft: 4 },
  btnBackGrande: { backgroundColor: '#ffffff', padding: 14, borderRadius: 8, marginBottom: 15, borderWidth: 1.5, borderColor: '#34495e', alignItems: 'center' },
  txtBackGrande: { color: '#34495e', fontWeight: 'bold', fontSize: 15 },
  card: { backgroundColor: '#ffffff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e1e8ed', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  txt: { color: '#FFF', fontWeight: 'bold' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tileButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dcdde1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  tileIcon: {
    fontSize: 34,
    marginBottom: 8,
  },
tileText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  }
});

};

export default App;
