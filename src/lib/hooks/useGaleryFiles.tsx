import { useEffect, useState } from "react";

export type GalleryFile = {
  url: string;
  type: string;
};

export type UseFaleryFilesReturnType = GalleryFile[];

const getImgUrl = (type: string, f: File) => {
  let imgUrl = "";
  switch (type) {
    case "pdf":
      imgUrl = "/pdf_thumb.png";
      break;
    case "zip":
    case "tgz":
      imgUrl = "/zip_thumb.png";
      break;
    case "xls":
    case "xlsx":
      imgUrl = "/excel_thumb.png";
      break;
    case "doc":
    case "docx":
      imgUrl = "/docx_thumb.png";
      break;
    case "ppt":
    case "pptx":
      imgUrl = "/ppt_thumb.png";
      break;
    case "mp3":
    case "wav":
      imgUrl = "/audio_thumb.png";
      break;
    default:
      imgUrl = URL.createObjectURL(f);
  }
  return imgUrl;
};

const getFileExtension = (f: File) => f.name.split(".").pop() || "png";

const transformFileToGalleryFile = (f: File) => {
  const type = getFileExtension(f);
  const url = getImgUrl(type, f);
  return { url, type };
};

const useGalleryFiles = (files: File[]): UseFaleryFilesReturnType => {
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([]);

  useEffect(() => {
    setGalleryFiles(files.map(transformFileToGalleryFile));
  }, [files]);

  return galleryFiles;
};

export default useGalleryFiles;
