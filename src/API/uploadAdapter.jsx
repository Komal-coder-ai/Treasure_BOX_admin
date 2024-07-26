// /* eslint-disable prefer-destructuring */
// /* eslint-disable consistent-return */
// /* eslint-disable no-multi-assign */
// /* eslint-disable no-debugger */

import { ImageUrl, ckEditorApi } from "./baseUrl";

export default class UploadAdapter {
    constructor(props) {
        this.loader = props;
        this.url = ckEditorApi;
        // this.url = "https://gallant-cohen.50-17-89-82.plesk.page";
    }

    // Starts the upload process.
    upload() {
        return new Promise((resolve, reject) => {
            // debugger
            this._initRequest();
            this._initListeners(resolve, reject);
            this._sendRequest();
        });
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open('POST', this.url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    }

    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file:  ${loader.file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.

            resolve({
                default: `${ImageUrl}${response.data}`
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {

                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    _sendRequest() {
        const data = new FormData();

        this.loader.file.then(result => {

            data.append('file', result);
            this.xhr.send(data);
        }
        )
    }

}




// import React, { useEffect, useRef } from "react";

// function UploadAdapter({ onChange, editorLoaded, name, value }) {
//   const editorRef = useRef();
//   const { CKEditor, ClassicEditor } = editorRef.current || {};

//   useEffect(() => {
//     editorRef.current = {
//       CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
//       ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
//     };
//   }, []);

//   return (
//     <div>
//       {editorLoaded ? (
//         <CKEditor
//           type=""
//           name={name}
//           editor={ClassicEditor}
//           config={{
//             ckfinder: {
//               // Upload the images to the server using the CKFinder QuickUpload command
//               // You have to change this address to your server that has the ckfinder php connector
//               uploadUrl: "" //Enter your upload url
//             }
//           }}
//           data={value}
//           onChange={(event, editor) => {
//             const data = editor.getData();
//             // console.log({ event, editor, data })
//             onChange(data);
//           }}
//         />
//       ) : (
//         <div>Editor loading</div>
//       )}
//     </div>
//   );
// }

// export default UploadAdapter;
