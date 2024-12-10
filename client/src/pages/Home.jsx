import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-posts`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl ">
          ברוכים הבאים לבלוג זכויות החיילים
        </h1>
        <p>
          הבלוג נוצר במטרה לספק מידע ברור וקצר על הזכויות המגיעות לכל חייל
          וחיילת. כאן תוכלו למצוא מדריכים, כלים, וטיפים שיעזרו לכם להבין את
          זכויותיכם ולקבל את המגיע לכם. זכרו - ידע הוא כוח, ואנחנו כאן כדי לתמוך
          בכם בכל שלב!
        </p>
        <p className="text-gray-500 text-xs sm:text-sm">
          מטרת הבלוג היא לאפשר לכל אחד שמכיר היטב בתחום הזכויות של חיילים לשתף
          מידע חשוב ולכתוב פוסטים. <br /> שימו לב שכל המידע בבלוג הוא בגדר המלצה
          בלבד, ואנו לא אחראים לתוכן המופיע בו. יש לוודא את המידע המעודכן מול
          משרד ת"ש.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">
          לצפיה בכל הפוסטים
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700 max-w-6xl mx-auto rounded">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">פוסטים אחרונים</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 hover:underline text-center">
              לצפיה בכל הפוסטים
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
