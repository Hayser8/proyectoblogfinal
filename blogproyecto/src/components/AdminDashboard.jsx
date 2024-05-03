import { useState, useEffect } from "react";
import PostList from "./PostList";
import ModalForm from "./ModalForm";
import Modal from "./Modal";
import AddButton from "./AddButton";
import Loading from "./Loading";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const handleAddPost = async (post) => {
    try {
      const response = await fetch("http://18.220.89.49:3000/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error("Error al crear el post");
      }
      const newPost = await response.json();
      setPosts([...posts, newPost]);
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Error al crear el post:", error);
      setError(error.toString());
    }
  };

  const handleReadMore = (post) => {
    console.log("Leer más clickeado", post);
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const deletePost = async (postId) => {
    if (window.confirm("¿Estás seguro de querer eliminar este post?")) {
      try {
        const response = await fetch(`http://18.220.89.49:3000/blogs/${postId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el post");
        setPosts(posts.filter((post) => post.id !== postId));
        onClose();
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      }
    }
  };

  const editPost = async (postId, editedTitle, editedContent, editedBanner) => {
    try {
      const response = await fetch(`http://18.220.89.49:3000/blogs/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          banner: editedBanner,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el post");
      }
      const updatedPost = await response.json();
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el post:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://18.220.89.49:3000/blogs");
        if (!response.ok) {
          throw new Error("Algo salió mal al cargar los posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const logoutHandler = () => {
    logout(); 
  };

  const dashboardStyle = {
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: '#3aafa9',  
    color: '#fff',  
    fontFamily: 'Arial, sans-serif',  
  };
  

  const headerStyle = {
    fontSize: "2rem",
    color: "#17252a", 
    textAlign: "center",
    marginBottom: "1rem",
  };

  const errorStyle = {
    color: "red", 
    textAlign: "center",
  };

  const addButtonStyle = {
    backgroundColor: '#2b7a78',  
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    margin: '10px auto',
    display: 'block',
  };

  return (
    <div style={dashboardStyle}>
      <h1 style={headerStyle}>Maneja las publicaciones desde aquí!</h1>
      <button onClick={logoutHandler} style={addButtonStyle}>Cerrar Sesión</button>
      <AddButton
        onClick={() => setIsFormModalOpen(true)}
        style={addButtonStyle}
      />
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div style={errorStyle}>Error: {error}</div>
      ) : (
        <PostList posts={posts} onReadMore={handleReadMore} />
      )}
      <ModalForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleAddPost}
      />
      {currentPost && (
        <Modal
          isOpen={isModalOpen}
          onClose={onClose}
          post={currentPost}
          onEdit={editPost}
          onDelete={deletePost}
          readOnly={false}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
