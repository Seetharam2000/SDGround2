// src/components/ComplaintForm.jsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { WARDS } from "../data/wards";
import toast from "react-hot-toast";

const CATEGORIES = ["water", "garbage", "air", "roads", "health"];
const CATEGORY_ICONS = {
  water: "💧",
  garbage: "🗑️",
  air: "💨",
  roads: "🛣️",
  health: "🏥",
};

export default function ComplaintForm() {
  const [wardId, setWardId] = useState(WARDS[0].id);
  const [category, setCategory] = useState("garbage");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Upload image to Firebase Storage and return download URL
  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const fileName = `complaints/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = null;

      // Upload image if one was selected
      if (image) {
        imageUrl = await uploadImage(image);
      }

      // Save complaint to Firestore
      await addDoc(collection(db, "complaints"), {
        wardId,
        category,
        description: description.trim(),
        imageUrl,
        status: "open",
        createdAt: serverTimestamp(),
      });

      toast.success("Complaint submitted! Map will update.");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-white mb-2">Complaint Submitted</h2>
          <p className="text-gray-400 mb-6">The ward map has been updated in real time.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setDescription("");
              setImage(null);
              setImagePreview(null);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-14 flex items-start justify-center px-4 py-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 w-full max-w-lg">
        <h1 className="text-2xl font-black text-white mb-1">Report an Issue</h1>
        <p className="text-gray-400 text-sm mb-6">Your complaint updates the ward map live.</p>

        {/* Ward selector */}
        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
          Ward
        </label>
        <select
          value={wardId}
          onChange={(e) => setWardId(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 mb-4 text-sm"
        >
          {WARDS.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        {/* Category picker */}
        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">
          Category
        </label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex flex-col items-center justify-center py-3 rounded-xl border text-xs font-medium transition-all ${
                category === cat
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              <span className="text-xl mb-1">{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Description */}
        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue clearly — location, severity, how long it's been there."
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none mb-4 text-sm"
        />

        {/* Image upload */}
        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
          Photo (optional)
        </label>
        <label className="block w-full bg-gray-800 border border-dashed border-gray-600 rounded-xl px-4 py-5 text-center cursor-pointer hover:border-indigo-500 transition-colors mb-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto max-h-36 rounded-lg object-cover"
            />
          ) : (
            <div>
              <div className="text-3xl mb-1">📷</div>
              <p className="text-gray-400 text-sm">Click to upload (max 5MB)</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImagePick}
            className="hidden"
          />
        </label>

        {/* Upload progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Uploading photo…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          {uploading ? "Submitting…" : "Submit Complaint"}
        </button>
      </div>
    </div>
  );
}
