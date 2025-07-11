import { useEffect } from "react";
import socket from "../Socket/socket"; 
import { useDispatch } from "react-redux";
import { addNotification } from "../features/notificationSlice"; // adjust path
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const NotificationsListener = () => {
 const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser?._id) return;

    socket.connect();
    socket.emit("register", currentUser._id);
    console.log("✅ Socket registered for", currentUser._id);

    socket.on("notification", (data) => {
      console.log("🔔 New notification received:", data);

      // Save to redux
      dispatch(addNotification(data));

      // Optional toast
      if (data?.message) {
        toast.info(`🔔 ${data.message}`);
      }
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [currentUser, dispatch]);

  return null;
};

export default NotificationsListener;
