import React, { useEffect, useRef, useState } from 'react'
import { FileViewType, TreeItem } from '@/types'
import { ShadowDomWrapper } from '@components/right/contents/ShadowDomWrapper'
import * as monaco from 'monaco-editor'
import { formatFileSize, getFileTypeGroup, getMonacoLanguage } from '@components/utils'
import * as api from '@/api'
import { convertFileSrc } from '@tauri-apps/api/core'
import FileHead from "@components/right/contents/FileHead.tsx"
import {useFileViewTypeMapStore} from "@store/fileViewTypeMapStore.ts"


self.MonacoEnvironment = {
  getWorkerUrl(_, label) {
    const basePath = '.'
    if (label === 'json') {
      return `${basePath}/monaco-editor/esm/vs/language/json/json.worker.js`
    }
    if (label === 'css') {
      return `${basePath}/monaco-editor/esm/vs/language/css/css.worker.js`
    }
    if (label === 'html') {
      return `${basePath}/monaco-editor/esm/vs/language/html/html.worker.js`
    }
    if (label === 'typescript' || label === 'javascript') {
      return `${basePath}/monaco-editor/esm/vs/language/typescript/ts.worker.js`
    }
    return `${basePath}/monaco-editor/esm/vs/editor/editor.worker.js`
  }
}

interface FileViewProps {
  selectedItem?: TreeItem | undefined
}

function FileView({ selectedItem }: FileViewProps): React.ReactElement {
  const fileViewTypeMap = useFileViewTypeMapStore((state) => state.fileViewTypeMap)
  const [fileViewType, setFileViewType] = useState<FileViewType | undefined>(undefined)
  useEffect(() => {
    const fileViewTypeGroup = getFileTypeGroup(selectedItem)
    const selectedFileViewType = fileViewTypeMap[fileViewTypeGroup]
    setFileViewType(selectedFileViewType)
  }, [selectedItem, fileViewTypeMap, fileViewType]);

  return (
    <>
      <FileHead />
      <div className='file-content'>
      {(() => {
        switch (fileViewType) {
          case 'Empty':
            return <ViewEmpty selectedItem={selectedItem} />
          case 'Img':
            return <ViewImg selectedItem={selectedItem} />
          case 'Embed':
            return <ViewEmbed selectedItem={selectedItem} />
          case 'Html':
            return <ViewHtml selectedItem={selectedItem} />
            // return <ViewIframe selectedItem={selectedItem} />
          case 'Iframe':
            return <ViewIframe selectedItem={selectedItem} />
          case 'Text':
            return <ViewText selectedItem={selectedItem} />
          case 'Audio':
            return <ViewAudio selectedItem={selectedItem} />
          case 'Video':
            return <ViewVideo selectedItem={selectedItem} />
          case 'Monaco':
            return <ViewMonaco selectedItem={selectedItem} />
          default:
            return <ViewNone selectedItem={selectedItem} />
        }
      })()}
      </div>
    </>
  )
}

function ViewImg({ selectedItem }: FileViewProps): React.ReactElement {
  if (!selectedItem) {
    return <div className='view-img'></div>
  }
  return (
    <div className="view-img">
      <img src={convertFileSrc(selectedItem?.full_path)} alt={selectedItem?.full_path} />
    </div>
  )
}

function ViewEmbed({ selectedItem }: FileViewProps): React.ReactElement {
  if (!selectedItem) {
    return <div className='view-embed'></div>
  } else {
  }
  return (
    <div className="view-embed">
      <embed src={convertFileSrc(selectedItem?.full_path)} type={selectedItem?.mt}></embed>
    </div>
  )
}
function ViewHtml({ selectedItem }: FileViewProps): React.ReactElement {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const fetchText = async (): Promise<string> => {
      if (selectedItem?.full_path) {
        const textContent = await api.readText(selectedItem.full_path)
        return textContent.text || ''
      } else {
        return ''
      }
    }
    fetchText().then((txt) => setHtml(txt))

  }, [selectedItem?.full_path])

  useEffect(() => {
    if (html) {
      const shadow = document.querySelector('.shadow-dom')?.shadowRoot;
      if (shadow) {
        shadow.querySelectorAll("a").forEach((a) => {
          a.setAttribute('target', '_blank')
        })
      }
    }
  }, [html]);

  return (
    <ShadowDomWrapper>
      <div className="view-html" dangerouslySetInnerHTML={{ __html: html }}></div>
    </ShadowDomWrapper>
  )
}
function ViewIframe({ selectedItem }: FileViewProps): React.ReactElement {
  return (
    <div className="view-iframe">
      <iframe src={selectedItem?.full_path}></iframe>
    </div>
  )
}
function ViewText({ selectedItem }: FileViewProps): React.ReactElement {
  const [text, setText] = useState('')

  useEffect(() => {
    const fetchText = async (): Promise<string> => {
      if (selectedItem?.full_path) {
        const textContent = await api.readText(selectedItem.full_path)
        return textContent.text || ''
      } else {
        return ''
      }
    }
    fetchText().then((txt) => setText(txt))
  }, [selectedItem?.full_path])

  return <div className="view-text">{text}</div>
}

function ViewAudio({ selectedItem }: FileViewProps): React.ReactElement {
  // console.log('view-audio')
  if(!selectedItem) {
    return <div className='view-audio'></div>
  }
  const mediaRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.3
      mediaRef.current?.load()
    }
  })
  return (
    <div className="view-audio">
      <audio ref={mediaRef} controls={true} autoPlay={true}>
        <source src={convertFileSrc(selectedItem?.full_path)} type={selectedItem?.mt} />
      </audio>
    </div>
  )
}

function ViewVideo({ selectedItem }: FileViewProps): React.ReactElement {
  if (!selectedItem) {
    return  <div className='view-video'></div>
  }
  const mediaRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.5
      mediaRef.current?.load()
    }
  })
  return (
    <div className="view-video">
      <video ref={mediaRef} controls={true} autoPlay={true}>
        <source src={convertFileSrc(selectedItem?.full_path)} type={selectedItem?.mt} />
      </video>
    </div>
  )
}

function ViewEmpty({ selectedItem }: FileViewProps): React.ReactElement {
  return (
    <div>
      <h3>{selectedItem?.nm}</h3>
      <h3>{formatFileSize(selectedItem?.sz)}</h3>
    </div>
  )
}

function ViewNone({ selectedItem }: FileViewProps): React.ReactElement {
  return (
    <div>
      <h3>{selectedItem?.nm}</h3>
      <h3>{formatFileSize(selectedItem?.sz)}</h3>
    </div>
  )
}

function ViewMonaco({ selectedItem }: FileViewProps): React.ReactElement {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedItem) {
      return
    }
    api
      .readText(selectedItem.full_path)
      .then((txtContent) => {
        setContent(txtContent?.text || '')
      })
      .catch((e) => {
        console.error(e)
        setContent('')
      })
  }, [selectedItem])

  useEffect(() => {
    if (selectedItem && content && editorRef && editorRef.current) {
      if (monacoEditorRef?.current) {
        monacoEditorRef.current.dispose()
      }
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        // model,
        value: content,
        // language: 'plaintext',
        language: getMonacoLanguage(selectedItem?.ext),
        theme: 'vs',
        readOnly: true,
        automaticLayout: true,
        scrollBeyondLastLine: false
      })
    }
  }, [content, selectedItem])

  return <div className="view-monaco" ref={editorRef} />
}

export default FileView
