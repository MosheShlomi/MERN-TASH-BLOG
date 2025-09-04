import { Button, Modal, Spinner } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [postUser, setPostUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        } else {
          setError(false);
          setLoading(false);
          setPost(data.posts[0]);
        }
      } catch (error) {
        setError(false);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    if (!post?.userId) return;

    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${post.userId}`);
        const data = await res.json();
        if (res.ok) {
          setPostUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
  }, [post?.userId]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentPosts();
  }, []);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/delete-post/${postIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLikePost = async () => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/post/like-post/${post._id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setPost(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculateTotalLikes = (post) => {
    const createdDate = new Date(post.createdAt);
    const today = new Date();

    const diffInDays = Math.floor(
      (today - createdDate) / (1000 * 60 * 60 * 24)
    );

    const dailyIncrement = 2;

    const initialLikes = post.title.length * 2;

    return post.numberOfLikes + initialLikes + diffInDays * dailyIncrement;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen items-center">
      {currentUser && currentUser.isAdmin && (
        <div className="flex justify-between max-w-2xl w-full border-b border-slate-600 px-2 -mb-9">
          <Link to={`/update-post/${post._id}`}>
            <span className="text-teal-500 hover:underline cursor-pointer">
              עריכה
            </span>
          </Link>
          <span
            onClick={() => {
              setShowModal(true);
              setPostIdToDelete(post._id);
            }}
            className="font-medium text-red-500 hover:underline cursor-pointer">
            מחיקה
          </span>
        </div>
      )}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <div className="flex gap-2 flex-wrap justify-center">
        {post.category &&
          post.category.map((cat) => (
            <Link
              to={`/posts?category=${cat.name}`}
              className="self-center mt-2" key={cat._id}>
              <Button color="gray" pill size="xs">
                {cat.name}
              </Button>
            </Link>
          ))}
      </div>

      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-5 p-3 min-h-[260px] max-h-[600px] w-full max-w-2xl mx-auto object-cover"
        loading="lazy"
        style={{
          background: `url("/src/assets/images/default-img.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {post &&
            new Date(post.createdAt).toLocaleDateString("he-IL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
        </span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} דקות קריאה
        </span>
      </div>
      <div className="flex gap-2 w-full max-w-2xl text-md p-3 justify-between border-b border-slate-500">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleLikePost}
            className={
              currentUser && post.likes.includes(currentUser._id)
                ? "text-md text-red-500 hover:text-gray-400"
                : "text-md text-gray-400 hover:text-red-500"
            }>
            <FaHeart />
          </button>
          <p className="text-gray-400">
            {`${calculateTotalLikes(post)} אהבו את הפוסט `}
          </p>
        </div>
        <span className="text-xs">
          נכתב ע"י{" "}
          <span className="font-bold  truncate text-cyan-600 hover:underline hover:cursor-pointer">
            {postUser ? `${postUser.username}@` : "משתמש אנונימי"}
          </span>
        </span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">פוסטים אחרונים</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center items-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              האם אתה בטוח שברצונך למחוק את הפוסט הזה?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                כן, בהחלט
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                לא, בטל
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
}

export default PostPage;
