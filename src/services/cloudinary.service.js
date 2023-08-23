import { Cloudinary } from '@cloudinary/url-gen';

import {
  cloudinaryAPI,
  cloudinaryConfig
} from '@/services/config/cloudinary.config';

import { useDispatcher } from '@/services/common.service';
import { xhrRequest } from '@/services/authentication.service';

import { stub } from '@/utils/function';
import request from '@/utils/request';

/**
 * @constant
 * @type {Cloudinary}
 */
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName
  }
});

/**
 * @export
 * @param token
 * @param {string} folder
 * @return {Promise<T|{data: {error: *}, exists: boolean}>}
 */
export const cloudinaryCredentials = async ({ token, folder }) => {
  return xhrRequest({
    url: cloudinaryAPI.signature,
    method: request.METHOD.get,
    params: { folder: encodeURIComponent(folder) },
    token
  });
};

const {
  cloudName,
  uploadPreset
} = cloudinaryConfig;

/**
 * @export
 * @param props
 * @return {Promise<void>}
 */
export const cloudinaryProcessFile = async (props) => {
  const {
    file,
    model,
    uploadConfig,
    signData,
    assets = {}
  } = props;

  const UPLOAD_URL = cloudinaryAPI.Auto_upload_API;
  const XUniqueUploadId = +new Date();

  const {
    sliceSize,
    unsignedUpload,
    folder = '',
    publicId = null
  } = uploadConfig;

  _processFile();

  const dispatch = useDispatcher();

  /**
   * @function
   * @param {Event} [e]
   * @private
   */
  function _processFile(e) {
    e?.preventDefault();

    if (!file?.size) {
      console.error('File error', file);
      return false;
    }

    const size = file.size;
    let start = 0;

    setTimeout(_loop, 3);

    /**
     * @function
     * @private
     */
    function _loop() {
      let end = start + sliceSize;

      if (end > size) end = size;

      const s = slice(file, start, end);

      _send(s, start, end - 1, size);

      if (end < size) {
        start += sliceSize;
        setTimeout(_loop, 3);
      }
    }
  }

  /**
   * @function
   * @param {File} piece
   * @param {number} start
   * @param {number} end
   * @param {number} size
   * @private
   */
  function _send(piece, start, end, size) {
    const formData = new FormData();

    formData.append('file', piece);
    formData.append('folder', folder);
    formData.append('cloud_name', cloudName);

    if (typeof publicId === 'string') {
      formData.append('public_id', publicId);
    }

    if (unsignedUpload) {
      formData.append('upload_preset', uploadPreset);
    } else {
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timeStamp);
      formData.append('signature', signData.signature);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOAD_URL, false);
    xhr.setRequestHeader('X-Unique-Upload-Id', XUniqueUploadId.toString());
    xhr.setRequestHeader(
        'Content-Range',
        `bytes ${start}-${end}/${size}`
    );

    xhr.onload = function() {
      let _json = { asset_id: 'error' },
          _error = null;

      try {

        /**
         * @type {{asset_id}}
         * @private
         */
        _json = JSON.parse(this.responseText);

      } catch (error) {
        _error = { ...error };
      }

      dispatch({
        type: `${model}/updateState`,
        payload: {
          errorUpload: _error,
          assets: {
            ...assets,
            [folder]: {
              ...(assets[folder] ?? {}),
              [_json?.asset_id]: {
                public_id: _json.public_id,
                secure_url: _json.secure_url
              }
            }
          },
          spinning: false
        }
      });
    };

    xhr.send(formData);
  }

  /**
   * @function
   * @param {File} file
   * @param {number} start
   * @param {number} end
   * @return {*}
   */
  function slice(file, start, end) {
    const slice = file?.slice ? file.slice : stub;
    return slice.bind(file)(start, end);
  }
};

/**
 * @export
 * @param {{public_id: string}} json
 */
export const getImage = (json = {}) => {
  return cld.image(json?.public_id);
};