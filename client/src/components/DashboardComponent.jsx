import { Button, Table } from "flowbite-react";
import React, { useState, useEffect } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashboardComponent() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/get-users?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-posts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 bg-white dark:bg-slate-800 gap-4 w-full lg:w-72  rounded-md shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">סך משתמשים</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500 ">בחודש האחרון</div>
          </div>
        </div>

        <div className="flex flex-col p-3 bg-white dark:bg-slate-800 gap-4 w-full lg:w-72 rounded-md shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">סך תגובות</h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500 ">בחודש האחרון</div>
          </div>
        </div>

        <div className="flex flex-col p-3 bg-white dark:bg-slate-800 gap-4 w-full lg:w-72 rounded-md shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">סך פוסטים</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500 ">בחודש האחרון</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto flex-1 shadow-md p-2 rounded-md bg-white dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2 ">משתמשים אחרונים</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=users">לצפיה</Link>
            </Button>
          </div>
          <Table hoverable className="shadow-md text-right bg-gray-50 dark:bg-gray-800">
            <Table.Head>
              <Table.HeadCell>תמונת פרופיל</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-stone-50 dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profileAvatar}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto flex-1 shadow-md p-2 rounded-md bg-white dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2 ">תגובות אחרונות</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=comments">לצפיה</Link>
            </Button>
          </div>
          <Table hoverable className="shadow-md text-right bg-gray-50 dark:bg-gray-800">
            <Table.Head>
              <Table.HeadCell>תוכן התגובה</Table.HeadCell>
              <Table.HeadCell>לייקים</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-stone-50 dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto flex-1 shadow-md p-2 rounded-md bg-white dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2 ">פוסטים אחרונים</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=posts">לצפיה</Link>
            </Button>
          </div>
          <Table hoverable className="shadow-md text-right bg-gray-50 dark:bg-gray-800">
            <Table.Head>
              <Table.HeadCell>תמונה ראשית</Table.HeadCell>
              <Table.HeadCell>כותרת</Table.HeadCell>
              <Table.HeadCell>קטגוריה</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-stone-50 dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="post"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    {post.category ? (
                      <Table.Cell className="w-5">
                        {post.category.map((cat) => cat.name).join(", ")}
                      </Table.Cell>
                    ) : (
                      <div></div>
                    )}
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
