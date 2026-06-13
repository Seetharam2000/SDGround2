// src/components/ComplaintForm.jsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { WARDS } from "../data/wards";
import toast from "react-hot-toast";

const CATEGORIES = ["water", "garbage", "air", "roads", "health"];

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
      if (image) {
        imageUrl = await uploadImage(image);
      }

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
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6">
            Submitted
          </p>
          <h2 className="text-[clamp(2rem,6vw,4rem)] font-black uppercase tracking-tighter leading-none text-white mb-4">
            Complaint<br />Received
          </h2>
          <p className="text-gray-500 text-sm mb-12 max-w-xs mx-auto">
            The ward map has been updated in real time.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setDescription("");
              setImage(null);
              setImagePreview(null);
            }}
            className="px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-14">
      <div className="max-w-2xl mx-auto px-8 py-16">

        {/* Header */}
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
          Civic Reporting
        </p>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-tighter leading-none mb-3">
          Report an<br />Issue
        </h1>
        <p className="text-gray-500 text-sm mb-12">
          Your complaint updates the ward map live.
        </p>

        <div className="border-t border-gray-800 mb-12" />

        {/* Ward selector */}
        <div className="mb-10">
          <label className="block text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
            Ward
          </label>
          <select
            value={wardId}
            onChange={(e) => setWardId(e.target.value)}
            className="w-full bg-transparent border border-gray-800 px-4 py-4 text-white text-sm focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
          >
            {WARDS.map((w) => (
              <option key={w.id} value={w.id} className="bg-black">
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category picker */}
        <div className="mb-10">
          <label className="block text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
            Category
          </label>
          <div className="grid grid-cols-5 gap-px bg-gray-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-4 text-xs font-bold tracking-[0.15em] uppercase transition-colors ${
                  category === cat
                    ? "bg-white text-black"
                    : "bg-black text-gray-500 hover:text-white hover:bg-gray-950"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <label className="block text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue clearly — location, severity, how long it's been there."
            rows={5}
            className="w-full bg-transparent border border-gray-800 px-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-gray-400 transition-colors resize-none text-sm leading-relaxed"
          />
        </div>

        {/* Image upload */}
        <div className="mb-10">
          <label className="block text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
            Photo (optional)
          </label>
          <label className="block w-full border border-dashed border-gray-800 px-4 py-10 text-center cursor-pointer hover:border-gray-500 transition-colors">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto max-h-40 object-cover"
              />
            ) : (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-600">
                  Click to upload
                </p>
                <p className="text-xs text-gray-700 mt-1">Max 5MB</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImagePick}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs tracking-[0.15em] uppercase text-gray-500 mb-2">
              <span>Uploading photo</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-px bg-gray-800 w-full">
              <div
                className="h-px bg-white transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full bg-white text-black text-xs font-bold tracking-[0.2em] uppercase py-4 hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 transition-colors"
        >
          {uploading ? "Submitting…" : "Submit Complaint"}
        </button>

      </div>
    </div>
  );
}