import { db, auth } from './firebaseConnection'
import './app.css'
import { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
 } from 'firebase/firestore'

 import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
 } from 'firebase/auth'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')
  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  // Real time do firebase (onSnapshot)
  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let listPost = [];

        snapshot.forEach((doc) => {
          listPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(listPost)
      })
    }

    loadPosts();

  }, []) 

  async function handleAdd() {
    /*await setDoc(doc(db, 'posts', '12345'), {
      titulo: titulo,
      autor:autor,
    })
    .then(() => {
      console.log('Dados registrado no banco')
    })
    .catch((erro) => {
      console.log('Gerou erro '+erro)
    })*/

    await addDoc(collection(db, 'posts'), {
      titulo: titulo,
      autor:autor,
    })
    .then(() => {
      setAutor('')
      setTitulo('')
    })
    .catch((erro) => {
      console.log('Gerou erro '+erro)
    })
  }

  async function buscarPost() {
    /* Busca um post específico
    const postRef = doc(db, 'posts', 'usJJ06pPrAFeGm2FPCZv')

    await getDoc(postRef)
    .then((snapshot) => {
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)
    })
    .catch((erro) => {
      console.log('Gerou erro '+erro)
    })*/

    // Busca todos os posts
    const postRef = collection(db, 'posts')
    await getDocs(postRef)
    .then((snapshot) => {
      
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista)

    })
    .catch((erro) => {
      console.log('Gerou erro '+erro)
    })

  }

  async function editarPost() {
    const doctRef = doc(db, 'posts', idPost)
    await updateDoc(doctRef, {
      titulo: titulo,
      autor:autor,
    })
    .then(() => {
      setAutor('')
      setTitulo('')
      setIdPost('')
    })
    .catch((erro) => {
      console.log('Gerou erro ao atualizar'+erro)
    })
  }

  async function excluirPost(id) {
    const doctRef = doc(db, 'posts', id)
    await deleteDoc(doctRef)
    .then(() => {
      alert('Post deletado com sucesso!')
    })
    .catch((erro) => {
      console.log('Gerou erro ao excluir'+erro)
    })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      // Aqui nesse console retorna os dados do usuário cadastrado.
      console.log(value)
      setEmail('')
      setSenha('')
      alert('cadstrado com sucesso!')
    })
    .catch((erro) => {
      if (erro.code == 'auth/weak-password') {
        alert('Senha muito fraca.')
      } else if (erro.code == 'auth/email-already-in-use') {
        alert('E-mail já existe')
      }
      console.log('Gerou erro ao cadastrar'+erro)
    })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log(value)

      setUserDetail({
        uid: value.uid,
        email: value.user.email
      })

      setUser(true)

      setEmail('')
      setSenha('')
      alert('Logado com sucesso!')
    })
    .catch((erro) => {
      console.log('Gerou erro ao fazer login'+erro)
    })
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado)</strong><br />
          <span>ID: {userDetail.uid} - E-mail: {userDetail.email}</span><br />
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
          <br />
        </div>
      )}

      <div className='container'>
        <h2>Usuário</h2>
        <label>E-mail</label>
        <input 
          placeholder='Digite o e-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <label>Senha</label>
        <input 
          placeholder='Digite a senha'
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        /><br />

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer login</button>
      </div>

      <br /><br />
      <hr />

      <div className='container'>
        <h2>Posts</h2>
        <label>Id do post</label>
        <input 
          placeholder='Digite o ID do post'
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />
        <label>Título</label>
        <textarea
          type='text'
          placeholder='Digite o título'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor</label>
        <input 
          type='text' 
          placeholder='Autor do post'
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button><br />

        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map((post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br />
                <span>Título: {post.titulo}</span><br />
                <span>Autor: {post.autor}</span><br />
                <button onClick={ () => excluirPost(post.id)}>Excluir</button><br /><br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
