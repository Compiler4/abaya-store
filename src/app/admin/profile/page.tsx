"use client";

import {
  Camera,
  Home,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import styles from "../sharedAdmin.module.css";

type ProfileState = {
  name: string;
  email: string;
  phone: string;
  role: string;
  photo: string;
  address: string;
};

const emptyProfile: ProfileState = {
  name: "",
  email: "",
  phone: "",
  role: "",
  photo: "",
  address: "",
};

const PROFILE_PHOTO_KEY = "admin_profile_photo";

export default function ProfilePage() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const roleId = useId();
  const addressId = useId();
  const photoId = useId();

  const [profile, setProfile] = useState<ProfileState>(emptyProfile);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const loaded = data.profile || data.data || data || {};

        const nextProfile = {
          name: loaded.name || loaded.email?.split("@")[0] || "Admin User",
          email: loaded.email || "",
          phone: loaded.phone || "",
          role: loaded.role || "ADMIN",
          photo: loaded.photo || loaded.image || "",
          address: loaded.address || "",
        };

        setProfile(nextProfile);

        if (nextProfile.photo) {
          localStorage.setItem(PROFILE_PHOTO_KEY, nextProfile.photo);
        }
      })
      .catch(() => {
        setProfile(emptyProfile);
      });
  }, []);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewPhoto(preview);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = new FormData();
    body.append("name", profile.name);
    body.append("email", profile.email);
    body.append("phone", profile.phone);
    body.append("role", profile.role);
    body.append("address", profile.address);

    if (photoFile) {
      body.append("photo", photoFile);
    }

    const res = await fetch("/api/profile", {
      method: "PUT",
      body,
    });

    const data = await res.json();
    const updated = data.profile || data.data || data || {};

    const updatedPhoto =
      updated.photo || updated.image || previewPhoto || profile.photo;

    setProfile((prev) => ({
      ...prev,
      photo: updatedPhoto,
    }));

    if (updatedPhoto) {
      localStorage.setItem(PROFILE_PHOTO_KEY, updatedPhoto);

      window.dispatchEvent(
        new CustomEvent("admin-profile-updated", {
          detail: { photo: updatedPhoto },
        })
      );
    }

    setSaving(false);
    alert("Profile updated");
  };

  const currentPhoto = previewPhoto || profile.photo || "/default-avatar.png";

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Account</p>
          <h1>
            <UserRound size={30} /> Admin Profile
          </h1>
        </div>

        <span className={styles.status}>
          <ShieldCheck size={14} /> {profile.role || "ADMIN"}
        </span>
      </div>

      <form className={styles.formCard} onSubmit={saveProfile}>
        <div className={styles.profileHero}>
          <label className={styles.profilePhotoPicker} htmlFor={photoId}>
            <img
              className={styles.profileImg}
              src={currentPhoto}
              alt="Admin profile"
            />

            <span>
              <Camera size={18} />
            </span>
          </label>

          <div>
            <h2>{profile.name || "Admin User"}</h2>
            <p>{profile.email || "No email added"}</p>
          </div>
        </div>

        <label className={styles.fieldLabel} htmlFor={nameId}>
          <UserRound size={14} /> Display name
        </label>
        <input
          id={nameId}
          className={styles.input}
          placeholder="Display name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        <label className={styles.fieldLabel} htmlFor={emailId}>
          <Mail size={14} /> Email
        </label>
        <input
          id={emailId}
          className={styles.input}
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />

        <label className={styles.fieldLabel} htmlFor={phoneId}>
          <Phone size={14} /> Phone
        </label>
        <input
          id={phoneId}
          className={styles.input}
          placeholder="Phone"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />

        <label className={styles.fieldLabel} htmlFor={addressId}>
          <Home size={14} /> Address
        </label>
        <input
          id={addressId}
          className={styles.input}
          placeholder="Address"
          value={profile.address}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
        />

        <label className={styles.fieldLabel} htmlFor={roleId}>
          <ShieldCheck size={14} /> Role
        </label>
        <input
          id={roleId}
          className={styles.input}
          placeholder="Role"
          value={profile.role}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
        />

        <label className={styles.fieldLabel} htmlFor={photoId}>
          <Camera size={14} /> Profile photo
        </label>
        <input
          id={photoId}
          className={styles.input}
          type="file"
          accept="image/*"
          onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
        />

        <button className={styles.primaryBtn} type="submit" disabled={saving}>
          <Save size={17} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </main>
  );
}
