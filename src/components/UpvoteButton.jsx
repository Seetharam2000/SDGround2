import { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

export default function UpvoteButton({ complaint }) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const hasUpvoted = complaint.upvotedBy?.includes(user?.uid);
  const count = complaint.upvotes || 0;

  const handleUpvote = async () => {
    if (!user) {
      toast.error("Sign in to upvote");
      return;
    }

    setLoading(true);
    try {
      const ref = doc(db, "complaints", complaint.id);
      if (hasUpvoted) {
        await updateDoc(ref, {
          upvotes: increment(-1),
          upvotedBy: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(ref, {
          upvotes: increment(1),
          upvotedBy: arrayUnion(user.uid),
        });
      }
    } catch (err) {
      toast.error("Failed to upvote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={loading}
      className={`flex flex-col items-center gap-1 px-4 py-3 border transition-colors disabled:opacity-40 ${
        hasUpvoted
          ? "border-white text-white"
          : "border-gray-700 text-gray-500 hover:border-white hover:text-white"
      }`}
    >
      <span className="text-xs">{hasUpvoted ? "▲" : "△"}</span>
      <span className="text-sm font-black">{count}</span>
    </button>
  );
}