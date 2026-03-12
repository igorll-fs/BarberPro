#!/usr/bin/env node
/**
 * Script para configurar conta de desenvolvedor no BarberPro
 * 
 * Uso: node scripts/setup-dev-account.js [email]
 * Exemplo: node scripts/setup-dev-account.js igor@barberpro.app
 */

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc,
  getDoc
} = require('firebase/firestore');

// Firebase config (mesmo do app)
const firebaseConfig = {
  apiKey: "AIzaSyDoQH-6kjBi3FDs9M50JJdmr9uCLfK9lVY",
  authDomain: "baberpro-31c40.firebaseapp.com",
  projectId: "baberpro-31c40",
  storageBucket: "baberpro-31c40.firebasestorage.app",
  messagingSenderId: "559665774528",
  appId: "1:559665774528:web:c8250dd76513d68b539225"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupDevAccount(email, password = 'Dev@123456') {
  console.log('🔧 Configurando conta de desenvolvedor...\n');
  
  try {
    let uid;
    
    // Tenta criar usuário, se já existir faz login
    try {
      console.log(`📧 Criando usuário: ${email}`);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      uid = userCredential.user.uid;
      
      // Atualiza o perfil
      await updateProfile(userCredential.user, {
        displayName: 'Developer'
      });
      
      console.log('✅ Usuário criado com sucesso!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️  Usuário já existe, fazendo login...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
        console.log('✅ Login realizado!');
      } else {
        throw error;
      }
    }
    
    // Configura o documento do usuário no Firestore
    console.log('\n📝 Configurando permissões de desenvolvedor...');
    
    await setDoc(doc(db, 'users', uid), {
      email: email,
      name: 'Developer',
      role: 'dev',
      isDeveloper: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        canSwitchRoles: true,
        canAccessAllShops: true,
        canManageVersions: true,
        canViewDebugInfo: true,
      }
    }, { merge: true });
    
    console.log('✅ Permissões configuradas!');
    
    // Configura custom claims (requer Admin SDK em produção)
    console.log('\n⚠️  IMPORTANTE: Configure as Custom Claims manualmente:');
    console.log(`   UID: ${uid}`);
    console.log(`   Role: dev`);
    console.log('\n   No Firebase Console > Authentication > User > ${uid}');
    console.log('   Ou use o script set-dev-claims.js (requer service account)');
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ CONTA DEV CONFIGURADA COM SUCESSO!');
    console.log('='.repeat(50));
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔑 Senha: ${password}`);
    console.log(`🆔 UID: ${uid}`);
    console.log(`👤 Role: dev`);
    console.log('\n🚀 Agora você pode:');
    console.log('   1. Logar no app/web com essas credenciais');
    console.log('   2. Acessar Configurações > Modo Desenvolvedor');
    console.log('   3. Alternar entre Cliente/Dono/Barbeiro');
    console.log('\n⚠️  Mantenha essas credenciais seguras!');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executa o script
const email = process.argv[2];
const password = process.argv[3];

if (!email) {
  console.log('Uso: node setup-dev-account.js [email] [senha(opcional)]');
  console.log('Exemplo: node setup-dev-account.js igor@barberpro.app');
  process.exit(1);
}

setupDevAccount(email, password);
