import { db } from './firebaseConnection'
import './app.css'
import { useState } from 'react';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs,
  updateDoc
 } from 'firebase/firestore'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')

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

  return (
    <div>
      <h1>ReactJS + Firebase</h1>

      <div className='container'>
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
                <span>Autor: {post.autor}</span><br /><br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
