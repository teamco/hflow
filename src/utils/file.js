/**
 * @export
 * @param {string} base64
 * @return {*}
 */
export const getExtension = base64 => {
  const regexStr = base64.split(';')[0].match(/data:\w+\//);
  if (regexStr) {
    const regex = new RegExp(regexStr[0]);
    return regexStr?.input?.replace(regex, '');
  }
};

/**
 * @export
 * @param file
 * @param [entity]
 * @param {string} [type]
 * @param {boolean} [isEdit]
 * @return {*|Promise<*>}
 */
export const toFile = ({ file, entity, type, isEdit = false }) => {
  // File preparation before saving.
  if (file) {
    return toBase64({ file });
  } else if (isEdit && entity) {
    return entity[type];
  } else {
    // TODO (teamco): handle file.
    // return errorSaveMsg(isEdit, 'Business');
  }
};

/**
 * @async
 * @export
 * @description Returns image dimensions for specified URL.
 * @param {string} url
 */
export const getImageDimensions = async ({ url }) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({
      width: img.width,
      height: img.height
    });
    img.onerror = (error) => reject(error);
    img.src = url;
  }).catch(error => {
    console.error(error);
  });
};

/**
 * @export
 * @param {string} url
 * @return {Promise<string>}
 */
export async function getFileFromUrl(url) {
  const response = await fetch(url, {});
  const blob = await response.blob();
  // Then create a local URL for that image.
  return URL.createObjectURL(blob);
}

/**
 * @export
 * @param {string} url
 * @param {function} callback
 */
export function getImageFromUrl(url, callback) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'Anonymous');
  img.onload = function(a) {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0, 0);

    const dataURI = canvas.toDataURL('image/png');

    // Convert base64/URLEncoded data component to raw binary data held in a string.
    const byteString = dataURI.split(',')[0].indexOf('base64') >= 0 ?
        atob(dataURI.split(',')[1]) :
        unescape(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].
        split(':')[1].
        split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return callback(new Blob([ia], { type: mimeString }));
  };

  img.src = url;
}

/**
 * @function
 * @function
 * @param file
 * @return {Promise<unknown>}
 */
export function toBase64({ file }) {
  if (!file) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * @export
 * @param b64Data
 * @param contentType
 * @param sliceSize
 * @return {Blob}
 */
export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * @export
 * @param {string} url
 * @param {string} fileName
 * @return {Promise<void>}
 */
export const downloadFromUrl = (url, fileName) => {
  return getFileFromUrl(url).then(href => handleDownload({ href, fileName }));
};

/**
 * @export
 * @param href
 * @param {string} fileName
 */
export const handleDownload = ({ href, fileName }) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  link.click();
};
