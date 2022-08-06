import {
  ERROR_TEXT_RESOLUTION_PHOTO,
  ERROR_TEXT_SIZE_PHOTO,
  ERROR_TEXT_SIZE_VIDEO,
  ERROR_TEXT_TYPE_MEDIA,
  ERROR_TEXT_TYPE_PHOTO,
  ERROR_TEXT_TYPE_VIDEO,
  FILE_MAX_SIZE_PHOTO_20MB,
  FILE_MAX_SIZE_VIDEO_500MB,
  FILE_MIN_PROPORTIONS,
  MIME_TYPES,
  MIME_VIDEO_TYPE,
  IS_VIDEO,
  IS_PHOTO,
} from "constants/addFile";

const validationMedia = (file, addMediaHandler, photoFailure, typeMedia) => {
  const checkTypeFile = (type) => MIME_TYPES.indexOf(type) < 0;

  const toggleError = (text) => {
    photoFailure(text);

    setTimeout(() => {
      photoFailure();
    }, 3000);
  };

  const formData = new FormData();

  if (checkTypeFile(file.type)) {
    let errorText = ERROR_TEXT_TYPE_MEDIA;
    if (typeMedia) {
      errorText =
        typeMedia === IS_PHOTO ? ERROR_TEXT_TYPE_PHOTO : ERROR_TEXT_TYPE_VIDEO;
    }

    toggleError(errorText);
  } else {
    if (MIME_VIDEO_TYPE.find((item) => item === file.type)) {
      if (typeMedia && typeMedia === IS_PHOTO) {
        toggleError(ERROR_TEXT_TYPE_PHOTO);
      } else if (file.size > FILE_MAX_SIZE_VIDEO_500MB) {
        toggleError(ERROR_TEXT_SIZE_VIDEO);
      } else {
        formData.append("file", file);
        addMediaHandler(formData, IS_VIDEO);
      }
    } else {
      if (typeMedia && typeMedia === IS_VIDEO) {
        toggleError(ERROR_TEXT_TYPE_VIDEO);
      } else if (file.size > FILE_MAX_SIZE_PHOTO_20MB) {
        toggleError(ERROR_TEXT_SIZE_PHOTO);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          let image = new Image();
          image.onload = () => {
            if (
              image.width < FILE_MIN_PROPORTIONS ||
              image.height < FILE_MIN_PROPORTIONS
            ) {
              toggleError(ERROR_TEXT_RESOLUTION_PHOTO);
            } else {
              formData.append("file", file);
              addMediaHandler(formData, IS_PHOTO);
            }
          };
          image.src = window.URL.createObjectURL(file);
        };
      }
    }
  }
};

export default validationMedia;
