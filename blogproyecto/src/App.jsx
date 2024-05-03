import { useState, useEffect, Suspense } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Loading from "./components/Loading";
import PostList from "./components/PostList";
import Modal from "./components/Modal";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminEntry from "./components/AdminEntry";
import SignIn from "./components/SignIn";
import PrivateRoute from "./Routes/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [, setIsAuthenticated] = useState(false);
  //const [isAdmin, setIsAdmin] = useState(false);

  // const { isAdmin } = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleLoginSuccess = (authStatus) => {
    setIsAuthenticated(authStatus);
  };

  const handleSignInSuccess = (token) => {
    if (token) {
      login(token);
      setIsAuthenticated(true);
      navigate("/admin/dashboard");
    } else {
      console.error("Registro completado, pero no se recibió token");
    }
  };

  // const handleAddPost = async (post) => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:3000/blogs", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(post),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Error al crear el post");
  //     }
  //     const newPost = await response.json();
  //     setPosts([...posts, newPost]);
  //     setIsFormModalOpen(false);
  //   } catch (error) {
  //     console.error("Error al crear el post:", error);
  //     setError(error.toString());
  //   }
  // };

  // const handleAddPostClick = () => {
  //   setIsFormModalOpen(true);
  // };

  const handleReadMore = (post) => {
    console.log("Leer más clickeado", post);
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  // const deletePost = async (postId) => {
  //   if (window.confirm("¿Estás seguro de querer eliminar este post?")) {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:3000/blogs/${postId}`, {
  //         method: "DELETE",
  //       });
  //       if (!response.ok) throw new Error("Error al eliminar el post");
  //       setPosts(posts.filter((post) => post.id !== postId));
  //       onClose();
  //     } catch (error) {
  //       console.error("Error al eliminar el post:", error);
  //     }
  //   }
  // };

  // const editPost = async (postId, editedTitle, editedContent, editedBanner) => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:3000/blogs/${postId}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         title: editedTitle,
  //         content: editedContent,
  //         banner: editedBanner,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Error al actualizar el post");
  //     }
  //     const updatedPost = await response.json();
  //     setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error al actualizar el post:", error);
  //   }
  // };

  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin" element={<AdminEntry />} />
          <Route
            path="/admin/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/admin/signin"
            element={<SignIn onSignInSuccess={handleSignInSuccess} />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <div
                style={{
                  margin: "0 auto",
                  color: "#fff",
                  backgroundColor: "#3aafa9",
                }}
              >
                <Header />
                <Banner imageUrl="https://motionbgs.com/media/2005/lionel-messi-fifa-2023.jpg" />
                {isLoading ? (
                  <Loading />
                ) : error ? (
                  <div>Error: {error}</div>
                ) : (
                  <PostList posts={posts} onReadMore={handleReadMore} />
                )}
                {currentPost && (
                  <Modal
                    isOpen={isModalOpen}
                    onClose={onClose}
                    post={currentPost}
                    readOnly={true}
                  />
                )}
              </div>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
