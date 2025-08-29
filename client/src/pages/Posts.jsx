import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

function Posts() {
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBarData({
        ...sideBarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/get-posts?${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          }
        } else {
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category/get-categories`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.error("שגיאה בשליפת הקטגוריות:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarData({
        ...sideBarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSideBarData({
        ...sideBarData,
        sort: order,
      });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "";
      setSideBarData({
        ...sideBarData,
        category,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("category", sideBarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/posts?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    try {
      const res = await fetch(`/api/post/get-posts?${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-ri md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex-1 border-b border-gray-500 pb-3">
            <Link to="/create-post">
              <Button
                gradientDuoTone="purpleToPink"
                type="button"
                className="w-full">
                פוסט חדש
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold flex-1">
              טקסט חיפוש:
            </label>
            <TextInput
              placeholder="חיפוש..."
              id="searchTerm"
              type="text"
              value={sideBarData.searchTerm}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold flex-1">
              סדר:
            </label>
            <Select
              onChange={handleChange}
              value={sideBarData.sort}
              id="sort"
              className="flex-1">
              <option value="desc">חדשים קודם</option>
              <option value="asc">ישנים קודם</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold flex-1">
              קטגוריה:
            </label>
            <Select
              onChange={handleChange}
              value={sideBarData.category}
              className="flex-1"
              id="category">
              <option value="">הכל</option>

              {categories &&
                categories.map((category) => (
                  <option value={category.name} key={category._id}>
                    {category.name}
                  </option>
                ))}
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            חפש
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white p-3">
          פוסטים
        </h1>
        <div className="p-7 flex flex-wrap gap-4 justify-center">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">לא נמצאו פוסטים.</p>
          )}
          {loading && <p className="text-xl text-gray-500">טוען...</p>}
          {!loading && posts && (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}

              {showMore && (
                <button
                  className="text-teal-500 text-lg hover:underline p-7 w-full"
                  onClick={handleShowMore}>
                  הצג עוד
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;
