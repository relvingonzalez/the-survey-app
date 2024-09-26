import { useEffect, useState } from "react";
import { SurveyFile } from "../../../internal";

export type GalleryFile = File & {
  url: string;
  extension: string;
};

const getImgUrl = (extension: string, f: SurveyFile) => {
  if (f.url) {
    return f.url;
  } else {
    let imgUrl = "";
    switch (extension) {
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
        imgUrl = URL.createObjectURL(f.file);
    }
    return imgUrl;
  }
};

const getFileExtension = (f: File) => f.name.split(".").pop() || "png";

const transformFileToGalleryFile = (f: SurveyFile) => {
  const extension = getFileExtension(f.file);
  const url = getImgUrl(extension, f);
  return { ...f.file, url, extension };
};

const useGalleryFiles = (files?: SurveyFile[]): GalleryFile[] | undefined => {
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>();

  useEffect(() => {
    if (files) {
      setGalleryFiles(files.map(transformFileToGalleryFile));
    }
  }, [files]);

  return galleryFiles;
};

export default useGalleryFiles;

export const useGalleryFile = (file?: SurveyFile): GalleryFile | undefined => {
  const [galleryFile, setGalleryFile] = useState<GalleryFile>();

  useEffect(() => {
    console.log("file changed");
    if (file) {
      setGalleryFile(transformFileToGalleryFile(file));
    }
  }, [file]);

  return galleryFile;
};
