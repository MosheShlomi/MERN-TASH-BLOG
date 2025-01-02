import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";

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
      <div className="flex flex-col items-center gap-8 p-8 lg:p-16 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <h1 className="text-3xl lg:text-6xl font-bold tracking-tight text-center">
          ברוכים הבאים לבלוג זכויות החיילים
        </h1>

        <p className="text-md lg:text-lg text-center max-w-4xl leading-relaxed">
          הבלוג נוצר במטרה לספק מידע ברור וקצר על הזכויות המגיעות לכל חייל
          וחיילת. כאן תוכלו למצוא מדריכים, כלים, וטיפים שיעזרו לכם להבין את
          זכויותיכם ולקבל את המגיע לכם.
          <br className="hidden lg:block" />
          זכרו - ידע הוא כוח, ואנחנו כאן כדי לתמוך בכם בכל שלב!
          <span className="block mt-4 text-sm lg:text-md text-red-400">
            שימו לב: שכל המידע בבלוג הוא בגדר המלצה בלבד, ואנו לא אחראים לתוכן
            המופיע בו. יש לוודא את המידע המעודכן מול משרד ת"ש.
          </span>
        </p>

        <Button gradientDuoTone="greenToBlue" size="lg">
          <Link to="/posts">לצפיה בכל הפוסטים</Link>
        </Button>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700 max-w-6xl mx-auto rounded">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">
              פוסטים אחרונים
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            <div className="flex justify-center ">
              <Button gradientDuoTone="greenToBlue" size="md">
                <Link to="/posts">לצפיה בכל הפוסטים</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
