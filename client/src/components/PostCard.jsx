import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function PostCard({ post }) {
  const calculateTotalLikes = () => {
    const createdDate = new Date(post.createdAt);
    const today = new Date();

    const diffInDays = Math.floor(
      (today - createdDate) / (1000 * 60 * 60 * 24)
    );

    const dailyIncrement = 2;

    const initialLikes = post.title.length * 2;

    return post.numberOfLikes + initialLikes + diffInDays * dailyIncrement;
  };

  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 transition-all sm:h-[380px] h-[400px] overflow-hidden rounded-lg sm:w-[370px]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
          loading="lazy"
          style={{
            background: `url("/src/assets/images/default-img.jpeg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-1 ">{post.title}</p>

        {post.category && (
          <span className="italic text-sm">
            {post.category.map((cat) => cat.name).join(", ")}
          </span>
        )}

        <span className="text-sm flex justify-between flex-row-reverse">
          {new Date(post.updatedAt).toLocaleDateString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}

          {post.numberOfLikes ? (
            <span className="flex gap-1 text-md justify-center items-center ">
              <FaHeart className="text-red-500" />
              {calculateTotalLikes()}
            </span>
          ) : null}
        </span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2">
          לקריאה
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
