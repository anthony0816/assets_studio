"use client";
import { useTheme } from "@/context/themeContext";

export default function UploadAvatar({ onSucces }) {
  const { currentTheme } = useTheme();

  async function handleUpload() {}

  return (
    <>
      <section>
        <label htmlFor="uploaderAvatarUser">
          <div>Upload</div>
        </label>
        <input
          onChange={handleUpload}
          id="uploaderAvatarUser"
          type="file"
          hidden
        />
      </section>
    </>
  );
}
