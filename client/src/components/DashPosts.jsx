import { Modal, Table, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  const hebrewNames = {
    pending: "ממתין לאישור",
    published: "פורסם",
    rejected: "נדחה",
  };

  const statusColors = {
    pending: "text-yellow-600 dark:text-yellow-400",
    published: "text-green-600 dark:text-green-400",
    rejected: "text-red-600 dark:text-red-400",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-dash-posts`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/get-dash-posts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto w-full text-center overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md text-right">
            <Table.Head>
              <Table.HeadCell>תאריך עדכון</Table.HeadCell>
              <Table.HeadCell>תמונה ראשית</Table.HeadCell>
              <Table.HeadCell>כותרת</Table.HeadCell>
              <Table.HeadCell>קטגוריה</Table.HeadCell>
              <Table.HeadCell>סטטוס</Table.HeadCell>
              <Table.HeadCell>
                <span>עריכה</span>
              </Table.HeadCell>
              <Table.HeadCell>מחיקה</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post, index) => (
              <Table.Body className="divide-y" key={`${post._id}-${index}`}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString("he-IL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/preview/${post._id}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/preview/${post._id}`}
                      className="font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className={statusColors[post.status]}>
                      {hebrewNames[post.status]}
                    </span>
                    <br />
                    {!currentUser.isAdmin &&
                      post.updateStatus === "accepted" && (
                        <span className="text-xs border-t border-gray-300 text-green-600 dark:border-gray-700 dark:text-green-400 p-1 block">
                          בקשה לעדכון אושרה
                        </span>
                      )}
                    {!currentUser.isAdmin &&
                      post.updateStatus === "rejected" && (
                        <span className="text-xs border-t border-gray-300 text-red-600 dark:border-gray-700 dark:text-red-400 p-1 block">
                          בקשה לעדכון נידחתה
                        </span>
                      )}
                    {!currentUser.isAdmin &&
                      post.updateStatus === "pending" && (
                        <span className="text-xs border-t border-gray-300 text-yellow-600 dark:border-gray-700 dark:text-yellow-400 p-1 block">
                          בקשה לעדכון נשלחה
                        </span>
                      )}
                  </Table.Cell>
                  <Table.Cell>
                    {currentUser.isAdmin ||
                      (post.status !== "rejected" && (
                        <Link to={`/update-post/${post._id}`}>
                          <span className="text-teal-500 hover:underline cursor-pointer">
                            עריכה
                          </span>
                        </Link>
                      ))}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer">
                      מחיקה
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center py-7 text-sm ">
              הצג עוד
            </button>
          )}
        </>
      ) : (
        <p>אין לך עדיין פוסטים!</p>
      )}
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
    </div>
  );
}

export default DashPosts;
