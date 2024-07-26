// /* eslint-disable no-debugger */
// /* eslint-disable react/prop-types */

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';
import "./index.css"
import UploadAdapter from '../../API/uploadAdapter';
import { ckEditorApi } from '../../API/baseUrl';

const CkEditor = ({ onChange, className, data }) => {
    function CustomUploadAdapterPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = loader => new UploadAdapter(loader, ckEditorApi);
    }
    const config = {
        language: "en",
        extraPlugins: [CustomUploadAdapterPlugin]
    };
    return (
        <div className="App">
            <CKEditor
                className={className}
                config={config}
                editor={ClassicEditor}
                data={data}
                onChange={(event, editor) => onChange(event, editor)}
            />
        </div>
    );
}
export default CkEditor;