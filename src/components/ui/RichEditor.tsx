import React, { useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder
}) => {
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (
        e.target instanceof Element &&
        e.target.closest('.tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root') !== null
      ) {
        e.stopImmediatePropagation();
      }
    };

    document.addEventListener('focusin', handleFocusIn, true);
    return () => {
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, []);

  return (
    <Editor
      apiKey="u76ju277guyoq9r8f4u8mpl7cl7zfwsvdq5cvtf11c8toz4w"
      value={value}
      onEditorChange={(content) => onChange(content)}
      onInit={(evt, editor) => {
        editor.on('wheel', (e: any) => {
          const body = editor.getBody();
          const docEl = editor.getDoc().documentElement;
          
          const currentScroll = docEl.scrollTop || body.scrollTop || 0;
          const scrollHeight = docEl.scrollHeight || body.scrollHeight || 0;
          const clientHeight = docEl.clientHeight || body.clientHeight || 0;
          const maxScroll = scrollHeight - clientHeight;

          const isAtTop = e.deltaY < 0 && currentScroll <= 0;
          const isAtBottom = e.deltaY > 0 && currentScroll >= maxScroll - 1;
          const hasScrollbar = scrollHeight > clientHeight;

          if (!hasScrollbar || isAtTop || isAtBottom) {
            const parentScrollable = editor.getContainer().closest('[role="dialog"], .overflow-y-auto');
            if (parentScrollable) {
              parentScrollable.scrollTop += e.deltaY;
            }
          }
        });
      }}
      init={{
        height: 500,
        menubar: true,

        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'help',
          'wordcount'
        ],

        toolbar:
          'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat | code fullscreen | help',

        placeholder: placeholder || 'Write content here...'
      }}
    />
  );
};

export default RichEditor;
