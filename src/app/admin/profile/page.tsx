"use client";

import { useState } from "react";
import styles from "./profile.module.css";

type ProfileData = {
  name: string;
  email: string;
  password: string;
};

export default function Profile() {
  const [image, setImage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: "Admin User",
    email: "admin@mail.com",
    password: "123456",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // SAVE TO DATABASE (API READY)
  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          image,
        }),
      });

      if (res.ok) {
        alert("Profile updated successfully ✅");
        setEditing(false);
      } else {
        alert("Failed to update profile ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>👤 Admin Profile</h1>

        {/* AVATAR */}
        <div className={styles.avatar}>
          {image ? (
            <img src={image} alt="profile" />
          ) : (
            profile.name.charAt(0)
          )}
        </div>

        {/* UPLOAD IMAGE */}
        <label className={styles.label}>Profile Image</label>
        <input
          type="file"
          className={styles.input}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(URL.createObjectURL(file));
          }}
        />

        {/* FORM */}
        <div className={styles.form}>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Full Name"
          />

          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Email"
          />

          <input
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Password"
          />
        </div>

        {/* BUTTONS */}
        <div className={styles.actions}>
          {!editing ? (
            <button onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className={styles.save}>
                💾 Save
              </button>
              <button onClick={() => setEditing(false)}>
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}